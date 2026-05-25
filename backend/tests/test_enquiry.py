"""
Pytest test suite for the Closira Enquiry API.
Covers all five endpoints with happy-path and failure cases.
"""

import pytest
import time
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch

from app.main import app
from app.db.database import Base, get_db

# ── In-memory SQLite for tests ───────────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test_closira.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# Patch the background task db_factory to use the test session
# so background processing runs against the test DB, not the real one.
@pytest.fixture(autouse=True)
def patch_bg_db(monkeypatch):
    import app.api.enquiry as eq_router
    original = eq_router.SessionLocal
    monkeypatch.setattr(eq_router, "SessionLocal", TestingSessionLocal)
    yield
    monkeypatch.setattr(eq_router, "SessionLocal", original)


client = TestClient(app)


# ── Helper ───────────────────────────────────────────────────────
def create_test_enquiry(channel="whatsapp", customer_name="Test User", message="I want pricing details"):
    return client.post(
        "/enquiry",
        json={"channel": channel, "customer_name": customer_name, "message": message},
    )


def get_enquiry_id_by_job(job_id: str) -> str:
    from app.models.enquiry import Enquiry
    time.sleep(0.3)  # allow background task to complete
    db = TestingSessionLocal()
    enquiry = db.query(Enquiry).filter(Enquiry.job_id == job_id).first()
    db.close()
    return enquiry.id


# ── POST /enquiry ────────────────────────────────────────────────

class TestCreateEnquiry:
    def test_happy_path_returns_202_with_job_id(self):
        res = create_test_enquiry()
        assert res.status_code == 202
        data = res.json()
        assert "job_id" in data
        assert data["status"] == "processing"

    def test_whatsapp_channel_accepted(self):
        assert create_test_enquiry(channel="whatsapp").status_code == 202

    def test_email_channel_accepted(self):
        assert create_test_enquiry(channel="email").status_code == 202

    def test_call_channel_accepted(self):
        assert create_test_enquiry(channel="call").status_code == 202

    def test_invalid_channel_returns_422(self):
        res = client.post("/enquiry", json={"channel": "telegram", "customer_name": "Test", "message": "Hello"})
        assert res.status_code == 422

    def test_missing_customer_name_returns_422(self):
        res = client.post("/enquiry", json={"channel": "whatsapp", "message": "Hello"})
        assert res.status_code == 422

    def test_missing_message_returns_422(self):
        res = client.post("/enquiry", json={"channel": "whatsapp", "customer_name": "Test"})
        assert res.status_code == 422

    def test_empty_customer_name_returns_422(self):
        res = client.post("/enquiry", json={"channel": "whatsapp", "customer_name": "", "message": "Hello"})
        assert res.status_code == 422

    def test_each_enquiry_gets_unique_job_id(self):
        r1 = create_test_enquiry()
        r2 = create_test_enquiry()
        assert r1.json()["job_id"] != r2.json()["job_id"]


# ── POST /enquiry/{id}/follow-up ─────────────────────────────────

class TestFollowUp:
    def _setup(self):
        res = create_test_enquiry(message="I want to book an appointment")
        return get_enquiry_id_by_job(res.json()["job_id"])

    def test_happy_path_schedules_follow_up(self):
        enquiry_id = self._setup()
        res = client.post(
            f"/enquiry/{enquiry_id}/follow-up",
            json={"delay_minutes": 30, "message_template": "Following up"},
        )
        assert res.status_code == 201
        assert len(res.json()["follow_ups"]) == 1

    def test_nonexistent_enquiry_returns_404(self):
        res = client.post("/enquiry/nonexistent-id/follow-up", json={"delay_minutes": 30})
        assert res.status_code == 404

    def test_zero_delay_returns_422(self):
        enquiry_id = self._setup()
        res = client.post(f"/enquiry/{enquiry_id}/follow-up", json={"delay_minutes": 0})
        assert res.status_code == 422

    def test_multiple_follow_ups_accumulate(self):
        enquiry_id = self._setup()
        client.post(f"/enquiry/{enquiry_id}/follow-up", json={"delay_minutes": 10})
        res = client.post(f"/enquiry/{enquiry_id}/follow-up", json={"delay_minutes": 20})
        assert res.status_code == 201
        assert len(res.json()["follow_ups"]) == 2


# ── POST /enquiry/{id}/escalate ──────────────────────────────────

class TestEscalate:
    def _setup(self):
        res = create_test_enquiry(message="I want to book an appointment")
        return get_enquiry_id_by_job(res.json()["job_id"])

    def test_happy_path_escalates(self):
        enquiry_id = self._setup()
        res = client.post(f"/enquiry/{enquiry_id}/escalate", json={"reason": "Customer requested manager"})
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "escalated"
        assert data["reason"] == "Customer requested manager"

    def test_nonexistent_enquiry_returns_404(self):
        res = client.post("/enquiry/nonexistent-id/escalate", json={"reason": "Some reason"})
        assert res.status_code == 404

    def test_missing_reason_returns_422(self):
        enquiry_id = self._setup()
        res = client.post(f"/enquiry/{enquiry_id}/escalate", json={})
        assert res.status_code == 422

    def test_empty_reason_returns_422(self):
        enquiry_id = self._setup()
        res = client.post(f"/enquiry/{enquiry_id}/escalate", json={"reason": ""})
        assert res.status_code == 422


# ── GET /enquiry/{id}/history ────────────────────────────────────

class TestHistory:
    def _setup(self):
        res = create_test_enquiry(message="Can I book an appointment please?")
        return get_enquiry_id_by_job(res.json()["job_id"])

    def test_happy_path_returns_history(self):
        enquiry_id = self._setup()
        res = client.get(f"/enquiry/{enquiry_id}/history")
        assert res.status_code == 200
        data = res.json()
        assert data["id"] == enquiry_id
        assert "conversation_history" in data
        assert "status_timeline" in data
        assert "follow_ups" in data

    def test_nonexistent_enquiry_returns_404(self):
        res = client.get("/enquiry/nonexistent-id/history")
        assert res.status_code == 404

    def test_history_contains_initial_message(self):
        enquiry_id = self._setup()
        res = client.get(f"/enquiry/{enquiry_id}/history")
        messages = res.json()["conversation_history"]
        assert len(messages) >= 1
        assert messages[0]["role"] == "customer"

    def test_sop_matched_after_background_task(self):
        enquiry_id = self._setup()
        res = client.get(f"/enquiry/{enquiry_id}/history")
        data = res.json()
        assert data["matched_sop"] is not None
        assert data["status"] == "open"


# ── GET /health ──────────────────────────────────────────────────

class TestHealth:
    def test_health_returns_200(self):
        assert client.get("/health").status_code == 200

    def test_health_returns_correct_schema(self):
        data = client.get("/health").json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"


# ── SOP Auto-Escalation ──────────────────────────────────────────

class TestAutoEscalation:
    def test_no_sop_match_auto_escalates(self):
        res = create_test_enquiry(message="xyzzy frobozz magic word zork")
        enquiry_id = get_enquiry_id_by_job(res.json()["job_id"])

        from app.models.enquiry import Enquiry
        db = TestingSessionLocal()
        enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        db.close()

        assert enquiry.status.value == "escalated"
        assert enquiry.escalation_reason is not None
