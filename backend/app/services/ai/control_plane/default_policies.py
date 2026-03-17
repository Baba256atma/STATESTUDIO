"""Safe default AI control plane policies derived from backend settings."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.config import LocalAISettings
from app.schemas.control_plane import (
    AIPolicySnapshot,
    AuditPolicyConfig,
    BenchmarkPolicyConfig,
    EvaluationPolicyConfig,
    ModelPolicyConfig,
    PolicyVersionInfo,
    PrivacyPolicyConfig,
    ProviderPolicyConfig,
    ProviderPolicyEntry,
    RoutingPolicyConfig,
    TelemetryPolicyConfig,
)


def build_default_policy_snapshot(settings: LocalAISettings) -> AIPolicySnapshot:
    """Build the effective default AI policy snapshot from backend settings."""
    now = datetime.now(UTC).isoformat()
    return AIPolicySnapshot(
        enabled=settings.enabled,
        version_info=PolicyVersionInfo(
            policy_version="nexora-default-v1",
            loaded_at=now,
            updated_at=None,
            source="settings_defaults",
        ),
        routing=RoutingPolicyConfig(
            enabled=settings.routing_enabled,
            default_mode=settings.routing_default_mode,
            local_first=settings.local_first,
            cloud_fallback_enabled=settings.cloud_fallback_enabled,
            cloud_for_reasoning_enabled=settings.cloud_for_reasoning_enabled,
            privacy_strict_local=settings.privacy_strict_local,
            cloud_allowed_tasks=sorted(settings.cloud_allowed_tasks),
            local_allowed_tasks=sorted(settings.local_allowed_tasks),
        ),
        privacy=PrivacyPolicyConfig(
            enabled=settings.privacy_classification_enabled,
            default_privacy_mode=settings.default_privacy_mode,
            strict_mode=settings.classification_strict_mode,
            assume_uploaded_content_confidential=settings.assume_uploaded_content_confidential,
            cloud_blocked_sensitivity_levels=sorted(settings.cloud_blocked_sensitivity_levels),
            local_required_sensitivity_levels=sorted(settings.local_required_sensitivity_levels),
        ),
        provider=ProviderPolicyConfig(
            default_provider=settings.default_provider,
            fallback_provider=settings.fallback_provider,
            local_provider_enabled=settings.local_provider_enabled,
            cloud_provider_enabled=settings.cloud_provider_enabled,
            providers={
                "ollama": ProviderPolicyEntry(
                    enabled=settings.local_provider_enabled,
                    kind="local",
                    default_model=settings.default_model,
                ),
                "openai": ProviderPolicyEntry(
                    enabled=settings.openai_enabled,
                    kind="cloud",
                    default_model=settings.openai_default_model,
                ),
                "anthropic": ProviderPolicyEntry(
                    enabled=settings.anthropic_enabled,
                    kind="cloud",
                    default_model=settings.anthropic_default_model,
                ),
            },
        ),
        model=ModelPolicyConfig(
            selection_enabled=settings.model_selection_enabled,
            selection_strategy=settings.ai_selection_strategy,
            default_model=settings.default_model,
            fast_model=settings.fast_model,
            reasoning_model=settings.reasoning_model,
            extraction_model=settings.extraction_model,
        ),
        benchmark=BenchmarkPolicyConfig(
            enabled=settings.benchmark_tuning_enabled,
            results_path=settings.benchmark_results_path,
            min_success_rate=settings.benchmark_min_success_rate,
            weights=settings.benchmark_weights,
        ),
        audit=AuditPolicyConfig(
            enabled=settings.audit_enabled,
            log_to_file=settings.audit_log_to_file,
            file_path=settings.audit_file_path,
            keep_in_memory=settings.audit_keep_in_memory,
            max_events=settings.audit_max_events,
            include_policy_tags=settings.audit_include_policy_tags,
            redact_sensitive_fields=settings.audit_redact_sensitive_fields,
            include_provider_metadata=settings.audit_include_provider_metadata,
        ),
        telemetry=TelemetryPolicyConfig(
            enabled=settings.telemetry_enabled,
            log_to_file=settings.telemetry_log_to_file,
            file_path=settings.telemetry_file_path,
            keep_in_memory=settings.telemetry_keep_in_memory,
            max_events=settings.telemetry_max_events,
            redact_sensitive_fields=settings.telemetry_redact_sensitive_fields,
            include_provider_metadata=settings.telemetry_include_provider_metadata,
        ),
        evaluation=EvaluationPolicyConfig(
            optimization_auto_apply_enabled=False,
        ),
    )
