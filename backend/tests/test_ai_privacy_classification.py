from __future__ import annotations

from app.core.config import LocalAISettings
from app.schemas.privacy import PrivacyClassificationRequest
from app.services.ai.privacy_classifier import PrivacyClassifier
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


def test_public_low_risk_request_is_cloud_allowed_when_policy_permits():
    classifier = PrivacyClassifier(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_privacy_classification_enabled=True,
            ai_classification_strict_mode=False,
        )
    )
    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="explain",
            text="Explain the difference between queues and streams.",
            metadata={"cloud_allowed": True},
        )
    )

    assert result.sensitivity_level == "public"
    assert result.cloud_allowed is True


def test_uploaded_content_is_classified_conservatively():
    classifier = PrivacyClassifier(LocalAISettings())
    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="summarize_context",
            text="Summarize the uploaded report.",
            contains_uploaded_content=True,
        )
    )

    assert result.sensitivity_level == "confidential"
    assert result.cloud_allowed is False


def test_confidential_request_requires_local_preference():
    classifier = PrivacyClassifier(LocalAISettings())
    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="analyze_scenario",
            text="Analyze payroll exposure and revenue forecast risks.",
        )
    )

    assert result.sensitivity_level == "confidential"
    assert result.cloud_allowed is False


def test_restricted_request_blocks_cloud_routing():
    classifier = PrivacyClassifier(LocalAISettings(ai_classification_strict_mode=True))
    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="analyze_scenario",
            text="Review SSN and bank account handling issues.",
            metadata={"cloud_allowed": True},
        )
    )

    assert result.sensitivity_level == "restricted"
    assert result.local_required is True
    assert result.cloud_allowed is False


def test_explicit_local_only_metadata_overrides_cloud_policy():
    classifier = PrivacyClassifier(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_classification_strict_mode=False,
        )
    )
    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="explain",
            text="Explain this architecture note.",
            metadata={"local_only": True, "cloud_allowed": True},
        )
    )

    assert result.privacy_mode == "local_only"
    assert result.cloud_allowed is False
    assert result.local_required is True


def test_missing_metadata_falls_back_safely():
    classifier = PrivacyClassifier(LocalAISettings())
    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="analyze_scenario",
            text=None,
        )
    )

    assert result.sensitivity_level == "internal"
    assert result.cloud_allowed is False


def test_hybrid_routing_respects_privacy_classification():
    settings = LocalAISettings(
        ai_cloud_provider_enabled=True,
        ai_cloud_fallback_enabled=True,
        ai_cloud_for_reasoning_enabled=True,
    )
    classifier = PrivacyClassifier(settings)
    classification = classifier.classify(
        PrivacyClassificationRequest(
            task_type="analyze_scenario",
            text="Review uploaded contract and revenue forecast.",
            contains_uploaded_content=True,
        )
    )
    routing_policy = HybridRoutingPolicy(settings)
    decision = routing_policy.decide(
        RoutingDecisionRequest(
            task_type="analyze_scenario",
            privacy_sensitive=classification.sensitivity_level in {"confidential", "restricted"},
            privacy_mode=classification.privacy_mode,
            sensitivity_level=classification.sensitivity_level,
            local_required=classification.local_required,
            cloud_allowed=classification.cloud_allowed,
            classification_reason=classification.classification_reason,
            provider_states=[_local_state(), _cloud_state()],
        )
    )

    assert decision.selected_provider == "ollama"
    assert decision.cloud_allowed is False
