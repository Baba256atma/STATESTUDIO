"""LLM-MVP:4 live allowed proof + exhausted skip. One paid call maximum."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

import pytest

from app.services.nexora_llm.openai_text_adapter import OpenAITextAdapter, openai_api_key_configured
from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore
from tests.test_nexora_llm_live import LIVE_REQUEST

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
def test_live_allowed_then_exhausted_zero_provider_calls(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = _CountingOpenAIAdapter()
    env = {
        "NEXORA_LLM_ENABLED": "true",
        "NEXORA_LLM_USAGE_LIMIT": "1",
        "NEXORA_LLM_USAGE_PERIOD": "daily",
        "NEXORA_LLM_USAGE_SCOPE": "ws_default",
    }
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    allowed = execute_nexora_llm_guarded_runtime(
        {**LIVE_REQUEST, "turnId": "llm-mvp4-live-allowed"},
        adapter,
        timeout_seconds=20,
        environ=env,
        store=store,
        now=now,
    )
    dumped = json.dumps(allowed)
    secret = os.getenv("OPENAI_API_KEY")
    assert secret not in dumped
    assert allowed["status"] == "ok", allowed["failure"]
    assert allowed["policy"]["allowed"] is True
    assert adapter.complete_calls == 1
    exhausted = execute_nexora_llm_guarded_runtime(
        {**LIVE_REQUEST, "turnId": "llm-mvp4-live-exhausted"},
        adapter,
        timeout_seconds=20,
        environ=env,
        store=store,
        now=now,
    )
    assert exhausted["status"] == "skipped"
    assert exhausted["policy"]["reason"] == "ALLOWANCE_EXHAUSTED"
    assert adapter.complete_calls == 1
    evidence = {
        "executed": True,
        "skipped": False,
        "policyReasonAllowed": "ALLOWED",
        "policyReasonExhausted": "ALLOWANCE_EXHAUSTED",
        "provider": allowed["runtime"]["provider"],
        "model": allowed["runtime"]["model"],
        "status": allowed["status"],
        "requestIdPresent": bool(allowed["runtime"]["requestId"]),
        "latencyMs": allowed["runtime"]["latencyMs"],
        "usage": allowed["usage"],
        "cost": allowed["cost"],
        "allowedProviderCalls": 1,
        "exhaustedProviderCalls": 0,
        "totalProviderCalls": adapter.complete_calls,
    }
    Path(__file__).resolve().parents[2].joinpath(
        "frontend/artifacts/LLM-MVP-4/live-evidence.json",
    ).parent.mkdir(parents=True, exist_ok=True)
    Path(__file__).resolve().parents[2].joinpath(
        "frontend/artifacts/LLM-MVP-4/live-evidence.json",
    ).write_text(json.dumps(evidence, indent=2) + "\n")
