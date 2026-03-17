"""Typed schemas for policy environment promotion and rollback."""

from __future__ import annotations

from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.control_plane import AIPolicySnapshot


class EnvironmentType(StrEnum):
    """Known policy promotion environments."""

    LOCAL = "local"
    DEV = "dev"
    STAGING = "staging"
    PRODUCTION = "production"


PromotionStatus = Literal["promoted", "blocked", "failed", "rolled_back"]


class PromotionGateResult(BaseModel):
    """Result of a single deterministic promotion gate."""

    gate_name: str
    passed: bool
    reason: str
    metrics_summary: dict[str, Any] = Field(default_factory=dict)


class PolicyEnvironmentState(BaseModel):
    """Active policy state for one environment."""

    environment: EnvironmentType
    policy_version: str
    updated_at: str
    source_environment: EnvironmentType | None = None
    last_known_good_version: str | None = None
    snapshot: AIPolicySnapshot


class PolicyEnvironmentListResponse(BaseModel):
    """List response for all policy environments."""

    environments: list[PolicyEnvironmentState] = Field(default_factory=list)


class PolicyPromotionRequest(BaseModel):
    """Request to promote a policy from one environment to the next."""

    source_environment: EnvironmentType
    target_environment: EnvironmentType
    requested_by: str = "system"
    approved_by: str | None = None
    promotion_reason: str | None = None


class PolicyPromotionResult(BaseModel):
    """Result of a promotion attempt."""

    promotion_id: str
    source_environment: EnvironmentType
    target_environment: EnvironmentType
    policy_version: str
    promotion_timestamp: str
    approved_by: str | None = None
    promotion_status: PromotionStatus
    promotion_reason: str | None = None
    gate_results: list[PromotionGateResult] = Field(default_factory=list)
    activated: bool = False
    activation_allowed: bool = False


class PromotionHistoryRecord(BaseModel):
    """Stored promotion or rollback history record."""

    promotion_id: str
    policy_version: str
    source_environment: EnvironmentType
    target_environment: EnvironmentType
    promotion_timestamp: str
    approved_by: str | None = None
    promotion_status: PromotionStatus
    promotion_reason: str | None = None
    gate_results: list[PromotionGateResult] = Field(default_factory=list)


class PromotionHistoryResponse(BaseModel):
    """History response for promotions and rollbacks."""

    records: list[PromotionHistoryRecord] = Field(default_factory=list)


class PolicyRollbackRequest(BaseModel):
    """Request to rollback an environment to its last-known-good policy."""

    actor_id: str
    reason: str | None = None


class PolicyRollbackResult(BaseModel):
    """Result of an environment rollback attempt."""

    environment: EnvironmentType
    rolled_back: bool
    policy_version: str | None = None
    previous_policy_version: str | None = None
    rollback_timestamp: str
    actor_id: str
    reason: str | None = None
