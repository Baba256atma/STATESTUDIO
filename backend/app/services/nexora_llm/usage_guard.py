"""LLM-MVP:4 — authorize, then call Phase-3 runtime, then meter.

Server is the cost boundary. Client quota fields are ignored.
"""

from __future__ import annotations

import json
import logging
import math
import os
from dataclasses import dataclass, replace
from datetime import datetime, timezone
from typing import Any, Mapping

from app.services.nexora_llm.runtime import configured_adapter, execute_nexora_llm_runtime
from app.services.nexora_llm.usage_policy import (
    NEXORA_LLM_USAGE_POLICY_IDENTITY,
    eligibility_decision,
    load_usage_policy_config,
    period_key,
)
from app.services.nexora_llm.usage_store import LedgerError, NexoraLlmUsageStore, utc_now

logger = logging.getLogger("nexora.llm.usage")

HOSTED_UTTERANCE_CHARS = 240
HOSTED_CONTEXT_CHARS = 8000
HOSTED_VALUE_CHARS = 160


@dataclass(frozen=True)
class HostedSecurityLimits:
    user_rate_limit: int
    workspace_rate_limit: int
    rate_window_seconds: int
    burst_limit: int
    burst_window_seconds: int
    user_concurrency: int
    workspace_concurrency: int
    user_usage_limit: int
    user_budget_usd: float
    workspace_budget_usd: float
    request_cost_floor_usd: float
    retention_days: int
    timeout_seconds: float
    max_output_tokens: int | None
    max_request_usd: float | None
    max_input_tokens: int | None


def load_hosted_security_limits(environ: Mapping[str, str] | None = None) -> HostedSecurityLimits:
    env = environ if environ is not None else os.environ
    return HostedSecurityLimits(
        user_rate_limit=_positive(env, "NEXORA_LLM_USER_RATE_LIMIT", 20),
        workspace_rate_limit=_positive(env, "NEXORA_LLM_WORKSPACE_RATE_LIMIT", 12),
        rate_window_seconds=_positive(env, "NEXORA_LLM_RATE_WINDOW_SECONDS", 60),
        burst_limit=_positive(env, "NEXORA_LLM_BURST_LIMIT", 3),
        burst_window_seconds=_positive(env, "NEXORA_LLM_BURST_WINDOW_SECONDS", 10),
        user_concurrency=_positive(env, "NEXORA_LLM_USER_CONCURRENCY", 1),
        workspace_concurrency=_positive(env, "NEXORA_LLM_WORKSPACE_CONCURRENCY", 1),
        user_usage_limit=_positive(env, "NEXORA_LLM_USER_USAGE_LIMIT", 40),
        user_budget_usd=_positive_float(env, "NEXORA_LLM_USER_BUDGET_USD", 2.0),
        workspace_budget_usd=_positive_float(env, "NEXORA_LLM_WORKSPACE_BUDGET_USD", 1.0),
        request_cost_floor_usd=_positive_float(env, "NEXORA_LLM_REQUEST_COST_FLOOR_USD", 0.01),
        retention_days=_positive(env, "NEXORA_LLM_USAGE_RETENTION_DAYS", 30),
        timeout_seconds=_positive_float(env, "NEXORA_LLM_TIMEOUT_SECONDS", 8.0),
        max_output_tokens=_optional_positive(env, "NEXORA_LLM_MAX_OUTPUT_TOKENS"),
        max_request_usd=_optional_positive_float(env, "NEXORA_LLM_MAX_REQUEST_USD"),
        max_input_tokens=_optional_positive(env, "NEXORA_LLM_MAX_INPUT_TOKENS"),
    )


def _ledger_create_allowed(environ: Mapping[str, str] | None) -> bool:
    env = environ if environ is not None else os.environ
    mode = env.get("NEXORA_DEPLOYMENT_MODE")
    if mode is None:
        mode = os.environ.get("NEXORA_DEPLOYMENT_MODE")
    if mode != "hosted":
        return True
    flag = env.get("NEXORA_LLM_LEDGER_INITIALIZE")
    if flag is None:
        flag = os.environ.get("NEXORA_LLM_LEDGER_INITIALIZE", "")
    return str(flag).strip().lower() == "true"


def _optional_positive(env: Mapping[str, str], name: str) -> int | None:
    raw = env.get(name)
    if raw is None or not str(raw).strip():
        return None
    return _positive_int(str(raw).strip(), name)


def _optional_positive_float(env: Mapping[str, str], name: str) -> float | None:
    raw = env.get(name)
    if raw is None or not str(raw).strip():
        return None
    return _positive_finite(str(raw).strip(), name)


def _positive(env: Mapping[str, str], name: str, default: int) -> int:
    raw = env.get(name)
    if raw is None or not str(raw).strip():
        return default
    return _positive_int(str(raw).strip(), name)


