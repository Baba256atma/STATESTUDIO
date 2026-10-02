"""LLM-MVP:3 live OpenAI proof. Skips when the server credential is absent."""

from __future__ import annotations

import json
import os
from pathlib import Path

import pytest

from app.services.nexora_llm.contracts import NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
from app.services.nexora_llm.openai_text_adapter import OpenAITextAdapter, openai_api_key_configured
from app.services.nexora_llm.runtime import execute_nexora_llm_runtime

try:
    from dotenv import load_dotenv
except Exception:  # pragma: no cover
    load_dotenv = None

if load_dotenv:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")


LIVE_REQUEST = {
    "turnId": "llm-mvp3-live-capacity",
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
        "referent": {"canonicalId": "obj-capacity", "provenance": "test-fixture"},
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


class _CountingOpenAIAdapter(OpenAITextAdapter):
    def __init__(self) -> None:
        super().__init__()
        self.complete_calls = 0

    def complete(self, **kwargs):  # type: ignore[no-untyped-def]
        self.complete_calls += 1
        return super().complete(**kwargs)


@pytest.mark.skipif(not openai_api_key_configured(), reason="OPENAI_API_KEY is not configured")
def test_live_openai_adapter_returns_normalized_contribution() -> None:
    adapter = _CountingOpenAIAdapter()
    result = execute_nexora_llm_runtime(LIVE_REQUEST, adapter, timeout_seconds=20)
    dumped = json.dumps(result)
    secret = os.getenv("OPENAI_API_KEY")
    assert secret not in dumped
    assert "OPENAI_API_KEY" not in dumped
    assert result["status"] == "ok", result["failure"]
    assert result["failure"] is None
    assert isinstance(result["contribution"], str) and result["contribution"].strip()
    assert result["runtime"]["provider"] == "openai"
    assert isinstance(result["runtime"]["model"], str) and result["runtime"]["model"]
    assert isinstance(result["runtime"]["requestId"], str) and result["runtime"]["requestId"]
    assert result["runtime"]["latencyMs"] is not None and result["runtime"]["latencyMs"] > 0
    usage = result["usage"]
    assert set(usage) == {"inputTokens", "outputTokens", "totalTokens"}
    for value in usage.values():
        assert value is None or isinstance(value, int)
    assert adapter.complete_calls == 1
    evidence = {
        "executed": True,
        "skipped": False,
        "status": result["status"],
        "provider": result["runtime"]["provider"],
        "model": result["runtime"]["model"],
        "requestIdPresent": bool(result["runtime"]["requestId"]),
        "latencyMs": result["runtime"]["latencyMs"],
        "contributionNonEmpty": True,
        "contributionEqualsDeterministicResponse": result["contribution"]
        == LIVE_REQUEST["deterministicResponse"],
        "usage": usage,
        "cost": result["cost"],
        "providerCompleteCalls": adapter.complete_calls,
    }
    Path(__file__).resolve().parents[2].joinpath(
        "frontend/artifacts/LLM-MVP-3-R1/live-evidence.json",
    ).write_text(json.dumps(evidence, indent=2) + "\n")
