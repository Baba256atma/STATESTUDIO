"""Deterministic hybrid local/cloud routing policy."""

from __future__ import annotations

from app.core.config import LocalAISettings
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService
from app.services.ai.control_plane.policy_engine import AIPolicyEngine
from app.services.ai.routing_types import (
    RoutingDecision,
    RoutingDecisionRequest,
    RoutingPolicyResponse,
    RoutingProviderState,
)


REASONING_TASKS = {"analyze_scenario", "explain", "summarize_context"}


class HybridRoutingPolicy:
    """Compute deterministic provider routing decisions for Nexora AI requests."""

    def __init__(self, settings: LocalAISettings) -> None:
        self.settings = settings
        self.control_plane = AIControlPlaneService(settings)

    def describe_policy(self) -> RoutingPolicyResponse:
        """Return a static snapshot of the current routing policy."""
        policy = self.control_plane.get_routing_policy()
        return RoutingPolicyResponse(
            enabled=policy.enabled,
            default_mode=policy.default_mode,
            local_first=policy.local_first,
            cloud_fallback_enabled=policy.cloud_fallback_enabled,
            cloud_for_reasoning_enabled=policy.cloud_for_reasoning_enabled,
            privacy_strict_local=policy.privacy_strict_local,
            cloud_allowed_tasks=sorted(policy.cloud_allowed_tasks),
            local_allowed_tasks=sorted(policy.local_allowed_tasks),
        )

    def decide(self, request: RoutingDecisionRequest) -> RoutingDecision:
        """Return a deterministic routing decision."""
        policy = self.control_plane.get_routing_policy()
        engine = AIPolicyEngine(self.control_plane.get_snapshot())
        local_state = self._select_state(request.provider_states, "local")
        cloud_state = self._select_state(request.provider_states, "cloud")
        local_available = self._is_usable(local_state)
        cloud_available = self._is_usable(cloud_state)
        privacy_mode = request.privacy_mode or "default"
        if request.privacy_sensitive and policy.privacy_strict_local and privacy_mode != "local_only":
            privacy_mode = "local_preferred"
        cloud_allowed = self._cloud_allowed(request)
        fallback_allowed = bool(engine.is_fallback_allowed(privacy_mode).effective_value and cloud_allowed)

        if request.requested_provider:
            explicit = self._decide_explicit_provider(
                request=request,
                local_state=local_state,
                cloud_state=cloud_state,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
            )
            if explicit is not None:
                return explicit

        if request.local_required or privacy_mode == "local_only":
            if local_available:
                return self._decision(
                    selected_provider=local_state.provider if local_state else self.settings.provider,
                    routing_reason=request.classification_reason or "Privacy-sensitive request routed to local provider",
                    fallback_allowed=False,
                    privacy_mode="local_only",
                    local_available=local_available,
                    cloud_available=cloud_available,
                    cloud_allowed=False,
                )
            return self._decision(
                selected_provider=None,
                routing_reason="No local provider available for local-required request",
                fallback_allowed=False,
                privacy_mode="local_only",
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=False,
            )

        if request.latency_sensitive and local_available:
            return self._decision(
                selected_provider=local_state.provider if local_state else self.settings.provider,
                routing_reason="Latency-sensitive request kept local while local provider is healthy",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        if policy.local_first and request.task_type in set(policy.local_allowed_tasks) and local_available:
            return self._decision(
                selected_provider=local_state.provider if local_state else self.settings.provider,
                routing_reason="Local-first policy selected a healthy local provider",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        if (
            request.task_type in REASONING_TASKS
            and policy.cloud_for_reasoning_enabled
            and cloud_allowed
            and cloud_available
        ):
            return self._decision(
                selected_provider=cloud_state.provider if cloud_state else self.settings.default_provider,
                routing_reason="Reasoning-oriented task routed to cloud by policy",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        if not local_available and fallback_allowed and cloud_available:
            return self._decision(
                selected_provider=cloud_state.provider if cloud_state else self.settings.default_provider,
                routing_reason="Local provider unavailable; cloud fallback selected",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        if local_available:
            return self._decision(
                selected_provider=local_state.provider if local_state else self.settings.provider,
                routing_reason="Healthy local provider selected by conservative default policy",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        if cloud_allowed and cloud_available:
            return self._decision(
                selected_provider=cloud_state.provider if cloud_state else self.settings.default_provider,
                routing_reason="Cloud provider selected because local execution is unavailable",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        return self._decision(
            selected_provider=None,
            routing_reason="No eligible provider is available under the current routing policy",
            fallback_allowed=fallback_allowed,
            privacy_mode=privacy_mode,
            local_available=local_available,
            cloud_available=cloud_available,
            cloud_allowed=cloud_allowed,
        )

    def _decide_explicit_provider(
        self,
        *,
        request: RoutingDecisionRequest,
        local_state: RoutingProviderState | None,
        cloud_state: RoutingProviderState | None,
        local_available: bool,
        cloud_available: bool,
        cloud_allowed: bool,
        fallback_allowed: bool,
        privacy_mode: str,
    ) -> RoutingDecision | None:
        requested_provider = request.requested_provider or ""
        if local_state is not None and requested_provider == local_state.provider:
            if local_available:
                return self._decision(
                    selected_provider=local_state.provider,
                    routing_reason="Explicit local provider preference honored",
                    fallback_allowed=fallback_allowed,
                    privacy_mode=privacy_mode,
                    local_available=local_available,
                    cloud_available=cloud_available,
                    cloud_allowed=cloud_allowed,
                )
            if fallback_allowed and cloud_available:
                return self._decision(
                    selected_provider=cloud_state.provider if cloud_state else None,
                    routing_reason="Explicit local preference could not be met; cloud fallback selected",
                    fallback_allowed=fallback_allowed,
                    privacy_mode=privacy_mode,
                    local_available=local_available,
                    cloud_available=cloud_available,
                    cloud_allowed=cloud_allowed,
                )
            return self._decision(
                selected_provider=None,
                routing_reason="Explicit local provider preference could not be satisfied",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        if cloud_state is not None and requested_provider == cloud_state.provider:
            if cloud_allowed and cloud_available:
                return self._decision(
                    selected_provider=cloud_state.provider,
                    routing_reason="Explicit cloud provider preference honored",
                    fallback_allowed=fallback_allowed,
                    privacy_mode=privacy_mode,
                    local_available=local_available,
                    cloud_available=cloud_available,
                    cloud_allowed=cloud_allowed,
                )
            if local_available:
                return self._decision(
                    selected_provider=local_state.provider if local_state else self.settings.provider,
                    routing_reason="Explicit cloud preference was not allowed; local provider selected",
                    fallback_allowed=fallback_allowed,
                    privacy_mode=privacy_mode,
                    local_available=local_available,
                    cloud_available=cloud_available,
                    cloud_allowed=cloud_allowed,
                )
            return self._decision(
                selected_provider=None,
                routing_reason="Explicit cloud provider preference could not be satisfied",
                fallback_allowed=fallback_allowed,
                privacy_mode=privacy_mode,
                local_available=local_available,
                cloud_available=cloud_available,
                cloud_allowed=cloud_allowed,
            )

        return None

    def _cloud_allowed(self, request: RoutingDecisionRequest) -> bool:
        routing_policy = self.control_plane.get_routing_policy()
        privacy_policy = self.control_plane.get_privacy_policy()
        provider_policy = self.control_plane.get_provider_policy()
        if bool(request.metadata.get("local_only")):
            return False
        if request.local_required:
            return False
        if not provider_policy.cloud_provider_enabled:
            return False
        if request.sensitivity_level in set(privacy_policy.cloud_blocked_sensitivity_levels):
            return False
        if request.task_type not in set(routing_policy.cloud_allowed_tasks):
            return False
        if not request.cloud_allowed:
            return False
        if request.cloud_permitted:
            return True
        return routing_policy.cloud_for_reasoning_enabled and request.task_type in REASONING_TASKS

    @staticmethod
    def _select_state(provider_states: list[RoutingProviderState], kind: str) -> RoutingProviderState | None:
        for state in provider_states:
            if state.kind == kind:
                return state
        return None

    @staticmethod
    def _is_usable(state: RoutingProviderState | None) -> bool:
        return bool(state and state.enabled and state.configured and state.available)

    def _decision(
        self,
        *,
        selected_provider: str | None,
        routing_reason: str,
        fallback_allowed: bool,
        privacy_mode: str,
        local_available: bool,
        cloud_available: bool,
        cloud_allowed: bool,
    ) -> RoutingDecision:
        return RoutingDecision(
            selected_provider=selected_provider,
            routing_reason=routing_reason,
            fallback_allowed=fallback_allowed,
            privacy_mode=privacy_mode,
            local_preferred=self.settings.local_first,
            cloud_allowed=cloud_allowed,
            local_available=local_available,
            cloud_available=cloud_available,
        )
