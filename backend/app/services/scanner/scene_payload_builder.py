"""Frontend-friendly scene payload builder for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any

from mapping.schemas import ObjectImpactSet


_RISK_OBJECTS = {"obj_risk_zone", "obj_supplier", "obj_bottleneck", "obj_delivery"}


def build_fragility_scene_payload(
    object_impacts: ObjectImpactSet,
    fragility_score: float,
    drivers: list[dict],
    findings: list[dict],
    reasons_by_object: dict[str, list[str]],
) -> dict[str, Any]:
    """Build an additive scene payload for scanner-driven frontend overlays."""
    bounded_score = _clamp01(fragility_score)
    level = _level_for_score(bounded_score)
    primary_ids = [impact.object_id for impact in object_impacts.primary]
    affected_ids = [impact.object_id for impact in object_impacts.affected]
    context_ids = [impact.object_id for impact in object_impacts.context]
    highlighted_object_ids = _unique_ids([*primary_ids, *affected_ids, *context_ids])[:5]
    focus_objects = _suggested_focus(primary_ids, affected_ids, highlighted_object_ids, drivers)

    objects = [
        {
            "id": object_id,
            "emphasis": _object_emphasis(object_id, bounded_score),
            "reason": _highlight_reason(object_id, drivers, findings, reasons_by_object),
        }
        for object_id in highlighted_object_ids
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
        "highlighted_object_ids": highlighted_object_ids,
        "primary_object_ids": primary_ids,
        "affected_object_ids": affected_ids,
        "dim_unrelated_objects": len(primary_ids) > 0,
        "reasons_by_object": reasons_by_object,
    }


def _suggested_focus(primary_ids: list[str], affected_ids: list[str], suggested_objects: list[str], drivers: list[dict]) -> list[str]:
    """Return the most relevant objects to focus in the scene."""
    ordered: list[str] = []
    risk_priority = [item for item in [*primary_ids, *affected_ids, *suggested_objects] if item in _RISK_OBJECTS]
    for object_id in [*primary_ids, *risk_priority, *affected_ids, *suggested_objects]:
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


def _highlight_reason(
    object_id: str,
    drivers: list[dict],
    findings: list[dict],
    reasons_by_object: dict[str, list[str]],
) -> str:
    """Build a compact explanation for why an object is highlighted."""
    object_reasons = reasons_by_object.get(object_id) or []
    if object_reasons:
        return object_reasons[0]

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


def _unique_ids(values: list[str]) -> list[str]:
    ordered: list[str] = []
    for value in values:
        if value and value not in ordered:
            ordered.append(value)
    return ordered


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
