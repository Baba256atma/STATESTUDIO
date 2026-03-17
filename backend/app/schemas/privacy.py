"""Typed schemas for AI privacy classification and diagnostics."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator


SensitivityLevel = Literal["public", "internal", "confidential", "restricted"]
PrivacyMode = Literal["default", "local_preferred", "local_only", "cloud_allowed"]


class PrivacyClassificationRequest(BaseModel):
    """Input payload for deterministic privacy classification."""

    task_type: str
    text: str | None = None
    contains_uploaded_content: bool = False
    workspace_privacy_mode: PrivacyMode | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    context: dict[str, Any] = Field(default_factory=dict)

    @field_validator("task_type")
    @classmethod
    def _normalize_task_type(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("task_type must not be empty")
        return normalized


class PrivacyClassificationResult(BaseModel):
    """Deterministic privacy classification result."""

    task_type: str
    contains_uploaded_content: bool = False
    privacy_mode: PrivacyMode = "default"
    sensitivity_level: SensitivityLevel = "internal"
    cloud_allowed: bool = False
    local_required: bool = False
    classification_reason: str
    policy_tags: list[str] = Field(default_factory=list)


class PrivacyPolicyResponse(BaseModel):
    """Static privacy classification policy snapshot."""

    enabled: bool = True
    default_privacy_mode: PrivacyMode = "default"
    strict_mode: bool = True
    assume_uploaded_content_confidential: bool = True
    cloud_blocked_sensitivity_levels: list[SensitivityLevel] = Field(default_factory=list)
    local_required_sensitivity_levels: list[SensitivityLevel] = Field(default_factory=list)
