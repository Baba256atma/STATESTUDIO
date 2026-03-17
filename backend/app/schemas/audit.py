"""Typed schemas for AI audit trail records and diagnostics."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


AuditStage = Literal[
    "request_received",
    "privacy_classified",
    "routing_decided",
    "provider_selected",
    "model_selected",
    "provider_execution_started",
    "provider_execution_completed",
    "provider_execution_failed",
    "fallback_applied",
    "response_returned",
    "policy_change_submitted",
    "policy_change_validated",
    "policy_change_approval_required",
    "policy_change_approved",
    "policy_change_rejected",
    "policy_change_activated",
    "policy_change_activation_failed",
    "policy_promoted",
    "promotion_failed",
    "promotion_blocked",
    "promotion_gate_failed",
    "policy_rolled_back",
    "canary_started",
    "canary_assigned",
    "canary_paused",
    "canary_resumed",
    "canary_rolled_back",
    "canary_promoted",
    "canary_health_degraded",
    "experiment_created",
    "experiment_started",
    "experiment_assigned",
    "experiment_paused",
    "experiment_completed",
    "experiment_stopped",
    "experiment_winner_selected",
    "optimization_run_started",
    "optimization_proposal_created",
    "optimization_proposal_approved",
    "optimization_proposal_rejected",
    "optimization_proposal_applied",
]


class AuditEvent(BaseModel):
    """Compact audit event recorded during AI orchestration."""

    trace_id: str
    timestamp: str
    stage: AuditStage
    correlation_id: str | None = None
    task_type: str | None = None
    privacy_mode: str | None = None
    sensitivity_level: str | None = None
    selected_provider: str | None = None
    selected_model: str | None = None
    fallback_used: bool = False
    benchmark_used: bool = False
    decision_reason: str | None = None
    policy_tags: list[str] = Field(default_factory=list)
    success: bool | None = None
    error_code: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class PolicyDecisionRecord(AuditEvent):
    """Generic policy decision record."""


class PrivacyDecisionRecord(PolicyDecisionRecord):
    """Privacy classification decision record."""


class RoutingDecisionRecord(PolicyDecisionRecord):
    """Routing decision record."""


class ModelSelectionDecisionRecord(PolicyDecisionRecord):
    """Model selection decision record."""


class ProviderExecutionRecord(AuditEvent):
    """Provider execution lifecycle record."""


class AuditEventListResponse(BaseModel):
    """Audit event list response."""

    ok: bool = True
    events: list[AuditEvent] = Field(default_factory=list)


class AuditPolicyDecisionsResponse(BaseModel):
    """Filtered policy decision event response."""

    ok: bool = True
    events: list[PolicyDecisionRecord] = Field(default_factory=list)


class AuditPolicyResponse(BaseModel):
    """Static audit logging policy snapshot."""

    enabled: bool = True
    log_to_file: bool = False
    file_path: str | None = None
    keep_in_memory: bool = True
    max_events: int = 500
    include_policy_tags: bool = True
    redact_sensitive_fields: bool = True
    include_provider_metadata: bool = False
