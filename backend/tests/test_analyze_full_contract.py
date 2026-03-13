from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import pytest
from fastapi.testclient import TestClient

import main
from archetypes.visual_mapper import map_archetype_to_visual_state
from archetypes.library import get_archetype_library


class MinimalState:
    def __init__(self):
        self.timestamp = datetime.now(timezone.utc).isoformat()
        self.instability = 0.1
        self.system_pressure = 0.1
        self.detected = []


def test_visual_mapper_minimal_state():
    state = MinimalState()
    visual = map_archetype_to_visual_state(state, get_archetype_library())
    assert "nodes" in visual
    assert "loops" in visual
    assert "levers" in visual
    assert visual["focus"] is None


def test_analyze_full_handles_missing_fields(monkeypatch):
    client = TestClient(main.app)

    def fake_analyze(text: str, metrics: dict[str, float] | None, episode_id: str | None) -> dict[str, Any]:
        return {
            "episode_id": "fake",
            "signals": {},
            "human_state": {},
            "system_signals": {},
            "system_state": MinimalState(),
            "visual": {"scene": {}},
        }

    monkeypatch.setattr("app.services.orchestrator.analyze_full_pipeline", fake_analyze)
    res = client.post("/analyze/full", json={"text": "hi"})
    assert res.status_code == 200
    body = res.json()
    assert "visual" in body
