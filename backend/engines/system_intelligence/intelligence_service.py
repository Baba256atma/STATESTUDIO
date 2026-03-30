"""System interpretation layer for War Room and scenario overlays."""

from __future__ import annotations

from collections import defaultdict
from typing import Any

from engines.evolution.evolution_service import get_current_policy_inputs
from engines.system_intelligence.intelligence_models import (
    SystemIntelligenceAdvice,
    SystemIntelligenceInput,
    SystemIntelligenceObjectInsight,
    SystemIntelligencePathInsight,
    SystemIntelligenceResult,
    SystemIntelligenceSummary,
)
from engines.system_intelligence.intelligence_policy import (
    clamp01,
    classify_advice_kind,
    compute_object_priority,
    compute_path_significance,
    resolve_suggested_focus,
)


def _as_dict(value: Any) -> dict[str, Any]:
    if value is None:
        return {}
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="python")
    return value if isinstance(value, dict) else {}


def _normalize_id(value: Any) -> str | None:
    next_value = str(value or "").strip()
    return next_value or None


def _derive_object_label(object_id: str) -> str:
    return object_id.replace("obj_", "").replace("_", " ").strip().title() or object_id


def _build_object_signal_map(payload: SystemIntelligenceInput) -> dict[str, dict[str, Any]]:
    signal_map: dict[str, dict[str, Any]] = defaultdict(
        lambda: {
            "role": "context",
            "propagation_strength": 0.0,
            "decision_strength": 0.0,
            "fragility_score": 0.0,
            "pressure_score": 0.0,
            "leverage_score": 0.0,
        }
    )

    propagation = _as_dict(payload.propagation)
    for node in propagation.get("impacted_nodes", []) or []:
        object_id = _normalize_id(node.get("object_id"))
        if not object_id:
            continue
        depth = max(0, int(node.get("depth", 0) or 0))
        strength = clamp01(node.get("strength", 0.0))
        entry = signal_map[object_id]
        entry["propagation_strength"] = max(entry["propagation_strength"], strength)
        entry["pressure_score"] = max(entry["pressure_score"], strength)
        entry["role"] = "source" if depth == 0 else "impacted" if entry["role"] == "context" else entry["role"]

    decision_path = _as_dict(payload.decision_path)
    for node in decision_path.get("nodes", []) or []:
        object_id = _normalize_id(node.get("object_id"))
        if not object_id:
            continue
        role = str(node.get("role", "context") or "context")
        strength = clamp01(node.get("strength", 0.0))
        entry = signal_map[object_id]
        entry["decision_strength"] = max(entry["decision_strength"], strength)
        if role in {"leverage", "destination", "source", "bottleneck", "protected", "context", "impacted"}:
            entry["role"] = role
        if role == "leverage":
            entry["leverage_score"] = max(entry["leverage_score"], strength)
        if role == "bottleneck":
            entry["pressure_score"] = max(entry["pressure_score"], strength)

    scanner = _as_dict(payload.scanner_summary)
    fragility_score = clamp01(
        scanner.get("fragility_score", scanner.get("score", 0.0))
    )
    primary_id = _normalize_id(
        scanner.get("scanner_primary_target_id")
        or scanner.get("primary_object_id")
        or scanner.get("source_object_id")
    )
    if primary_id:
        entry = signal_map[primary_id]
        entry["fragility_score"] = max(entry["fragility_score"], fragility_score)
        if entry["role"] == "context":
            entry["role"] = "source"

    scenario_action = _as_dict(payload.scenario_action)
    source_object_id = _normalize_id(
        scenario_action.get("intent", {}).get("source_object_id")
        or scenario_action.get("source_object_id")
    )
    if source_object_id:
        entry = signal_map[source_object_id]
        entry["role"] = "source"
        entry["pressure_score"] = max(entry["pressure_score"], 0.55)

    return signal_map


