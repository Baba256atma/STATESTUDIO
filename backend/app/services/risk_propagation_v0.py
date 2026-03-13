from __future__ import annotations

from typing import Any, Dict, List


def _fnum(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return float(default)


def build_risk_propagation_v0(scene_json, fragility, conflicts):
    scene = scene_json.get("scene", {}) if isinstance(scene_json, dict) else {}
    kpi = scene.get("kpi", {}) if isinstance(scene.get("kpi"), dict) else {}
    drivers = fragility.get("drivers", {}) if isinstance(fragility, dict) else {}

    inv_pressure = _fnum(drivers.get("inventory_pressure", 0.0), 0.0)
    time_pressure = _fnum(drivers.get("time_pressure", 0.0), 0.0)
    quality_risk = _fnum(drivers.get("quality_risk", 0.0), 0.0)

    edges: List[Dict[str, Any]] = []
    sources: List[str] = []

    if inv_pressure > 0.35:
        edges.append({"from": "obj_inventory", "to": "obj_delivery", "weight": round(inv_pressure, 3)})
        sources.append("obj_inventory")

    if time_pressure > 0.35:
        edges.append({"from": "obj_delivery", "to": "obj_quality", "weight": round(time_pressure, 3)})

    if quality_risk > 0.35:
        edges.append({"from": "obj_quality", "to": "obj_risk_zone", "weight": round(quality_risk, 3)})

    # If risk is elevated and conflicts exist, mark risk zone as a source too.
    risk_level = _fnum(kpi.get("risk", 0.0), 0.0)
    has_conflicts = isinstance(conflicts, list) and len(conflicts) > 0
    if risk_level > 0.6 and has_conflicts:
        sources.append("obj_risk_zone")

    return {
        "edges": edges,
        "sources": sorted(set([s for s in sources if isinstance(s, str) and s])),
        "summary": "Risk cascades through system drivers." if edges else "No significant propagation detected.",
    }
