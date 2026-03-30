"""Compare mode service for A/B strategic tradeoff evaluation."""

from __future__ import annotations

from collections import defaultdict
from time import time
from typing import Any

from engines.compare_mode.compare_models import (
    CompareAdvice,
    CompareInput,
    CompareObjectDelta,
    ComparePathDelta,
    CompareResult,
    CompareSummary,
    CompareTradeoff,
)
from engines.evolution.evolution_service import get_current_policy_inputs
from engines.compare_mode.compare_policy import (
    clamp01,
    clamp_signed,
    classify_object_interpretation,
    classify_path_interpretation,
    compute_dimension_score,
    compute_object_dimension_score,
    compute_path_significance_score,
    dimension_weights,
    resolve_dimension_winner,
    resolve_dominance,
    resolve_tradeoff_confidence,
)


def _normalize_id(value: Any) -> str | None:
    normalized = str(value or "").strip()
    return normalized or None


def _label_for_id(value: str | None) -> str:
    if not value:
        return "Unknown"
    return value.replace("obj_", "").replace("_", " ").strip().title() or value


def _scenario_label(scenario: dict[str, Any], fallback: str) -> str:
    title = str(scenario.get("title") or scenario.get("label") or "").strip()
    return title or fallback


def _avg(values: list[float]) -> float:
    if not values:
        return 0.0
    return sum(values) / len(values)


def _system_metrics(intelligence: dict[str, Any]) -> dict[str, float]:
    objects = intelligence.get("object_insights", []) or []
    paths = intelligence.get("path_insights", []) or []
    pressure_values = [clamp01(item.get("pressure_score", 0.0)) for item in objects]
    fragility_values = [clamp01(item.get("fragility_score", 0.0) or 0.0) for item in objects]
    leverage_values = [clamp01(item.get("leverage_score", 0.0)) for item in objects]
    priority_values = [clamp01(item.get("strategic_priority", 0.0)) for item in objects]
    path_values = [
        clamp01(item.get("significance_score", 0.0)) * 0.6 + clamp01(item.get("path_strength", 0.0)) * 0.4
        for item in paths
    ]
    top_pressure = max(pressure_values) if pressure_values else 0.0
    avg_pressure = _avg(pressure_values)
    risk_concentration = clamp01(top_pressure - avg_pressure + 0.5 * max(fragility_values or [0.0]))
    return {
        "pressure": avg_pressure,
        "fragility": _avg(fragility_values),
        "leverage": _avg(leverage_values),
        "priority": _avg(priority_values),
        "path_strength": _avg(path_values),
        "risk_concentration": risk_concentration,
    }


def _build_object_delta_map(intelligence: dict[str, Any], focus_dimension: str) -> dict[str, dict[str, Any]]:
    delta_map: dict[str, dict[str, Any]] = {}
    for item in intelligence.get("object_insights", []) or []:
        object_id = _normalize_id(item.get("object_id"))
        if not object_id:
            continue
        strategic_priority = clamp01(item.get("strategic_priority", 0.0))
        pressure_score = clamp01(item.get("pressure_score", 0.0))
        leverage_score = clamp01(item.get("leverage_score", 0.0))
        fragility_score = clamp01(item.get("fragility_score", 0.0) or 0.0)
        delta_map[object_id] = {
            "object_id": object_id,
            "role": str(item.get("role", "context") or "context"),
            "priority": strategic_priority,
            "pressure": pressure_score,
            "leverage": leverage_score,
            "fragility": fragility_score,
            "rationale": str(item.get("rationale", "") or "").strip() or None,
            "impact": compute_object_dimension_score(
                strategic_priority=strategic_priority,
                pressure_score=pressure_score,
                leverage_score=leverage_score,
                fragility_score=fragility_score,
                focus_dimension=focus_dimension,  # type: ignore[arg-type]
            ),
        }
    return delta_map


