from __future__ import annotations

from typing import Any


def build_conflict_map_v0(kpi: dict, fragility: dict):
    """
    Lightweight conflict detection between system objects.
    Returns list of conflicts.
    """
    conflicts = []

    kpi = kpi if isinstance(kpi, dict) else {}
    fragility = fragility if isinstance(fragility, dict) else {}

    inv = float(kpi.get("inventory", 0.5) or 0.5)
    delivery = float(kpi.get("delivery", 0.5) or 0.5)
    risk = float(kpi.get("risk", 0.5) or 0.5)

    drivers: dict[str, Any] = fragility.get("drivers", {}) if isinstance(fragility.get("drivers"), dict) else {}
    inv_pressure = float(drivers.get("inventory_pressure", 0) or 0)
    time_pressure = float(drivers.get("time_pressure", 0) or 0)
    quality_risk = float(drivers.get("quality_risk", 0) or 0)

    # Inventory vs Delivery
    if inv_pressure > 0.4 and time_pressure > 0.4:
        conflicts.append({
            "a": "obj_inventory",
            "b": "obj_delivery",
            "score": round((inv_pressure + time_pressure) / 2, 3),
            "reason": "Low inventory increases delivery pressure.",
        })

    # Delivery vs Quality
    if time_pressure > 0.4 and quality_risk > 0.4:
        conflicts.append({
            "a": "obj_delivery",
            "b": "obj_quality",
            "score": round((time_pressure + quality_risk) / 2, 3),
            "reason": "Delivery acceleration increases quality risk.",
        })

    # Risk zone
    if risk > 0.6:
        conflicts.append({
            "a": "obj_risk_zone",
            "b": "system",
            "score": risk,
            "reason": "System risk exposure rising.",
        })

    return conflicts
