"""Deterministic human signal extractor."""
from __future__ import annotations

import re
from typing import List

from app.models.signals import HumanSignal, HumanSignalMeta, HumanSignalReport
from app.utils.clamp import clamp01, ensure_finite


def _count_matches(text: str, term: str) -> int:
    if not term:
        return 0
    return len(re.findall(re.escape(term), text, flags=re.IGNORECASE))


def _length_score(length: int) -> float:
    if length <= 40:
        return 0.3
    if length <= 120:
        return 0.6
    return 0.9


def extract_signals(text: str) -> HumanSignalReport:
    if text is None:
        raise ValueError("text is required")
    if len(text) > 4000:
        raise ValueError("text exceeds maximum length")
    normalized = text or ""
    length = len(normalized)
    exclamation_count = normalized.count("!")
    question_count = normalized.count("?")

    signals: List[HumanSignal] = []

    keyword_matches = {
        "urgent": ["urgent", "asap", "immediately"],
        "risk": ["risk", "danger", "unsafe"],
        "delay": ["delay", "late", "lagging"],
        "overload": ["overload", "too much", "burnout"],
    }
    phrase_matches = {
        "not_sure": ["not sure", "uncertain", "don't know"],
        "need_help": ["need help", "need support", "can't handle"],
        "under_pressure": ["under pressure", "too much pressure"],
    }

    for signal_id, keywords in keyword_matches.items():
        count = sum(_count_matches(normalized, kw) for kw in keywords)
        if count > 0:
            score = clamp01(ensure_finite(count / 3.0, 0.0))
            signals.append(HumanSignal(type="keyword", value=signal_id, score=score))

    for signal_id, phrases in phrase_matches.items():
        count = sum(_count_matches(normalized, phrase) for phrase in phrases)
        if count > 0:
            score = clamp01(ensure_finite(count / 2.0, 0.0))
            signals.append(HumanSignal(type="phrase", value=signal_id, score=score))

    signals.append(
        HumanSignal(
            type="meta",
            value="exclamation_count",
            score=clamp01(ensure_finite(exclamation_count / 5.0, 0.0)),
        )
    )
    signals.append(
        HumanSignal(
            type="meta",
            value="question_count",
            score=clamp01(ensure_finite(question_count / 5.0, 0.0)),
        )
    )
    signals.append(
        HumanSignal(
            type="meta",
            value="length_bucket",
            score=_length_score(length),
        )
    )

    return HumanSignalReport(
        text=normalized,
        signals=signals,
        meta=HumanSignalMeta(
            length=length,
            exclamation_count=exclamation_count,
            question_count=question_count,
        ),
    )