def _path_signature(item: dict[str, Any]) -> str | None:
    source_id = _normalize_id(item.get("source_object_id"))
    target_id = _normalize_id(item.get("target_object_id"))
    if not source_id or not target_id:
        return None
    role = str(item.get("path_role", "secondary") or "secondary")
    return f"{source_id}->{target_id}:{role}"


def _build_path_delta_map(intelligence: dict[str, Any], focus_dimension: str) -> dict[str, dict[str, Any]]:
    path_map: dict[str, dict[str, Any]] = {}
    for item in intelligence.get("path_insights", []) or []:
        signature = _path_signature(item)
        if not signature:
            continue
        path_role = str(item.get("path_role", "secondary") or "secondary")
        path_strength = clamp01(item.get("path_strength", 0.0))
        significance_score = clamp01(item.get("significance_score", 0.0))
        effective_strength = compute_path_significance_score(
            path_strength=path_strength,
            significance_score=significance_score,
            path_role=path_role,
            focus_dimension=focus_dimension,  # type: ignore[arg-type]
        )
        path_map[signature] = {
            "path_id": signature,
            "role": path_role,
            "strength": effective_strength,
            "raw_significance": significance_score,
            "rationale": str(item.get("rationale", "") or "").strip() or None,
            "source": _normalize_id(item.get("source_object_id")),
            "target": _normalize_id(item.get("target_object_id")),
        }
    return path_map


def _build_tradeoffs(
    *,
    metrics_a: dict[str, float],
    metrics_b: dict[str, float],
) -> list[CompareTradeoff]:
    tradeoffs: list[CompareTradeoff] = []
    for dimension in ("risk", "efficiency", "stability", "growth"):
        score_a = compute_dimension_score(
            total_pressure=metrics_a["pressure"],
            total_fragility=metrics_a["fragility"],
            total_leverage=metrics_a["leverage"],
            total_priority=metrics_a["priority"],
            path_strength=metrics_a["path_strength"],
            risk_concentration=metrics_a["risk_concentration"],
            focus_dimension=dimension,  # type: ignore[arg-type]
        )
        score_b = compute_dimension_score(
            total_pressure=metrics_b["pressure"],
            total_fragility=metrics_b["fragility"],
            total_leverage=metrics_b["leverage"],
            total_priority=metrics_b["priority"],
            path_strength=metrics_b["path_strength"],
            risk_concentration=metrics_b["risk_concentration"],
            focus_dimension=dimension,  # type: ignore[arg-type]
        )
        winner = resolve_dimension_winner(score_a, score_b)
        explanation = (
            f"Scenario A is cleaner on {dimension} signals."
            if winner == "A"
            else f"Scenario B is stronger on {dimension} signals."
            if winner == "B"
            else f"Both scenarios are closely matched on {dimension}."
        )
        tradeoffs.append(
            CompareTradeoff(
                dimension=dimension,  # type: ignore[arg-type]
                winner=winner,  # type: ignore[arg-type]
                confidence=resolve_tradeoff_confidence(score_a, score_b),
                explanation=explanation,
            )
        )
    return tradeoffs


def _build_advice(
    *,
    winner: str,
    focus_dimension: str,
    tradeoffs: list[CompareTradeoff],
    top_delta: CompareObjectDelta | None,
) -> list[CompareAdvice]:
    advice: list[CompareAdvice] = []
    if winner == "A":
        advice.append(
            CompareAdvice(
                advice_id="compare:choose:A",
                recommendation="choose_A",
                title="Choose Scenario A",
                explanation=f"Scenario A leads the comparison on the current {focus_dimension} focus without a critical downside signal.",
                confidence=clamp01(0.72 + (tradeoffs[0].confidence if tradeoffs else 0.0) * 0.18),
            )
        )
    elif winner == "B":
        advice.append(
            CompareAdvice(
                advice_id="compare:choose:B",
                recommendation="choose_B",
                title="Choose Scenario B",
                explanation=f"Scenario B produces the stronger overall outcome on the current {focus_dimension} focus.",
                confidence=clamp01(0.72 + (tradeoffs[0].confidence if tradeoffs else 0.0) * 0.18),
            )
        )
    else:
        has_split = len({item.winner for item in tradeoffs if item.winner in {"A", "B"}}) > 1
        advice.append(
            CompareAdvice(
                advice_id="compare:tradeoff",
                recommendation="hybrid" if has_split else "investigate_more",
                title="Treat this as a tradeoff decision",
                explanation=(
                    "The compared strategies split their advantage across dimensions; preserve the better side of each before committing."
                    if has_split
                    else "The compared strategies are close enough that a deeper scenario run is more responsible than a forced pick."
                ),
                confidence=0.62 if has_split else 0.54,
            )
        )
    if top_delta and abs(top_delta.delta) >= 0.08:
        advice.append(
            CompareAdvice(
                advice_id=f"compare:investigate:{top_delta.object_id}",
                recommendation="investigate_more",
                title=f"Inspect {_label_for_id(top_delta.object_id)} before committing",
                explanation=top_delta.rationale,
                confidence=clamp01(0.5 + abs(top_delta.delta) * 0.4),
            )
        )
    return advice


