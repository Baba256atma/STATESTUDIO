from __future__ import annotations

import json
from typing import Any

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routes.nexora_llm import router
from app.services.nexora_llm.contracts import (
    AdapterError,
    NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY,
    NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION,
)
from app.services.nexora_llm.openai_text_adapter import (
    OpenAITextAdapter,
    classify_openai_error,
)
from app.services.nexora_llm.runtime import execute_nexora_llm_runtime


def fixture_request(**overrides: Any) -> dict[str, Any]:
    request = {
        "turnId": "turn-runtime-1",
        "deterministicResponse": "Focused on Capacity.",
        "experienceStatus": "applied",
        "managementContext": {
            "identity": NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY,
            "subject": {
                "canonicalId": "obj-capacity",
                "label": "Capacity",
                "kind": "object",
                "epistemic": None,
            },
            "referent": {"canonicalId": "obj-capacity", "provenance": None},
            "management": {"projection": None, "refs": []},
            "dataReality": {"projections": [], "refs": []},
            "conversation": {
                "projection": "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
                "currentUtterance": "Focus on Capacity",
                "previousUtterance": None,
                "frames": [],
            },
            "evidence": {"refs": []},
            "scenario": {"refs": []},
            "decision": {"refs": []},
        },
    }
    request.update(overrides)
    return request


class FakeAdapter:
    provider = "openai"

    def __init__(self, completion: dict[str, Any] | None = None, error: Exception | None = None) -> None:
        self.completion = completion or {"text": "Optional overlay."}
        self.error = error
        self.calls: list[dict[str, Any]] = []

    def complete(self, *, system_instruction: str, user_payload: str, timeout_seconds: float) -> dict[str, Any]:
        self.calls.append(
            {
                "system_instruction": system_instruction,
                "user_payload": user_payload,
                "timeout_seconds": timeout_seconds,
            }
        )
        if self.error is not None:
            raise self.error
        return self.completion


def test_a_request_normalization_reaches_adapter() -> None:
    adapter = FakeAdapter()
    request = fixture_request()
    execute_nexora_llm_runtime(request, adapter)
    assert adapter.calls
    call = adapter.calls[0]
    assert call["system_instruction"] == NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION
    assert call["timeout_seconds"] == 8.0
    payload = json.loads(call["user_payload"])
    assert payload["turnId"] == "turn-runtime-1"
    assert payload["deterministicResponse"] == "Focused on Capacity."
    assert payload["managementContext"]["identity"] == NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
    assert "OPENAI_API_KEY" not in call["user_payload"]


def test_b_success_normalization() -> None:
    result = execute_nexora_llm_runtime(
        fixture_request(),
        FakeAdapter(
            {
                "text": "  Optional overlay.  ",
                "provider": "openai",
                "model": "gpt-4o-mini",
                "requestId": "resp_123",
            }
        ),
    )
    assert result["status"] == "ok"
    assert result["contribution"] == "Optional overlay."
    assert result["failure"] is None
    assert result["runtime"]["provider"] == "openai"
    assert result["runtime"]["model"] == "gpt-4o-mini"
    assert result["runtime"]["requestId"] == "resp_123"


def test_c_usage_normalization() -> None:
    reported = execute_nexora_llm_runtime(
        fixture_request(),
        FakeAdapter(
            {
                "text": "ok",
                "usage": {"inputTokens": 11, "outputTokens": 7, "totalTokens": 18},
            }
        ),
    )
    assert reported["usage"] == {"inputTokens": 11, "outputTokens": 7, "totalTokens": 18}
    missing = execute_nexora_llm_runtime(fixture_request(), FakeAdapter({"text": "ok"}))
    assert missing["usage"] == {"inputTokens": None, "outputTokens": None, "totalTokens": None}
    assert missing["cost"] is None


def test_d_runtime_metadata() -> None:
    result = execute_nexora_llm_runtime(
        fixture_request(),
        FakeAdapter({"text": "ok", "model": "gpt-4o-mini", "requestId": "req_meta"}),
    )
    assert result["runtime"]["provider"] == "openai"
    assert result["runtime"]["model"] == "gpt-4o-mini"
    assert result["runtime"]["requestId"] == "req_meta"
    assert result["runtime"]["latencyMs"] is not None and result["runtime"]["latencyMs"] >= 0


