"""Typed policy diff helpers."""

from __future__ import annotations

from typing import Any

from app.schemas.policy_changes import PolicyDiffResult, PolicyFieldDiff, PolicyRiskLevel


RISK_ORDER: dict[PolicyRiskLevel, int] = {
    "low": 0,
    "medium": 1,
    "high": 2,
    "critical": 3,
}


class PolicyDiffEngine:
    """Compute deterministic field-level policy diffs."""

    def diff(self, before: dict[str, Any], after: dict[str, Any]) -> PolicyDiffResult:
        """Return a structured diff between two policy payloads."""
        diffs = sorted(_diff_dicts(before, after), key=lambda item: item.field_path)
        changed_fields = [item.field_path for item in diffs]
        risk_level = "low"
        for diff in diffs:
            if RISK_ORDER[diff.risk_level] > RISK_ORDER[risk_level]:
                risk_level = diff.risk_level
        return PolicyDiffResult(
            changed_fields=changed_fields,
            diffs=diffs,
            risk_level=risk_level,
            summary=f"{len(diffs)} field changes detected" if diffs else "No policy changes detected",
        )


def _diff_dicts(before: dict[str, Any], after: dict[str, Any], prefix: str = "") -> list[PolicyFieldDiff]:
    diffs: list[PolicyFieldDiff] = []
    keys = sorted(set(before).union(after))
    for key in keys:
        path = f"{prefix}.{key}" if prefix else key
        before_has = key in before
        after_has = key in after
        before_value = before.get(key)
        after_value = after.get(key)

        if before_has and after_has and isinstance(before_value, dict) and isinstance(after_value, dict):
            diffs.extend(_diff_dicts(before_value, after_value, path))
            continue

        if before_has and after_has and before_value == after_value:
            continue

        if not before_has:
            change_kind = "added"
        elif not after_has:
            change_kind = "removed"
        else:
            change_kind = "changed"

        risk_level = _classify_risk(path, before_value, after_value)
        diffs.append(
            PolicyFieldDiff(
                field_path=path,
                change_kind=change_kind,
                before_value=before_value,
                after_value=after_value,
                risk_level=risk_level,
                summary=f"{path} {change_kind}",
            )
        )
    return diffs


def _classify_risk(field_path: str, before_value: Any, after_value: Any) -> PolicyRiskLevel:
    if field_path in {
        "provider.cloud_provider_enabled",
        "routing.cloud_fallback_enabled",
        "routing.cloud_for_reasoning_enabled",
    }:
        if before_value is False and after_value is True:
            return "critical"
        return "high"

    if field_path in {
        "privacy.strict_mode",
        "audit.redact_sensitive_fields",
        "telemetry.redact_sensitive_fields",
    }:
        if before_value is True and after_value is False:
            return "critical"
        return "high"

    if field_path in {
        "privacy.cloud_blocked_sensitivity_levels",
        "privacy.local_required_sensitivity_levels",
        "routing.cloud_allowed_tasks",
    }:
        return "high"

    if field_path.startswith("model.") or field_path.startswith("provider.providers."):
        return "medium"

    if field_path.startswith("benchmark.") or field_path.startswith("evaluation."):
        return "medium"

    return "low"
