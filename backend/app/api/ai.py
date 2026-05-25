from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import httpx

from app.services.sop_service import match_sop

router = APIRouter(prefix="/ai", tags=["ai"])


class SuggestRequest(BaseModel):
    message: str


class SuggestResponse(BaseModel):
    suggested_response: str
    matched_sop: Optional[str] = None
    source: str = "template"


@router.post("/suggest", response_model=SuggestResponse)
def suggest_response(req: SuggestRequest):
    """Return a short suggested reply for a customer message.

    Behaviour:
    - If `OPENAI_API_KEY` is set, call OpenAI's chat completions API (optional).
    - Otherwise prefer the local SOP matcher (free) to return a contextual suggested response.
    - If no SOP matches, return a short deterministic template.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that crafts concise customer support replies."},
                    {
                        "role": "user",
                        "content": f"Customer message: {req.message}\n\nProduce a short (1-2 sentence) suggested response appropriate for a customer support agent.",
                    },
                ],
                "max_tokens": 120,
                "temperature": 0.2,
            }
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            resp = httpx.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            content = data.get("choices", [])[0].get("message", {}).get("content", "").strip()
            if not content:
                raise ValueError("empty response from OpenAI")
            return SuggestResponse(suggested_response=content, source="llm")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"LLM request failed: {e}")

    # Free local SOP-based suggestion (preferred for offline/demo use)
    sop = match_sop(req.message)
    if sop:
        sop_name, sop_suggestion = sop
        return SuggestResponse(suggested_response=sop_suggestion, matched_sop=sop_name, source="sop")

    # Deterministic template fallback
    snippet = req.message.strip()
    if len(snippet) > 120:
        snippet = snippet[:117] + "..."
    template = (
        f"Thanks for reaching out — we can help. Quick reply: '{snippet}'. "
        "When would you like to schedule this or would you like more details?"
    )
    return SuggestResponse(suggested_response=template, source="template")
