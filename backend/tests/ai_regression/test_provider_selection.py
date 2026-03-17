from __future__ import annotations

import pytest

from app.core.config import LocalAISettings
from app.services.ai.providers.exceptions import UnknownProviderError
from app.services.ai.providers.factory import AIProviderFactory


@pytest.mark.regression
@pytest.mark.provider
def test_provider_registry_resolves_correct_provider():
    factory = AIProviderFactory(LocalAISettings())

    provider = factory.get_provider("ollama")

    assert provider.provider_key == "ollama"


@pytest.mark.regression
@pytest.mark.provider
def test_unknown_provider_fails_safely():
    factory = AIProviderFactory(LocalAISettings())

    with pytest.raises(UnknownProviderError):
        factory.get_provider("missing-provider")
