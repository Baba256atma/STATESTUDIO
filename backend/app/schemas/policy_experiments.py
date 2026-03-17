"""Typed schemas for policy experimentation workflows."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.policy_promotion import EnvironmentType


ExperimentStatus = Literal["draft", "active", "paused", "completed", "stopped"]
ExperimentAssignmentScope = Literal["global", "tenant", "workspace"]


class PolicyVariant(BaseModel):
    """A named experiment policy variant."""

    variant_name: str
    policy_version: str
    source_environment: EnvironmentType = EnvironmentType.STAGING


class PolicyExperimentConfig(BaseModel):
    """Configuration for a policy experiment."""

    experiment_name: str
    description: str | None = None
    control_policy_version: str
    variants: list[PolicyVariant] = Field(default_factory=list)
    traffic_split: dict[str, int] = Field(default_factory=dict)
    assignment_scope: ExperimentAssignmentScope = "global"
    tenant_id: str | None = None
    workspace_id: str | None = None


class ExperimentLifecycleAction(BaseModel):
    """Actor metadata for experiment lifecycle actions."""

    actor_id: str
    reason: str | None = None


class ExperimentAssignmentRequest(BaseModel):
    """Request context for deterministic experiment assignment."""

    trace_id: str | None = None
    request_id: str | None = None
    tenant_id: str | None = None
    workspace_id: str | None = None


class ExperimentAssignmentResult(BaseModel):
    """Deterministic experiment assignment output."""

    experiment_id: str
    experiment_name: str
    selected_variant: str
    assigned_policy_version: str
    request_hash_bucket: int
    assignment_scope: ExperimentAssignmentScope = "global"
    traffic_split: dict[str, int] = Field(default_factory=dict)
    tenant_id: str | None = None
    workspace_id: str | None = None
    decision_reason: str


class VariantMetricsSummary(BaseModel):
    """Metrics summary for one control or variant arm."""

    variant_name: str
    policy_version: str
    request_count: int = 0
    response_validity_rate: float = 0.0
    fallback_rate: float = 0.0
    routing_error_rate: float = 0.0
    audit_completeness_rate: float = 0.0
    average_latency_ms: float = 0.0


class ExperimentMetricsSummary(BaseModel):
    """Aggregated experiment results."""

    experiment_id: str
    experiment_name: str
    status: ExperimentStatus
    control_variant: VariantMetricsSummary
    variant_summaries: list[VariantMetricsSummary] = Field(default_factory=list)
    winning_variant: str | None = None
    enough_data: bool = False
    summary: str
    compared_at: str


class ExperimentDecisionResult(BaseModel):
    """Decision derived from experiment analysis."""

    experiment_id: str
    status: ExperimentStatus
    winning_variant: str | None = None
    promotion_ready: bool = False
    stop_required: bool = False
    decision_reason: str


class ExperimentRunState(BaseModel):
    """Stored experiment definition, lifecycle state, and latest analysis."""

    experiment_id: str
    experiment_name: str
    description: str | None = None
    status: ExperimentStatus = "draft"
    control_policy_version: str
    variants: list[PolicyVariant] = Field(default_factory=list)
    traffic_split: dict[str, int] = Field(default_factory=dict)
    assignment_scope: ExperimentAssignmentScope = "global"
    tenant_id: str | None = None
    workspace_id: str | None = None
    created_at: str
    started_at: str | None = None
    ended_at: str | None = None
    updated_at: str
    updated_by: str | None = None
    winning_variant: str | None = None
    decision_reason: str | None = None
    metrics_summary: ExperimentMetricsSummary | None = None
    decision: ExperimentDecisionResult | None = None


class ExperimentListResponse(BaseModel):
    """List response for policy experiments."""

    experiments: list[ExperimentRunState] = Field(default_factory=list)


class ExperimentResultsResponse(BaseModel):
    """Results response for one experiment."""

    experiment: ExperimentRunState
    metrics_summary: ExperimentMetricsSummary | None = None
    decision: ExperimentDecisionResult | None = None
