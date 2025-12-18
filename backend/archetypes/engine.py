"""Deterministic archetype detection engine using signal/metric patterns."""
from __future__ import annotations

from typing import Dict, List, Tuple
import time

from .schemas import ArchetypeDetectionResult, ArchetypeState


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def _now_ts() -> float:
    return float(time.time())


def _normalize_signal(signal: str) -> str:
    return signal.strip().lower().replace(" ", "_")


def _signal_score(signal_set: set[str], expected: List[str]) -> float:
    if not expected:
        return 0.0
    hits = sum(1 for s in expected if _normalize_signal(s) in signal_set)
    return _clamp01(hits / len(expected))


def _metric_value(metrics: Dict[str, float], keys: List[str]) -> float:
    values = []
    for key in keys:
        if key in metrics:
            try:
                values.append(float(metrics[key]))
            except (TypeError, ValueError):
                continue
    if not values:
        return 0.0
    return _clamp01(max(values))


def _history_delta(current: float, history: List[ArchetypeState] | None) -> float:
    if not history:
        return 0.0
    prev = history[-1]
    try:
        return _clamp01(current - float(prev.instability))
    except (TypeError, ValueError):
        return 0.0


def _compose_notes(parts: List[str]) -> str:
    return "; ".join(p for p in parts if p)


class ArchetypeEngine:
    """Pattern-based archetype detector using signals, metrics, and history."""

    def detect(
        self,
        signals: List[str],
        metrics: Dict[str, float],
        history: List[ArchetypeState] | None = None,
        ts: float | None = None,
    ) -> ArchetypeState:
        signal_set = {_normalize_signal(s) for s in signals}
        metrics_clean = {k: _clamp01(float(v)) for k, v in metrics.items() if v is not None}

        system_pressure = _metric_value(
            metrics_clean, ["pressure", "load", "demand", "stress", "strain"]
        )
        instability = _metric_value(metrics_clean, ["instability", "volatility", "noise"])

        delay_factor = _metric_value(metrics_clean, ["delay", "latency", "lag"])

        growth_strength = _metric_value(metrics_clean, ["growth", "demand", "adoption"])
        constraint_strength = _metric_value(metrics_clean, ["constraint", "quality_drop", "latency"])

        ltg_signal = _signal_score(signal_set, ["demand_up", "quality_down", "latency_up"])
        ltg_base = min(growth_strength, constraint_strength)
        ltg_score = _clamp01(0.55 * ltg_base + 0.25 * ltg_signal + 0.2 * delay_factor)

        relief = _metric_value(metrics_clean, ["relief", "short_term_relief", "symptom_relief"])
        degradation = _metric_value(metrics_clean, ["recurring_failure", "side_effects", "problem_level"])
        ftf_signal = _signal_score(signal_set, ["temporary_relief", "recurring_failure", "side_effects"])
        ftf_core = min(relief, degradation)
        ftf_score = _clamp01(0.6 * ftf_core + 0.3 * ftf_signal + 0.1 * delay_factor)

        escalation_signal = _signal_score(signal_set, ["arms_race", "overreaction", "conflict"])
        reaction_strength = _metric_value(metrics_clean, ["reaction", "retaliation", "competition"])
        instability_rise = _history_delta(instability, history)
        esc_score = _clamp01(0.45 * escalation_signal + 0.3 * reaction_strength + 0.25 * instability_rise)

        stb_signal = _signal_score(signal_set, ["symptomatic_reliance", "capability_decline"])
        symptomatic = _metric_value(metrics_clean, ["symptomatic_solution", "quick_fix"])
        erosion = _metric_value(metrics_clean, ["capability_erosion", "skill_decay"])
        stb_core = min(symptomatic, erosion)
        stb_score = _clamp01(0.55 * stb_core + 0.25 * stb_signal + 0.2 * delay_factor)

        raw_scores: List[Tuple[str, float, str, str]] = [
            ("obj_limits_to_growth", ltg_score, "R" if growth_strength >= constraint_strength else "B", "growth vs constraint"),
            ("obj_fixes_that_fail", ftf_score, "B" if relief >= degradation else "R", "short-term relief with long-term cost"),
            ("obj_escalation", esc_score, "R", "mutual reinforcement pressure"),
            ("obj_shifting_the_burden", stb_score, "B" if symptomatic >= erosion else "R", "symptomatic relief with capability erosion"),
        ]

        max_raw = max((score for _, score, _, _ in raw_scores), default=0.0)
        detections: List[ArchetypeDetectionResult] = []
        for archetype_id, score, dominant_loop, note in raw_scores:
            normalized = _clamp01(score / max_raw) if max_raw > 0 else 0.0
            if normalized <= 0.4:
                continue
            detections.append(
                ArchetypeDetectionResult(
                    archetype_id=archetype_id,
                    confidence=normalized,
                    dominant_loop=dominant_loop,
                    notes=_compose_notes([note]),
                )
            )

        detections.sort(key=lambda item: item.confidence, reverse=True)

        return ArchetypeState(
            detected=detections,
            system_pressure=system_pressure,
            instability=instability,
            timestamp=ts if ts is not None else _now_ts(),
        )
