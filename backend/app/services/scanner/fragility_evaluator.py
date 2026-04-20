"""Deterministic fragility evaluation based on canonical signals and object impacts."""

from __future__ import annotations

from typing import Any

from ingestion.schemas import SignalBundle
from mapping.schemas import ObjectImpactSet


_CATEGORY_CONFIG: dict[str, dict[str, Any]] = {
    "delay_pressure": {"types": {"delay"}, "weight": 1.0, "label": "Delay Pressure"},
    # Legacy aliases ("cost") plus Phase B.1 canonical `cost_pressure`.
    "cost_pressure": {"types": {"cost", "cost_pressure"}, "weight": 0.88, "label": "Cost Pressure"},
    "supply_fragility": {
        "types": {
            "supply",
            "risk",
            "supplier_impact",
            "shortage",
            "operational_instability",
            "customer_impact",
        },
        "weight": 0.95,
        "label": "Supply Fragility",
    },
    "demand_instability": {"types": {"demand", "demand_shift"}, "weight": 0.82, "label": "Demand Instability"},
    "financial_pressure": {"types": {"finance"}, "weight": 0.8, "label": "Financial Pressure"},
    "regulatory_pressure": {"types": {"regulation"}, "weight": 0.78, "label": "Regulatory Pressure"},
}


def evaluate_fragility(
    signal_bundle: SignalBundle,
    object_impacts: ObjectImpactSet,
) -> dict[str, Any]:
    """Return deterministic fragility scoring, level, and category diagnostics."""
    if not signal_bundle.signals:
        return {
            "fragility_score": 0.0,
            "fragility_level": "low",
            "category_scores": {},
            "dominant_categories": [],
            "confidence": 0.18,
            "score_reasons": ["No canonical signals were supplied to the scanner."],
        }

    category_scores: dict[str, float] = {}
    category_reasons: dict[str, list[str]] = {}

    for category_id, config in _CATEGORY_CONFIG.items():
        matched = [signal for signal in signal_bundle.signals if signal.type in config["types"]]
        if not matched:
            continue
        avg_strength = sum(signal.strength for signal in matched) / len(matched)
        weighted_score = min(1.0, avg_strength * float(config["weight"]))
        category_scores[category_id] = round(weighted_score, 4)
        category_reasons[category_id] = [
            f"{config['label']} is elevated by {signal.type} signal '{signal.description}'"
            for signal in matched[:2]
        ]

    source_text = " ".join(str(signal_bundle.source.raw_content or "").strip().lower().split())

    if not category_scores:
        base_score = min(1.0, sum(signal.strength for signal in signal_bundle.signals) / len(signal_bundle.signals) * 0.55)
    else:
        base_score = sum(category_scores.values()) / len(category_scores)

    multi_pressure_boost = 0.08 if len(category_scores) >= 3 else 0.04 if len(category_scores) == 2 else 0.0
    primary_concentration_boost = min(0.12, 0.05 * len(object_impacts.primary))
    affected_presence_boost = min(0.08, 0.025 * len(object_impacts.affected))
    sparse_signal_penalty = -0.08 if len(signal_bundle.signals) == 1 and signal_bundle.signals[0].strength < 0.45 else 0.0
    stability_discount = _stability_discount(source_text)

    fragility_score = max(
        0.0,
        min(
            1.0,
            base_score
            + multi_pressure_boost
            + primary_concentration_boost
            + affected_presence_boost
            + sparse_signal_penalty
            - stability_discount,
        ),
    )
    confidence = max(0.2, min(0.95, 0.45 + 0.08 * len(signal_bundle.signals) + 0.05 * len(object_impacts.primary)))

    dominant_categories = [
        category_id
        for category_id, _score in sorted(category_scores.items(), key=lambda item: (item[1], item[0]), reverse=True)[:3]
    ]

    score_reasons = []
    if dominant_categories:
        score_reasons.append(f"Dominant pressure categories: {', '.join(dominant_categories)}.")
    if multi_pressure_boost > 0:
        score_reasons.append("Multiple pressure categories are co-occurring, which amplifies fragility.")
    if primary_concentration_boost > 0:
        score_reasons.append("Primary object concentration is reinforcing the overall fragility score.")
    if sparse_signal_penalty < 0:
        score_reasons.append("Signal coverage is sparse and weak, which keeps fragility pressure limited.")
    if stability_discount > 0:
        score_reasons.append("The source explicitly describes stable or undisrupted conditions, which lowers fragility pressure.")

    return {
        "fragility_score": round(fragility_score, 4),
        "fragility_level": _map_score_to_level(fragility_score),
        "category_scores": category_scores,
        "category_reasons": category_reasons,
        "dominant_categories": dominant_categories,
        "confidence": round(confidence, 4),
        "score_reasons": score_reasons,
    }


def _map_score_to_level(score: float) -> str:
    if score >= 0.78:
        return "critical"
    if score >= 0.56:
        return "high"
    if score >= 0.28:
        return "moderate"
    return "low"


def _stability_discount(text: str) -> float:
    if not text:
        return 0.0

    stable_patterns = (
        "system is stable",
        "stable operations",
        "no major disruption",
        "no disruption",
        "no significant disruption",
        "no major issue",
        "operating normally",
        "limited pressure",
    )
    discount = 0.0
    for pattern in stable_patterns:
        if pattern in text:
            discount = max(discount, 0.48 if "stable" in pattern or "no major disruption" in pattern else 0.32)
    return discount
