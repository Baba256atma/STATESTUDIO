from __future__ import annotations


def build_object_selection_v25(scene_json, fragility, conflicts, memory, memory_v2=None):
    scene = scene_json.get("scene", {}) if isinstance(scene_json, dict) else {}
    drivers = fragility.get("drivers", {}) if isinstance(fragility, dict) else {}
    kpi = scene.get("kpi", {}) if isinstance(scene.get("kpi"), dict) else {}

    inventory_pressure = float(drivers.get("inventory_pressure", 0) or 0)
    time_pressure = float(drivers.get("time_pressure", 0) or 0)
    quality_risk = float(drivers.get("quality_risk", 0) or 0)

    ranking = {}
    ranking["obj_inventory"] = (inventory_pressure * 0.5 + float(kpi.get("inventory", 0.5) or 0.5) * 0.3)
    ranking["obj_delivery"] = (time_pressure * 0.6 + float(kpi.get("delivery", 0.5) or 0.5) * 0.3)
    ranking["obj_quality"] = quality_risk * 0.7
    ranking["obj_risk_zone"] = float(kpi.get("risk", 0.5) or 0.5) * 0.6

    for c in conflicts if isinstance(conflicts, list) else []:
        if not isinstance(c, dict):
            continue
        a = c.get("a")
        b = c.get("b")
        score = float(c.get("score", 0) or 0)
        if a in ranking:
            ranking[a] += score * 0.2
        if b in ranking:
            ranking[b] += score * 0.2

    # Memory v2: boost repeated object relevance when available.
    if isinstance(memory_v2, dict):
        for bias in memory_v2.get("object_bias") if isinstance(memory_v2.get("object_bias"), list) else []:
            if not isinstance(bias, dict):
                continue
            oid = bias.get("id")
            boost = float(bias.get("boost", 0) or 0)
            if not isinstance(oid, str) or not oid:
                continue
            if oid in ranking:
                ranking[oid] += boost
            else:
                ranking[oid] = boost * 0.5

    ranked = sorted(
        [{"id": k, "score": round(float(v), 3)} for k, v in ranking.items()],
        key=lambda x: x["score"],
        reverse=True,
    )

    active = [x["id"] for x in ranked[:3]]
    highlighted = [x["id"] for x in ranked[:2]]
    suppressed = ["obj_cashflow", "obj_customer"]

    return {
        "active_objects": active,
        "highlighted_objects": highlighted,
        "suppressed_objects": suppressed,
        "rankings": ranked,
        "reasoning": "Object relevance derived from fragility drivers and conflict map.",
    }
