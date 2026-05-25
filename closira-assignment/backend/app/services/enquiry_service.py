import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.orm import Session

from app.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate, FollowUpCreate, EscalateCreate
from app.services.sop_service import match_sop
from app.core.logging import get_logger

logger = get_logger(__name__)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _append_timeline(enquiry: Enquiry, event: str, detail: Optional[str] = None) -> None:
    timeline = list(enquiry.status_timeline or [])
    entry = {"event": event, "timestamp": _now_iso()}
    if detail:
        entry["detail"] = detail
    timeline.append(entry)
    enquiry.status_timeline = timeline


def create_enquiry(db: Session, payload: EnquiryCreate) -> Enquiry:
    enquiry = Enquiry(
        id=str(uuid.uuid4()),
        job_id=str(uuid.uuid4()),
        channel=payload.channel,
        customer_name=payload.customer_name,
        message=payload.message,
        status=EnquiryStatus.PROCESSING,
        status_timeline=[],
        follow_ups=[],
        conversation_history=[
            {
                "role": "customer",
                "content": payload.message,
                "timestamp": _now_iso(),
            }
        ],
    )
    _append_timeline(enquiry, "enquiry_created", f"Channel: {payload.channel}")
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    logger.info(
        "Enquiry created",
        extra={
            "event": "enquiry_created",
            "enquiry_id": enquiry.id,
            "job_id": enquiry.job_id,
            "channel": enquiry.channel,
            "customer_name": enquiry.customer_name,
        },
    )
    return enquiry


def process_enquiry_background(enquiry_id: str, db_factory) -> None:
    """
    Background task: match message against SOPs and update enquiry record.
    Runs asynchronously after the API response is returned to the client.
    """
    db: Session = db_factory()
    try:
        enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        if not enquiry:
            logger.error("Background task: enquiry not found", extra={"enquiry_id": enquiry_id})
            return

        result = match_sop(enquiry.message)

        if result:
            sop_name, suggested_response = result
            enquiry.matched_sop = sop_name
            enquiry.suggested_response = suggested_response
            enquiry.status = EnquiryStatus.OPEN
            enquiry.updated_at = datetime.now(timezone.utc)

            # Append AI suggested response to conversation history
            history = list(enquiry.conversation_history or [])
            history.append(
                {
                    "role": "assistant",
                    "content": suggested_response,
                    "timestamp": _now_iso(),
                }
            )
            enquiry.conversation_history = history
            _append_timeline(enquiry, "sop_matched", f"SOP: {sop_name}")

            logger.info(
                "SOP matched",
                extra={
                    "event": "sop_matched",
                    "enquiry_id": enquiry_id,
                    "sop": sop_name,
                },
            )
        else:
            # No SOP matched — auto-escalate
            enquiry.status = EnquiryStatus.ESCALATED
            enquiry.escalation_reason = "No matching SOP found for this enquiry. Requires human review."
            enquiry.updated_at = datetime.now(timezone.utc)
            _append_timeline(enquiry, "auto_escalated", "No SOP matched — escalated for human review")

            logger.warning(
                "No SOP matched — auto-escalated",
                extra={
                    "event": "auto_escalation",
                    "enquiry_id": enquiry_id,
                    "message_preview": enquiry.message[:100],
                },
            )

        db.commit()
    except Exception as exc:
        logger.error(
            "Background task failed",
            extra={"event": "background_task_error", "enquiry_id": enquiry_id, "error": str(exc)},
        )
        db.rollback()
    finally:
        db.close()


def schedule_follow_up(db: Session, enquiry_id: str, payload: FollowUpCreate) -> Enquiry:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        return None

    if enquiry.status == EnquiryStatus.ESCALATED:
        raise ValueError("Cannot schedule follow-up on escalated enquiry")

    if enquiry.status not in (EnquiryStatus.OPEN, EnquiryStatus.PROCESSING, EnquiryStatus.QUALIFIED):
        raise ValueError(f"Cannot schedule follow-up for enquiry in status '{enquiry.status}'")

    now = datetime.now(timezone.utc)
    due_at = now + timedelta(minutes=payload.delay_minutes)

    follow_up = {
        "id": str(uuid.uuid4()),
        "delay_minutes": payload.delay_minutes,
        "message_template": payload.message_template or "Following up on your enquiry.",
        "scheduled_at": now.isoformat(),
        "due_at": due_at.isoformat(),
        "status": "scheduled",
    }

    follow_ups = list(enquiry.follow_ups or [])
    follow_ups.append(follow_up)
    enquiry.follow_ups = follow_ups
    enquiry.updated_at = now
    _append_timeline(enquiry, "follow_up_scheduled", f"Due in {payload.delay_minutes} minutes")

    db.commit()
    db.refresh(enquiry)

    logger.info(
        "Follow-up scheduled",
        extra={
            "event": "follow_up_scheduled",
            "enquiry_id": enquiry_id,
            "delay_minutes": payload.delay_minutes,
        },
    )
    return enquiry


def escalate_enquiry(db: Session, enquiry_id: str, payload: EscalateCreate) -> Enquiry:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        return None

    enquiry.status = EnquiryStatus.ESCALATED
    enquiry.escalation_reason = payload.reason
    enquiry.updated_at = datetime.now(timezone.utc)
    _append_timeline(enquiry, "manually_escalated", payload.reason)

    db.commit()
    db.refresh(enquiry)

    logger.info(
        "Enquiry escalated",
        extra={
            "event": "escalation_triggered",
            "enquiry_id": enquiry_id,
            "reason": payload.reason,
        },
    )
    return enquiry


def get_enquiry_history(db: Session, enquiry_id: str) -> Optional[Enquiry]:
    return db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
