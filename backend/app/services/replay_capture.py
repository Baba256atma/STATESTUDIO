"""Replay capture helpers for deterministic frame construction."""
from __future__ import annotations

from typing import Any, Dict, List

from app.models.replay import ReplayFrame, ReplayMeta


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def _as_dict(value: Any) -> dict | None:
    if value is None:
        return None
    if hasattr(value, "model_dump"):
        return value.model_dump()
    if isinstance(value, dict):
        return value
    return None


def _summarize_human_state(state: Any) -> dict | None:
    data = _as_dict(state)
    if not data:
        return None
    results = []
    for item in data.get("results", []) or []:
        if not isinstance(item, dict):
            continue
        results.append(
            {
                "archetype_id": item.get("archetype_id"),
                "confidence": item.get("confidence"),
                "intensity": item.get("intensity"),
            }
        )
    return {
        "timestamp": data.get("timestamp"),
        "pressure": data.get("pressure"),
        "instability": data.get("instability"),
        "results": results,
    }


def _summarize_system_state(state: Any) -> dict | None:
    data = _as_dict(state)
    if not data:
        return {"top": [], "pressure": 0.0, "instability": 0.0}
    results = []
    for item in data.get("results", []) or []:
        if not isinstance(item, dict):
            continue
        results.append(
            {
                "id": item.get("archetype_id"),
                "confidence": _clamp01(float(item.get("confidence", 0.0))),
                "dominant_loop": item.get("dominant_loop"),
            }
        )
    results = sorted(results, key=lambda r: r.get("confidence", 0.0), reverse=True)[:3]
    return {
        "top": results,
        "pressure": _clamp01(float(data.get("pressure", 0.0))),
        "instability": _clamp01(float(data.get("instability", 0.0))),
    }


def _sanitize_signals(system_signals: Dict[str, float]) -> Dict[str, float]:
    cleaned: Dict[str, float] = {}
    for key, value in (system_signals or {}).items():
        name = str(key).strip()
        if not name:
            continue
        try:
            cleaned[name] = _clamp01(float(value))
        except (TypeError, ValueError):
            continue
    return cleaned


def build_replay_frame(
    t: float,
    input_text: str | None,
    human_state: Any,
    system_signals: Dict[str, float],
    system_state: Any,
    visual: Any,
) -> ReplayFrame:
    """Build a replay frame with relative time and summarized state."""
    relative_t = max(0.0, float(t))
    visual_payload = _as_dict(visual)
    if visual_payload is None:
        raise ValueError("visual must be a dict or Pydantic model")

    return ReplayFrame(
        t=relative_t,
        input_text=input_text,
        human_state=_summarize_human_state(human_state),
        system_signals=_sanitize_signals(system_signals),
        system_state=_summarize_system_state(system_state),
        visual=visual_payload,
        meta=ReplayMeta(note=None, tags=[]),
    )