def run_compare(input_data: CompareInput) -> CompareResult:
    intelligence_a = input_data.scenarioA.intelligence.model_dump(mode="python")
    intelligence_b = input_data.scenarioB.intelligence.model_dump(mode="python")
    focus_dimension = input_data.focusDimension
    compare_policy_inputs = get_current_policy_inputs().get("compare", {})
    scenario_label_a = _scenario_label(input_data.scenarioA.scenario, "Scenario A")
    scenario_label_b = _scenario_label(input_data.scenarioB.scenario, "Scenario B")

    object_map_a = _build_object_delta_map(intelligence_a, focus_dimension)
    object_map_b = _build_object_delta_map(intelligence_b, focus_dimension)
    object_ids = sorted(set(object_map_a.keys()) | set(object_map_b.keys()))
    object_deltas: list[CompareObjectDelta] = []
    for object_id in object_ids:
        left = object_map_a.get(object_id, {"impact": 0.0, "pressure": 0.0, "fragility": 0.0, "leverage": 0.0})
        right = object_map_b.get(object_id, {"impact": 0.0, "pressure": 0.0, "fragility": 0.0, "leverage": 0.0})
        delta = clamp_signed(right["impact"] - left["impact"])
        interpretation = classify_object_interpretation(delta)
        object_deltas.append(
            CompareObjectDelta(
                object_id=object_id,
                impactA=left["impact"],
                impactB=right["impact"],
                delta=delta,
                interpretation=interpretation,  # type: ignore[arg-type]
                rationale=(
                    f"{scenario_label_b} improves {_label_for_id(object_id)} relative to {scenario_label_a}."
                    if interpretation == "improved"
                    else f"{scenario_label_b} weakens {_label_for_id(object_id)} relative to {scenario_label_a}."
                    if interpretation == "worse"
                    else f"{_label_for_id(object_id)} stays broadly comparable across both strategies."
                ),
            )
        )
    object_deltas.sort(key=lambda item: abs(item.delta), reverse=True)

    path_map_a = _build_path_delta_map(intelligence_a, focus_dimension)
    path_map_b = _build_path_delta_map(intelligence_b, focus_dimension)
    path_ids = sorted(set(path_map_a.keys()) | set(path_map_b.keys()))
    path_deltas: list[ComparePathDelta] = []
    for path_id in path_ids:
        left = path_map_a.get(path_id, {"strength": 0.0, "role": "secondary", "source": None, "target": None})
        right = path_map_b.get(path_id, {"strength": 0.0, "role": "secondary", "source": None, "target": None})
        delta = clamp_signed(right["strength"] - left["strength"])
        role = "critical" if max(left["strength"], right["strength"]) >= 0.7 or "primary" in {left["role"], right["role"]} else "supporting" if max(left["strength"], right["strength"]) >= 0.4 else "secondary"
        source_label = _label_for_id(right.get("source") or left.get("source"))
        target_label = _label_for_id(right.get("target") or left.get("target"))
        path_deltas.append(
            ComparePathDelta(
                path_id=path_id,
                strengthA=left["strength"],
                strengthB=right["strength"],
                delta=delta,
                interpretation=classify_path_interpretation(delta),  # type: ignore[arg-type]
                strategicRole=role,  # type: ignore[arg-type]
                rationale=(
                    f"{scenario_label_b} strengthens the {source_label} to {target_label} route."
                    if delta > 0.05
                    else f"{scenario_label_b} softens the {source_label} to {target_label} route."
                    if delta < -0.05
                    else f"The {source_label} to {target_label} route remains comparable across both scenarios."
                ),
            )
        )
    path_deltas.sort(key=lambda item: abs(item.delta), reverse=True)

    metrics_a = _system_metrics(intelligence_a)
    metrics_b = _system_metrics(intelligence_b)
    tradeoffs = _build_tradeoffs(metrics_a=metrics_a, metrics_b=metrics_b)
    weights = dimension_weights(focus_dimension)
    aggregate_a = sum(
        compute_dimension_score(
            total_pressure=metrics_a["pressure"],
            total_fragility=metrics_a["fragility"],
            total_leverage=metrics_a["leverage"],
            total_priority=metrics_a["priority"],
            path_strength=metrics_a["path_strength"],
            risk_concentration=metrics_a["risk_concentration"],
            focus_dimension=dimension,  # type: ignore[arg-type]
        )
        * weights[dimension]
        for dimension in ("risk", "efficiency", "stability", "growth")
    )
    aggregate_b = sum(
        compute_dimension_score(
            total_pressure=metrics_b["pressure"],
            total_fragility=metrics_b["fragility"],
            total_leverage=metrics_b["leverage"],
            total_priority=metrics_b["priority"],
            path_strength=metrics_b["path_strength"],
            risk_concentration=metrics_b["risk_concentration"],
            focus_dimension=dimension,  # type: ignore[arg-type]
        )
        * weights[dimension]
        for dimension in ("risk", "efficiency", "stability", "growth")
    )
    score_margin = aggregate_a - aggregate_b
    dominance = resolve_dominance([item.winner for item in tradeoffs], score_margin=score_margin)
    summary_winner = "A" if dominance == "A" else "B" if dominance == "B" else "tie"
    leading_tradeoffs = [
        f"{item.dimension.title()}: {scenario_label_a if item.winner == 'A' else scenario_label_b if item.winner == 'B' else 'Tie'}"
        for item in tradeoffs
    ]
    reasoning = (
        f"{scenario_label_a} dominates the current comparison with stronger overall tradeoff balance."
        if summary_winner == "A"
        else f"{scenario_label_b} dominates the current comparison with stronger overall tradeoff balance."
        if summary_winner == "B"
        else f"{scenario_label_a} and {scenario_label_b} split the decision across different strengths."
    )
    summary = CompareSummary(
        headline=(
            f"{scenario_label_a} is the stronger choice for {focus_dimension}."
            if summary_winner == "A"
            else f"{scenario_label_b} is the stronger choice for {focus_dimension}."
            if summary_winner == "B"
            else f"{scenario_label_a} vs {scenario_label_b} is a live strategic tradeoff."
        ),
        winner=summary_winner,  # type: ignore[arg-type]
        confidence=clamp01(0.5 + abs(score_margin) * 0.7 + float(compare_policy_inputs.get("confidence_bias", 0.0))),
        reasoning=reasoning,
        keyTradeoffs=leading_tradeoffs,
    )
    advice = _build_advice(
        winner=summary_winner,
        focus_dimension=focus_dimension,
        tradeoffs=tradeoffs,
        top_delta=object_deltas[0] if object_deltas else None,
    )

    return CompareResult(
        object_deltas=object_deltas,
        path_deltas=path_deltas,
        tradeoffs=tradeoffs,
        summary=summary,
        advice=advice,
        meta={
            "comparison_mode": focus_dimension,
            "timestamp": time(),
            "engine_version": "compare_mode_v1",
            "source": "system_intelligence_compare",
        },
    )
