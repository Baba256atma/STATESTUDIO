"""LLM-COST-SECURITY-FIX:1 — ledger fail-closed behavior and reserved cost caps."""

from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.services.nexora_llm.contracts import AdapterError, NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
from app.services.nexora_llm.openai_text_adapter import OpenAITextAdapter
from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime
from app.services.nexora_llm.usage_store import (
    LEDGER_CORRUPTED,
    LEDGER_INTEGRITY_VIOLATION,
    LEDGER_UNAVAILABLE,
    LedgerError,
    NexoraLlmUsageStore,
    USAGE_STORE_IDENTITY,
)

NOW = datetime(2026, 10, 24, tzinfo=timezone.utc)
SCOPE_A = "hosted:dev:user_a:ws_companyAcompanyAcompanyA"
SCOPE_B = "hosted:dev:user_b:ws_companyBcompanyBcompanyB"
ENABLED = {
    "NEXORA_LLM_ENABLED": "true",
    "NEXORA_LLM_USAGE_LIMIT": "4",
    "NEXORA_LLM_USAGE_PERIOD": "daily",
    "NEXORA_LLM_USER_USAGE_LIMIT": "4",
    "NEXORA_LLM_USER_BUDGET_USD": "1",
    "NEXORA_LLM_WORKSPACE_BUDGET_USD": "1",
    "NEXORA_LLM_REQUEST_COST_FLOOR_USD": "0.01",
    "NEXORA_LLM_MAX_OUTPUT_TOKENS": "32",
    "NEXORA_LLM_MAX_REQUEST_USD": "0.01",
    "NEXORA_LLM_USER_CONCURRENCY": "4",
    "NEXORA_LLM_WORKSPACE_CONCURRENCY": "4",
    "NEXORA_LLM_BURST_LIMIT": "10",
    "NEXORA_LLM_USER_RATE_LIMIT": "20",
    "NEXORA_LLM_WORKSPACE_RATE_LIMIT": "20",
}


