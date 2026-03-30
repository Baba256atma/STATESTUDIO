from __future__ import annotations

from typing import Any

from engines.strategic_council.council_models import CouncilAgentInput, CouncilAgentRole


def clamp01(value: float) -> float:
    if not isinstance(value, (int, float)):
        return 0.0
    return max(0.0, min(1.0, float(value)))


def prettify_label(value: str | None) -> str:
    return str(value or "").replace("obj_", "").replace("_", " ").strip().title()


def resolve_scene_label(scene_json: dict[str, Any] | None, object_id: str | None) -> str | None:
    if not object_id or not isinstance(scene_json, dict):
        return None
    objects = (scene_json.get("scene") or {}).get("objects") or []
    if not isinstance(objects, list):
        return None
    for item in objects:
        if not isinstance(item, dict):
            continue
        if object_id in {item.get("id"), item.get("objectId"), item.get("name")}:
            label = item.get("label") or item.get("name") or item.get("title")
            if isinstance(label, str) and label.strip():
                return label.strip()
    return prettify_label(object_id)


def top_fragility_drivers(fragility: dict[str, Any] | None) -> list[str]:
    drivers = (fragility or {}).get("drivers") or {}
    if isinstance(drivers, list):
        labels = []
        for item in drivers:
            if not isinstance(item, dict):
                continue
            label = item.get("label") or item.get("code") or item.get("id")
            if isinstance(label, str) and label.strip():
                labels.append(label.strip())
        return labels[:3]
    if not isinstance(drivers, dict):
        return []
    ranked = sorted(drivers.items(), key=lambda entry: float(entry[1] or 0), reverse=True)
    return [prettify_label(str(key)) for key, value in ranked[:3] if float(value or 0) > 0]


def propagation_chain(input_data: CouncilAgentInput) -> list[str]:
    propagation = input_data.propagation or {}
    edges = propagation.get("edges") or []
    if not isinstance(edges, list) or not edges:
        return []
    chain: list[str] = []
    for index, edge in enumerate(edges[:4]):
        if not isinstance(edge, dict):
            continue
        node_id = edge.get("from") if index == 0 else edge.get("to")
        label = resolve_scene_label(input_data.scene_json, str(node_id) if node_id else None)
        if label:
            chain.append(label)
    return chain


def compare_tradeoffs(compare_result: dict[str, Any] | None) -> list[str]:
    if not isinstance(compare_result, dict):
        return []
    tradeoffs = compare_result.get("tradeoffs") or []
    labels: list[str] = []
    if isinstance(tradeoffs, list):
        for item in tradeoffs[:3]:
            if not isinstance(item, dict):
                continue
            dimension = item.get("dimension")
            if isinstance(dimension, str) and dimension.strip():
                labels.append(prettify_label(dimension))
    return labels


def strategy_actions(strategy_result: dict[str, Any] | None) -> list[str]:
    if not isinstance(strategy_result, dict):
        return []
    actions = strategy_result.get("recommended_actions") or strategy_result.get("top_actions") or []
    if not isinstance(actions, list):
        return []
    result: list[str] = []
    for action in actions[:3]:
        if isinstance(action, str) and action.strip():
            result.append(action.strip())
        elif isinstance(action, dict):
            label = action.get("action") or action.get("title")
            if isinstance(label, str) and label.strip():
                result.append(label.strip())
    return result


def confidence_floor(input_data: CouncilAgentInput) -> float:
    score = 0.28
    if isinstance(input_data.fragility, dict) and input_data.fragility:
        score += 0.14
    if isinstance(input_data.propagation, dict) and input_data.propagation:
        score += 0.12
    if isinstance(input_data.decision_path, dict) and input_data.decision_path:
        score += 0.08
    if isinstance(input_data.compare_result, dict) and input_data.compare_result:
        score += 0.08
    if isinstance(input_data.strategy_result, dict) and input_data.strategy_result:
        score += 0.08
    if isinstance(input_data.memory_summary, dict) and input_data.memory_summary:
        score += 0.05
    if isinstance(input_data.learning_summary, dict) and input_data.learning_summary:
        score += 0.05
    if input_data.focused_object_id:
        score += 0.05
    return clamp01(score)


def role_weight(role: CouncilAgentRole) -> float:
    if role == "ceo":
        return 0.05
    if role == "cfo":
        return 0.03
    return 0.04
