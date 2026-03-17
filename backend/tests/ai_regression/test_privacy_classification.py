from __future__ import annotations

import pytest

from app.core.config import LocalAISettings
from app.schemas.privacy import PrivacyClassificationRequest
from app.services.ai.privacy_classifier import PrivacyClassifier


@pytest.mark.regression
@pytest.mark.privacy
def test_confidential_data_blocks_cloud_routing():
    classifier = PrivacyClassifier(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_classification_strict_mode=True,
        )
    )

    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="analyze_scenario",
            text="Analyze payroll exposure and revenue forecast variance.",
            metadata={"cloud_allowed": True},
        )
    )

    assert result.sensitivity_level == "confidential"
    assert result.cloud_allowed is False


@pytest.mark.regression
@pytest.mark.privacy
def test_public_data_allows_cloud_routing_when_enabled():
    classifier = PrivacyClassifier(
        LocalAISettings(
            ai_cloud_provider_enabled=True,
            ai_classification_strict_mode=False,
        )
    )

    result = classifier.classify(
        PrivacyClassificationRequest(
            task_type="explain",
            text="Explain the public release timeline.",
            metadata={"cloud_allowed": True},
        )
    )

    assert result.sensitivity_level == "public"
    assert result.cloud_allowed is True
