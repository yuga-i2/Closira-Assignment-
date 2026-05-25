from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session

from app.db.database import get_db, SessionLocal
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryCreatedResponse,
    FollowUpCreate,
    EscalateCreate,
    EnquiryHistoryResponse,
)
from app.services.enquiry_service import (
    create_enquiry,
    process_enquiry_background,
    schedule_follow_up,
    escalate_enquiry,
    get_enquiry_history,
)

router = APIRouter(prefix="/enquiry", tags=["Enquiry"])


@router.post(
    "",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create a new inbound enquiry",
    description=(
        "Accepts an inbound customer enquiry from WhatsApp, email, or call. "
        "Returns a job_id immediately and processes SOP matching asynchronously in the background."
    ),
)
def post_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    enquiry = create_enquiry(db, payload)
    background_tasks.add_task(
        process_enquiry_background,
        enquiry_id=enquiry.id,
        db_factory=SessionLocal,
    )
    return {"job_id": enquiry.job_id, "status": "processing"}


@router.post(
    "/{enquiry_id}/follow-up",
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a follow-up for an open enquiry",
    description=(
        "Schedules a follow-up task for a given enquiry. "
        "Only allowed for enquiries that are open, processing, or qualified — not escalated."
    ),
)
def post_follow_up(
    enquiry_id: str,
    payload: FollowUpCreate,
    db: Session = Depends(get_db),
):
    try:
        enquiry = schedule_follow_up(db, enquiry_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))

    if enquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    return {
        "message": "Follow-up scheduled",
        "enquiry_id": enquiry_id,
        "follow_ups": enquiry.follow_ups,
    }


@router.post(
    "/{enquiry_id}/escalate",
    status_code=status.HTTP_200_OK,
    summary="Escalate an enquiry to a human agent",
    description=(
        "Marks an enquiry as escalated to a human agent with a mandatory reason. "
        "Updates the status timeline and logs the event."
    ),
)
def post_escalate(
    enquiry_id: str,
    payload: EscalateCreate,
    db: Session = Depends(get_db),
):
    enquiry = escalate_enquiry(db, enquiry_id, payload)
    if enquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")

    return {
        "message": "Enquiry escalated",
        "enquiry_id": enquiry_id,
        "status": enquiry.status,
        "reason": enquiry.escalation_reason,
    }


@router.get(
    "/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get full conversation history and status timeline",
    description=(
        "Returns the complete enquiry record including: conversation history, "
        "status timeline, matched SOP, suggested response, and all scheduled follow-ups."
    ),
)
def get_history(
    enquiry_id: str,
    db: Session = Depends(get_db),
):
    enquiry = get_enquiry_history(db, enquiry_id)
    if enquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found")
    return enquiry
