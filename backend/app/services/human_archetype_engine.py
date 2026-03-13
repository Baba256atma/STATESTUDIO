"""Deterministic human archetype scoring engine."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from app.models.human_catalog import HumanCatalog
from app.models.signals import HumanArchetypeResult, HumanArchetypeState, HumanSignalReport
from app.utils.clamp import clamp01, ensure_finite


def _variance(values: List[float]) -> float:
    if not values:
        return 0.0
    mean = sum(values) / len(values)
    return sum((v - mean) ** 2 for v in values) / len(values)


def _unique_sorted(values: List[str]) -> List[str]:
    return sorted(set(values))


def _extract_signals(report: HumanSignalReport, signal_type: str) -> List[str]:
    return [s.value for s in report.signals if s.type == signal_type]


def _meta_bonus(report: HumanSignalReport) -> float:
    bonus = 0.0
    for signal in report.signals:
        if signal.type != "meta":
            continue
        if signal.value == "exclamation_count":
            bonus += signal.score * 0.1
        if signal.value == "question_count":
            bonus += signal.score * 0.1
        if signal.value == "length_bucket":
            bonus += signal.score * 0.05
    return clamp01(bonus)


def score_archetypes(
    report: HumanSignalReport,
    catalog: HumanCatalog,
    max_results: int = 5,
    min_confidence: float = 0.35,
) -> HumanArchetypeState:
    keyword_values = set(_extract_signals(report, "keyword"))
    phrase_values = set(_extract_signals(report, "phrase"))
    meta_bonus = _meta_bonus(report)

    results: List[HumanArchetypeResult] = []
    for archetype in catalog.items:
        keywords = set(archetype.signals.keywords)
        phrases = set(archetype.signals.phrases)

        matched_keywords = sorted(keyword_values.intersection(keywords))
        matched_phrases = sorted(phrase_values.intersection(phrases))

        kw_score = clamp01(ensure_finite(len(matched_keywords) / max(1, len(keywords)), 0.0))
        ph_score = clamp01(ensure_finite(len(matched_phrases) / max(1, len(phrases)), 0.0))

        confidence = clamp01(
            ensure_finite(
                archetype.weights.keyword_weight * kw_score
                + archetype.weights.phrase_weight * ph_score
                + meta_bonus,
                0.0,
            )
        )
        intensity = clamp01(ensure_finite(confidence * archetype.weights.intensity_scale, 0.0))
        evidence = _unique_sorted(matched_keywords + matched_phrases)

        if confidence >= min_confidence:
            results.append(
                HumanArchetypeResult(
                    archetype_id=archetype.id,
                    confidence=confidence,
                    intensity=intensity,
                    evidence=evidence,
                )
            )

    results.sort(key=lambda item: item.confidence, reverse=True)
    results = results[:max_results]

    intensities = [result.intensity for result in results]
    avg_intensity = sum(intensities) / max(1, len(results))
    pressure = clamp01(avg_intensity)
    instability = clamp01(ensure_finite(_variance(intensities) * 2.0, 0.0))

    return HumanArchetypeState(
        timestamp=datetime.now(timezone.utc),
        results=results,
        pressure=pressure,
        instability=instability,
    )