def request(turn_id: str) -> dict[str, Any]:
    return {
        "turnId": turn_id,
        "deterministicResponse": "Capacity is the focus.",
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


class FakeAdapter:
    provider = "openai"

    def __init__(self, completion: dict[str, Any] | None = None, error: Exception | None = None) -> None:
        self.completion = completion or {
            "text": "Capacity is stable.",
            "provider": "openai",
            "model": "gpt-4o-mini",
            "usage": {"inputTokens": 8, "outputTokens": 4, "totalTokens": 12},
        }
        self.error = error
        self.calls = 0
        self.kwargs: list[dict[str, Any]] = []

    def complete(self, **kwargs: Any) -> dict[str, Any]:
        self.calls += 1
        self.kwargs.append(kwargs)
        if self.error is not None:
            raise self.error
        return self.completion


def run(store: NexoraLlmUsageStore, adapter: FakeAdapter, turn: str, scope: str = SCOPE_A, environ: dict[str, str] | None = None):
    return execute_nexora_llm_guarded_runtime(
        request(turn),
        adapter,
        environ=environ or ENABLED,
        store=store,
        now=NOW,
        usage_scope=scope,
    )


def test_valid_ledger_allows_one_capped_call(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    result = run(store, adapter, "ok")
    assert result["policy"]["dispatched"] is True
    assert adapter.calls == 1
    assert adapter.kwargs[0]["max_output_tokens"] == 32
    assert store.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 0.01


def test_corrupted_ledger_blocks_and_preserves_bytes(tmp_path: Path) -> None:
    path = tmp_path / "usage.json"
    path.write_text("{not-json", encoding="utf-8")
    before = path.read_bytes()
    store = NexoraLlmUsageStore(path)
    adapter = FakeAdapter()
    result = run(store, adapter, "bad")
    assert result["policy"]["reason"] == LEDGER_CORRUPTED
    assert adapter.calls == 0
    assert path.read_bytes() == before


def test_missing_hosted_ledger_is_not_created(tmp_path: Path) -> None:
    path = tmp_path / "usage.json"
    store = NexoraLlmUsageStore(path, create_if_missing=False)
    adapter = FakeAdapter()
    result = run(store, adapter, "missing")
    assert result["policy"]["reason"] == LEDGER_UNAVAILABLE
    assert adapter.calls == 0
    assert not path.exists()


def test_integrity_violation_does_not_reset(tmp_path: Path) -> None:
    path = tmp_path / "usage.json"
    path.write_text(json.dumps({
        "identity": USAGE_STORE_IDENTITY,
        "scopes": {SCOPE_A: {"2026-10-24": {"authorizedAttempts": -1, "reservations": {}, "records": []}}},
    }), encoding="utf-8")
    before = path.read_text(encoding="utf-8")
    store = NexoraLlmUsageStore(path)
    adapter = FakeAdapter()
    result = run(store, adapter, "bad-count")
    assert result["policy"]["reason"] == LEDGER_INTEGRITY_VIOLATION
    assert adapter.calls == 0
    assert path.read_text(encoding="utf-8") == before
    try:
        store.authorized_attempts(scope_id=SCOPE_A, period_key="2026-10-24")
    except LedgerError as exc:
        assert exc.code == LEDGER_INTEGRITY_VIOLATION
    else:
        raise AssertionError("integrity violation was rewritten into a readable zero ledger")


def test_budget_and_token_caps_block_before_provider(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    tight = {**ENABLED, "NEXORA_LLM_WORKSPACE_BUDGET_USD": "0.01", "NEXORA_LLM_USER_BUDGET_USD": "0.01"}
    assert run(store, adapter, "first", environ=tight)["policy"]["dispatched"] is True
    blocked = run(store, adapter, "second", environ=tight)
    assert blocked["policy"]["reason"] == "BUDGET_EXHAUSTED"
    assert adapter.calls == 1
    tiny = {**ENABLED, "NEXORA_LLM_MAX_INPUT_TOKENS": "1"}
    other = NexoraLlmUsageStore(tmp_path / "other.json")
    refused = run(other, FakeAdapter(), "tiny", environ=tiny)
    assert refused["policy"]["reason"] == "payload_too_large"
    assert refused["policy"].get("dispatched") is not True


def test_user_and_workspace_allowances_stay_isolated(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    limited = {**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "1", "NEXORA_LLM_USER_USAGE_LIMIT": "1"}
    assert run(store, adapter, "a", environ=limited)["policy"]["dispatched"] is True
    again = run(store, adapter, "a2", environ=limited)
    assert again["policy"]["reason"] == "ALLOWANCE_EXHAUSTED"
    other = run(store, adapter, "b", scope=SCOPE_B, environ=limited)
    assert other["policy"]["dispatched"] is True
    assert store.authorized_attempts(scope_id=SCOPE_A, period_key="2026-10-24") == 1
    assert store.authorized_attempts(scope_id=SCOPE_B, period_key="2026-10-24") == 1
    assert adapter.calls == 2


def test_concurrent_reservations_cannot_exceed_budget(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    tight = {
        **ENABLED,
        "NEXORA_LLM_WORKSPACE_BUDGET_USD": "0.01",
        "NEXORA_LLM_USER_BUDGET_USD": "0.01",
        "NEXORA_LLM_USER_CONCURRENCY": "4",
        "NEXORA_LLM_WORKSPACE_CONCURRENCY": "4",
    }

    def once(turn: str) -> dict[str, Any]:
        return run(store, adapter, turn, environ=tight)

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(once, ["c1", "c2"]))
    assert sum(1 for item in results if item.get("policy", {}).get("dispatched") is True) == 1
    assert adapter.calls == 1
    assert store.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 0.01


def test_timeout_keeps_reservation_and_does_not_retry(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter(error=AdapterError("TIMEOUT", "Provider request timed out."))
    failed = run(store, adapter, "slow")
    assert failed["status"] == "failed"
    assert adapter.calls == 1
    assert store.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 0.01
    follow = run(
        store,
        FakeAdapter(),
        "next",
        environ={**ENABLED, "NEXORA_LLM_WORKSPACE_BUDGET_USD": "0.01", "NEXORA_LLM_USER_BUDGET_USD": "0.01"},
    )
    assert follow["policy"]["reason"] == "BUDGET_EXHAUSTED"


def test_lower_provider_cost_is_not_refunded(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter(completion={
        "text": "ok",
        "usage": {"inputTokens": 2, "outputTokens": 1, "totalTokens": 3},
        "cost": {"amount": 0.0001, "currency": "USD"},
    })
    assert run(store, adapter, "cheap")["status"] == "ok"
    assert store.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 0.01
    record = store.records(scope_id=SCOPE_A, period_key="2026-10-24")[0]
    assert record["usage"]["totalTokens"] == 3


def test_disabled_flag_makes_no_provider_call(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json", create_if_missing=False)
    adapter = FakeAdapter()
    result = run(store, adapter, "off", environ={"NEXORA_LLM_ENABLED": "false"})
    assert result["policy"]["reason"] == "LLM_DISABLED"
    assert adapter.calls == 0
    assert not (tmp_path / "usage.json").exists()


def test_restart_reopens_the_same_consumption(tmp_path: Path) -> None:
    path = tmp_path / "usage.json"
    first = NexoraLlmUsageStore(path)
    adapter = FakeAdapter()
    assert run(first, adapter, "kept")["policy"]["dispatched"] is True
    second = NexoraLlmUsageStore(path)
    assert second.authorized_attempts(scope_id=SCOPE_A, period_key="2026-10-24") == 1
    assert second.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 0.01


def test_nonfinite_and_malformed_money_blocks_before_provider(tmp_path: Path) -> None:
    samples = (
        "nan",
        "NaN",
        "NAN",
        "inf",
        "Infinity",
        "infinity",
        "-inf",
        "-INF",
        "1e309",
        "-1e309",
        "-1",
        "0",
        "0.0",
        "",
        "abc",
        "$0.01",
    )
    for index, sample in enumerate(samples):
        adapter = FakeAdapter()
        result = run(
            NexoraLlmUsageStore(tmp_path / f"reserve-{index}.json"),
            adapter,
            f"reserve-{index}",
            environ={**ENABLED, "NEXORA_LLM_MAX_REQUEST_USD": sample},
        )
        assert result["policy"]["reason"] == "CONFIGURATION_ERROR"
        assert adapter.calls == 0
    for name, sample in (
        ("NEXORA_LLM_USER_BUDGET_USD", "nan"),
        ("NEXORA_LLM_USER_BUDGET_USD", "inf"),
        ("NEXORA_LLM_USER_BUDGET_USD", "Infinity"),
        ("NEXORA_LLM_WORKSPACE_BUDGET_USD", "NaN"),
        ("NEXORA_LLM_WORKSPACE_BUDGET_USD", "-inf"),
        ("NEXORA_LLM_WORKSPACE_BUDGET_USD", "1e309"),
        ("NEXORA_LLM_REQUEST_COST_FLOOR_USD", "nan"),
        ("NEXORA_LLM_TIMEOUT_SECONDS", "inf"),
    ):
        adapter = FakeAdapter()
        result = run(
            NexoraLlmUsageStore(tmp_path / f"{name}-{sample}.json"),
            adapter,
            "budget",
            environ={**ENABLED, name: sample},
        )
        assert result["policy"]["reason"] == "CONFIGURATION_ERROR"
        assert adapter.calls == 0


def test_valid_finite_reservation_makes_one_provider_call(tmp_path: Path) -> None:
    store = NexoraLlmUsageStore(tmp_path / "usage.json")
    adapter = FakeAdapter()
    result = run(
        store,
        adapter,
        "finite",
        environ={
            **ENABLED,
            "NEXORA_LLM_MAX_OUTPUT_TOKENS": "256",
            "NEXORA_LLM_MAX_INPUT_TOKENS": "2000",
            "NEXORA_LLM_MAX_REQUEST_USD": "0.002",
            "NEXORA_LLM_USER_BUDGET_USD": "0.02",
            "NEXORA_LLM_WORKSPACE_BUDGET_USD": "0.02",
        },
    )
    assert result["policy"]["dispatched"] is True
    assert adapter.calls == 1
    assert store.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 0.002


def test_invalid_token_and_integer_limits_block_before_provider(tmp_path: Path) -> None:
    rejected = (
        ("NEXORA_LLM_MAX_OUTPUT_TOKENS", "32.5"),
        ("NEXORA_LLM_MAX_OUTPUT_TOKENS", "-1"),
        ("NEXORA_LLM_MAX_OUTPUT_TOKENS", "0"),
        ("NEXORA_LLM_MAX_OUTPUT_TOKENS", "nan"),
        ("NEXORA_LLM_MAX_OUTPUT_TOKENS", "inf"),
        ("NEXORA_LLM_MAX_INPUT_TOKENS", "2000.5"),
        ("NEXORA_LLM_MAX_INPUT_TOKENS", "nan"),
        ("NEXORA_LLM_USAGE_LIMIT", "nan"),
        ("NEXORA_LLM_USAGE_LIMIT", "1.5"),
        ("NEXORA_LLM_USAGE_LIMIT", "inf"),
        ("NEXORA_LLM_USER_USAGE_LIMIT", "4.0"),
        ("NEXORA_LLM_USER_CONCURRENCY", "1.5"),
        ("NEXORA_LLM_WORKSPACE_CONCURRENCY", "inf"),
    )
    for index, (name, sample) in enumerate(rejected):
        adapter = FakeAdapter()
        result = run(
            NexoraLlmUsageStore(tmp_path / f"token-{index}.json"),
            adapter,
            f"token-{index}",
            environ={**ENABLED, name: sample},
        )
        assert result["policy"]["reason"] == "CONFIGURATION_ERROR"
        assert adapter.calls == 0
    adapter = FakeAdapter()
    result = run(
        NexoraLlmUsageStore(tmp_path / "zero-allowance.json"),
        adapter,
        "zero",
        environ={**ENABLED, "NEXORA_LLM_USAGE_LIMIT": "0"},
    )
    assert result["policy"]["reason"] == "ALLOWANCE_EXHAUSTED"
    assert adapter.calls == 0
    accepted = FakeAdapter()
    assert run(
        NexoraLlmUsageStore(tmp_path / "cap.json"),
        accepted,
        "cap",
        environ={**ENABLED, "NEXORA_LLM_MAX_OUTPUT_TOKENS": "256"},
    )["policy"]["dispatched"] is True
    assert accepted.calls == 1
    assert accepted.kwargs[0]["max_output_tokens"] == 256


def _ledger(amount: Any) -> dict[str, Any]:
    return {
        "identity": USAGE_STORE_IDENTITY,
        "initialized": True,
        "scopes": {
            SCOPE_A: {
                "2026-10-24": {
                    "authorizedAttempts": 1,
                    "reservations": {},
                    "records": [
                        {
                            "turnId": "old",
                            "recordedAt": "2026-10-24T00:00:00+00:00",
                            "request": {"turnId": "old", "attempted": True},
                            "cost": {"amount": amount, "currency": "USD"},
                        }
                    ],
                    "holds": {},
                }
            }
        },
    }


def test_nonfinite_persisted_money_fails_closed_without_rewrite(tmp_path: Path) -> None:
    for index, literal in enumerate(("NaN", "Infinity", "-Infinity")):
        path = tmp_path / f"money-{index}.json"
        path.write_text(json.dumps(_ledger(0.01)).replace("0.01", literal), encoding="utf-8")
        original = path.read_bytes()
        adapter = FakeAdapter()
        result = run(NexoraLlmUsageStore(path), adapter, f"money-{index}")
        assert result["policy"]["reason"] == LEDGER_INTEGRITY_VIOLATION
        assert adapter.calls == 0
        assert path.read_bytes() == original
    path = tmp_path / "text-amount.json"
    path.write_text(json.dumps(_ledger("nope")), encoding="utf-8")
    original = path.read_bytes()
    adapter = FakeAdapter()
    result = run(NexoraLlmUsageStore(path), adapter, "text-amount")
    assert result["policy"]["reason"] == LEDGER_INTEGRITY_VIOLATION
    assert adapter.calls == 0
    assert path.read_bytes() == original


def test_arithmetic_overflow_blocks_without_provider_call(tmp_path: Path) -> None:
    path = tmp_path / "overflow.json"
    path.write_text(json.dumps(_ledger(1e308)), encoding="utf-8")
    store = NexoraLlmUsageStore(path)
    adapter = FakeAdapter()
    result = run(
        store,
        adapter,
        "overflow",
        environ={
            **ENABLED,
            "NEXORA_LLM_MAX_REQUEST_USD": "1e308",
            "NEXORA_LLM_USER_BUDGET_USD": "1e308",
            "NEXORA_LLM_WORKSPACE_BUDGET_USD": "1e308",
        },
    )
    assert result["policy"]["reason"] == "BUDGET_EXHAUSTED"
    assert adapter.calls == 0
    assert store.spent_usd(scope_id=SCOPE_A, period_key="2026-10-24", floor_usd=0.01) == 1e308


def test_openai_adapter_disables_retries_and_sets_output_cap(monkeypatch: Any) -> None:
    captured: dict[str, Any] = {}

    class Responses:
        def create(self, **kwargs: Any) -> Any:
            captured["create"] = kwargs

            class Usage:
                input_tokens = 2
                output_tokens = 1
                total_tokens = 3

            class Response:
                output_text = "ok"
                model = "gpt-4o-mini"
                id = "resp_test"
                usage = Usage()

            return Response()

    class Client:
        def __init__(self, **kwargs: Any) -> None:
            captured["client"] = kwargs
            self.responses = Responses()

    monkeypatch.setattr("openai.OpenAI", Client)
    result = OpenAITextAdapter(api_key="test-key", model="gpt-4o-mini").complete(
        system_instruction="system",
        user_payload="{}",
        timeout_seconds=8,
        max_output_tokens=32,
    )
    assert captured["client"]["max_retries"] == 0
    assert captured["create"]["max_output_tokens"] == 32
    assert "stream" not in captured["create"]
    assert result["text"] == "ok"
    assert result["cost"] is None
