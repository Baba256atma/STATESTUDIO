"""HOSTED-MVP:5 — hosted rate, budget, concurrency, retention, and payload gates."""

from __future__ import annotations

import json
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from app.services.nexora_llm.contracts import AdapterError, NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore

NOW = datetime(2026, 10, 16, 12, 0, tzinfo=timezone.utc)
SCOPE_A = "hosted:dev:user_a:ws_companyAcompanyAcompanyA"
SCOPE_P = "hosted:dev:user_a:ws_projectAprojectAprojectA"
SCOPE_B = "hosted:dev:user_b:ws_companyBcompanyBcompanyB"
ENABLED = {
    "NEXORA_LLM_ENABLED": "true",
    "NEXORA_LLM_USAGE_LIMIT": "5",
    "NEXORA_LLM_USAGE_PERIOD": "daily",
    "NEXORA_LLM_USER_RATE_LIMIT": "4",
    "NEXORA_LLM_WORKSPACE_RATE_LIMIT": "3",
    "NEXORA_LLM_RATE_WINDOW_SECONDS": "60",
    "NEXORA_LLM_BURST_LIMIT": "2",
    "NEXORA_LLM_BURST_WINDOW_SECONDS": "10",
    "NEXORA_LLM_USER_CONCURRENCY": "1",
    "NEXORA_LLM_WORKSPACE_CONCURRENCY": "1",
    "NEXORA_LLM_USER_USAGE_LIMIT": "5",
    "NEXORA_LLM_USER_BUDGET_USD": "0.03",
    "NEXORA_LLM_WORKSPACE_BUDGET_USD": "0.02",
    "NEXORA_LLM_REQUEST_COST_FLOOR_USD": "0.01",
    "NEXORA_LLM_USAGE_RETENTION_DAYS": "30",
    "NEXORA_LLM_TIMEOUT_SECONDS": "8",
}


