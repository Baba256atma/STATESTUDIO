from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.services.replay_store import ReplayStore
from app.services.decision_replay_v0 import build_decision_replay_v0

router = APIRouter()


@router.get("/replay/view/{episode_id}")
def replay_view(episode_id: str):
    store = ReplayStore()
    try:
        return build_decision_replay_v0(store, episode_id)
    except Exception as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
