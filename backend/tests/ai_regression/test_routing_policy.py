from __future__ import annotations

import pytest

from app.core.config import LocalAISettings
from app.services.ai.privacy_classifier import PrivacyClassifier
from app.services.ai.privacy_types import PrivacyClassificationRequest
from app.services.ai.routing_policy import HybridRoutingPolicy
from app.services.ai.routing_types import RoutingDecisionRequest, RoutingProviderState
from backend.tests.ai_regression.utils import get_case, run_case_result


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


@pytest.mark.regression
@pytest.mark.routing
def test_local_first_routing_behavior_is_preserved():
    case = get_case("safe_public_summarization")
    result = run_case_result(case)

    assert result.routing_passed is True
    assert result.selected_provider == "ollama"


@pytest.mark.regression
@pytest.mark.routing
def test_cloud_fallback_when_local_is_unavailable():
    case = get_case("provider_unavailable_fallback_case")
    result = run_case_result(case)

    assert result.routing_passed is True
    assert result.selected_provider == "openai"


@pytest.mark.regression
@pytest.mark.routing
def test_local_only_enforcement_blocks_cloud_provider():
    settings = LocalAISettings(
        ai_cloud_provider_enabled=True,
        ai_cloud_fallback_enabled=True,
        ai_cloud_for_reasoning_enabled=True,
    )
    classifier = PrivacyClassifier(settings)
    privacy = classifier.classify(
        PrivacyClassificationRequest(
            task_type="explain",
            text="Explain the internal roadmap note.",
            metadata={"local_only": True, "cloud_allowed": True},
        )
    )
    decision = HybridRoutingPolicy(settings).decide(
        RoutingDecisionRequest(
            task_type="explain",
            privacy_sensitive=True,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            local_required=privacy.local_required,
            cloud_allowed=privacy.cloud_allowed,
            classification_reason=privacy.classification_reason,
            provider_states=[_local_state(True), _cloud_state(True)],
            metadata={"local_only": True},
        )
    )

    assert decision.selected_provider == "ollama"
    assert decision.cloud_allowed is False
