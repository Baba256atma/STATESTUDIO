from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routes.nexora_llm import router
from app.services.nexora_llm.contracts import AdapterError, NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime
from app.services.nexora_llm.usage_policy import load_usage_policy_config, period_key
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore


def fixture_request(turn_id: str = "turn-usage-1", **overrides: Any) -> dict[str, Any]:
    request = {
        "turnId": turn_id,
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
        self.calls = 0

    def complete(self, **kwargs: Any) -> dict[str, Any]:
        self.calls += 1
        if self.error is not None:
            raise self.error
        return self.completion


ENABLED = {
    "NEXORA_LLM_ENABLED": "true",
    "NEXORA_LLM_USAGE_LIMIT": "2",
    "NEXORA_LLM_USAGE_PERIOD": "daily",
    "NEXORA_LLM_USAGE_SCOPE": "ws_default",
}


def test_a_enabled_with_allowance_allows(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    result = execute_nexora_llm_guarded_runtime(
        fixture_request(),
        adapter,
        environ=ENABLED,
        store=store,
        now=datetime(2026, 10, 1, tzinfo=timezone.utc),
    )
    assert result["policy"]["allowed"] is True
    assert result["policy"]["reason"] == "ALLOWED"
    assert result["status"] == "ok"
    assert adapter.calls == 1
    assert result["contribution"] == "Optional overlay."


def test_b_disabled_skips_provider(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    result = execute_nexora_llm_guarded_runtime(
        fixture_request(),
        adapter,
        environ={"NEXORA_LLM_ENABLED": "false"},
        store=store,
    )
    assert result["status"] == "skipped"
    assert result["policy"]["reason"] == "LLM_DISABLED"
    assert adapter.calls == 0
    assert result["contribution"] is None


def test_c_allowance_exhausted_skips(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    env = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "1"}
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    first = execute_nexora_llm_guarded_runtime(
        fixture_request("t1"), adapter, environ=env, store=store, now=now
    )
    second = execute_nexora_llm_guarded_runtime(
        fixture_request("t2"), adapter, environ=env, store=store, now=now
    )
    assert first["status"] == "ok"
    assert second["status"] == "skipped"
    assert second["policy"]["reason"] == "ALLOWANCE_EXHAUSTED"
    assert adapter.calls == 1


def test_d_missing_and_malformed_config_fail_closed(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    missing = execute_nexora_llm_guarded_runtime(fixture_request(), adapter, environ={}, store=store)
    assert missing["policy"]["reason"] == "LLM_DISABLED"
    assert adapter.calls == 0
    malformed = execute_nexora_llm_guarded_runtime(
        fixture_request("t-mal"),
        adapter,
        environ={"NEXORA_LLM_ENABLED": "true", "NEXORA_LLM_USAGE_LIMIT": "nope"},
        store=store,
    )
    assert malformed["policy"]["reason"] == "CONFIGURATION_ERROR"
    assert adapter.calls == 0


def test_e_new_period_resets_allowance(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    env = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "1"}
    day1 = execute_nexora_llm_guarded_runtime(
        fixture_request("d1"),
        adapter,
        environ=env,
        store=store,
        now=datetime(2026, 10, 1, tzinfo=timezone.utc),
    )
    day2 = execute_nexora_llm_guarded_runtime(
        fixture_request("d2"),
        adapter,
        environ=env,
        store=store,
        now=datetime(2026, 10, 2, tzinfo=timezone.utc),
    )
    assert day1["status"] == "ok"
    assert day2["status"] == "ok"
    assert adapter.calls == 2
    assert period_key("daily", datetime(2026, 10, 1, tzinfo=timezone.utc)) == "2026-10-01"
    assert period_key("daily", datetime(2026, 10, 2, tzinfo=timezone.utc)) == "2026-10-02"


def test_f_client_quota_cannot_override(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    result = execute_nexora_llm_guarded_runtime(
        fixture_request(remainingQuota=999999, llmAllowed=True, usageCount=0),
        adapter,
        environ={"NEXORA_LLM_ENABLED": "false"},
        store=store,
    )
    assert result["policy"]["reason"] == "LLM_DISABLED"
    assert adapter.calls == 0


def test_g_successful_call_meters_usage(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter(
        {
            "text": "ok",
            "model": "gpt-4o-mini",
            "usage": {"inputTokens": 11, "outputTokens": 7, "totalTokens": 18},
        }
    )
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    execute_nexora_llm_guarded_runtime(
        fixture_request(), adapter, environ=ENABLED, store=store, now=now
    )
    records = store.records(scope_id="ws_default", period_key="2026-10-01")
    assert len(records) == 1
    assert records[0]["usage"] == {"inputTokens": 11, "outputTokens": 7, "totalTokens": 18}
    assert "Focused on Capacity" not in json.dumps(records)
    assert "managementContext" not in json.dumps(records)


def test_h_null_tokens_stay_null(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter({"text": "ok"})
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    execute_nexora_llm_guarded_runtime(
        fixture_request(), adapter, environ=ENABLED, store=store, now=now
    )
    record = store.records(scope_id="ws_default", period_key="2026-10-01")[0]
    assert record["usage"] == {"inputTokens": None, "outputTokens": None, "totalTokens": None}


def test_i_provider_failure_after_dispatch_still_counts(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter(error=AdapterError("PROVIDER_ERROR", "upstream"))
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    env = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "1"}
    failed = execute_nexora_llm_guarded_runtime(
        fixture_request("fail"), adapter, environ=env, store=store, now=now
    )
    skipped = execute_nexora_llm_guarded_runtime(
        fixture_request("next"), adapter, environ=env, store=store, now=now
    )
    assert failed["status"] == "failed"
    assert failed["failure"]["category"] == "PROVIDER_ERROR"
    assert adapter.calls == 1
    assert store.authorized_attempts(scope_id="ws_default", period_key="2026-10-01") == 1
    assert skipped["policy"]["reason"] == "ALLOWANCE_EXHAUSTED"


def test_j_pre_dispatch_failure_releases_reservation(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    env = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "1"}
    bad = execute_nexora_llm_guarded_runtime(
        {"turnId": "bad", "deterministicResponse": "D", "experienceStatus": "applied", "managementContext": {}},
        adapter,
        environ=env,
        store=store,
        now=now,
    )
    assert bad["status"] == "failed"
    assert adapter.calls == 0
    assert store.authorized_attempts(scope_id="ws_default", period_key="2026-10-01") == 0
    ok = execute_nexora_llm_guarded_runtime(
        fixture_request("ok"), adapter, environ=env, store=store, now=now
    )
    assert ok["status"] == "ok"
    assert adapter.calls == 1


def test_k_skipped_request_is_not_provider_usage(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    execute_nexora_llm_guarded_runtime(
        fixture_request(), adapter, environ={"NEXORA_LLM_ENABLED": "false"}, store=store
    )
    assert store.records(scope_id="ws_default", period_key="2026-10-01") == []
    assert adapter.calls == 0


def test_l_duplicate_settlement_does_not_double_count(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)
    env = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "5"}
    first = execute_nexora_llm_guarded_runtime(
        fixture_request("same"), adapter, environ=env, store=store, now=now
    )
    second = execute_nexora_llm_guarded_runtime(
        fixture_request("same"), adapter, environ=env, store=store, now=now
    )
    assert first["status"] == "ok"
    assert second["status"] == "skipped"
    assert second["policy"]["reason"] == "POLICY_DECLINED"
    assert adapter.calls == 1
    assert store.authorized_attempts(scope_id="ws_default", period_key="2026-10-01") == 1
    assert len(store.records(scope_id="ws_default", period_key="2026-10-01")) == 1


def test_m_last_allowance_concurrency(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    env = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "1"}
    now = datetime(2026, 10, 1, tzinfo=timezone.utc)

    def run(turn: str) -> dict[str, Any]:
        return execute_nexora_llm_guarded_runtime(
            fixture_request(turn), adapter, environ=env, store=store, now=now
        )

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(run, ["c1", "c2"]))
    allowed = [item for item in results if item["status"] == "ok"]
    skipped = [item for item in results if item["status"] == "skipped"]
    assert len(allowed) == 1
    assert len(skipped) == 1
    assert adapter.calls == 1
    assert store.authorized_attempts(scope_id="ws_default", period_key="2026-10-01") == 1


def test_http_endpoint_enforces_policy_and_ignores_client_quota(tmp_path: Path, monkeypatch: Any) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    monkeypatch.setenv("NEXORA_LLM_ENABLED", "false")
    monkeypatch.setattr(
        "app.services.nexora_llm.usage_guard.NexoraLlmUsageStore",
        lambda path=None: store,
    )
    monkeypatch.setattr("app.services.nexora_llm.usage_guard.configured_adapter", lambda: adapter)
    app = FastAPI()
    app.include_router(router)
    client = TestClient(app)
    response = client.post(
        "/nexora/llm/runtime",
        json={**fixture_request(), "remainingQuota": 999999, "llmAllowed": True},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "skipped"
    assert body["policy"]["reason"] == "LLM_DISABLED"
    assert adapter.calls == 0
    assert "OPENAI_API_KEY" not in json.dumps(body)


def test_config_safe_default() -> None:
    config = load_usage_policy_config({})
    assert config.enabled is False
    assert config.valid is True
