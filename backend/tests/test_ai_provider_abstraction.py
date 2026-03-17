from __future__ import annotations

import asyncio
import json

import pytest

from app.core.config import LocalAISettings
from app.schemas.ai import LocalAIAnalyzeRequest
from app.services.ai.orchestrator import LocalAIOrchestrator
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.exceptions import UnknownProviderError
from app.services.ai.providers.factory import AIProviderFactory
from app.services.ai.providers.ollama_provider import OllamaProvider
from app.services.ai.providers.types import (
    ProviderChatRequest,
    ProviderChatResponse,
    ProviderDescriptor,
    ProviderHealthStatus,
    ProviderModelInfo,
    ProviderModelList,
)


class FakeProvider(AIProvider):
    def __init__(self) -> None:
        self.chat_calls: list[ProviderChatRequest] = []

    @property
    def provider_key(self) -> str:
        return "fake-provider"

    @property
    def default_model(self) -> str | None:
        return "fake-model"

    def describe(self) -> ProviderDescriptor:
        return ProviderDescriptor(
            key=self.provider_key,
            kind="local",
            enabled=True,
            configured=True,
            default_model=self.default_model,
            base_url="http://fake-provider.local",
        )

    async def health_check(self) -> ProviderHealthStatus:
        return ProviderHealthStatus(
            provider=self.provider_key,
            available=True,
            base_url="http://fake-provider.local",
            default_model=self.default_model,
        )

    async def list_models(self) -> ProviderModelList:
        return ProviderModelList(
            provider=self.provider_key,
            models=[ProviderModelInfo(name="fake-model", provider=self.provider_key)],
        )

    async def chat_json(self, request: ProviderChatRequest) -> ProviderChatResponse:
        self.chat_calls.append(request)
        payload = {"summary": "Provider abstraction works.", "risk_signals": [], "object_candidates": []}
        return ProviderChatResponse(
            ok=True,
            provider=self.provider_key,
            model=request.model or "fake-model",
            raw_model=request.model or "fake-model",
            output=json.dumps(payload),
            data=payload,
            latency_ms=8.5,
            error=None,
            metadata={"trace_id": request.trace_id},
        )


class FakeHTTPResponse:
    def __init__(self, status_code: int, payload: dict) -> None:
        self.status_code = status_code
        self._payload = payload
        self.content = json.dumps(payload).encode("utf-8")

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise RuntimeError("unexpected_status")

    def json(self) -> dict:
        return self._payload


class FakeAsyncClient:
    def __init__(self, responses: list[FakeHTTPResponse]) -> None:
        self._responses = list(responses)

    async def request(self, method: str, path: str, json=None):
        return self._responses.pop(0)

    async def aclose(self) -> None:
        return None


def test_provider_registry_resolves_correct_provider():
    factory = AIProviderFactory(LocalAISettings())
    provider = factory.get_provider("ollama")
    assert provider.provider_key == "ollama"


def test_unknown_provider_fails_safely():
    factory = AIProviderFactory(LocalAISettings())
    with pytest.raises(UnknownProviderError):
        factory.get_provider("missing-provider")


def test_default_provider_fallback_uses_local_provider_safely():
    factory = AIProviderFactory(
        LocalAISettings(
            ai_provider_default="openai",
            ai_provider_fallback="ollama",
            ai_cloud_provider_enabled=False,
            ollama_default_model="llama3.2:3b",
        )
    )
    provider = factory.get_default_provider()
    assert provider.provider_key == "ollama"


def test_orchestrator_uses_provider_abstraction_instead_of_direct_ollama_coupling():
    provider = FakeProvider()
    orchestrator = LocalAIOrchestrator(
        settings=LocalAISettings(ollama_default_model="fake-model"),
        provider=provider,
    )

    response = asyncio.run(
        orchestrator.analyze_local(
            LocalAIAnalyzeRequest(
                text="Analyze a local provider abstraction scenario.",
                metadata={"task": "analyze_scenario"},
            )
        )
    )

    assert response.ok is True
    assert response.provider == "fake-provider"
    assert provider.chat_calls
    assert response.metadata["selected_provider"] == "fake-provider"


def test_ollama_provider_behaves_as_expected():
    http_client = FakeAsyncClient(
        [
            FakeHTTPResponse(
                200,
                {
                    "models": [
                        {
                            "name": "llama3.2:3b",
                            "size": "3b",
                            "details": {"family": "llama"},
                        }
                    ]
                },
            )
        ]
    )
    provider = OllamaProvider(settings=LocalAISettings(), http_client=http_client)

    result = asyncio.run(provider.list_models())

    assert result.ok is True
    assert result.provider == "ollama"
    assert result.models[0].name == "llama3.2:3b"
