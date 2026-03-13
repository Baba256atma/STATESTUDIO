from __future__ import annotations

from typing import Any


def build_strategic_advice_v0(
    scene_json: dict[str, Any] | None,
    fragility: dict[str, Any] | None,
    conflicts: list[dict[str, Any]] | None,
    risk_propagation: dict[str, Any] | None,
    object_selection: dict[str, Any] | None,
    memory_v2: dict[str, Any] | None,
    timeline_result: Any = None,
) -> dict[str, Any]:
    """
    Build strategic advice from current Nexora intelligence layers.
    Returns a recommendation bundle.
    """
    _ = conflicts  # Reserved for future scoring without changing API surface.

    kpi = (scene_json or {}).get("scene", {}).get("kpi", {}) or {}
    drivers = (fragility or {}).get("drivers", {}) or {}
    rankings = (object_selection or {}).get("rankings", []) or []
    repeated_conflicts = (memory_v2 or {}).get("repeated_conflicts", []) or []
    similar_patterns = (memory_v2 or {}).get("similar_patterns", []) or []
    edges = (risk_propagation or {}).get("edges", []) or []

    inventory_pressure = float(drivers.get("inventory_pressure", 0))
    time_pressure = float(drivers.get("time_pressure", 0))
    quality_risk = float(drivers.get("quality_risk", 0))
    risk_value = float(kpi.get("risk", 0.5))

    actions: list[dict[str, Any]] = []

    # 1) Inventory / flow stabilization
    if inventory_pressure > 0.4:
        actions.append(
            {
                "type": "stabilize",
                "action": "Increase inventory buffer",
                "targets": ["obj_inventory", "obj_delivery"],
                "impact": "Reduces delivery pressure and stabilizes flow.",
                "priority": 1,
            }
        )

    # 2) Time / quality protection
    if time_pressure > 0.4 and quality_risk > 0.35:
        actions.append(
            {
                "type": "protect_quality",
                "action": "Reduce delivery acceleration",
                "targets": ["obj_delivery", "obj_quality"],
                "impact": "Lowers quality risk caused by time pressure.",
                "priority": 2,
            }
        )

    # 3) General risk containment
    if risk_value > 0.55:
        actions.append(
            {
                "type": "contain_risk",
                "action": "Add risk controls and mitigation checkpoints",
                "targets": ["obj_risk_zone"],
                "impact": "Reduces exposure to escalation and failure propagation.",
                "priority": 3,
            }
        )

    # 4) If no specific strong signals, fallback recommendation
    if not actions:
        actions.append(
            {
                "type": "monitor",
                "action": "Maintain current path and monitor leading indicators",
                "targets": [],
                "impact": "No dominant fragility driver detected.",
                "priority": 1,
            }
        )

    # Memory influence (lightweight)
    # If repeated delivery-quality conflicts appear, raise protect_quality priority
    for a in actions:
        if a["type"] == "protect_quality":
            for rc in repeated_conflicts:
                pair = rc.get("pair") or []
                if "obj_delivery" in pair and "obj_quality" in pair:
                    a["priority"] = max(1, int(a.get("priority", 2)) - 1)
                    break

    # Object selection influence (lightweight)
    # If inventory/delivery objects rank high, slightly reinforce stabilization.
    top_ids = []
    if isinstance(rankings, list):
        for r in rankings[:3]:
            if isinstance(r, dict) and isinstance(r.get("id"), str):
                top_ids.append(r["id"])
    if "obj_inventory" in top_ids or "obj_delivery" in top_ids:
        for a in actions:
            if a["type"] == "stabilize":
                a["priority"] = max(1, int(a.get("priority", 1)) - 1)
                break

    # Timeline-aware optional reinforcement
    timeline_best = None
    if isinstance(timeline_result, dict):
        timeline_best = timeline_result.get("best_scenario")
    else:
        timeline_best = getattr(timeline_result, "best_scenario", None)
    if isinstance(timeline_best, str) and timeline_best and timeline_best != "Baseline":
        for a in actions:
            if a["type"] == "stabilize":
                a["priority"] = max(1, int(a.get("priority", 1)) - 1)
                break

    # Sort by priority ascending
    actions = sorted(actions, key=lambda x: x.get("priority", 999))

    primary = actions[0] if actions else None

    # Why
    why_parts = []
    if inventory_pressure > 0.4:
        why_parts.append("inventory pressure is elevated")
    if time_pressure > 0.4:
        why_parts.append("delivery pressure is elevated")
    if quality_risk > 0.35:
        why_parts.append("quality risk is rising")
    if risk_value > 0.55:
        why_parts.append("overall risk exposure is elevated")

    why = (
        ", ".join(why_parts).capitalize() + "."
        if why_parts
        else "Recommendation derived from current system signals."
    )

    # Confidence (simple heuristic)
    signal_count = 0
    if inventory_pressure > 0.4:
        signal_count += 1
    if time_pressure > 0.4:
        signal_count += 1
    if quality_risk > 0.35:
        signal_count += 1
    if risk_value > 0.55:
        signal_count += 1
    if repeated_conflicts:
        signal_count += 1
    if similar_patterns:
        signal_count += 1
    if edges:
        signal_count += 1
    if top_ids:
        signal_count += 1

    confidence = round(min(0.95, 0.45 + signal_count * 0.07), 2)

    summary = (
        f"Best next move is to {primary['action'].lower()}."
        if primary
        else "No recommendation available."
    )

    return {
        "recommended_actions": actions,
        "primary_recommendation": primary,
        "why": why,
        "confidence": confidence,
        "summary": summary,
    }
