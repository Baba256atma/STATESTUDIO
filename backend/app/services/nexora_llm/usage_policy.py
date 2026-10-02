"""LLM-MVP:4 — server-side usage policy configuration (provider-neutral)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Mapping

NEXORA_LLM_USAGE_POLICY_IDENTITY = "LLM-MVP:4/UsagePolicyCostGuard"
NEXORA_LLM_USAGE_PERIODS = frozenset({"daily", "monthly"})
NEXORA_LLM_DEFAULT_USAGE_SCOPE = "ws_default"

SKIP_REASONS = frozenset(
    {
        "LLM_DISABLED",
        "ALLOWANCE_EXHAUSTED",
        "BUDGET_EXHAUSTED",
        "POLICY_DECLINED",
        "USAGE_UNAVAILABLE",
        "CONFIGURATION_ERROR",
    }
)


@dataclass(frozen=True)
class UsagePolicyConfig:
    valid: bool
    enabled: bool
    limit: int
    period: str
    scope_id: str
    configuration_error: bool


def period_key(period: str, now: datetime | None = None) -> str:
    stamp = now or datetime.now(timezone.utc)
    if stamp.tzinfo is None:
        stamp = stamp.replace(tzinfo=timezone.utc)
    else:
        stamp = stamp.astimezone(timezone.utc)
    if period == "daily":
        return stamp.strftime("%Y-%m-%d")
    if period == "monthly":
        return stamp.strftime("%Y-%m")
    raise ValueError("unsupported_usage_period")


def load_usage_policy_config(environ: Mapping[str, str] | None = None) -> UsagePolicyConfig:
    env = environ if environ is not None else __import__("os").environ
    enabled_raw = env.get("NEXORA_LLM_ENABLED")
    if enabled_raw is None or not str(enabled_raw).strip():
        return UsagePolicyConfig(
            valid=True,
            enabled=False,
            limit=0,
            period="daily",
            scope_id=NEXORA_LLM_DEFAULT_USAGE_SCOPE,
            configuration_error=False,
        )
    enabled_text = str(enabled_raw).strip().lower()
    if enabled_text not in {"true", "false", "1", "0", "yes", "no"}:
        return UsagePolicyConfig(
            valid=False,
            enabled=False,
            limit=0,
            period="daily",
            scope_id=NEXORA_LLM_DEFAULT_USAGE_SCOPE,
            configuration_error=True,
        )
    enabled = enabled_text in {"true", "1", "yes"}
    if not enabled:
        return UsagePolicyConfig(
            valid=True,
            enabled=False,
            limit=0,
            period="daily",
            scope_id=_scope(env),
            configuration_error=False,
        )
    period = str(env.get("NEXORA_LLM_USAGE_PERIOD") or "").strip().lower()
    limit_raw = env.get("NEXORA_LLM_USAGE_LIMIT")
    if period not in NEXORA_LLM_USAGE_PERIODS or limit_raw is None or not str(limit_raw).strip():
        return UsagePolicyConfig(
            valid=False,
            enabled=True,
            limit=0,
            period="daily",
            scope_id=_scope(env),
            configuration_error=True,
        )
    try:
        limit = int(str(limit_raw).strip())
        if limit < 0:
            raise ValueError("negative")
    except ValueError:
        return UsagePolicyConfig(
            valid=False,
            enabled=True,
            limit=0,
            period="daily",
            scope_id=_scope(env),
            configuration_error=True,
        )
    return UsagePolicyConfig(
        valid=True,
        enabled=True,
        limit=limit,
        period=period,
        scope_id=_scope(env),
        configuration_error=False,
    )


def _scope(env: Mapping[str, str]) -> str:
    raw = str(env.get("NEXORA_LLM_USAGE_SCOPE") or "").strip()
    return raw or NEXORA_LLM_DEFAULT_USAGE_SCOPE


def eligibility_decision(config: UsagePolicyConfig) -> dict[str, object]:
    if config.configuration_error or not config.valid:
        return {"allowed": False, "reason": "CONFIGURATION_ERROR", "reservationId": None}
    if not config.enabled:
        return {"allowed": False, "reason": "LLM_DISABLED", "reservationId": None}
    return {"allowed": True, "reason": "ALLOWED", "reservationId": None}
