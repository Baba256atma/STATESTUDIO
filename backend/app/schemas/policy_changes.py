"""Typed schemas for policy diff, validation, approval, and activation."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.policy_overlays import OverlayConflictRecord, PolicyOverlayPayload, PolicyOverlayScope


PolicyChangeStatus = Literal[
    "pending",
    "approved",
    "rejected",
    "activated",
    "validation_failed",
    "activation_failed",
]
PolicyRiskLevel = Literal["low", "medium", "high", "critical"]
PolicyDiffKind = Literal["added", "removed", "changed"]
PolicyValidationSeverity = Literal["warning", "error"]


class PolicyFieldDiff(BaseModel):
    """A single field-level policy diff record."""

    field_path: str
    change_kind: PolicyDiffKind
    before_value: Any = None
    after_value: Any = None
    risk_level: PolicyRiskLevel = "low"
    summary: str


class PolicyFieldChange(PolicyFieldDiff):
    """Backward-compatible alias for a field-level policy change."""


class PolicyDiffResult(BaseModel):
    """Structured diff between current and proposed policy state."""

    changed_fields: list[str] = Field(default_factory=list)
    diffs: list[PolicyFieldDiff] = Field(default_factory=list)
    risk_level: PolicyRiskLevel = "low"
    summary: str


class PolicyValidationIssue(BaseModel):
    """Structural or logical validation issue."""

    severity: PolicyValidationSeverity
    code: str
    field_path: str
    message: str


class PolicyValidationResult(BaseModel):
    """Combined structural and logical validation result."""

    valid: bool
    structural_valid: bool
    logical_valid: bool
    issues: list[PolicyValidationIssue] = Field(default_factory=list)
    conflicts: list[OverlayConflictRecord] = Field(default_factory=list)


class PolicyApprovalRequirement(BaseModel):
    """Approval requirement derived from policy change risk."""

    approval_required: bool
    risk_level: PolicyRiskLevel
    required_roles: list[str] = Field(default_factory=list)
    reason: str


class PolicyApprovalRecord(BaseModel):
    """Approval or rejection record for a policy change."""

    status: Literal["not_required", "pending", "approved", "rejected"] = "pending"
    actor_id: str | None = None
    reason: str | None = None
    timestamp: str | None = None


class PolicyApprovalDecision(PolicyApprovalRecord):
    """Explainable approval decision output."""

    approval_required: bool = True
    decision_reason: str | None = None


class PolicyActivationResult(BaseModel):
    """Activation result for a staged policy change."""

    activated: bool = False
    activated_at: str | None = None
    activated_by: str | None = None
    previous_active_change_id: str | None = None
    effective_policy_version: str | None = None
    message: str | None = None


class PolicyChangeRequest(BaseModel):
    """Incoming policy change request."""

    title: str
    description: str | None = None
    scope_type: PolicyOverlayScope
    tenant_id: str | None = None
    workspace_id: str | None = None
    proposed_by: str = "system"
    source: str = "api"
    payload: PolicyOverlayPayload


class PolicyApprovalAction(BaseModel):
    """Approval or rejection action payload."""

    actor_id: str
    reason: str | None = None


class PolicyChangePreview(BaseModel):
    """Preview of a proposed policy change before storage or activation."""

    scope_type: PolicyOverlayScope
    scope_id: str
    tenant_id: str | None = None
    workspace_id: str | None = None
    diff: PolicyDiffResult
    validation: PolicyValidationResult
    approval: PolicyApprovalRequirement
    resulting_policy_version: str
    blocked_fields: list[str] = Field(default_factory=list)


class PolicyChangeRecord(BaseModel):
    """Stored policy change record."""

    change_id: str
    title: str
    description: str | None = None
    scope_type: PolicyOverlayScope
    scope_id: str
    tenant_id: str | None = None
    workspace_id: str | None = None
    proposed_by: str
    source: str
    created_at: str
    updated_at: str
    status: PolicyChangeStatus
    payload: PolicyOverlayPayload
    sanitized_payload: PolicyOverlayPayload
    diff: PolicyDiffResult
    validation: PolicyValidationResult
    approval_requirement: PolicyApprovalRequirement
    approval_record: PolicyApprovalRecord
    activation: PolicyActivationResult = Field(default_factory=PolicyActivationResult)
    resulting_policy_version: str


class PolicyChangeAuditRecord(BaseModel):
    """Compact audit-friendly policy change record."""

    change_id: str
    scope_type: PolicyOverlayScope
    scope_id: str
    base_policy_version: str | None = None
    proposed_policy_version: str
    approval_status: str
    approved_by: str | None = None
    activation_allowed: bool = False
    decision_reason: str | None = None


class PolicyChangeListResponse(BaseModel):
    """List response for stored policy changes."""

    changes: list[PolicyChangeRecord] = Field(default_factory=list)


class PolicyChangeDiagnostics(BaseModel):
    """Diagnostics summary for policy change storage and activation."""

    active_changes: dict[str, str] = Field(default_factory=dict)
    last_known_good_changes: dict[str, str] = Field(default_factory=dict)
    counts_by_status: dict[str, int] = Field(default_factory=dict)
    last_reload_succeeded: bool = True
    last_reload_error: str | None = None
