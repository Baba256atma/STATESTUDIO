from __future__ import annotations

from typing import Any


def build_opponent_model_v0(
    scene_json: dict[str, Any] | None,
    fragility: dict[str, Any] | None,
    conflicts: list[dict[str, Any]] | None,
    risk_propagation: dict[str, Any] | None,
    object_selection: dict[str, Any] | None,
    memory_v2: dict[str, Any] | None,
    strategic_advice: dict[str, Any] | None,
) -> dict[str, Any]:
    """
    Lightweight external actor modeling.
    Returns likely opponent/external moves and best response.
    """
    _ = conflicts
    _ = risk_propagation

    kpi = (scene_json or {}).get("scene", {}).get("kpi", {}) or {}
    drivers = (fragility or {}).get("drivers", {}) or {}
    highlighted = (object_selection or {}).get("highlighted_objects", []) or []
    repeated_conflicts = (memory_v2 or {}).get("repeated_conflicts", []) or []

    inventory_pressure = float(drivers.get("inventory_pressure", 0))
    time_pressure = float(drivers.get("time_pressure", 0))
    quality_risk = float(drivers.get("quality_risk", 0))
    risk_value = float(kpi.get("risk", 0.5))

    moves: list[dict[str, Any]] = []

    # If delivery is weak, opponent can pressure delivery
    if time_pressure > 0.4:
        moves.append(
            {
                "id": "pressure_delivery",
                "label": "Exploit delivery weakness",
                "impact": "Increases delivery instability.",
            }
        )

    # If inventory is weak, opponent can pressure supply/availability
    if inventory_pressure > 0.4:
        moves.append(
            {
                "id": "pressure_inventory",
                "label": "Exploit inventory weakness",
                "impact": "Pushes the system into shortage pressure.",
            }
        )

    # If overall risk is elevated, opponent can escalate
    if risk_value > 0.55 or quality_risk > 0.4:
        moves.append(
            {
                "id": "escalate_risk",
                "label": "Increase strategic pressure",
                "impact": "Pushes the system toward higher fragility.",
            }
        )

    if not moves:
        moves.append(
            {
                "id": "observe_and_wait",
                "label": "Wait and observe",
                "impact": "No dominant weakness is exposed.",
            }
        )

    # Memory/object-selection influence (lightweight)
    if isinstance(highlighted, list) and "obj_delivery" in highlighted:
        has_delivery = any(m.get("id") == "pressure_delivery" for m in moves)
        if not has_delivery:
            moves.append(
                {
                    "id": "pressure_delivery",
                    "label": "Exploit delivery weakness",
                    "impact": "Increases delivery instability.",
                }
            )

    has_delivery_quality_repeat = False
    for rc in repeated_conflicts:
        if not isinstance(rc, dict):
            continue
        pair = rc.get("pair") or []
        if "obj_delivery" in pair and "obj_quality" in pair:
            has_delivery_quality_repeat = True
            break
    if has_delivery_quality_repeat:
        has_escalate = any(m.get("id") == "escalate_risk" for m in moves)
        if not has_escalate:
            moves.append(
                {
                    "id": "escalate_risk",
                    "label": "Increase strategic pressure",
                    "impact": "Pushes the system toward higher fragility.",
                }
            )

    # Best response logic
    if any(m["id"] == "pressure_delivery" for m in moves):
        best_response = {
            "id": "stabilize_flow",
            "label": "Stabilize delivery and protect quality",
            "targets": ["obj_delivery", "obj_quality"],
            "why": "Delivery pressure is the easiest attack surface.",
        }
    elif any(m["id"] == "pressure_inventory" for m in moves):
        best_response = {
            "id": "protect_inventory",
            "label": "Increase inventory resilience",
            "targets": ["obj_inventory", "obj_delivery"],
            "why": "Inventory weakness can cascade into delivery instability.",
        }
    elif any(m["id"] == "escalate_risk" for m in moves):
        best_response = {
            "id": "contain_risk",
            "label": "Add risk controls and mitigation checkpoints",
            "targets": ["obj_risk_zone"],
            "why": "Elevated system risk creates exposure to escalation.",
        }
    else:
        primary = (strategic_advice or {}).get("primary_recommendation") or {}
        best_response = {
            "id": "follow_primary_advice",
            "label": primary.get("action", "Maintain current position"),
            "targets": primary.get("targets", []),
            "why": "No dominant opponent move detected.",
        }

    strategic_risk = round(
        min(
            0.95,
            0.4
            + (0.15 if inventory_pressure > 0.4 else 0)
            + (0.18 if time_pressure > 0.4 else 0)
            + (0.15 if quality_risk > 0.4 else 0)
            + (0.1 if risk_value > 0.55 else 0),
        ),
        2,
    )

    summary = "External pressure is most likely to target exposed system weaknesses."

    return {
        "actor": {
            "id": "external_actor",
            "label": "External Actor",
        },
        "possible_moves": moves,
        "best_response": best_response,
        "strategic_risk": strategic_risk,
        "summary": summary,
    }
