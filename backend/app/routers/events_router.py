from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Request

router = APIRouter(prefix="/events", tags=["events"])


def _store(request: Request):
    return getattr(request.app.state, "event_store", None)


@router.get("/recent")
def recent_events(
    request: Request,
    user_id: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
):
    if not user_id:
        raise HTTPException(status_code=400, detail={"ok": False, "error": {"type": "INVALID_INPUT", "message": "user_id required"}})
    store = _store(request)
    if store is None:
        return {"ok": True, "events": []}
    events = store.recent(user_id, limit=limit)
    return {"ok": True, "events": events}


@router.post("/replay")
def replay_events(
    request: Request,
    user_id: str = Query(..., min_length=1),
    from_event_id: str | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
):
    if not user_id:
        raise HTTPException(status_code=400, detail={"ok": False, "error": {"type": "INVALID_INPUT", "message": "user_id required"}})
    store = _store(request)
    if store is None:
        return {"ok": True, "events": []}
    events = store.replay(user_id, from_event_id=from_event_id, limit=limit)
    if not events:
        raise HTTPException(status_code=404, detail={"ok": False, "error": {"type": "NOT_FOUND", "message": "No events"}})
    return {"ok": True, "events": events}
