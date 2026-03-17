"""Typed schemas for tenant and workspace AI policy overlays."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.control_plane import AIPolicySnapshot


PolicyOverlayScope = Literal["global", "tenant", "workspace"]


class PolicyOverlayReference(BaseModel):
    """Reference metadata for a policy overlay source."""

    scope_type: PolicyOverlayScope
    scope_id: str
    policy_version: str
    source: str
    enabled: bool = True
    overlay_priority: int
    inherited_from: str | None = None


class PolicyOverlayPayload(BaseModel):
    """Partial policy payload used by tenant and workspace overlays."""

    enabled: bool | None = None
    routing: dict[str, Any] = Field(default_factory=dict)
    privacy: dict[str, Any] = Field(default_factory=dict)
    provider: dict[str, Any] = Field(default_factory=dict)
    model: dict[str, Any] = Field(default_factory=dict)
    benchmark: dict[str, Any] = Field(default_factory=dict)
    audit: dict[str, Any] = Field(default_factory=dict)
    telemetry: dict[str, Any] = Field(default_factory=dict)
    evaluation: dict[str, Any] = Field(default_factory=dict)


class TenantPolicyOverlay(BaseModel):
    """Tenant-scoped AI policy overlay."""

    scope_type: Literal["tenant"] = "tenant"
    scope_id: str
    policy_version: str
    source: str
    enabled: bool = True
    overlay_priority: int = 100
    inherited_from: str = "global"
    overlay: PolicyOverlayPayload = Field(default_factory=PolicyOverlayPayload)


class WorkspacePolicyOverlay(BaseModel):
    """Workspace-scoped AI policy overlay."""

    scope_type: Literal["workspace"] = "workspace"
    scope_id: str
    tenant_id: str | None = None
    policy_version: str
    source: str
    enabled: bool = True
    overlay_priority: int = 200
    inherited_from: str = "tenant"
    overlay: PolicyOverlayPayload = Field(default_factory=PolicyOverlayPayload)


class OverlayConflictRecord(BaseModel):
    """Blocked or adjusted overlay change recorded during resolution."""

    scope_type: PolicyOverlayScope
    scope_id: str
    field_path: str
    attempted_value: Any = None
    effective_value: Any = None
    reason: str


class OverlayMergeTrace(BaseModel):
    """Trace entry showing how a single overlay affected effective policy."""

    overlay_reference: PolicyOverlayReference
    overridden_fields: list[str] = Field(default_factory=list)
    blocked_fields: list[str] = Field(default_factory=list)


class EffectivePolicyResolution(BaseModel):
    """Resolved effective policy and overlay provenance."""

    tenant_id: str | None = None
    workspace_id: str | None = None
    resolution_timestamp: str
    base_policy_version: str
    tenant_overlay_version: str | None = None
    workspace_overlay_version: str | None = None
    effective_policy_version: str
    sources: list[str] = Field(default_factory=list)
    effective_policy: AIPolicySnapshot
    merge_trace: list[OverlayMergeTrace] = Field(default_factory=list)
    conflicts: list[OverlayConflictRecord] = Field(default_factory=list)
