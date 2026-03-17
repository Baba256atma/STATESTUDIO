"""Typed request and response models for hybrid provider routing."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator


class RoutingProviderState(BaseModel):
    """Compact provider state used by routing policy decisions."""

    provider: str
    kind: Literal["local", "cloud"]
    available: bool = False
    enabled: bool = True
    configured: bool = True


class RoutingDecisionRequest(BaseModel):
    """Inputs required to compute a routing decision."""

    task_type: str
    privacy_sensitive: bool = False
    privacy_mode: str = "default"
    sensitivity_level: str = "internal"
    local_required: bool = False
    latency_sensitive: bool = False
    cloud_permitted: bool = False
    cloud_allowed: bool = False
    classification_reason: str | None = None
    policy_tags: list[str] = Field(default_factory=list)
    requested_provider: str | None = None
    provider_states: list[RoutingProviderState] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("task_type")
    @classmethod
    def _normalize_task_type(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("task_type must not be empty")
        return normalized

    @field_validator("requested_provider")
    @classmethod
    def _normalize_requested_provider(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip().lower()
        return normalized or None


class RoutingDecision(BaseModel):
    """Normalized routing decision returned by the policy."""

    selected_provider: str | None = None
    routing_reason: str
    fallback_allowed: bool = False
    privacy_mode: str = "standard"
    local_preferred: bool = True
    cloud_allowed: bool = False
    local_available: bool = False
    cloud_available: bool = False


class RoutingPolicyResponse(BaseModel):
    """Static routing policy snapshot for diagnostics."""

    enabled: bool = True
    default_mode: str
    local_first: bool = True
    cloud_fallback_enabled: bool = False
    cloud_for_reasoning_enabled: bool = False
    privacy_strict_local: bool = True
    cloud_allowed_tasks: list[str] = Field(default_factory=list)
    local_allowed_tasks: list[str] = Field(default_factory=list)
