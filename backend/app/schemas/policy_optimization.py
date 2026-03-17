"""Typed schemas for autonomous policy optimization workflows."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.policy_changes import PolicyRiskLevel
from app.schemas.policy_overlays import PolicyOverlayPayload, PolicyOverlayScope


OptimizationSignalType = Literal[
    "high_fallback_rate",
    "high_routing_failure_rate",
    "canary_promotion_ready",
    "experiment_winner",
    "benchmark_weights_missing",
]
OptimizationProposalStatus = Literal["proposed", "approved", "rejected", "applied", "expired"]
OptimizationType = Literal[
    "tighten_fallback_rules",
    "reduce_cloud_reasoning",
    "promote_canary_winner",
    "promote_experiment_winner",
    "adjust_benchmark_weights",
]
OptimizationRiskLevel = Literal["low", "medium", "high", "forbidden"]


class PolicyOptimizationSignal(BaseModel):
    """Normalized signal that may justify a policy optimization."""

    signal_type: OptimizationSignalType
    source_component: str
    metric_name: str
    current_value: float | str | bool
    threshold_value: float | str | bool | None = None
    signal_metadata: dict[str, Any] = Field(default_factory=dict)
    decision_reason: str


class OptimizationRiskAssessment(BaseModel):
    """Risk classification for one optimization proposal."""

    risk_level: OptimizationRiskLevel
    approval_required: bool
    auto_apply_eligible: bool
    policy_change_risk_level: PolicyRiskLevel
    decision_reason: str


class OptimizationDecision(BaseModel):
    """Compact decision metadata for a proposal or run."""

    decision_reason: str
    expected_benefit: str
    approval_required: bool
    auto_apply_eligible: bool


class PolicyOptimizationProposal(BaseModel):
    """A generated optimization proposal."""

    proposal_id: str
    optimization_type: OptimizationType
    target_scope: PolicyOverlayScope = "global"
    tenant_id: str | None = None
    workspace_id: str | None = None
    current_policy_version: str
    proposed_policy_patch: PolicyOverlayPayload
    source_signals: list[PolicyOptimizationSignal] = Field(default_factory=list)
    expected_benefit: str
    risk_assessment: OptimizationRiskAssessment
    decision: OptimizationDecision
    status: OptimizationProposalStatus = "proposed"
    linked_policy_change_id: str | None = None
    created_at: str
    updated_at: str
    created_by: str = "optimizer"
    approved_by: str | None = None
    rejected_by: str | None = None
    applied_by: str | None = None


class OptimizationApplicationResult(BaseModel):
    """Result of attempting to apply a proposal through governance workflow."""

    proposal_id: str
    applied: bool = False
    policy_change_id: str | None = None
    policy_change_status: str | None = None
    resulting_policy_version: str | None = None
    auto_applied: bool = False
    decision_reason: str


class OptimizationProposalSet(BaseModel):
    """Results of one optimization run."""

    run_id: str
    started_at: str
    completed_at: str
    source_signals: list[PolicyOptimizationSignal] = Field(default_factory=list)
    proposals: list[PolicyOptimizationProposal] = Field(default_factory=list)
    auto_applied_results: list[OptimizationApplicationResult] = Field(default_factory=list)
    decision_reason: str


class OptimizationAction(BaseModel):
    """Actor metadata for optimization proposal lifecycle actions."""

    actor_id: str
    reason: str | None = None


class OptimizationProposalListResponse(BaseModel):
    """List response for optimization proposals."""

    proposals: list[PolicyOptimizationProposal] = Field(default_factory=list)
