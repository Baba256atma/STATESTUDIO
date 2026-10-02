"""LLM-MVP:FINAL live HTTP proof: Shell path is POST /nexora/llm/runtime."""

from __future__ import annotations

import json
import os
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routes.nexora_llm import router
from app.services.nexora_llm.openai_text_adapter import OpenAITextAdapter, openai_api_key_configured
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore
from tests.test_nexora_llm_governed_live import LIVE_REQUEST

try:
    from dotenv import load_dotenv
except Exception:  # pragma: no cover
    load_dotenv = None

if load_dotenv:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class _CountingOpenAIAdapter(OpenAITextAdapter):
    def __init__(self) -> None:
        super().__init__()
        self.complete_calls = 0

    def complete(self, **kwargs):  # type: ignore[no-untyped-def]
        self.complete_calls += 1
        return super().complete(**kwargs)


@pytest.mark.skipif(not openai_api_key_configured(), reason="OPENAI_API_KEY is not configured")
def test_final_live_http_runtime_is_the_product_seam(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = _CountingOpenAIAdapter()
    monkeypatch.setenv("NEXORA_LLM_ENABLED", "true")
    monkeypatch.setenv("NEXORA_LLM_USAGE_LIMIT", "1")
    monkeypatch.setenv("NEXORA_LLM_USAGE_PERIOD", "daily")
    monkeypatch.setenv("NEXORA_LLM_USAGE_SCOPE", "ws_default")
    monkeypatch.setattr(
        "app.services.nexora_llm.usage_guard.NexoraLlmUsageStore",
        lambda path=None: store,
    )
    monkeypatch.setattr(
        "app.services.nexora_llm.usage_guard.configured_adapter",
        lambda: adapter,
    )
    app = FastAPI()
    app.include_router(router)
    client = TestClient(app)
    response = client.post(
        "/nexora/llm/runtime",
        json={
            **LIVE_REQUEST,
            "turnId": "llm-mvp-final-live",
            "remainingQuota": 999999,
            "llmAllowed": True,
        },
    )
    dumped = response.text
    secret = os.getenv("OPENAI_API_KEY")
    assert secret not in dumped
    assert "OPENAI_API_KEY" not in dumped
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok", body.get("failure")
    assert body["policy"]["reason"] == "ALLOWED"
    assert adapter.complete_calls == 1
    assert isinstance(body["contribution"], str) and body["contribution"].strip()
    evidence = {
        "executed": True,
        "seam": "POST /nexora/llm/runtime",
        "deterministicResponse": LIVE_REQUEST["deterministicResponse"],
        "contribution": body["contribution"],
        "policyReason": body["policy"]["reason"],
        "provider": body["runtime"]["provider"],
        "model": body["runtime"]["model"],
        "requestIdPresent": bool(body["runtime"]["requestId"]),
        "latencyMs": body["runtime"]["latencyMs"],
        "usage": body["usage"],
        "cost": body["cost"],
        "providerCalls": adapter.complete_calls,
        "clientQuotaIgnored": True,
        "managementContext": LIVE_REQUEST["managementContext"],
    }
    out = Path(__file__).resolve().parents[2].joinpath(
        "frontend/artifacts/LLM-MVP-FINAL/live-http.json",
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(evidence, indent=2) + "\n")
