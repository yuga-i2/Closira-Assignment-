from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from app.models.enquiry import EnquiryStatus, Channel


# ── Request Schemas ──────────────────────────────────────────────

class EnquiryCreate(BaseModel):
    channel: Channel = Field(..., examples=["whatsapp"])
    customer_name: str = Field(..., min_length=1, max_length=200, examples=["Sarah M"])
    message: str = Field(..., min_length=1, max_length=5000, examples=["I want pricing details"])

    model_config = {
        "json_schema_extra": {
            "example": {
                "channel": "whatsapp",
                "customer_name": "Sarah M",
                "message": "I want pricing details",
            }
        }
    }


class FollowUpCreate(BaseModel):
    delay_minutes: int = Field(..., ge=1, le=10080, examples=[30])
    message_template: Optional[str] = Field(
        None, max_length=1000, examples=["Following up regarding your enquiry"]
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "delay_minutes": 30,
                "message_template": "Following up regarding your enquiry",
            }
        }
    }


class EscalateCreate(BaseModel):
    reason: str = Field(..., min_length=1, max_length=1000, examples=["Customer requested manager"])

    model_config = {
        "json_schema_extra": {
            "example": {"reason": "Customer requested manager"}
        }
    }


# ── Response Schemas ─────────────────────────────────────────────

class EnquiryCreatedResponse(BaseModel):
    job_id: str
    status: str

    model_config = {
        "json_schema_extra": {
            "example": {"job_id": "550e8400-e29b-41d4-a716-446655440000", "status": "processing"}
        }
    }


class FollowUp(BaseModel):
    id: str
    delay_minutes: int
    message_template: Optional[str]
    scheduled_at: str
    due_at: str
    status: str


class TimelineEntry(BaseModel):
    event: str
    timestamp: str
    detail: Optional[str] = None


class ConversationMessage(BaseModel):
    role: str
    content: str
    timestamp: str


class EnquiryHistoryResponse(BaseModel):
    id: str
    job_id: str
    channel: str
    customer_name: str
    message: str
    status: str
    matched_sop: Optional[str]
    suggested_response: Optional[str]
    escalation_reason: Optional[str]
    created_at: datetime
    updated_at: datetime
    status_timeline: List[Any]
    follow_ups: List[Any]
    conversation_history: List[Any]


class HealthResponse(BaseModel):
    status: str
    database: str