def _positive_float(env: Mapping[str, str], name: str, default: float) -> float:
    raw = env.get(name)
    if raw is None or not str(raw).strip():
        return default
    return _positive_finite(str(raw).strip(), name)


def _positive_int(raw: str, name: str) -> int:
    try:
        value = int(raw)
    except (TypeError, ValueError) as exc:
        raise ValueError(name) from exc
    if value < 1:
        raise ValueError(name)
    return value


def _positive_finite(raw: str, name: str) -> float:
    try:
        value = float(raw)
    except (TypeError, ValueError) as exc:
        raise ValueError(name) from exc
    if not math.isfinite(value) or value <= 0:
        raise ValueError(name)
    return value


def hosted_scope_parts(scope: str) -> tuple[str, str] | None:
    if not scope.startswith("hosted:"):
        return None
    rest = scope[len("hosted:"):]
    marker = ":ws_"
    index = rest.rfind(marker)
    if index <= 0:
        return None
    return rest[:index], rest[index + 1:]


def hosted_payload_refusal(request: dict[str, Any] | None) -> str | None:
    if not isinstance(request, dict):
        return "payload_too_large"
    encoded = json.dumps(request, ensure_ascii=False, separators=(",", ":"))
    if len(encoded) > HOSTED_CONTEXT_CHARS or "csvText" in encoded or "csv_text" in encoded:
        return "payload_too_large"
    context = request.get("managementContext")
    if not isinstance(context, dict):
        return "payload_too_large"
    conversation = context.get("conversation") if isinstance(context.get("conversation"), dict) else {}
    utterance = conversation.get("currentUtterance")
    if not isinstance(utterance, str) or len(utterance) > HOSTED_UTTERANCE_CHARS:
        return "payload_too_large"
    for group in ("dataReality", "evidence", "decision", "scenario", "management"):
        node = context.get(group)
        refs = node.get("refs") if isinstance(node, dict) else []
        if not isinstance(refs, list):
            return "payload_too_large"
        cap = 1 if group in {"decision", "scenario"} else 6 if group == "management" else 4
        if len(refs) > cap:
            return "payload_too_large"
        for ref in refs:
            if not isinstance(ref, dict):
                return "payload_too_large"
            value = ref.get("value")
            if isinstance(value, str) and len(value) > HOSTED_VALUE_CHARS:
                return "payload_too_large"
    return None


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
    usage_scope: str | None = None,
) -> dict[str, Any]:
    config = load_usage_policy_config(environ)
    if usage_scope:
        config = replace(config, scope_id=usage_scope)
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
    turn = turn_id.strip()
    hosted = hosted_scope_parts(usage_scope) if usage_scope else None
    limits = None
    user_scope = None
    if hosted is not None:
        try:
            limits = load_hosted_security_limits(environ)
        except ValueError:
            return _skipped("CONFIGURATION_ERROR")
        refusal = hosted_payload_refusal(request if isinstance(request, dict) else None)
        if refusal:
            return _skipped(refusal)
        user_scope = f"hosted-user:{hosted[0]}"

    try:
        ledger = store or NexoraLlmUsageStore(create_if_missing=_ledger_create_allowed(environ))
    except (OSError, ValueError):
        logger.info("nexora_llm_policy reason=USAGE_UNAVAILABLE turn=%s", turn)
        return _skipped("USAGE_UNAVAILABLE")
    stamp = now or datetime.now(timezone.utc)
    key = period_key(config.period, stamp)
    slots: list[str] = []
    try:
        if hosted is not None and limits is not None and user_scope is not None:
            if limits.max_output_tokens is None or limits.max_request_usd is None:
                return _skipped("CONFIGURATION_ERROR")
            if limits.max_input_tokens is not None and isinstance(request, dict):
                encoded = json.dumps(request, ensure_ascii=False, separators=(",", ":"))
                if (len(encoded) + 3) // 4 > limits.max_input_tokens:
                    return _skipped("payload_too_large")
            ledger.prune_expired_details(now=stamp, retention_days=limits.retention_days)
            reservation = ledger.admit_hosted(
                workspace_scope=config.scope_id,
                user_scope=user_scope,
                user_id=hosted[0],
                period_key=key,
                turn_id=turn,
                now=stamp,
                workspace_limit=config.limit,
                user_limit=limits.user_usage_limit,
                workspace_rate_limit=limits.workspace_rate_limit,
                user_rate_limit=limits.user_rate_limit,
                rate_window_seconds=limits.rate_window_seconds,
                burst_window_seconds=limits.burst_window_seconds,
                burst_limit=limits.burst_limit,
                workspace_concurrency=limits.workspace_concurrency,
                user_concurrency=limits.user_concurrency,
                workspace_budget_usd=limits.workspace_budget_usd,
                user_budget_usd=limits.user_budget_usd,
                reserve_usd=limits.max_request_usd,
                floor_usd=limits.request_cost_floor_usd,
            )
            if not reservation["allowed"]:
                logger.info(
                    "nexora_llm_policy allowed=false reason=%s turn=%s",
                    reservation["reason"],
                    turn,
                )
                return _skipped(str(reservation["reason"]))
            slots.extend((config.scope_id, user_scope))
        else:
            try:
                reservation = ledger.try_reserve(
                    scope_id=config.scope_id,
                    period_key=key,
                    turn_id=turn,
                    limit=config.limit,
                )
            except LedgerError as exc:
                logger.info("nexora_llm_policy reason=%s turn=%s", exc.code, turn)
                return _skipped(exc.code)
            except Exception:
                logger.info("nexora_llm_policy reason=USAGE_UNAVAILABLE turn=%s", turn)
                return _skipped("USAGE_UNAVAILABLE")

        if not reservation["allowed"]:
            logger.info(
                "nexora_llm_policy allowed=false reason=%s turn=%s",
                reservation["reason"],
                turn,
            )
            return _skipped(str(reservation["reason"]))

        selected = adapter if adapter is not None else configured_adapter()
        timeout = timeout_seconds if timeout_seconds is not None else (limits.timeout_seconds if limits is not None else None)
        output_cap = limits.max_output_tokens if limits is not None else None
        if selected is None:
            ledger.release(scope_id=config.scope_id, period_key=key, turn_id=turn)
            if user_scope is not None:
                ledger.release(scope_id=user_scope, period_key=key, turn_id=turn)
            return {
                **execute_nexora_llm_runtime(
                    request, None, timeout_seconds=timeout, max_output_tokens=output_cap
                ),
                "policy": {
                    "identity": NEXORA_LLM_USAGE_POLICY_IDENTITY,
                    "allowed": True,
                    "reason": "ALLOWED",
                    "reservationId": reservation["reservationId"],
                    "dispatched": False,
                },
            }

        probe = _DispatchProbe(selected)
        result = execute_nexora_llm_runtime(
            request, probe, timeout_seconds=timeout, max_output_tokens=output_cap
        )
        if not probe.dispatched:
            ledger.release(scope_id=config.scope_id, period_key=key, turn_id=turn)
            if user_scope is not None:
                ledger.release(scope_id=user_scope, period_key=key, turn_id=turn)
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
            turn_id=turn,
            allowed=True,
            reason="ALLOWED",
            attempted=True,
            result=result,
        )
        if hosted is not None and limits is not None and limits.max_request_usd is not None:
            amount = limits.max_request_usd
            reported = result.get("cost") if isinstance(result.get("cost"), dict) else None
            reported_amount = reported.get("amount") if reported else None
            if (
                result.get("status") == "ok"
                and reported is not None
                and reported.get("currency") == "USD"
                and isinstance(reported_amount, (int, float))
                and not isinstance(reported_amount, bool)
                and math.isfinite(reported_amount)
                and reported_amount > amount
            ):
                amount = float(reported_amount)
            compact["cost"] = {"amount": amount, "currency": "USD"}
        elif compact.get("cost") is None and limits is not None:
            compact["cost"] = {"amount": limits.request_cost_floor_usd, "currency": "USD"}
        try:
            ledger.settle(
                scope_id=config.scope_id,
                period_key=key,
                turn_id=turn,
                reservation_id=str(reservation["reservationId"]),
                record=compact,
            )
            if user_scope is not None:
                ledger.close_reservation(scope_id=user_scope, period_key=key, turn_id=turn)
        except Exception:
            logger.info("nexora_llm_policy reason=USAGE_UNAVAILABLE turn=%s", turn)
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
            turn,
            out.get("runtime", {}).get("provider") if isinstance(out.get("runtime"), dict) else None,
            out.get("status"),
            compact.get("usage"),
        )
        return out
    except LedgerError as exc:
        logger.info("nexora_llm_policy reason=%s turn=%s", exc.code, turn)
        return _skipped(exc.code)
    except OSError:
        logger.info("nexora_llm_policy reason=LEDGER_PERSISTENCE_FAILED turn=%s", turn)
        return _skipped("LEDGER_PERSISTENCE_FAILED")
    except Exception:
        logger.info("nexora_llm_policy reason=USAGE_UNAVAILABLE turn=%s", turn)
        return _skipped("USAGE_UNAVAILABLE")
    finally:
        for scope_id in slots:
            try:
                ledger.release_turn(scope_id=scope_id, turn_id=turn)
            except Exception:
                logger.info("nexora_llm_policy reason=USAGE_UNAVAILABLE turn=%s", turn)
