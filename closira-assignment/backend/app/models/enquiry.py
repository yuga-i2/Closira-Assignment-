import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, JSON, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum


class EnquiryStatus(str, enum.Enum):
    PROCESSING = "processing"
    OPEN = "open"
    QUALIFIED = "qualified"
    ESCALATED = "escalated"
    RESOLVED = "resolved"


class Channel(str, enum.Enum):
    WHATSAPP = "whatsapp"
    EMAIL = "email"
    CALL = "call"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    channel = Column(SAEnum(Channel), nullable=False)
    customer_name = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(SAEnum(EnquiryStatus), default=EnquiryStatus.PROCESSING, nullable=False)
    matched_sop = Column(String, nullable=True)
    suggested_response = Column(Text, nullable=True)
    escalation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # JSON columns for timeline, follow-ups, conversation history
    status_timeline = Column(JSON, default=list)
    follow_ups = Column(JSON, default=list)
    conversation_history = Column(JSON, default=list)
