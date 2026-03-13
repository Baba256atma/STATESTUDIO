from __future__ import annotations

from typing import Any


def build_strategic_patterns_v0(
    memory_context: dict[str, Any] | None,
    memory_v2: dict[str, Any] | None,
    conflicts: list[dict[str, Any]] | None,
    risk_propagation: dict[str, Any] | None,
    object_selection: dict[str, Any] | None,
) -> dict[str, Any]:
    """
    Detect repeated strategic patterns using memory summaries, conflicts,
    object focus recurrence, and risk propagation edges.
    """
    _ = conflicts

    summary = (memory_context or {}).get("summary", {}) or {}
    recurring_drivers = summary.get("recurring_drivers", []) or []
    top_objects = summary.get("top_focused_objects", []) or []
    repeated_conflicts = (memory_v2 or {}).get("repeated_conflicts", []) or []
    object_bias = (memory_v2 or {}).get("object_bias", []) or []
    edges = (risk_propagation or {}).get("edges", []) or []
    rankings = (object_selection or {}).get("rankings", []) or []

    patterns: list[dict[str, Any]] = []

    driver_map = {d.get("code"): d for d in recurring_drivers if isinstance(d, dict)}
    object_ids = {o.get("id") for o in top_objects if isinstance(o, dict)}
    ranking_ids = {r.get("id") for r in rankings if isinstance(r, dict)}

    # Pattern 1: Supply chain instability
    has_supply_chain = (
        ("inventory_pressure" in driver_map and driver_map["inventory_pressure"].get("count", 0) >= 2)
        and ("time_pressure" in driver_map and driver_map["time_pressure"].get("count", 0) >= 2)
        and (
            "obj_inventory" in object_ids
            or "obj_delivery" in object_ids
            or "obj_inventory" in ranking_ids
            or "obj_delivery" in ranking_ids
        )
    )
    if has_supply_chain:
        avg_fragility = round(
            (
                float(driver_map.get("inventory_pressure", {}).get("avg", 0))
                + float(driver_map.get("time_pressure", {}).get("avg", 0))
            )
            / 2,
            2,
        )
        freq = int(
            max(
                driver_map.get("inventory_pressure", {}).get("count", 0),
                driver_map.get("time_pressure", {}).get("count", 0),
            )
        )
        patterns.append(
            {
                "id": "pattern_supply_chain_instability",
                "label": "Supply chain instability",
                "frequency": freq,
                "avg_fragility": avg_fragility,
                "key_objects": ["obj_inventory", "obj_delivery", "obj_quality"],
                "why": "Inventory pressure repeatedly cascades into delivery and quality risk.",
            }
        )

    # Pattern 2: Delivery-quality fragility loop
    for rc in repeated_conflicts:
        pair = rc.get("pair") or []
        if "obj_delivery" in pair and "obj_quality" in pair:
            freq = int(rc.get("count", 1))
            avg_fragility = round(float(rc.get("avg_score", 0)), 2)
            patterns.append(
                {
                    "id": "pattern_delivery_quality_loop",
                    "label": "Delivery-quality fragility loop",
                    "frequency": freq,
                    "avg_fragility": avg_fragility,
                    "key_objects": ["obj_delivery", "obj_quality"],
                    "why": "Delivery pressure repeatedly amplifies quality risk.",
                }
            )
            break

    # Pattern 3: Escalating risk propagation
    if len(edges) >= 2:
        max_edge = max((float(e.get("weight", 0)) for e in edges if isinstance(e, dict)), default=0)
        if max_edge > 0.4:
            patterns.append(
                {
                    "id": "pattern_risk_cascade",
                    "label": "Risk cascade",
                    "frequency": len(edges),
                    "avg_fragility": round(max_edge, 2),
                    "key_objects": [e.get("from") for e in edges[:3] if isinstance(e, dict) and e.get("from")],
                    "why": "Risk repeatedly propagates across connected objects.",
                }
            )

    # Pattern 4: Repeated opponent pressure
    if any(
        isinstance(b, dict) and b.get("id") == "obj_delivery" and float(b.get("boost", 0)) > 0.1
        for b in object_bias
    ):
        patterns.append(
            {
                "id": "pattern_external_pressure_on_flow",
                "label": "External pressure on flow",
                "frequency": 2,
                "avg_fragility": 0.5,
                "key_objects": ["obj_delivery", "obj_risk_zone"],
                "why": "Memory bias suggests repeated pressure on delivery stability.",
            }
        )

    # Deduplicate by id
    dedup: dict[str, dict[str, Any]] = {}
    for p in patterns:
        pid = p.get("id")
        if isinstance(pid, str):
            dedup[pid] = p
    patterns = list(dedup.values())

    # Sort by frequency then avg_fragility descending
    patterns = sorted(
        patterns,
        key=lambda x: (x.get("frequency", 0), x.get("avg_fragility", 0)),
        reverse=True,
    )

    top_pattern = patterns[0] if patterns else None
    summary_text = (
        f"Most repeated pattern is {top_pattern['label'].lower()}."
        if top_pattern
        else "No strategic pattern detected yet."
    )

    return {
        "detected_patterns": patterns,
        "top_pattern": top_pattern,
        "summary": summary_text,
    }
