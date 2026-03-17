"""Deterministic policy decision helpers for the AI control plane."""

from __future__ import annotations

from app.schemas.control_plane import AIPolicySnapshot, PolicyDecision


class AIPolicyEngine:
    """Evaluate explainable policy decisions from a control plane snapshot."""

    def __init__(self, snapshot: AIPolicySnapshot) -> None:
        self.snapshot = snapshot

    def is_cloud_routing_enabled(self) -> PolicyDecision:
        enabled = self.snapshot.routing.enabled and self.snapshot.provider.cloud_provider_enabled
        return self._decision(
            "cloud_routing_enabled",
            enabled,
            "Cloud routing is enabled by routing and provider policy"
            if enabled
            else "Cloud routing is disabled by routing or provider policy",
            ["routing.enabled", "provider.cloud_provider_enabled"],
        )

    def is_benchmark_tuning_enabled(self) -> PolicyDecision:
        enabled = self.snapshot.benchmark.enabled
        return self._decision(
            "benchmark_tuning_enabled",
            enabled,
            "Benchmark tuning is enabled by policy" if enabled else "Benchmark tuning is disabled by policy",
            ["benchmark.enabled"],
        )

    def is_provider_enabled(self, provider_key: str) -> PolicyDecision:
        provider = self.snapshot.provider.providers.get(provider_key)
        enabled = bool(provider and provider.enabled)
        return self._decision(
            "provider_enabled",
            enabled,
            f"Provider {provider_key} is enabled by policy" if enabled else f"Provider {provider_key} is disabled by policy",
            [f"provider.providers.{provider_key}.enabled"],
        )

    def is_task_cloud_allowed(self, task_type: str) -> PolicyDecision:
        allowed = task_type in set(self.snapshot.routing.cloud_allowed_tasks)
        return self._decision(
            "task_cloud_allowed",
            allowed,
            f"Task {task_type} is cloud-allowed by routing policy"
            if allowed
            else f"Task {task_type} is not cloud-allowed by routing policy",
            ["routing.cloud_allowed_tasks"],
        )

    def sensitivity_requires_local(self, sensitivity_level: str) -> PolicyDecision:
        required = sensitivity_level in set(self.snapshot.privacy.local_required_sensitivity_levels)
        return self._decision(
            "sensitivity_requires_local",
            required,
            f"Sensitivity {sensitivity_level} requires local execution"
            if required
            else f"Sensitivity {sensitivity_level} does not require local execution",
            ["privacy.local_required_sensitivity_levels"],
        )

    def is_fallback_allowed(self, privacy_mode: str | None = None) -> PolicyDecision:
        allowed = self.snapshot.routing.cloud_fallback_enabled and privacy_mode != "local_only"
        return self._decision(
            "fallback_allowed",
            allowed,
            "Fallback is enabled by routing policy" if allowed else "Fallback is disabled by routing policy",
            ["routing.cloud_fallback_enabled"],
        )

    def _decision(
        self,
        policy_decision: str,
        effective_value: object,
        decision_reason: str,
        matched_rules: list[str],
    ) -> PolicyDecision:
        return PolicyDecision(
            policy_decision=policy_decision,
            decision_reason=decision_reason,
            policy_version=self.snapshot.version_info.policy_version,
            matched_rules=matched_rules,
            effective_value=effective_value,
        )
