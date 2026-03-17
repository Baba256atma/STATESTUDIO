"""Deterministic scoring engine for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any


_DIMENSION_WEIGHTS: dict[str, float] = {
    "dependency": 1.0,
    "delivery": 0.95,
    "inventory": 0.85,
    "resilience": 0.95,
    "volatility": 0.7,
    "operational": 0.65,
}


def map_score_to_level(score: float) -> str:
    """Map a normalized fragility score to a stable level label."""
    bounded = _clamp01(score)
    if bounded >= 0.75:
        return "critical"
    if bounded >= 0.5:
        return "high"
    if bounded >= 0.25:
        return "medium"
    return "low"


def compute_fragility_score(signals: list[dict]) -> dict[str, Any]:
    """Compute a weighted fragility score and supporting diagnostics."""
    normalized_signals = [_normalize_signal(item) for item in signals if isinstance(item, dict)]
    if not normalized_signals:
        return {
            "fragility_score": 0.0,
            "fragility_level": "low",
            "dimension_scores": {},
            "top_drivers": [],
        }

    dimension_buckets: dict[str, list[float]] = {}
    weighted_total = 0.0
    total_weight = 0.0
    top_drivers: list[dict[str, Any]] = []

    for signal in normalized_signals:
        dimension = signal["dimension"]
        score = signal["score"]
        weight = _DIMENSION_WEIGHTS.get(dimension, 0.6)
        weighted_signal_score = score * weight

        dimension_buckets.setdefault(dimension, []).append(score)
        weighted_total += weighted_signal_score
        total_weight += weight
        top_drivers.append(
            {
                "id": signal["id"],
                "label": signal["label"],
                "dimension": dimension,
                "score": round(score, 4),
                "severity": signal["severity"],
                "weight": round(weight, 4),
                "weighted_score": round(weighted_signal_score, 4),
            }
        )

    fragility_score = _clamp01(weighted_total / total_weight if total_weight else 0.0)
    dimension_scores = {
        dimension: round(sum(values) / len(values), 4)
        for dimension, values in sorted(dimension_buckets.items())
    }
    top_drivers.sort(key=lambda item: (item["weighted_score"], item["score"], item["label"]), reverse=True)

    return {
        "fragility_score": round(fragility_score, 4),
        "fragility_level": map_score_to_level(fragility_score),
        "dimension_scores": dimension_scores,
        "top_drivers": top_drivers[:5],
    }


def _normalize_signal(signal: dict[str, Any]) -> dict[str, Any]:
    """Normalize a raw signal mapping into a scoreable structure."""
    dimension = str(signal.get("dimension") or "operational").strip().lower()
    return {
        "id": str(signal.get("id") or "unknown_signal").strip(),
        "label": str(signal.get("label") or "Unknown Signal").strip(),
        "dimension": dimension,
        "score": _clamp01(signal.get("score", 0.0)),
        "severity": str(signal.get("severity") or map_score_to_level(signal.get("score", 0.0))).strip().lower(),
    }


def _clamp01(value: Any) -> float:
    """Clamp arbitrary numeric input to the 0..1 range."""
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return 0.0
    if numeric < 0.0:
        return 0.0
    if numeric > 1.0:
        return 1.0
    return numeric
