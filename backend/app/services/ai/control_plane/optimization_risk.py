"""Risk assessment for policy optimization proposals."""

from __future__ import annotations

from app.schemas.policy_optimization import (
    OptimizationRiskAssessment,
    PolicyOptimizationProposal,
)


class OptimizationRiskEngine:
    """Classify optimization proposal risk deterministically."""

    def assess(self, proposal: PolicyOptimizationProposal) -> OptimizationRiskAssessment:
        """Return optimization risk classification."""
        payload = proposal.proposed_policy_patch.model_dump(exclude_none=True)
        privacy = payload.get("privacy", {})
        routing = payload.get("routing", {})
        provider = payload.get("provider", {})

        if "restricted" not in privacy.get("cloud_blocked_sensitivity_levels", ["restricted"]):
            return OptimizationRiskAssessment(
                risk_level="forbidden",
                approval_required=True,
                auto_apply_eligible=False,
                policy_change_risk_level="critical",
                decision_reason="Optimization cannot relax restricted cloud privacy protections.",
            )
        if "restricted" not in privacy.get("local_required_sensitivity_levels", ["restricted"]):
            return OptimizationRiskAssessment(
                risk_level="forbidden",
                approval_required=True,
                auto_apply_eligible=False,
                policy_change_risk_level="critical",
                decision_reason="Optimization cannot remove restricted local execution requirements.",
            )
        if provider.get("cloud_provider_enabled") is True:
            return OptimizationRiskAssessment(
                risk_level="forbidden",
                approval_required=True,
                auto_apply_eligible=False,
                policy_change_risk_level="critical",
                decision_reason="Optimization cannot autonomously enable cloud providers.",
            )
        if routing.get("cloud_fallback_enabled") is True or routing.get("cloud_for_reasoning_enabled") is True:
            return OptimizationRiskAssessment(
                risk_level="high",
                approval_required=True,
                auto_apply_eligible=False,
                policy_change_risk_level="high",
                decision_reason="Optimization that increases cloud routing requires explicit approval.",
            )
        if proposal.optimization_type in {"promote_canary_winner", "promote_experiment_winner"}:
            return OptimizationRiskAssessment(
                risk_level="medium",
                approval_required=True,
                auto_apply_eligible=False,
                policy_change_risk_level="medium",
                decision_reason="Promoting a validated winner still requires explicit approval.",
            )
        return OptimizationRiskAssessment(
            risk_level="low",
            approval_required=False,
            auto_apply_eligible=True,
            policy_change_risk_level="low",
            decision_reason="The proposal tightens or tunes existing policy behavior without relaxing safety controls.",
        )
