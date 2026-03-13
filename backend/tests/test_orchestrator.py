from __future__ import annotations

from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from app.services.orchestrator import analyze_full_pipeline
from app.models.system_archetypes import SystemArchetypeState
from archetypes.visual_mapper import map_archetype_to_visual_state
from archetypes.library import get_archetype_library
import main


def test_visual_mapper_handles_missing_detected():
    state = SystemArchetypeState(
        timestamp=datetime.now(timezone.utc),
        results=[],
        pressure=0.2,
        instability=0.3,
    )
    visual = map_archetype_to_visual_state(state, get_archetype_library())
    assert "nodes" in visual
    assert isinstance(visual["nodes"], list)
    assert visual.get("focus") is None
    assert visual.get("loops") == []


def test_analyze_full_pipeline_response_shape():
    result = analyze_full_pipeline(text="We have delays and rework.", metrics=None, episode_id=None)
    for key in ("episode_id", "visual", "system_signals", "system_state"):
        assert key in result
    if "warnings" in result:
        assert isinstance(result["warnings"], list)


def test_analyze_full_route_returns_200():
    client = TestClient(main.app)
    response = client.post("/analyze/full", json={"text": "We are seeing latency and overload"})
    assert response.status_code == 200
    body = response.json()
    assert "episode_id" in body
    assert "visual" in body
    if "warnings" in body:
        assert isinstance(body["warnings"], list)
