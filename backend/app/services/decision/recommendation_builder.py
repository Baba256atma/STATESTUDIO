"""Recommendation builder for Decision Engine Lite."""

from __future__ import annotations

from app.models.decision_output import DecisionComparison, DecisionRecommendation
from app.models.scenario_output import ScenarioSimulationResult


def build_recommendation(
    *,
    comparison: DecisionComparison,
    scenarios_by_option_id: dict[str, ScenarioSimulationResult],
) -> DecisionRecommendation:
    """Build a transparent recommendation from the winning option."""
    best_option = next(option for option in comparison.options if option.id == comparison.best_option_id)
    scenario = scenarios_by_option_id[best_option.id]
    key_actions = list(scenario.advice_slice.recommendations[:3]) or best_option.pros[:2]
    reason = best_option.pros[0] if best_option.pros else f"{best_option.label} offers the strongest balance of lower spread and lower projected impact."
    expected_outcome = scenario.scenario_summary
    return DecisionRecommendation(
        recommended_option_id=best_option.id,
        reason=reason,
        expected_outcome=expected_outcome,
        risk_level=best_option.impact_level,
        key_actions=key_actions,
    )
