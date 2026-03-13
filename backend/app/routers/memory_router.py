from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.services.decision_memory_v0 import build_memory_context_v0
from app.utils import responses


router = APIRouter()


@router.get("/memory/summary")
def memory_summary(user_id: str = Query(..., min_length=1)):
    if not user_id:
        raise HTTPException(
            status_code=400,
            detail=responses.error("INVALID_INPUT", "user_id required"),
        )
    out = build_memory_context_v0(user_id, kpi={}, fragility={}, focused_object_id=None)
    return responses.ok(out)