def request(turn_id: str, **overrides: Any) -> dict[str, Any]:
    body = {
        "turnId": turn_id,
        "deterministicResponse": "Capacity is the focus.",
        "experienceStatus": "applied",
        "managementContext": {
            "identity": NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY,
            "subject": {"canonicalId": None, "label": None, "kind": None, "epistemic": None},
            "referent": {"canonicalId": None, "provenance": None},
            "management": {"projection": None, "refs": []},
            "dataReality": {"projections": [], "refs": [{"id": "warehouse.used", "kind": "observation", "label": "Used", "value": "15", "provenanceId": None, "epistemic": "accepted"}]},
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
    body.update(overrides)
    return body


class FakeAdapter:
    provider = "openai"

    def __init__(self, completion: dict[str, Any] | None = None, error: Exception | None = None, hold: threading.Event | None = None) -> None:
        self.completion = completion or {
            "text": "Capacity is stable.",
            "provider": "openai",
            "model": "gpt-4o-mini",
            "usage": {"inputTokens": 10, "outputTokens": 4, "totalTokens": 14},
            "cost": {"amount": 0.01, "currency": "USD"},
        }
        self.error = error
        self.hold = hold
        self.calls = 0
        self.payloads: list[str] = []
        self.started = threading.Event()

    def complete(self, **kwargs: Any) -> dict[str, Any]:
        self.calls += 1
        self.payloads.append(kwargs["user_payload"])
        self.started.set()
        if self.hold is not None:
            self.hold.wait(2)
        if self.error is not None:
            raise self.error
        return self.completion


def run(
    store: NexoraLlmUsageStore,
    adapter: FakeAdapter,
    turn: str,
    scope: str = SCOPE_A,
    body: dict[str, Any] | None = None,
    now: datetime = NOW,
    environ: dict[str, str] | None = None,
):
    return execute_nexora_llm_guarded_runtime(
        body or request(turn),
        adapter,
        environ=environ or ENABLED,
        store=store,
        now=now,
        usage_scope=scope,
    )


def test_rate_burst_budget_and_isolation(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    assert run(store, adapter, "t1").get("policy", {}).get("dispatched") is True
    assert run(store, adapter, "t2", now=NOW + timedelta(seconds=1)).get("policy", {}).get("dispatched") is True
    assert run(store, adapter, "t3", now=NOW + timedelta(seconds=2)).get("policy", {}).get("reason") == "rate_limit_exceeded"
    assert adapter.calls == 2
    later = NOW + timedelta(seconds=11)
    exhausted = run(store, adapter, "t4", now=later)
    assert exhausted.get("policy", {}).get("reason") == "BUDGET_EXHAUSTED"
    isolated = later + timedelta(seconds=11)
    assert run(store, adapter, "t5", scope=SCOPE_P, now=isolated).get("policy", {}).get("dispatched") is True
    assert run(store, adapter, "t6", scope=SCOPE_B, now=isolated).get("policy", {}).get("dispatched") is True
    assert adapter.calls == 4


def test_concurrency_releases_after_completion(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    hold = threading.Event()
    first = FakeAdapter(hold=hold)
    second = FakeAdapter()
    outcome: dict[str, Any] = {}

    def blocked() -> None:
        outcome["first"] = run(store, first, "held")

    worker = threading.Thread(target=blocked)
    worker.start()
    assert first.started.wait(2)
    refused = run(store, second, "extra", now=NOW + timedelta(seconds=1))
    assert refused.get("policy", {}).get("reason") == "concurrency_exceeded"
    assert second.calls == 0
    hold.set()
    worker.join(3)
    assert outcome["first"].get("policy", {}).get("dispatched") is True
    released = run(store, second, "after", now=NOW + timedelta(seconds=20))
    assert released.get("policy", {}).get("dispatched") is True
    assert second.calls == 1


def test_payload_csv_provider_failures_and_retention(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    roomy = {
        **ENABLED,
        "NEXORA_LLM_WORKSPACE_BUDGET_USD": "1",
        "NEXORA_LLM_USER_BUDGET_USD": "1",
        "NEXORA_LLM_BURST_LIMIT": "10",
        "NEXORA_LLM_WORKSPACE_RATE_LIMIT": "20",
        "NEXORA_LLM_USER_RATE_LIMIT": "20",
    }
    huge = request("huge")
    huge["managementContext"]["conversation"]["currentUtterance"] = "x" * 241
    assert run(store, adapter, "huge", body=huge, environ=roomy).get("policy", {}).get("reason") == "payload_too_large"
    csv = request("csv")
    csv["managementContext"]["csvText"] = "Date,Used\n1,2\n"
    assert run(store, adapter, "csv", body=csv, environ=roomy).get("policy", {}).get("reason") == "payload_too_large"
    assert adapter.calls == 0
    timeout = FakeAdapter(error=AdapterError("TIMEOUT", "Provider request timed out."))
    failed = run(store, timeout, "timeout", environ=roomy)
    assert failed.get("status") == "failed"
    assert failed.get("contribution") is None
    invalid = FakeAdapter(completion={"text": None})
    bad = run(store, invalid, "bad", now=NOW + timedelta(seconds=1), environ=roomy)
    assert bad.get("status") == "failed"
    network = FakeAdapter(error=AdapterError("NETWORK_ERROR", "Provider network error."))
    down = run(store, network, "down", now=NOW + timedelta(seconds=2), environ=roomy)
    assert down.get("status") == "failed"
    server = FakeAdapter(error=AdapterError("PROVIDER_ERROR", "Provider error."))
    five = run(store, server, "five", now=NOW + timedelta(seconds=3), environ=roomy)
    assert five.get("status") == "failed"
    assert "sk-" not in json.dumps(five)
    allowed = run(store, adapter, "kept", now=NOW + timedelta(seconds=4), environ=roomy)
    assert allowed.get("policy", {}).get("dispatched") is True
    records = store.records(scope_id=SCOPE_A, period_key="2026-10-16")
    assert records
    assert "currentUtterance" not in json.dumps(records)
    store.prune_expired_details(now=NOW + timedelta(days=31), retention_days=30)
    assert store.records(scope_id=SCOPE_A, period_key="2026-10-16") == []
    assert store.authorized_attempts(scope_id=SCOPE_A, period_key="2026-10-16") >= 1


def test_usage_store_failure_is_closed(tmp_path: Path) -> None:
    class BrokenStore(NexoraLlmUsageStore):
        def admit_rate(self, **kwargs: Any) -> str | None:
            raise OSError("ledger down")

    store = BrokenStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    result = run(store, adapter, "closed")
    assert result.get("policy", {}).get("reason") == "USAGE_UNAVAILABLE"
    assert adapter.calls == 0
