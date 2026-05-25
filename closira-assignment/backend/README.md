# Closira Backend — Enquiry Handling API

A lightweight REST API built with **Python 3.11 + FastAPI** that simulates Closira's core enquiry-handling pipeline. Handles inbound customer enquiries, processes them asynchronously against SOPs, and exposes history and status endpoints.

---

## Quick Start

```bash
cd backend

# 1. Copy environment config
cp .env.example .env

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
uvicorn app.main:app --reload
```

API is now live at `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

## Screenshots

## API Documentation
![Swagger UI](docs/swagger.png)
> Run the server and visit http://localhost:8000/docs to see the full interactive API documentation.

---

## Docker

```bash
docker-compose up --build
```

---

## Run Tests

```bash
pytest tests/ -v
```

---

## Architecture

```
app/
├── main.py              # FastAPI app, lifespan, CORS, global exception handler
├── api/
│   ├── enquiry.py       # All enquiry endpoints (POST, GET)
│   └── health.py        # GET /health
├── core/
│   ├── config.py        # Pydantic Settings (env-based config)
│   └── logging.py       # Structured JSON logger
├── db/
│   └── database.py      # SQLAlchemy engine, session factory, Base
├── models/
│   └── enquiry.py       # Enquiry ORM model + Enums
├── schemas/
│   └── enquiry.py       # Pydantic request/response schemas
├── services/
│   ├── enquiry_service.py  # Business logic, CRUD, background task
│   └── sop_service.py      # Keyword-based SOP matching
└── utils/               # Reserved for future utility helpers
```

### Design Principles

- **Thin API layer**: Routers only handle HTTP. Business logic lives in `services/`.
- **Dependency injection**: `get_db()` is injected via `Depends`, making testing easy (override in tests).
- **No global state**: Each request gets its own DB session. Background tasks open their own session.
- **Clean separation**: Models (ORM), Schemas (Pydantic), Services (logic) are strictly separated.

---

## Database Schema

### `enquiries` table

| Column | Type | Notes |
|---|---|---|
| `id` | UUID string | Primary key |
| `job_id` | UUID string | Unique, returned to caller immediately |
| `channel` | Enum | `whatsapp`, `email`, `call` |
| `customer_name` | String | |
| `message` | Text | Original inbound message |
| `status` | Enum | `processing` → `open` / `escalated` → `qualified` / `resolved` |
| `matched_sop` | String | Set by background task |
| `suggested_response` | Text | Set by background task |
| `escalation_reason` | Text | Set on manual or auto-escalation |
| `created_at` | DateTime (tz-aware) | |
| `updated_at` | DateTime (tz-aware) | |
| `status_timeline` | JSON | Array of `{event, timestamp, detail}` |
| `follow_ups` | JSON | Array of scheduled follow-up objects |
| `conversation_history` | JSON | Array of `{role, content, timestamp}` |

**Why SQLite?** Appropriate for this scope — zero setup, single-file, portable. Switching to PostgreSQL only requires changing `DATABASE_URL` in `.env` (SQLAlchemy abstracts the rest). SQLite has no connection pool concerns for the single-process FastAPI setup used here.

**Why JSON columns for timeline/follow_ups?** These are append-only audit lists that are always read together with the parent record. Normalising them into separate tables would add joins without benefit at this scale.

---

## FastAPI BackgroundTasks vs Celery

**Decision: FastAPI BackgroundTasks**

| Aspect | BackgroundTasks | Celery |
|---|---|---|
| Setup complexity | Zero — built into FastAPI | Requires broker (Redis/RabbitMQ), worker process, beat scheduler |
| Appropriate for | Short tasks, in-process async work | Long-running jobs, distributed queues, retries, scheduling |
| Observability | Limited (runs in same process) | Rich — task IDs, retries, ETA, result backends |
| Failure handling | If the server process dies, task is lost | Tasks survive server restarts |
| Dev experience | Instant — no extra services | Docker Compose required |

**Rationale:** SOP matching is a fast, CPU-light keyword scan (< 5ms). There is no I/O to external services, no retry logic required, and the task completes well within the HTTP response timeout. BackgroundTasks is the right tool. Celery would be the correct choice if tasks involved: external API calls, email sending, long processing, distributed workers, or task retry logic.

**Known limitation:** If the server process crashes after returning the `job_id` but before the background task runs, the task is lost and the enquiry remains in `processing` status indefinitely. A production system would use a persistent queue (Celery + Redis or a transactional outbox pattern).

---

## Trade-offs & Known Limitations

1. **No authentication**: All endpoints are public. A production API would require API keys or OAuth.
2. **SQLite not suitable for production writes at scale**: SQLite uses file-level locking. For concurrent writes, migrate to PostgreSQL.
3. **Background task is fire-and-forget**: No retry on failure. A dead-letter queue would be needed in production.
4. **No pagination**: `GET /enquiry/{id}/history` returns all data. A real system would paginate conversation history.
5. **SOP matching is keyword-based**: Simple but brittle. Production Closira would use an LLM-backed classifier.
6. **No tenant isolation**: All enquiries are global. Production would scope by `tenant_id`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/enquiry` | Create enquiry, trigger async SOP matching |
| `POST` | `/enquiry/{id}/follow-up` | Schedule follow-up (open enquiries only) |
| `POST` | `/enquiry/{id}/escalate` | Manually escalate with reason |
| `GET` | `/enquiry/{id}/history` | Full history, timeline, SOP, follow-ups |
| `GET` | `/health` | API + DB connectivity check |

See `/docs` for interactive Swagger UI with example payloads.
