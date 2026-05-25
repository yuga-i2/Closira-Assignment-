"""
SOP (Standard Operating Procedure) matching service.

Uses keyword-based matching against 5 hardcoded SOP categories.
No AI required — simple, deterministic, and fast.
"""

from typing import Optional, Tuple

SOP_CATALOGUE = [
    {
        "id": "sop_booking",
        "name": "Booking Enquiry",
        "keywords": ["book", "booking", "appointment", "schedule", "reserve", "reservation", "slot", "available", "availability", "date", "time"],
        "suggested_response": (
            "Thank you for reaching out! We'd love to help you book an appointment. "
            "Please let us know your preferred date and time, and we'll confirm availability right away."
        ),
    },
    {
        "id": "sop_pricing",
        "name": "Pricing Question",
        "keywords": ["price", "pricing", "cost", "how much", "fee", "charge", "quote", "rate", "rates", "package", "plan", "discount", "offer"],
        "suggested_response": (
            "Thanks for your interest in our pricing! Our plans start from competitive rates tailored "
            "for SMBs. I'll have someone share a detailed quote with you shortly. Could you let us know "
            "the scale of your requirements?"
        ),
    },
    {
        "id": "sop_complaint",
        "name": "Complaint",
        "keywords": ["complaint", "unhappy", "disappointed", "issue", "problem", "wrong", "bad", "terrible", "refund", "fix", "broken", "upset", "angry", "frustrated"],
        "suggested_response": (
            "We're truly sorry to hear about your experience. Your feedback is very important to us. "
            "A senior team member will be in touch within the next 2 hours to personally resolve this for you."
        ),
    },
    {
        "id": "sop_after_hours",
        "name": "After-Hours Message",
        "keywords": ["after hours", "closed", "weekend", "holiday", "tonight", "late", "early morning", "midnight", "office hours", "when do you open"],
        "suggested_response": (
            "Thanks for reaching out! Our team is currently unavailable, but we'll get back to you "
            "first thing on the next business day. For urgent matters, please leave your contact details "
            "and we'll prioritise your query."
        ),
    },
    {
        "id": "sop_demo",
        "name": "Product Demo Request",
        "keywords": ["demo", "demonstration", "show me", "trial", "try", "test", "walkthrough", "how does it work", "features", "showcase", "preview", "tour"],
        "suggested_response": (
            "We'd love to show you what Closira can do! Our demos are tailored to your business needs "
            "and take about 20 minutes. Please share a convenient time and we'll send you a calendar invite."
        ),
    },
]


def match_sop(message: str) -> Optional[Tuple[str, str]]:
    """
    Match an inbound message to an SOP using keyword scoring.

    Returns a tuple of (sop_name, suggested_response) if matched,
    or None if no SOP matches.

    Scoring: each matching keyword adds 1 point. Highest score wins.
    Ties are broken by catalogue order (priority).
    """
    message_lower = message.lower()
    best_match = None
    best_score = 0

    for sop in SOP_CATALOGUE:
        score = sum(1 for kw in sop["keywords"] if kw in message_lower)
        if score > best_score:
            best_score = score
            best_match = sop

    if best_match and best_score > 0:
        return best_match["name"], best_match["suggested_response"]

    return None
