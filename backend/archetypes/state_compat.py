from __future__ import annotations

from typing import Any, Dict, List

from app.utils.clamp import clamp01, ensure_finite


def _coerce_detections(state: Any) -> List[Dict[str, Any]]:
    detections: List[Dict[str, Any]] = []
    detected_attr = getattr(state, "detected", None)
    results_attr = getattr(state, "results", None)

    for seq in (detected_attr, results_attr):
        if not seq:
            continue
        if not isinstance(seq, list):
            continue
        for item in seq:
            try:
                archetype_id = getattr(item, "archetype_id", None) or item.get("archetype_id")
                confidence = clamp01(ensure_finite(getattr(item, "confidence", None) or item.get("confidence") or 0.0, 0.0))
                dominant_loop = getattr(item, "dominant_loop", None) or item.get("dominant_loop") or "R"
                notes = getattr(item, "notes", None) or item.get("notes") or ""
                if archetype_id:
                    detections.append(
                        {
                            "archetype_id": archetype_id,
                            "confidence": confidence,
                            "dominant_loop": dominant_loop,
                            "notes": notes,
                        }
                    )
            except Exception:
                continue
    return detections


def normalize_archetype_state(state: Any) -> Dict[str, Any]:
    """Return a canonical dict representation resilient to schema drift."""
    instability = clamp01(ensure_finite(getattr(state, "instability", 0.0), 0.0))
    system_pressure = getattr(state, "system_pressure", None)
    pressure = getattr(state, "pressure", None)
    system_pressure = ensure_finite(
        system_pressure if system_pressure is not None else (pressure if pressure is not None else instability),
        0.0,
    )
    system_pressure = clamp01(system_pressure)

    canonical = {
        "timestamp": getattr(state, "timestamp", None),
        "instability": instability,
        "system_pressure": system_pressure,
        "dominant_signal": getattr(state, "dominant_signal", None) or None,
        "affected_objects": getattr(state, "affected_objects", None) or [],
        "leverage_focus": getattr(state, "leverage_focus", None) or None,
        "detections": _coerce_detections(state),
    }
    return canonical