def _build_path_insights(
    *,
    payload: SystemIntelligenceInput,
    object_priority_by_id: dict[str, float],
    fragility_by_id: dict[str, float],
) -> list[SystemIntelligencePathInsight]:
    propagation = _as_dict(payload.propagation)
    decision_path = _as_dict(payload.decision_path)
    edges = []

    for edge in propagation.get("impacted_edges", []) or []:
        from_id = _normalize_id(edge.get("from_id"))
        to_id = _normalize_id(edge.get("to_id"))
        if not from_id or not to_id:
            continue
        edges.append(
            {
                "from_id": from_id,
                "to_id": to_id,
                "path_strength": clamp01(edge.get("strength", 0.0)),
                "path_role": "primary" if int(edge.get("depth", 1) or 1) == 1 else "secondary",
                "rationale": "Propagation marks this as a likely downstream consequence link.",
            }
        )

    for edge in decision_path.get("edges", []) or []:
        from_id = _normalize_id(edge.get("from_id"))
        to_id = _normalize_id(edge.get("to_id"))
        if not from_id or not to_id:
            continue
        path_role = str(edge.get("path_role", "secondary_path") or "secondary_path")
        mapped_role = {
            "primary_path": "primary",
            "secondary_path": "secondary",
            "tradeoff_path": "tradeoff",
            "feedback_path": "feedback",
        }.get(path_role, "secondary")
        edges.append(
            {
                "from_id": from_id,
                "to_id": to_id,
                "path_strength": clamp01(edge.get("strength", 0.0)),
                "path_role": mapped_role,
                "rationale": "Decision path marks this link as strategically important.",
            }
        )

    path_insights: list[SystemIntelligencePathInsight] = []
    for index, edge in enumerate(edges):
        endpoint_priority = max(
            object_priority_by_id.get(edge["from_id"], 0.0),
            object_priority_by_id.get(edge["to_id"], 0.0),
        )
        fragility_signal = max(
            fragility_by_id.get(edge["from_id"], 0.0),
            fragility_by_id.get(edge["to_id"], 0.0),
        )
        significance = compute_path_significance(
            path_role=edge["path_role"],
            path_strength=edge["path_strength"],
            endpoint_priority=endpoint_priority,
            fragility_signal=fragility_signal,
            mode=payload.mode,
        )
        path_insights.append(
            SystemIntelligencePathInsight(
                path_id=f"path:{index}:{edge['from_id']}->{edge['to_id']}",
                source_object_id=edge["from_id"],
                target_object_id=edge["to_id"],
                path_strength=edge["path_strength"],
                path_role=edge["path_role"],
                significance_score=significance,
                rationale=edge["rationale"],
            )
        )

    return sorted(path_insights, key=lambda item: item.significance_score, reverse=True)


