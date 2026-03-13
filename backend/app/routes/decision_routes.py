from __future__ import annotations

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from app.services import json_store

router = APIRouter(prefix="/api", tags=["decisions"])


class DecisionPayload(BaseModel):
    company_id: str = Field(..., min_length=1)
    snapshot: dict


class EventPayload(BaseModel):
    company_id: str = Field(..., min_length=1)
    event: dict


@router.get("/decisions")
def list_decisions(
    company_id: str = Query(..., min_length=1),
    limit: int = Query(50, ge=1, le=500),
):
    items = json_store.read_decisions(company_id)
    if limit:
        items = items[-limit:]
    return {"ok": True, "data": items}


@router.post("/decisions")
def create_decision(payload: DecisionPayload):
    saved = json_store.add_decision(payload.company_id, payload.snapshot)
    return {"ok": True, "data": saved}


@router.get("/events")
def list_events(
    company_id: str = Query(..., min_length=1),
    limit: int = Query(200, ge=1, le=1000),
):
    items = json_store.read_events(company_id)
    if limit:
        items = items[-limit:]
    return {"ok": True, "data": items}


@router.post("/events")
def create_event(payload: EventPayload):
    saved = json_store.add_event(payload.company_id, payload.event)
    return {"ok": True, "data": saved}
