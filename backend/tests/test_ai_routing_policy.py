from __future__ import annotations

import asyncio

from app.core.config import LocalAISettings
from app.services.ai.routing_policy import HybridRoutingPolicy
from app.services.ai.routing_types import RoutingDecisionRequest, RoutingProviderState


def _local_state(available: bool = True) -> RoutingProviderState:
    return RoutingProviderState(
        provider="ollama",
        kind="local",
        available=available,
        enabled=True,
        configured=True,
    )


def _cloud_state(available: bool = True) -> RoutingProviderState:
    return RoutingProviderState(
        provider="openai",
        kind="cloud",
        available=available,
        enabled=True,
        configured=True,
    )


def test_privacy_sensitive_task_routes_to_local():
    policy = HybridRoutingPolicy(LocalAISettings())
    decision = policy.decide(
        RoutingDecisionRequest(
            task_type="analyze_scenario",
            privacy_sensitive=True,
            provider_states=[_local_state(), _cloud_state()],
        )
    )

    assert decision.selected_provider == "ollama"
    assert decision.privacy_mode == "strict_local"


def test_latency_sensitive_task_stays_local_when_local_is_healthy():
    policy = HybridRoutingPolicy(LocalAISettings())
    decision = policy.decide(
        RoutingDecisionRequest(
            task_type="classify_intent",
            latency_sensitive=True,
            provider_states=[_local_state(), _cloud_state()],
        )
    )

    assert decision.selected_provider == "ollama"
    assert "latency-sensitive" in decision.routing_reason.lower()


def test_reasoning_task_can_route_to_cloud_when_policy_allows():
    policy = HybridRoutingPolicy(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_cloud_for_reasoning_enabled=True,
            ai_privacy_strict_local=False,
        )
    )
    decision = policy.decide(
        RoutingDecisionRequest(
            task_type="analyze_scenario",
            cloud_permitted=True,
            provider_states=[_local_state(available=False), _cloud_state()],
        )
    )

    assert decision.selected_provider == "openai"
    assert "cloud" in decision.routing_reason.lower()


def test_local_unavailable_triggers_cloud_fallback_when_enabled():
    policy = HybridRoutingPolicy(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_cloud_fallback_enabled=True,
            ai_cloud_for_reasoning_enabled=True,
            ai_privacy_strict_local=False,
        )
    )
    decision = policy.decide(
        RoutingDecisionRequest(
            task_type="analyze_scenario",
            cloud_permitted=True,
            provider_states=[_local_state(available=False), _cloud_state()],
        )
    )

    assert decision.selected_provider == "openai"
    assert decision.fallback_allowed is True


def test_local_unavailable_does_not_use_cloud_when_fallback_disabled():
    policy = HybridRoutingPolicy(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_cloud_fallback_enabled=False,
            ai_cloud_for_reasoning_enabled=False,
        )
    )
    decision = policy.decide(
        RoutingDecisionRequest(
            task_type="extract_objects",
            cloud_permitted=False,
            provider_states=[_local_state(available=False), _cloud_state()],
        )
    )

    assert decision.selected_provider is None
    assert "no eligible provider" in decision.routing_reason.lower()


def test_unknown_provider_state_fails_safely():
    policy = HybridRoutingPolicy(LocalAISettings(ai_cloud_provider_enabled=True))
    decision = policy.decide(
        RoutingDecisionRequest(
            task_type="analyze_scenario",
            cloud_permitted=True,
            requested_provider="missing-provider",
            provider_states=[_local_state(available=False), _cloud_state(available=False)],
        )
    )

    assert decision.selected_provider is None
    assert "no eligible provider" in decision.routing_reason.lower() or "could not be satisfied" in decision.routing_reason.lower()
