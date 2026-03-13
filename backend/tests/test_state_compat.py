from __future__ import annotations

from datetime import datetime, timezone

from archetypes.state_compat import normalize_archetype_state


class Dummy:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


def test_minimal_state():
    now = datetime.now(timezone.utc).isoformat()
    state = Dummy(timestamp=now, instability=0.4)
    out = normalize_archetype_state(state)
    assert out["instability"] == 0.4
    assert out["system_pressure"] == 0.4
    assert out["detections"] == []


def test_pressure_fallback():
    state = Dummy(timestamp=123, pressure=0.7)
    out = normalize_archetype_state(state)
    assert out["system_pressure"] == 0.7


def test_system_pressure_preferred():
    state = Dummy(timestamp=123, system_pressure=0.2, pressure=0.8)
    out = normalize_archetype_state(state)
    assert out["system_pressure"] == 0.2


def test_detections_legacy():
    det = Dummy(archetype_id="a1", confidence=0.9, dominant_loop="B", notes="x")
    state = Dummy(timestamp=1, detected=[det], instability=0.1)
    out = normalize_archetype_state(state)
    assert out["detections"][0]["archetype_id"] == "a1"
    assert out["detections"][0]["confidence"] == 0.9