def run_system_intelligence(input_data: SystemIntelligenceInput) -> SystemIntelligenceResult:
    signal_map = _build_object_signal_map(input_data)
    focus_object_id = _normalize_id(input_data.current_focus_object_id)
    policy_inputs = get_current_policy_inputs().get("intelligence", {})

    object_insights: list[SystemIntelligenceObjectInsight] = []
    for object_id, signal in signal_map.items():
        fragility_score = clamp01(signal.get("fragility_score", 0.0))
        leverage_score = max(clamp01(signal.get("leverage_score", 0.0)), clamp01(signal.get("decision_strength", 0.0)) * 0.6)
        pressure_score = max(clamp01(signal.get("pressure_score", 0.0)), clamp01(signal.get("propagation_strength", 0.0)))
        priority = compute_object_priority(
            role=str(signal.get("role", "context")),
            propagation_strength=clamp01(signal.get("propagation_strength", 0.0)),
            decision_strength=clamp01(signal.get("decision_strength", 0.0)),
            fragility_score=fragility_score,
            is_focus_object=focus_object_id == object_id,
            mode=input_data.mode,
        )
        priority = clamp01(priority + float(policy_inputs.get(f"object:{object_id}", 0.0)))
        rationale = (
            f"{_derive_object_label(object_id)} is the active source of this scenario."
            if signal.get("role") == "source"
            else f"{_derive_object_label(object_id)} appears as a leverage point linking consequence paths."
            if signal.get("role") == "leverage"
            else f"{_derive_object_label(object_id)} is a bottleneck where strong paths concentrate."
            if signal.get("role") == "bottleneck"
            else f"{_derive_object_label(object_id)} remains strategically relevant in the current overlay."
        )
        object_insights.append(
            SystemIntelligenceObjectInsight(
                object_id=object_id,
                role=str(signal.get("role", "context")),
                strategic_priority=priority,
                pressure_score=pressure_score,
                leverage_score=leverage_score,
                fragility_score=fragility_score if fragility_score > 0 else None,
                rationale=rationale,
            )
        )

    object_insights = sorted(object_insights, key=lambda item: item.strategic_priority, reverse=True)
    object_priority_by_id = {item.object_id: item.strategic_priority for item in object_insights}
    fragility_by_id = {item.object_id: item.fragility_score or 0.0 for item in object_insights}
    path_insights = _build_path_insights(
        payload=input_data,
        object_priority_by_id=object_priority_by_id,
        fragility_by_id=fragility_by_id,
    )

    suggested_focus_object_id = resolve_suggested_focus([item.model_dump(mode="python") for item in object_insights])
    top_object = object_insights[0] if object_insights else None
    top_path = path_insights[0] if path_insights else None

    summary = SystemIntelligenceSummary(
        headline=(
            f"{_derive_object_label(top_object.object_id)} is the main strategic pressure point."
            if top_object is not None
            else "No strong strategic signal is active yet."
        ),
        summary=(
            f"{_derive_object_label(top_object.object_id)} currently leads the system priority ranking, while "
            f"{_derive_object_label(top_path.target_object_id)} anchors the strongest active path."
            if top_object is not None and top_path is not None and top_path.target_object_id
            else "System intelligence is waiting for stronger propagation or decision-path context."
        ),
        key_signal=top_object.rationale if top_object is not None else None,
        suggested_focus_object_id=suggested_focus_object_id,
        suggested_mode=(
            "decision"
            if input_data.mode == "decision" or any(item.role == "bottleneck" for item in object_insights[:2])
            else "simulation"
            if input_data.mode == "simulation" or path_insights
            else "analysis"
        ),
    )

    advice: list[SystemIntelligenceAdvice] = []
    for index, insight in enumerate(object_insights[:3]):
        advice_kind = classify_advice_kind(
            role=insight.role,
            fragility_score=insight.fragility_score or 0.0,
            leverage_score=insight.leverage_score,
        )
        title = (
            f"Focus {_derive_object_label(insight.object_id)} next"
            if advice_kind == "focus"
            else f"Mitigate {_derive_object_label(insight.object_id)}"
            if advice_kind == "mitigate"
            else f"Protect {_derive_object_label(insight.object_id)}"
            if advice_kind == "protect"
            else f"Investigate {_derive_object_label(insight.object_id)}"
            if advice_kind == "investigate"
            else f"Simulate {_derive_object_label(insight.object_id)} next"
        )
        body = (
            insight.rationale
            or f"{_derive_object_label(insight.object_id)} is materially present across the current system signals."
        )
        advice.append(
            SystemIntelligenceAdvice(
                advice_id=f"advice:{index}:{insight.object_id}",
                kind=advice_kind,
                target_object_id=insight.object_id,
                title=title,
                body=body,
                confidence=clamp01(insight.strategic_priority * 0.92),
            )
        )

    return SystemIntelligenceResult(
        active=bool(object_insights or path_insights),
        object_insights=object_insights,
        path_insights=path_insights,
        summary=summary,
        advice=advice,
        meta={
            "engine_version": "system_intelligence_v1",
            "interpretation_mode": input_data.mode,
            "source": "heuristic_system_intelligence",
            "timestamp": __import__("time").time(),
        },
    )
