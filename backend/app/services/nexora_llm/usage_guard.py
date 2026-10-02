"""LLM-MVP:4 — authorize, then call Phase-3 runtime, then meter.

Server is the cost boundary. Client quota fields are ignored.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any, Mapping

from app.services.nexora_llm.runtime import configured_adapter, execute_nexora_llm_runtime
from app.services.nexora_llm.usage_policy import (
    NEXORA_LLM_USAGE_POLICY_IDENTITY,
    eligibility_decision,
    load_usage_policy_config,
    period_key,
)
from app.services.nexora_llm.usage_store import NexoraLlmUsageStore, utc_now

logger = logging.getLogger("nexora.llm.usage")


class _DispatchProbe:
    def __init__(self, inner: Any) -> None:
        self.inner = inner
        self.provider = getattr(inner, "provider", "none")
        self.dispatched = False

    def complete(self, **kwargs: Any) -> Any:
        self.dispatched = True
        return self.inner.complete(**kwargs)


def _skipped(reason: str, *, runtime_provider: str = "none") -> dict[str, Any]:
    return {
        "contribution": None,
        "status": "skipped",
        "failure": None,
        "policy": {
            "identity": NEXORA_LLM_USAGE_POLICY_IDENTITY,
            "allowed": False,
            "reason": reason,
            "reservationId": None,
        },
        "runtime": {
            "provider": runtime_provider,
            "model": None,
            "requestId": None,
            "latencyMs": None,
        },
        "usage": {"inputTokens": None, "outputTokens": None, "totalTokens": None},
        "cost": None,
    }


def _compact_record(
    *,
    scope_id: str,
    period: str,
    turn_id: str,
    allowed: bool,
    reason: str,
    attempted: bool,
    result: dict[str, Any],
) -> dict[str, Any]:
    runtime = result.get("runtime") if isinstance(result.get("runtime"), dict) else {}
    usage = result.get("usage") if isinstance(result.get("usage"), dict) else {}
    return {
        "scopeId": scope_id,
        "periodKey": period,
        "turnId": turn_id,
        "recordedAt": utc_now(),
        "authorization": {"allowed": allowed, "reason": reason},
        "request": {"turnId": turn_id, "attempted": attempted},
        "runtime": {
            "provider": runtime.get("provider"),
            "model": runtime.get("model"),
            "status": result.get("status"),
            "latencyMs": runtime.get("latencyMs"),
        },
        "usage": {
            "inputTokens": usage.get("inputTokens"),
            "outputTokens": usage.get("outputTokens"),
            "totalTokens": usage.get("totalTokens"),
        },
        "cost": result.get("cost"),
    }


def execute_nexora_llm_guarded_runtime(
    request: dict[str, Any] | None,
    adapter: Any | None = None,
    *,
    timeout_seconds: float | None = None,
    environ: Mapping[str, str] | None = None,
    store: NexoraLlmUsageStore | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    config = load_usage_policy_config(environ)
    eligibility = eligibility_decision(config)
    if not eligibility["allowed"]:
        logger.info(
            "nexora_llm_policy allowed=false reason=%s turn=%s",
            eligibility["reason"],
            request.get("turnId") if isinstance(request, dict) else None,
        )
        return _skipped(str(eligibility["reason"]))

    turn_id = request.get("turnId") if isinstance(request, dict) else None
    if not isinstance(turn_id, str) or not turn_id.strip():
        return _skipped("CONFIGURATION_ERROR")

    ledger = store or NexoraLlmUsageStore()
    key = period_key(config.period, now)
    try:
        reservation = ledger.try_reserve(
            scope_id=config.scope_id,
            period_key=key,
            turn_id=turn_id.strip(),
            limit=config.limit,
        )
    except Exception:
        logger.info("nexora_llm_policy reason=USAGE_UNAVAILABLE turn=%s", turn_id)
        return _skipped("USAGE_UNAVAILABLE")

    if not reservation["allowed"]:
        logger.info(
            "nexora_llm_policy allowed=false reason=%s turn=%s",
            reservation["reason"],
            turn_id,
        )
        return _skipped(str(reservation["reason"]))

    selected = adapter if adapter is not None else configured_adapter()
    if selected is None:
        ledger.release(scope_id=config.scope_id, period_key=key, turn_id=turn_id.strip())
        return {
            **execute_nexora_llm_runtime(request, None, timeout_seconds=timeout_seconds),
            "policy": {
                "identity": NEXORA_LLM_USAGE_POLICY_IDENTITY,
                "allowed": True,
                "reason": "ALLOWED",
                "reservationId": reservation["reservationId"],
                "dispatched": False,
            },
        }

    probe = _DispatchProbe(selected)
    result = execute_nexora_llm_runtime(request, probe, timeout_seconds=timeout_seconds)
    if not probe.dispatched:
        ledger.release(scope_id=config.scope_id, period_key=key, turn_id=turn_id.strip())
        result = dict(result)
        result["policy"] = {
            "identity": NEXORA_LLM_USAGE_POLICY_IDENTITY,
            "allowed": True,
            "reason": "ALLOWED",
            "reservationId": reservation["reservationId"],
            "dispatched": False,
        }
        return result

    compact = _compact_record(
        scope_id=config.scope_id,
        period=key,
        turn_id=turn_id.strip(),
        allowed=True,
        reason="ALLOWED",
        attempted=True,
        result=result,
    )
    ledger.settle(
        scope_id=config.scope_id,
        period_key=key,
        turn_id=turn_id.strip(),
        reservation_id=str(reservation["reservationId"]),
        record=compact,
    )
    out = dict(result)
    out["policy"] = {
        "identity": NEXORA_LLM_USAGE_POLICY_IDENTITY,
        "allowed": True,
        "reason": "ALLOWED",
        "reservationId": reservation["reservationId"],
        "dispatched": True,
    }
    logger.info(
        "nexora_llm_meter turn=%s provider=%s status=%s usage=%s",
        turn_id,
        out.get("runtime", {}).get("provider") if isinstance(out.get("runtime"), dict) else None,
        out.get("status"),
        compact.get("usage"),
    )
    return out
