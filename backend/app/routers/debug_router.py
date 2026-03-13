from __future__ import annotations

import os
from fastapi import APIRouter, HTTPException

from app.models.chat import ChatResponse, Action
from archetypes.visual_mapper import map_archetype_to_visual_state
from archetypes.state_compat import normalize_archetype_state
from archetypes.library import get_archetype_library

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/contracts")
def contracts():
    if os.getenv("ENV") != "dev":
        raise HTTPException(status_code=404, detail="Not found")
    example = ChatResponse(
        ok=True,
        user_id="demo",
        reply="Sample reply",
        actions=[
          Action(type="applyObject", object="obj_demo", value={"color": "#88ccff"}),  # type: ignore
        ],
        scene_json={"scene": {}},
        source="ai",
        error=None,
        debug={"path": "example"},
    )
    return {"ok": True, "chat_response_example": example.model_dump()}


@router.get("/state-fields")
def state_fields():
    if os.getenv("ENV") != "dev":
        raise HTTPException(status_code=404, detail="Not found")
    sample_state = get_archetype_library().items[0]  # definition
    # Build a minimal compatible state using the first definition id
    class DummyState:
        def __init__(self, aid: str):
            self.timestamp = 0
            self.instability = 0.0
            self.system_pressure = 0.0
            self.detected = []
            self.dominant_signal = None
            self.affected_objects = []
            self.leverage_focus = None
            self.id = aid
    dummy = DummyState(sample_state.id if sample_state else "demo")
    canonical = normalize_archetype_state(dummy)
    fields = []
    if hasattr(dummy, "model_fields"):
        fields = list(getattr(dummy, "model_fields").keys())
    elif hasattr(dummy, "__fields__"):
        fields = list(getattr(dummy, "__fields__").keys())
    else:
        fields = [f for f in dir(dummy) if not f.startswith("_")]
    return {
        "ok": True,
        "state_type": type(dummy).__name__,
        "fields": fields,
        "example": canonical,
    }
