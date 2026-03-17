"""Object suggestion helpers for the Nexora Fragility Scanner MVP."""

from __future__ import annotations


_DIMENSION_OBJECT_MAP: dict[str, tuple[str, ...]] = {
    "inventory": ("obj_inventory", "obj_buffer"),
    "delivery": ("obj_delivery", "obj_bottleneck"),
    "dependency": ("obj_supplier", "obj_risk_zone"),
    "volatility": ("obj_risk_zone", "obj_buffer"),
    "operational": ("obj_bottleneck", "obj_delivery"),
    "resilience": ("obj_buffer", "obj_risk_zone"),
}

_SIGNAL_OBJECT_HINTS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("supplier", ("obj_supplier", "obj_risk_zone")),
    ("inventory", ("obj_inventory", "obj_buffer")),
    ("delay", ("obj_delivery", "obj_bottleneck")),
    ("bottleneck", ("obj_bottleneck", "obj_delivery")),
    ("recovery", ("obj_buffer", "obj_risk_zone")),
    ("volatility", ("obj_risk_zone",)),
    ("quality", ("obj_bottleneck",)),
    ("concentration", ("obj_supplier", "obj_risk_zone")),
)


def suggest_objects_from_fragility(
    signals: list[dict],
    scoring: dict,
    allowed_objects: list[str] | None = None,
) -> list[str]:
    """Return the top relevant Nexora object ids for the detected fragility pattern."""
    allowed = {item.strip() for item in allowed_objects or [] if isinstance(item, str) and item.strip()}
    object_scores: dict[str, float] = {}

    for signal in signals:
        if not isinstance(signal, dict):
            continue
        score = float(signal.get("score", 0.0) or 0.0)
        dimension = str(signal.get("dimension", "operational") or "operational").strip().lower()
        signal_id = str(signal.get("id", "") or "").lower()
        label = str(signal.get("label", "") or "").lower()

        for object_id in _DIMENSION_OBJECT_MAP.get(dimension, ()):
            _add_score(object_scores, object_id, score)

        for token, object_ids in _SIGNAL_OBJECT_HINTS:
            if token in signal_id or token in label:
                for object_id in object_ids:
                    _add_score(object_scores, object_id, score + 0.05)

    for driver in scoring.get("top_drivers", []) or []:
        if not isinstance(driver, dict):
            continue
        label = str(driver.get("label", "") or "").lower()
        weighted_score = float(driver.get("weighted_score", driver.get("score", 0.0)) or 0.0)
        for token, object_ids in _SIGNAL_OBJECT_HINTS:
            if token in label:
                for object_id in object_ids:
                    _add_score(object_scores, object_id, weighted_score)

    ranked = sorted(object_scores.items(), key=lambda item: (item[1], item[0]), reverse=True)
    suggestions = [object_id for object_id, _ in ranked if not allowed or object_id in allowed]
    return suggestions[:5]


def _add_score(scores: dict[str, float], object_id: str, value: float) -> None:
    """Accumulate a bounded relevance score for one object id."""
    scores[object_id] = scores.get(object_id, 0.0) + max(value, 0.0)
