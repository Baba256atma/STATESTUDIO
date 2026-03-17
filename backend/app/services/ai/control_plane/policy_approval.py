"""Risk-based policy approval rules."""

from __future__ import annotations

from app.schemas.policy_changes import PolicyApprovalRequirement, PolicyRiskLevel


class PolicyApprovalEngine:
    """Resolve approval requirements from policy diff risk."""

    def requirement_for(self, risk_level: PolicyRiskLevel) -> PolicyApprovalRequirement:
        """Return approval requirements for a risk level."""
        if risk_level == "low":
            return PolicyApprovalRequirement(
                approval_required=False,
                risk_level=risk_level,
                required_roles=[],
                reason="Low-risk policy changes can be auto-approved.",
            )
        if risk_level == "medium":
            return PolicyApprovalRequirement(
                approval_required=True,
                risk_level=risk_level,
                required_roles=["ai_operator"],
                reason="Medium-risk policy changes require explicit operator approval.",
            )
        return PolicyApprovalRequirement(
            approval_required=True,
            risk_level=risk_level,
            required_roles=["ai_policy_admin"],
            reason="High-risk policy changes require explicit policy admin approval.",
        )