def test_e_invalid_provider_response() -> None:
    result = execute_nexora_llm_runtime(
        fixture_request(),
        FakeAdapter({"text": {"reply": "nope", "actions": []}}),
    )
    assert result["status"] == "failed"
    assert result["contribution"] is None
    assert result["failure"]["category"] == "INVALID_RESPONSE"


def test_f_empty_response() -> None:
    result = execute_nexora_llm_runtime(fixture_request(), FakeAdapter({"text": "  "}))
    assert result["failure"]["category"] == "EMPTY_RESPONSE"
    assert result["contribution"] is None


def test_g_provider_error() -> None:
    result = execute_nexora_llm_runtime(
        fixture_request(),
        FakeAdapter(error=AdapterError("PROVIDER_ERROR", "upstream")),
    )
    assert result["failure"]["category"] == "PROVIDER_ERROR"


def test_h_timeout() -> None:
    result = execute_nexora_llm_runtime(
        fixture_request(),
        FakeAdapter(error=AdapterError("TIMEOUT", "deadline")),
    )
    assert result["failure"]["category"] == "TIMEOUT"


def test_i_no_secret_leakage_in_http_contract(monkeypatch: Any) -> None:
    monkeypatch.setenv("NEXORA_LLM_ENABLED", "false")
    app = FastAPI()
    app.include_router(router)
    client = TestClient(app)

    class SecretAdapter(FakeAdapter):
        def complete(self, **kwargs: Any) -> dict[str, Any]:
            super().complete(**kwargs)
            return {"text": "ok", "requestId": "resp_no_secret"}

    from app.services.nexora_llm import runtime as runtime_mod

    original = runtime_mod.configured_adapter
    runtime_mod.configured_adapter = lambda: SecretAdapter()  # type: ignore[assignment]
    try:
        response = client.post(
            "/nexora/llm/runtime",
            json={
                **fixture_request(),
                "apiKey": "sk-secret-must-not-round-trip",
                "OPENAI_API_KEY": "sk-secret-must-not-round-trip",
                "remainingQuota": 999999,
            },
        )
    finally:
        runtime_mod.configured_adapter = original  # type: ignore[assignment]
    assert response.status_code == 200
    body = response.json()
    dumped = json.dumps(body)
    assert "sk-secret" not in dumped
    assert "OPENAI_API_KEY" not in dumped
    assert "apiKey" not in dumped
    assert body["status"] == "skipped"
    assert body["contribution"] is None
    assert body["policy"]["reason"] == "LLM_DISABLED"


def test_not_configured_without_adapter(monkeypatch: Any) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    result = execute_nexora_llm_runtime(fixture_request(), None)
    assert result["failure"] is not None
    assert result["failure"]["category"] == "NOT_CONFIGURED"


def test_openai_adapter_maps_native_response_and_errors() -> None:
    class Usage:
        input_tokens = 3
        output_tokens = 5
        total_tokens = 8

    class Response:
        output_text = "Live overlay"
        id = "resp_live"
        model = "gpt-4o-mini"
        usage = Usage()

    class Client:
        class Responses:
            def create(self, **kwargs: Any) -> Response:
                assert kwargs["timeout"] == 8.0
                assert kwargs["model"] == "gpt-4o-mini"
                assert kwargs["input"][0]["role"] == "system"
                return Response()

        responses = Responses()

    adapter = OpenAITextAdapter(client_factory=lambda: Client(), api_key="unused-in-factory")
    completion = adapter.complete(
        system_instruction="sys",
        user_payload="user",
        timeout_seconds=8.0,
    )
    assert completion["text"] == "Live overlay"
    assert completion["usage"]["inputTokens"] == 3
    assert completion["requestId"] == "resp_live"

    class Auth(Exception):
        status_code = 401

    Auth.__name__ = "AuthenticationError"
    mapped = classify_openai_error(Auth("nope"))
    assert mapped.category == "AUTH_ERROR"


def test_openai_adapter_not_configured_without_key(monkeypatch: Any) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    adapter = OpenAITextAdapter()
    try:
        adapter.complete(system_instruction="s", user_payload="u", timeout_seconds=1)
        raise AssertionError("expected AdapterError")
    except AdapterError as exc:
        assert exc.category == "NOT_CONFIGURED"
