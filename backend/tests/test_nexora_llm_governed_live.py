"""LLM-MVP:5 live Phase-4 → Phase-3 proof. Governance of L is applied in TS."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

import pytest

from app.services.nexora_llm.contracts import NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
from app.services.nexora_llm.openai_text_adapter import OpenAITextAdapter, openai_api_key_configured
from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore

try:
    from dotenv import load_dotenv
except Exception:  # pragma: no cover
    load_dotenv = None

if load_dotenv:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")

LIVE_REQUEST = {
    "turnId": "llm-mvp5-live-capacity",
    "deterministicResponse": (
        "Capacity remains the active constraint. "
        "Scenario A and Scenario B are available for comparison."
    ),
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
        "management": {
            "projection": None,
            "refs": [
                {
                    "id": "obj-capacity",
                    "kind": "object",
                    "label": "Capacity",
                    "value": "constrained",
                    "provenanceId": "nmi-capacity",
                    "epistemic": "known",
                }
            ],
        },
        "dataReality": {
            "projections": ["catalog-primaryValue"],
            "refs": [
                {
                    "id": "obj-delivery",
                    "kind": "object",
                    "label": "Delivery",
                    "value": "elevated pressure",
                    "provenanceId": "dr-delivery",
                    "epistemic": "known",
                }
            ],
        },
        "conversation": {
            "projection": "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
            "currentUtterance": "Explain the Capacity constraint and the available scenarios.",
            "previousUtterance": None,
            "frames": [],
        },
        "evidence": {"refs": []},
        "scenario": {
            "refs": [
                {
                    "id": "scn-a",
                    "kind": "scenario",
                    "label": "Overtime",
                    "value": "overtime may respond faster; subcontracting may preserve internal capacity",
                    "provenanceId": "scn-a",
                    "epistemic": "draft",
                }
            ]
        },
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
def test_live_guarded_provider_contribution_for_phase5_governance(tmp_path: Path) -> None:
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
        LIVE_REQUEST,
        adapter,
        timeout_seconds=20,
        environ=env,
        store=store,
        now=now,
    )
    dumped = json.dumps(allowed)
    secret = os.getenv("OPENAI_API_KEY")
    assert secret not in dumped
    assert "OPENAI_API_KEY" not in dumped
    assert allowed["status"] == "ok", allowed["failure"]
    assert allowed["policy"]["allowed"] is True
    assert adapter.complete_calls == 1
    contribution = allowed["contribution"]
    assert isinstance(contribution, str) and contribution.strip()
    evidence = {
        "executed": True,
        "deterministicResponse": LIVE_REQUEST["deterministicResponse"],
        "contribution": contribution,
        "policyReason": allowed["policy"]["reason"],
        "provider": allowed["runtime"]["provider"],
        "model": allowed["runtime"]["model"],
        "status": allowed["status"],
        "providerCalls": adapter.complete_calls,
        "usage": allowed["usage"],
        "cost": allowed["cost"],
        "latencyMs": allowed["runtime"]["latencyMs"],
        "managementContext": LIVE_REQUEST["managementContext"],
    }
    out = Path(__file__).resolve().parents[2].joinpath(
        "frontend/artifacts/LLM-MVP-5/live-provider.json",
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(evidence, indent=2) + "\n")
