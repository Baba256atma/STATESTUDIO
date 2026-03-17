"""Rule-based fragility signal extraction for the Nexora Scanner MVP."""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class _SignalRule:
    """Static extraction rule for one fragility signal."""

    signal_id: str
    label: str
    dimension: str
    terms: tuple[str, ...]
    base_score: float


_COMMON_RULES: tuple[_SignalRule, ...] = (
    _SignalRule(
        signal_id="sig_delay_risk",
        label="Delay Risk",
        dimension="delivery",
        terms=("delay", "delays", "late delivery", "slow delivery", "lead time", "backlog"),
        base_score=0.62,
    ),
    _SignalRule(
        signal_id="sig_inventory_shortage",
        label="Inventory Shortage",
        dimension="inventory",
        terms=("inventory shortage", "stockout", "stock out", "low inventory", "inventory gap", "shortage"),
        base_score=0.72,
    ),
    _SignalRule(
        signal_id="sig_supplier_dependency",
        label="Supplier Dependency",
        dimension="dependency",
        terms=("single supplier", "supplier dependency", "vendor dependency", "sole source", "supplier reliance"),
        base_score=0.74,
    ),
    _SignalRule(
        signal_id="sig_volatility",
        label="Volatility",
        dimension="volatility",
        terms=("volatility", "volatile", "instability", "sudden swings", "rapid change", "uncertainty"),
        base_score=0.66,
    ),
    _SignalRule(
        signal_id="sig_quality_instability",
        label="Quality Instability",
        dimension="operational",
        terms=("quality issue", "quality instability", "defect", "defects", "rework", "inconsistent quality"),
        base_score=0.64,
    ),
    _SignalRule(
        signal_id="sig_bottleneck",
        label="Bottleneck",
        dimension="operational",
        terms=("bottleneck", "constraint", "capacity limit", "throughput issue", "blocked flow"),
        base_score=0.68,
    ),
    _SignalRule(
        signal_id="sig_concentration_risk",
        label="Concentration Risk",
        dimension="dependency",
        terms=("concentration risk", "overconcentration", "too few suppliers", "single region", "single point of failure"),
        base_score=0.76,
    ),
    _SignalRule(
        signal_id="sig_single_point_of_failure",
        label="Single Point of Failure",
        dimension="dependency",
        terms=("single point of failure", "single point failure", "no redundancy", "single route", "single dependency"),
        base_score=0.8,
    ),
    _SignalRule(
        signal_id="sig_recovery_weakness",
        label="Recovery Weakness",
        dimension="resilience",
        terms=("slow recovery", "poor recovery", "cannot recover", "weak recovery", "fragile recovery", "no backup"),
        base_score=0.7,
    ),
)

_MODE_RULES: dict[str, tuple[_SignalRule, ...]] = {
    "business": (),
    "operations": (
        _SignalRule(
            signal_id="sig_operational_bottleneck",
            label="Operational Bottleneck",
            dimension="operational",
            terms=("queue", "line stoppage", "handoff delay"),
            base_score=0.63,
        ),
    ),
    "supply_chain": (
        _SignalRule(
            signal_id="sig_supply_concentration",
            label="Supply Concentration",
            dimension="dependency",
            terms=("supplier concentration", "port dependency", "single route"),
            base_score=0.75,
        ),
    ),
}

_ESCALATION_TERMS: tuple[str, ...] = (
    "critical",
    "severe",
    "major",
    "repeated",
    "persistent",
    "worsening",
    "escalating",
)


def extract_fragility_signals(text: str, mode: str = "business") -> list[dict]:
    """Extract explainable fragility signals from plain text using keyword rules."""
    normalized_text = _normalize(text)
    if not normalized_text:
        return []

    rules = [*_COMMON_RULES, *_MODE_RULES.get(_normalize(mode), ())]
    signals: list[dict] = []

    for rule in rules:
        matches = _matched_terms(normalized_text, rule.terms)
        if not matches:
            continue
        score = _score_for_matches(normalized_text, rule.base_score, len(matches))
        signals.append(
            {
                "id": rule.signal_id,
                "label": rule.label,
                "score": score,
                "severity": _severity_for_score(score),
                "matched_terms": matches,
                "evidence_text": _evidence_text(text, matches),
                "dimension": rule.dimension,
            }
        )

    return sorted(signals, key=lambda item: (item["score"], item["label"]), reverse=True)


def _normalize(value: str | None) -> str:
    """Return lowercase normalized text with collapsed whitespace."""
    if value is None:
        return ""
    return re.sub(r"\s+", " ", value.strip().lower())


def _matched_terms(text: str, terms: tuple[str, ...]) -> list[str]:
    """Return ordered unique terms matched in the source text."""
    matched: list[str] = []
    for term in terms:
        if re.search(rf"\b{re.escape(term)}\b", text) and term not in matched:
            matched.append(term)
    return matched


def _score_for_matches(text: str, base_score: float, match_count: int) -> float:
    """Compute a bounded severity score from match density and escalation terms."""
    score = base_score + min(match_count - 1, 3) * 0.08
    escalation_count = sum(1 for term in _ESCALATION_TERMS if re.search(rf"\b{re.escape(term)}\b", text))
    score += min(escalation_count, 2) * 0.05
    return round(max(0.0, min(1.0, score)), 4)


def _severity_for_score(score: float) -> str:
    """Map a normalized score to a frontend-friendly severity label."""
    if score >= 0.85:
        return "critical"
    if score >= 0.7:
        return "high"
    if score >= 0.45:
        return "medium"
    return "low"


def _evidence_text(original_text: str, matched_terms: list[str]) -> str:
    """Build a compact evidence snippet that explains why a rule matched."""
    normalized_original = re.sub(r"\s+", " ", original_text.strip())
    if not normalized_original:
        return ""
    lower_original = normalized_original.lower()
    for term in matched_terms:
        position = lower_original.find(term)
        if position == -1:
            continue
        start = max(position - 50, 0)
        end = min(position + len(term) + 70, len(normalized_original))
        snippet = normalized_original[start:end].strip(" ,.;")
        return snippet
    return normalized_original[:140].strip()
