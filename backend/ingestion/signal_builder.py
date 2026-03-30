"""Deterministic signal builder for Nexora ingestion."""

from __future__ import annotations

import re
from typing import Iterable

from ingestion.schemas import Signal


_SIGNAL_RULES: dict[str, dict[str, object]] = {
    "risk": {
        "keywords": ("risk", "fragile", "instability", "failure", "shortage"),
        "base_strength": 0.55,
    },
    "delay": {
        "keywords": ("delay", "late", "shipping", "backlog", "disruption"),
        "base_strength": 0.62,
    },
    "demand": {
        "keywords": ("demand", "orders", "sales", "slowdown", "customer"),
        "base_strength": 0.52,
    },
    "cost": {
        "keywords": ("cost", "expense", "price", "inflation", "margin"),
        "base_strength": 0.58,
    },
    "supply": {
        "keywords": ("supplier", "supply", "inventory", "stock", "procurement"),
        "base_strength": 0.57,
    },
    "finance": {
        "keywords": ("cash", "liquidity", "debt", "interest", "finance"),
        "base_strength": 0.56,
    },
    "regulation": {
        "keywords": ("regulation", "policy", "tariff", "compliance", "law"),
        "base_strength": 0.6,
    },
}

_ENTITY_KEYWORDS = {
    "inventory",
    "supplier",
    "delivery",
    "customer",
    "cash",
    "cost",
    "demand",
    "market",
    "regulation",
    "policy",
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

    for token in _WORD_RE.findall(text.lower()):
        if token not in _ENTITY_KEYWORDS or token in seen:
            continue
        seen.add(token)
        entities.append(token)

    return entities[:6]


def _match_keywords(text: str, keywords: Iterable[str]) -> list[str]:
    matched: list[str] = []
    for keyword in keywords:
        if keyword in text:
            matched.append(keyword)
    return matched


def build_signals(raw_text: str, source_id: str) -> list[Signal]:
    """Build deterministic canonical signals from extracted text."""
    normalized_text = raw_text.strip()
    if not normalized_text:
        return []

    lowered_text = normalized_text.lower()
    entities = _collect_entities(normalized_text)
    signals: list[Signal] = []

    for signal_type, rule in _SIGNAL_RULES.items():
        keywords = tuple(str(keyword) for keyword in rule["keywords"])
        matches = _match_keywords(lowered_text, keywords)
        if not matches:
            continue
        base_strength = float(rule["base_strength"])
        match_bonus = min(0.25, 0.08 * len(matches))
        description = f"Detected {signal_type} pressure from: {', '.join(matches)}."
        signals.append(
            Signal(
                type=signal_type,
                description=description,
                entities=entities,
                strength=min(1.0, base_strength + match_bonus),
                source_id=source_id,
            )
        )

    if signals:
        return signals

    fallback_words = _WORD_RE.findall(lowered_text)[:6]
    fallback_description = (
        f"General operational pressure detected from text: {', '.join(fallback_words)}."
        if fallback_words
        else "General operational pressure detected from text."
    )
    return [
        Signal(
            type="risk",
            description=fallback_description,
            entities=entities,
            strength=0.35,
            source_id=source_id,
        )
    ]

