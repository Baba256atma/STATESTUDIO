"""Deterministic signal builder for Nexora ingestion (rule-based, stable ids)."""

from __future__ import annotations

import hashlib
import re
from typing import Iterable

from ingestion.schemas import Signal


def _stable_signal_id(source_id: str, signal_type: str, matched_keywords: tuple[str, ...]) -> str:
    key = "|".join([source_id, signal_type, ",".join(sorted(matched_keywords))])
    digest = hashlib.sha256(key.encode("utf-8")).hexdigest()[:16]
    return f"sig_{digest}"


_SIGNAL_RULES: tuple[dict[str, object], ...] = (
    {
        "type": "risk",
        "label": "Operational risk",
        "keywords": ("risk", "fragile", "fragility", "instability", "failure", "exposure", "threat", "volatile"),
        "base_strength": 0.56,
    },
    {
        "type": "delay",
        "label": "Schedule / delivery delay",
        "keywords": ("delay", "late", "latency", "backlog", "behind schedule", "missed deadline"),
        "base_strength": 0.62,
    },
    {
        "type": "shortage",
        "label": "Shortage / stock pressure",
        "keywords": ("shortage", "stockout", "out of stock", "depleted", "understock", "empty shelf"),
        "base_strength": 0.6,
    },
    {
        "type": "cost_pressure",
        "label": "Cost / margin pressure",
        "keywords": ("cost", "expense", "price", "margin", "inflation", "budget overrun", "overrun"),
        "base_strength": 0.58,
    },
    {
        "type": "customer_impact",
        "label": "Customer impact",
        "keywords": ("customer", "client", "sla", "complaint", "churn", "satisfaction", "trust"),
        "base_strength": 0.57,
    },
    {
        "type": "supplier_impact",
        "label": "Supplier / vendor stress",
        "keywords": ("supplier", "vendor", "procurement", "sourcing", "supply chain partner"),
        "base_strength": 0.59,
    },
    {
        "type": "operational_instability",
        "label": "Operational instability",
        "keywords": ("overload", "overloaded", "bottleneck", "unstable", "breakdown", "outage", "incident"),
        "base_strength": 0.55,
    },
    {
        "type": "demand_shift",
        "label": "Demand shift",
        "keywords": (
            "demand",
            "orders",
            "spike",
            "surge",
            "slowdown",
            "decrease",
            "increase",
            "forecast",
        ),
        "base_strength": 0.54,
    },
)

_ENTITY_KEYWORDS = {
    "inventory",
    "supplier",
    "delivery",
    "customer",
    "cash",
    "cost",
    "demand",
    "market",
    "warehouse",
    "order",
    "sku",
    "lead time",
    "leadtime",
}

_UPPER_TOKEN_RE = re.compile(r"\b[A-Z][a-zA-Z]{2,}\b")
_WORD_RE = re.compile(r"[a-zA-Z][a-zA-Z_-]+")


def _collect_entities(text: str) -> list[str]:
    entities: list[str] = []
    seen: set[str] = set()

    for token in _UPPER_TOKEN_RE.findall(text):
        key = token.lower()
        if key in seen:
            continue
        seen.add(key)
        entities.append(token)

    lowered = text.lower()
    for token in _WORD_RE.findall(lowered):
        if token not in _ENTITY_KEYWORDS or token in seen:
            continue
        seen.add(token)
        entities.append(token)

    return entities[:8]


def _match_keywords(text: str, keywords: Iterable[str]) -> list[str]:
    matched: list[str] = []
    for keyword in keywords:
        kw = keyword.lower()
        if kw in text:
            matched.append(keyword)
    return matched


def build_signals(raw_text: str, source_id: str) -> list[Signal]:
    """Build deterministic canonical signals from extracted text (no LLM)."""
    normalized_text = raw_text.strip()
    if not normalized_text:
        return []

    lowered_text = normalized_text.lower()
    entities = _collect_entities(normalized_text)
    signals: list[Signal] = []

    for rule in _SIGNAL_RULES:
        signal_type = str(rule["type"])
        label = str(rule["label"])
        keywords = tuple(str(k) for k in rule["keywords"])
        matches = _match_keywords(lowered_text, keywords)
        if not matches:
            continue
        base_strength = float(rule["base_strength"])
        match_bonus = min(0.22, 0.07 * len(matches))
        strength = min(1.0, base_strength + match_bonus)
        description = f"Detected {signal_type.replace('_', ' ')} from keywords: {', '.join(matches)}."
        sig_id = _stable_signal_id(source_id, signal_type, tuple(sorted(m.lower() for m in matches)))
        signals.append(
            Signal(
                id=sig_id,
                type=signal_type,
                label=label,
                description=description,
                entities=entities,
                strength=strength,
                source_id=source_id,
                metadata={"matched_keywords": matches},
            )
        )

    return signals
