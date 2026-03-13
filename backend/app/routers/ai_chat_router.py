from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.chat import ChatRequest, ChatResponse
from app.services.ai_commander import handle_chat
from app.services.event_log import EventLog

router = APIRouter()
event_log = EventLog()


@router.post("/chat/ai", response_model=ChatResponse)
def chat_ai(payload: ChatRequest) -> ChatResponse:
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=422, detail={"error": {"code": "INVALID_INPUT", "message": "text is required"}})
    resp = handle_chat(payload)
    if payload.user_id:
        event_log.log(payload.user_id, payload.text, resp.reply, [a.model_dump() for a in resp.actions])
    return resp
