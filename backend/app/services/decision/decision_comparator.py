"""Deterministic comparison helpers for Decision Engine Lite."""

from __future__ import annotations

from app.models.decision_output import DecisionComparison, DecisionOption


def compare_options(options: list[DecisionOption]) -> DecisionComparison:
    """Compare decision options and identify the best one."""
    ranked = sorted(options, key=lambda option: (option.score, option.confidence, option.id), reverse=True)
    best_option = ranked[0]

    if len(ranked) == 1:
        summary = f"{best_option.label} is the only available option and currently offers the clearest path with {best_option.impact_level} projected impact."
        return DecisionComparison(options=ranked, best_option_id=best_option.id, comparison_summary=summary)

    second_option = ranked[1]
    summary = (
        f"{best_option.label} ranks above {second_option.label} because it keeps projected impact at "
        f"{best_option.impact_level} versus {second_option.impact_level} and limits downstream spread more effectively."
    )
    return DecisionComparison(options=ranked, best_option_id=best_option.id, comparison_summary=summary)
