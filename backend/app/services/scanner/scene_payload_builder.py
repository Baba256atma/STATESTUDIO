"""Frontend-friendly scene payload builder for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any


_RISK_OBJECTS = {"obj_risk_zone", "obj_supplier", "obj_bottleneck", "obj_delivery"}


def build_fragility_scene_payload(
    suggested_objects: list[str],
    fragility_score: float,
    drivers: list[dict],
    findings: list[dict],
) -> dict[str, Any]:
    """Build an additive scene payload for scanner-driven frontend overlays."""
    bounded_score = _clamp01(fragility_score)
    level = _level_for_score(bounded_score)
    focus_objects = _suggested_focus(suggested_objects, drivers)

    objects = [
        {
            "id": object_id,
            "emphasis": _object_emphasis(object_id, bounded_score),
            "reason": _highlight_reason(object_id, drivers, findings),
        }
        for object_id in suggested_objects
    ]

    highlights = [
        {
            "type": "driver",
            "target": object_id,
            "severity": "high" if object_id in _RISK_OBJECTS and bounded_score >= 0.5 else level,
        }
        for object_id in focus_objects
    ]

    summary = _overlay_summary(drivers, level)
    scanner_overlay = {
        "summary": summary,
        "top_driver_ids": [item.get("id", "driver") for item in drivers[:3] if isinstance(item, dict)],
    }

    return {
        "objects": objects,
        "highlights": highlights,
        "state_vector": {
            "fragility_score": round(bounded_score, 4),
            "fragility_level": level,
            "scanner_mode": "business",
        },
        "suggested_focus": focus_objects,
        "scanner_overlay": scanner_overlay,
    }


def _suggested_focus(suggested_objects: list[str], drivers: list[dict]) -> list[str]:
    """Return the most relevant objects to focus in the scene."""
    ordered: list[str] = []
    risk_priority = [item for item in suggested_objects if item in _RISK_OBJECTS]
    for object_id in [*risk_priority, *suggested_objects]:
        if object_id not in ordered:
            ordered.append(object_id)
    if not ordered and drivers:
        ordered.append("obj_risk_zone")
    return ordered[:3]


def _object_emphasis(object_id: str, fragility_score: float) -> float:
    """Return object emphasis intensity for scanner overlays."""
    base = 0.45 + (0.45 * _clamp01(fragility_score))
    if object_id in _RISK_OBJECTS:
        base += 0.1
    return round(min(base, 1.0), 4)


def _highlight_reason(object_id: str, drivers: list[dict], findings: list[dict]) -> str:
    """Build a compact explanation for why an object is highlighted."""
    for driver in drivers:
        if not isinstance(driver, dict):
            continue
        label = str(driver.get("label", "") or "").lower()
        if "supplier" in label and object_id == "obj_supplier":
            return "Supplier-related fragility driver."
        if "inventory" in label and object_id == "obj_inventory":
            return "Inventory fragility driver."
        if "delay" in label and object_id == "obj_delivery":
            return "Delivery pressure driver."
        if any(token in label for token in ("risk", "volatility", "concentration")) and object_id == "obj_risk_zone":
            return "Risk concentration driver."
        if "bottleneck" in label and object_id == "obj_bottleneck":
            return "Operational bottleneck driver."

    for finding in findings:
        if not isinstance(finding, dict):
            continue
        title = str(finding.get("title", "") or "").lower()
        if "inventory" in title and object_id == "obj_inventory":
            return "Finding points to inventory fragility."
        if "supplier" in title and object_id == "obj_supplier":
            return "Finding points to supplier fragility."
        if "delay" in title and object_id == "obj_delivery":
            return "Finding points to delivery fragility."
    return "Highlighted by scanner analysis."


def _level_for_score(score: float) -> str:
    """Return a simple frontend fragility level."""
    if score >= 0.75:
        return "critical"
    if score >= 0.5:
        return "high"
    if score >= 0.25:
        return "medium"
    return "low"


def _overlay_summary(drivers: list[dict], level: str) -> str:
    """Return a short scanner overlay summary for the frontend."""
    labels = [item.get("label", "fragility pressure") for item in drivers[:2] if isinstance(item, dict)]
    if labels:
        return f"The system appears {level} due to {', '.join(labels)}."
    return f"The system appears {level} based on scanner analysis."


def _clamp01(value: float) -> float:
    """Clamp arbitrary numeric input to the 0..1 range."""
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return 0.0
    if numeric < 0.0:
        return 0.0
    if numeric > 1.0:
        return 1.0
    return numeric
