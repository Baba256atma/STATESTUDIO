"""Explainable learning pass for Nexora evolution."""

from __future__ import annotations

from collections import Counter, defaultdict
from time import time
from typing import Any

from engines.evolution.evolution_policy import clamp01, clamp_delta, recency_weight
from engines.evolution.learning_models import EvolutionState, EvolutionSummary, LearningSignal, PolicyAdjustment


def _derive_strategy_kind(record: dict[str, Any]) -> str:
    actions = record.get("actions", []) or []
    if actions:
        return str(actions[0].get("action_kind", "unknown"))
    strategy_id = str(record.get("strategy_id", "unknown"))
    return strategy_id.split(":")[1] if ":" in strategy_id else strategy_id


def run_learning_pass(records: dict[str, list[dict[str, Any]]]) -> EvolutionState:
    now = time()
    signals: list[LearningSignal] = []
    adjustments: list[PolicyAdjustment] = []

    strategy_records = records.get("strategy_records", []) or []
    comparison_records = records.get("comparison_records", []) or []
    scenario_records = records.get("scenario_records", []) or []

    strategy_success: dict[str, list[float]] = defaultdict(list)
    for record in strategy_records:
        kind = _derive_strategy_kind(record)
        chosen = bool(record.get("chosen"))
        if not chosen:
            continue
        age = max(0.0, now - float(record.get("timestamp", now)))
        base = recency_weight(age)
        outcome_status = str(record.get("outcome_status", "unknown"))
        delta = base if outcome_status == "positive" else -base if outcome_status == "negative" else 0.0
        if delta == 0.0:
            continue
        strategy_success[kind].append(delta)

    for kind, values in strategy_success.items():
        evidence = len(values)
        avg = sum(values) / evidence
        confidence = clamp01(0.32 + evidence * 0.14)
        signal_type = "policy_boost" if avg > 0 else "policy_penalty"
        rationale = (
            f"{kind} strategies show better recent outcomes and deserve a small ranking boost."
            if avg > 0
            else f"{kind} strategies underperform in recent runs and should be ranked more cautiously."
        )
        signals.append(
            LearningSignal(
                signal_id=f"signal:strategy_kind:{kind}",
                signal_type=signal_type,  # type: ignore[arg-type]
                target_scope="strategy_kind",
                target_key=kind,
                value=clamp_delta(avg),
                rationale=rationale,
                confidence=confidence,
                timestamp=now,
            )
        )
        adjustments.append(
            PolicyAdjustment(
                adjustment_id=f"adjust:strategy_generation:{kind}",
                policy_name="strategy_generation",
                key=f"strategy_kind:{kind}",
                delta=clamp_delta(avg * 0.08),
                reason=rationale,
                confidence=confidence,
            )
        )

    negative_object_counts: Counter[str] = Counter()
    positive_object_counts: Counter[str] = Counter()
    for record in scenario_records:
        outcome = record.get("observed_outcome") or {}
        status = str(outcome.get("outcome_status", "unknown"))
        for object_id in record.get("source_object_ids", []) or []:
            if status == "negative":
                negative_object_counts[str(object_id)] += 1
            elif status == "positive":
                positive_object_counts[str(object_id)] += 1

        predicted = record.get("predicted_summary") or {}
        predicted_risk = predicted.get("expected_risk")
        observed_risk = outcome.get("observed_risk")
        if predicted_risk is not None and observed_risk is not None:
            risk_gap = float(observed_risk) - float(predicted_risk)
            if abs(risk_gap) >= 0.12:
                sign = -1.0 if risk_gap > 0 else 1.0
                rationale = (
                    "Recent observed outcomes were riskier than predicted, so recommendation confidence should be reduced."
                    if risk_gap > 0
                    else "Recent observed outcomes were safer than predicted, so recommendation confidence can recover slightly."
                )
                signals.append(
                    LearningSignal(
                        signal_id=f"signal:compare_confidence:{record.get('record_id')}",
                        signal_type="confidence_adjustment",
                        target_scope="global",
                        target_key="compare_confidence",
                        value=clamp_delta(sign * min(abs(risk_gap), 0.2)),
                        rationale=rationale,
                        confidence=0.58,
                        timestamp=now,
                    )
                )
                adjustments.append(
                    PolicyAdjustment(
                        adjustment_id=f"adjust:compare:confidence:{record.get('record_id')}",
                        policy_name="compare",
                        key="confidence_bias",
                        delta=clamp_delta(sign * min(abs(risk_gap) * 0.08, 0.08)),
                        reason=rationale,
                        confidence=0.58,
                    )
                )

    for object_id, negative_count in negative_object_counts.items():
        positive_count = positive_object_counts.get(object_id, 0)
        net = negative_count - positive_count
        if net <= 0:
            continue
        confidence = clamp01(0.3 + net * 0.12)
        rationale = f"{object_id} repeatedly appears in negative outcomes and should receive stronger salience during analysis."
        signals.append(
            LearningSignal(
                signal_id=f"signal:object:{object_id}",
                signal_type="focus_pattern",
                target_scope="object",
                target_key=object_id,
                value=clamp_delta(net * 0.08),
                rationale=rationale,
                confidence=confidence,
                timestamp=now,
            )
        )
        adjustments.append(
            PolicyAdjustment(
                adjustment_id=f"adjust:intelligence:{object_id}",
                policy_name="intelligence",
                key=f"object:{object_id}",
                delta=clamp_delta(net * 0.03),
                reason=rationale,
                confidence=confidence,
            )
        )

    ignored_compare_count = 0
    for record in comparison_records:
        recommendation = str(record.get("recommendation") or "")
        user_choice = str(record.get("user_choice") or "unknown")
        winner = str(record.get("winner") or "unknown")
        if recommendation.endswith("_A") and user_choice == "B" and winner == "B":
            ignored_compare_count += 1
        if recommendation.endswith("_B") and user_choice == "A" and winner == "A":
            ignored_compare_count += 1
    if ignored_compare_count > 0:
        rationale = "Recent user choices outperformed compare recommendations often enough to reduce compare confidence slightly."
        signals.append(
            LearningSignal(
                signal_id="signal:compare:ignored_winner",
                signal_type="confidence_adjustment",
                target_scope="global",
                target_key="compare_confidence",
                value=clamp_delta(-ignored_compare_count * 0.06),
                rationale=rationale,
                confidence=clamp01(0.34 + ignored_compare_count * 0.1),
                timestamp=now,
            )
        )
        adjustments.append(
            PolicyAdjustment(
                adjustment_id="adjust:compare:ignored_winner",
                policy_name="compare",
                key="confidence_bias",
                delta=clamp_delta(-ignored_compare_count * 0.03),
                reason=rationale,
                confidence=clamp01(0.34 + ignored_compare_count * 0.1),
            )
        )

    summary = EvolutionSummary(
        headline="Nexora is tracking decision memory and bounded policy learning.",
        explanation=(
            f"{len(signals)} learning signals and {len(adjustments)} bounded policy adjustments were derived from stored decision history."
            if signals or adjustments
            else "Stored memory exists, but Nexora does not yet have enough evidence to shift policy signals safely."
        ),
    )
    return EvolutionState(
        active=bool(signals or adjustments),
        learning_signals=signals,
        policy_adjustments=adjustments,
        summary=summary,
    )
