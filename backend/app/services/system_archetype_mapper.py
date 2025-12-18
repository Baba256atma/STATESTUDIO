"""Deterministic mapper from system signals to system archetypes."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List

from app.models.system_archetypes import SystemArchetypeDefinition, SystemArchetypeResult, SystemArchetypeState
from app.utils.clamp import clamp01, ensure_finite


def _sum_weights(weights: Dict[str, float]) -> float:
    total = sum(ensure_finite(float(v), 0.0) for v in weights.values())
    return total if total > 0 else 1.0


def _dominant_loop(definition: SystemArchetypeDefinition, evidence: Dict[str, float]) -> str:
    balancing_signals = {"overload", "latency", "quality_drop", "resource_overload"}
    reinforcing_signals = {"demand_growth", "dependency_growth", "scope_creep", "escalation"}
    b_score = sum(value for key, value in evidence.items() if key in balancing_signals)
    r_score = sum(value for key, value in evidence.items() if key in reinforcing_signals)

    if definition.loops_template:
        r_loops = sum(1 for loop in definition.loops_template if loop.type == "R")
        b_loops = sum(1 for loop in definition.loops_template if loop.type == "B")
        if r_loops > b_loops:
            r_score += 0.05
        elif b_loops > r_loops:
            b_score += 0.05

    return "B" if b_score >= r_score else "R"


def map_system_archetypes(
    system_signals: Dict[str, float],
    archetype_defs: List[SystemArchetypeDefinition],
    history: List[SystemArchetypeState] | None = None,
    min_confidence: float = 0.4,
    top_n: int = 3,
) -> SystemArchetypeState:
    results: List[SystemArchetypeResult] = []

    for definition in archetype_defs:
        activation = definition.thresholds.activation or {}
        blocked = False
        for signal, minimum in activation.items():
            if clamp01(system_signals.get(signal, 0.0)) < minimum:
                blocked = True
                break

        weights = definition.weights
        total_weight = _sum_weights(weights)

        contrib = 0.0
        evidence: Dict[str, float] = {}
        for signal, weight in weights.items():
            value = clamp01(system_signals.get(signal, 0.0))
            weighted = ensure_finite(value * clamp01(weight), 0.0)
            contrib += weighted
            evidence[signal] = clamp01(ensure_finite(weighted / total_weight, 0.0))

        confidence = clamp01(ensure_finite(contrib / total_weight, 0.0))
        if blocked:
            confidence = clamp01(ensure_finite(confidence * 0.2, 0.0))

        if confidence < max(min_confidence, definition.thresholds.min_confidence):
            continue

        results.append(
            SystemArchetypeResult(
                archetype_id=definition.id,
                confidence=confidence,
                dominant_loop=_dominant_loop(definition, evidence),
                evidence=evidence,
                notes="weighted signal match",
            )
        )

    results.sort(key=lambda item: item.confidence, reverse=True)
    results = results[:max(1, top_n)]

    avg_confidence = sum(item.confidence for item in results) / max(1, len(results))
    pressure = clamp01(ensure_finite(avg_confidence, 0.0))

    if history:
        prev = history[-1]
        instability = clamp01(ensure_finite(abs(pressure - prev.pressure), 0.0))
    else:
        variance = (
            sum((item.confidence - avg_confidence) ** 2 for item in results) / max(1, len(results))
        )
        instability = clamp01(ensure_finite(variance * 3.0, 0.0))

    return SystemArchetypeState(
        timestamp=datetime.now(timezone.utc),
        results=results,
        pressure=pressure,
        instability=instability,
    )
