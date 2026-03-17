"""Typed schemas for policy canary release workflows."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_promotion import EnvironmentType


CanaryStatus = Literal["draft", "active", "paused", "rolled_back", "promoted"]
CanaryAssignmentScope = Literal["global", "tenant", "workspace"]
CanaryChannel = Literal["stable", "canary"]
CanaryHealthStatus = Literal["healthy", "degraded", "insufficient_data"]
CanaryAction = Literal["continue", "pause", "rollback", "promote"]


class CanaryTrafficRule(BaseModel):
    """Traffic targeting rule for canary assignment."""

    assignment_scope: CanaryAssignmentScope = "global"
    traffic_percentage: int = Field(default=0, ge=0, le=100)
    tenant_id: str | None = None
    workspace_id: str | None = None


class PolicyCanaryConfig(BaseModel):
    """Configuration for a canary release."""

    stable_policy_version: str
    canary_policy_version: str
    canary_enabled: bool = False
    traffic_percentage: int = Field(default=0, ge=0, le=100)
    assignment_scope: CanaryAssignmentScope = "global"
    source_environment: EnvironmentType = EnvironmentType.STAGING
    target_environment: EnvironmentType = EnvironmentType.PRODUCTION
    tenant_id: str | None = None
    workspace_id: str | None = None
    traffic_rules: list[CanaryTrafficRule] = Field(default_factory=list)


class CanaryAssignmentRequest(BaseModel):
    """Request context used for deterministic canary assignment."""

    trace_id: str | None = None
    request_id: str | None = None
    tenant_id: str | None = None
    workspace_id: str | None = None


class CanaryAssignmentResult(BaseModel):
    """Deterministic canary assignment output."""

    stable_policy_version: str
    canary_policy_version: str | None = None
    assigned_channel: CanaryChannel = "stable"
    assigned_policy_version: str
    canary_enabled: bool = False
    traffic_percentage: int = 0
    assignment_scope: CanaryAssignmentScope = "global"
    tenant_id: str | None = None
    workspace_id: str | None = None
    request_hash_bucket: int = 0
    decision_reason: str


class CanaryHealthSummary(BaseModel):
    """Compact canary health indicators derived from telemetry and audit signals."""

    stable_policy_version: str
    canary_policy_version: str | None = None
    health_status: CanaryHealthStatus = "insufficient_data"
    stable_request_count: int = 0
    canary_request_count: int = 0
    routing_failure_rate: float = 0.0
    fallback_rate: float = 0.0
    response_validity_rate: float = 0.0
    audit_completeness_rate: float = 0.0
    average_latency_ms_stable: float = 0.0
    average_latency_ms_canary: float = 0.0
    average_latency_delta_ms: float = 0.0
    rollback_required: bool = False
    promotion_ready: bool = False
    decision_reason: str


class CanaryDecisionResult(BaseModel):
    """Decision derived from canary health evaluation."""

    health_status: CanaryHealthStatus
    recommended_action: CanaryAction
    rollback_required: bool = False
    promotion_ready: bool = False
    decision_reason: str


class CanaryLifecycleAction(BaseModel):
    """Actor metadata for canary lifecycle operations."""

    actor_id: str
    reason: str | None = None


class CanaryReleaseState(BaseModel):
    """Stored canary release state."""

    status: CanaryStatus = "draft"
    stable_policy_version: str
    canary_policy_version: str
    canary_enabled: bool = False
    traffic_percentage: int = 0
    assignment_scope: CanaryAssignmentScope = "global"
    source_environment: EnvironmentType = EnvironmentType.STAGING
    target_environment: EnvironmentType = EnvironmentType.PRODUCTION
    tenant_id: str | None = None
    workspace_id: str | None = None
    started_at: str | None = None
    updated_at: str | None = None
    updated_by: str | None = None
    decision_reason: str | None = None
    stable_snapshot: AIPolicySnapshot
    canary_snapshot: AIPolicySnapshot
    health_summary: CanaryHealthSummary | None = None
    decision: CanaryDecisionResult | None = None

