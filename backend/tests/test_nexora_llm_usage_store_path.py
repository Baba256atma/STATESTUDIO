"""HOSTED-MVP:6-DEPLOY:3A — persistent LLM usage-ledger path."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pytest

from app.services.nexora_llm.contracts import NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore, default_usage_store_path


class FakeAdapter:
    provider = "openai"

    def __init__(self) -> None:
        self.calls = 0

    def complete(self, **kwargs: Any) -> dict[str, Any]:
        self.calls += 1
        return {"text": "Optional overlay."}


def request(turn_id: str) -> dict[str, Any]:
    return {
        "turnId": turn_id,
        "deterministicResponse": "Focused on Capacity.",
        "experienceStatus": "applied",
        "managementContext": {
            "identity": NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY,
            "subject": {"canonicalId": None, "label": None, "kind": None, "epistemic": None},
            "referent": {"canonicalId": None, "provenance": None},
            "management": {"projection": None, "refs": []},
            "dataReality": {"projections": [], "refs": []},
            "conversation": {
                "projection": "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
                "currentUtterance": "What is capacity?",
                "previousUtterance": None,
                "frames": [],
            },
            "evidence": {"refs": []},
            "scenario": {"refs": []},
            "decision": {"refs": []},
        },
    }


ENABLED = {
    "NEXORA_LLM_ENABLED": "true",
    "NEXORA_LLM_USAGE_LIMIT": "5",
    "NEXORA_LLM_USAGE_PERIOD": "daily",
    "NEXORA_LLM_MAX_OUTPUT_TOKENS": "64",
    "NEXORA_LLM_MAX_REQUEST_USD": "0.01",
    "NEXORA_LLM_LEDGER_INITIALIZE": "true",
}
SCOPE = "hosted:dev:user_a:ws_companyAcompanyAcompanyA"
NOW = datetime(2026, 10, 18, tzinfo=timezone.utc)


def test_local_default_path_is_unchanged() -> None:
    path = default_usage_store_path({})
    assert path == Path(__file__).resolve().parents[1] / "data" / "nexora_llm" / "usage.json"


def test_explicit_path_writes_reads_and_creates_parent(tmp_path: Path, monkeypatch: Any) -> None:
    path = tmp_path / "persistent" / "nexora_llm" / "usage.json"
    monkeypatch.delenv("NEXORA_DEPLOYMENT_MODE", raising=False)
    monkeypatch.setenv("NEXORA_LLM_USAGE_STORE_PATH", str(path))
    store = NexoraLlmUsageStore()
    reservation = store.try_reserve(scope_id="ws_test", period_key="2026-10-18", turn_id="turn-1", limit=2)

    assert reservation["allowed"] is True
    assert store.path == path
    assert path.is_file()
    assert NexoraLlmUsageStore(path).authorized_attempts(scope_id="ws_test", period_key="2026-10-18") == 1


def test_hosted_configured_usage_survives_store_reconstruction(tmp_path: Path, monkeypatch: Any) -> None:
    path = tmp_path / "var" / "data" / "nexora_llm" / "usage.json"
    monkeypatch.setenv("NEXORA_DEPLOYMENT_MODE", "hosted")
    monkeypatch.setenv("NEXORA_LLM_USAGE_STORE_PATH", str(path))
    first_adapter = FakeAdapter()
    first = execute_nexora_llm_guarded_runtime(
        request("turn-1"), first_adapter, environ=ENABLED, now=NOW, usage_scope=SCOPE
    )
    second_adapter = FakeAdapter()
    second = execute_nexora_llm_guarded_runtime(
        request("turn-1"), second_adapter, environ=ENABLED, now=NOW, usage_scope=SCOPE
    )

    assert first["policy"]["dispatched"] is True
    assert first_adapter.calls == 1
    assert second["policy"]["reason"] == "POLICY_DECLINED"
    assert second_adapter.calls == 0
    assert NexoraLlmUsageStore().path == path


@pytest.mark.parametrize("configured", [None, "", "relative/usage.json"])
def test_hosted_missing_empty_or_relative_path_fails_closed(
    configured: str | None, monkeypatch: Any
) -> None:
    monkeypatch.setenv("NEXORA_DEPLOYMENT_MODE", "hosted")
    if configured is None:
        monkeypatch.delenv("NEXORA_LLM_USAGE_STORE_PATH", raising=False)
    else:
        monkeypatch.setenv("NEXORA_LLM_USAGE_STORE_PATH", configured)
    adapter = FakeAdapter()

    result = execute_nexora_llm_guarded_runtime(
        request("turn-closed"), adapter, environ=ENABLED, now=NOW, usage_scope=SCOPE
    )

    assert result["policy"]["reason"] == "USAGE_UNAVAILABLE"
    assert adapter.calls == 0
    with pytest.raises(ValueError):
        default_usage_store_path(
            {
                "NEXORA_DEPLOYMENT_MODE": "hosted",
                **({} if configured is None else {"NEXORA_LLM_USAGE_STORE_PATH": configured}),
            }
        )


def test_hosted_unusable_path_fails_closed(tmp_path: Path, monkeypatch: Any) -> None:
    unusable = tmp_path / "usage-directory"
    unusable.mkdir()
    monkeypatch.setenv("NEXORA_DEPLOYMENT_MODE", "hosted")
    monkeypatch.setenv("NEXORA_LLM_USAGE_STORE_PATH", str(unusable))
    adapter = FakeAdapter()

    result = execute_nexora_llm_guarded_runtime(
        request("turn-unusable"), adapter, environ=ENABLED, now=NOW, usage_scope=SCOPE
    )

    assert result["policy"]["reason"] == "LEDGER_PERSISTENCE_FAILED"
    assert adapter.calls == 0
