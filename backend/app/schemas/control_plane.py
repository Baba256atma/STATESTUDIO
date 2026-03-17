"""Typed schemas for the Nexora AI control plane and policy engine."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


PolicySource = Literal["settings_defaults", "file", "fallback_defaults"]
ProviderKind = Literal["local", "cloud"]


class PolicyVersionInfo(BaseModel):
    """Version metadata for an effective AI policy snapshot."""

    policy_version: str
    loaded_at: str
    updated_at: str | None = None
    source: PolicySource | str


class RoutingPolicyConfig(BaseModel):
    """Config snapshot for AI routing policy defaults."""

    enabled: bool = True
    default_mode: str = "local_first"
    local_first: bool = True
    cloud_fallback_enabled: bool = False
    cloud_for_reasoning_enabled: bool = False
    privacy_strict_local: bool = True
    cloud_allowed_tasks: list[str] = Field(default_factory=list)
    local_allowed_tasks: list[str] = Field(default_factory=list)


class PrivacyPolicyConfig(BaseModel):
    """Config snapshot for privacy classification defaults."""

    enabled: bool = True
    default_privacy_mode: str = "default"
    strict_mode: bool = True
    assume_uploaded_content_confidential: bool = True
    cloud_blocked_sensitivity_levels: list[str] = Field(default_factory=list)
    local_required_sensitivity_levels: list[str] = Field(default_factory=list)


class ProviderPolicyEntry(BaseModel):
    """Provider-specific enablement policy entry."""

    enabled: bool = True
    kind: ProviderKind
    default_model: str | None = None


class ProviderPolicyConfig(BaseModel):
    """Config snapshot for provider policy defaults."""

    default_provider: str = "ollama"
    fallback_provider: str | None = None
    local_provider_enabled: bool = True
    cloud_provider_enabled: bool = False
    providers: dict[str, ProviderPolicyEntry] = Field(default_factory=dict)


class ModelPolicyConfig(BaseModel):
    """Config snapshot for model selection defaults."""

    selection_enabled: bool = True
    selection_strategy: str = "task_policy"
    default_model: str
    fast_model: str
    reasoning_model: str
    extraction_model: str


class BenchmarkPolicyConfig(BaseModel):
    """Config snapshot for benchmark-driven tuning defaults."""

    enabled: bool = False
    results_path: str
    min_success_rate: float = 0.65
    weights: dict[str, float] = Field(default_factory=dict)


class AuditPolicyConfig(BaseModel):
    """Config snapshot for audit controls."""

    enabled: bool = True
    log_to_file: bool = False
    file_path: str
    keep_in_memory: bool = True
    max_events: int = 500
    include_policy_tags: bool = True
    redact_sensitive_fields: bool = True
    include_provider_metadata: bool = False


class TelemetryPolicyConfig(BaseModel):
    """Config snapshot for telemetry controls."""

    enabled: bool = True
    log_to_file: bool = False
    file_path: str
    keep_in_memory: bool = True
    max_events: int = 1000
    redact_sensitive_fields: bool = True
    include_provider_metadata: bool = False


class EvaluationPolicyConfig(BaseModel):
    """Config snapshot for evaluation and regression defaults."""

    use_mock_providers: bool = True
    include_audit_checks: bool = True
    regression_enabled: bool = True
    optimization_auto_apply_enabled: bool = False


class AIPolicySnapshot(BaseModel):
    """Full effective AI control plane policy snapshot."""

    enabled: bool = True
    version_info: PolicyVersionInfo
    routing: RoutingPolicyConfig
    privacy: PrivacyPolicyConfig
    provider: ProviderPolicyConfig
    model: ModelPolicyConfig
    benchmark: BenchmarkPolicyConfig
    audit: AuditPolicyConfig
    telemetry: TelemetryPolicyConfig
    evaluation: EvaluationPolicyConfig


class AIControlPlaneState(BaseModel):
    """Current state of the AI control plane."""

    enabled: bool = True
    snapshot: AIPolicySnapshot
    reload_succeeded: bool = True
    last_error: str | None = None


class PolicyDecision(BaseModel):
    """Explainable policy engine decision output."""

    policy_decision: str
    decision_reason: str
    policy_version: str
    matched_rules: list[str] = Field(default_factory=list)
    effective_value: Any = None
