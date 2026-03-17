"""Deterministic structural and logical validation for policy changes."""

from __future__ import annotations

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_changes import PolicyValidationIssue, PolicyValidationResult
from app.schemas.policy_overlays import OverlayConflictRecord


class PolicyValidator:
    """Validate candidate policy state before approval or activation."""

    def validate(
        self,
        *,
        snapshot: AIPolicySnapshot,
        conflicts: list[OverlayConflictRecord] | None = None,
    ) -> PolicyValidationResult:
        """Return structural and logical validation output for a candidate snapshot."""
        issues: list[PolicyValidationIssue] = []
        structural_valid = True

        try:
            snapshot = AIPolicySnapshot.model_validate(snapshot.model_dump())
        except Exception as exc:
            structural_valid = False
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="policy_snapshot_invalid",
                    field_path="policy",
                    message=str(exc),
                )
            )

        if structural_valid:
            issues.extend(self._logical_issues(snapshot))

        logical_valid = not any(issue.severity == "error" for issue in issues)
        return PolicyValidationResult(
            valid=structural_valid and logical_valid,
            structural_valid=structural_valid,
            logical_valid=logical_valid,
            issues=issues,
            conflicts=conflicts or [],
        )

    def _logical_issues(self, snapshot: AIPolicySnapshot) -> list[PolicyValidationIssue]:
        issues: list[PolicyValidationIssue] = []
        known_providers = set(snapshot.provider.providers)
        if snapshot.provider.default_provider not in known_providers:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="default_provider_unknown",
                    field_path="provider.default_provider",
                    message="Default provider must reference a known provider entry.",
                )
            )
        if snapshot.provider.fallback_provider and snapshot.provider.fallback_provider not in known_providers:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="fallback_provider_unknown",
                    field_path="provider.fallback_provider",
                    message="Fallback provider must reference a known provider entry.",
                )
            )
        if "restricted" not in snapshot.privacy.cloud_blocked_sensitivity_levels:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="restricted_cloud_block_missing",
                    field_path="privacy.cloud_blocked_sensitivity_levels",
                    message="Restricted sensitivity must remain blocked from cloud execution.",
                )
            )
        if "restricted" not in snapshot.privacy.local_required_sensitivity_levels:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="restricted_local_required_missing",
                    field_path="privacy.local_required_sensitivity_levels",
                    message="Restricted sensitivity must require local execution.",
                )
            )
        if snapshot.routing.cloud_fallback_enabled and not snapshot.provider.cloud_provider_enabled:
            issues.append(
                PolicyValidationIssue(
                    severity="warning",
                    code="cloud_fallback_without_cloud_provider",
                    field_path="routing.cloud_fallback_enabled",
                    message="Cloud fallback is enabled while cloud provider policy is disabled.",
                )
            )
        if snapshot.routing.cloud_for_reasoning_enabled and not snapshot.provider.cloud_provider_enabled:
            issues.append(
                PolicyValidationIssue(
                    severity="warning",
                    code="cloud_reasoning_without_cloud_provider",
                    field_path="routing.cloud_for_reasoning_enabled",
                    message="Cloud reasoning is enabled while cloud provider policy is disabled.",
                )
            )
        if snapshot.routing.default_mode == "cloud_only" and snapshot.privacy.strict_mode:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="cloud_only_with_strict_privacy",
                    field_path="routing.default_mode",
                    message="cloud_only routing conflicts with strict privacy policy.",
                )
            )
        if snapshot.benchmark.enabled and not snapshot.benchmark.results_path.strip():
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="benchmark_results_path_required",
                    field_path="benchmark.results_path",
                    message="Benchmark tuning requires a non-empty benchmark results path.",
                )
            )
        if snapshot.audit.max_events <= 0:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="audit_max_events_invalid",
                    field_path="audit.max_events",
                    message="Audit max_events must be greater than zero.",
                )
            )
        if snapshot.telemetry.max_events <= 0:
            issues.append(
                PolicyValidationIssue(
                    severity="error",
                    code="telemetry_max_events_invalid",
                    field_path="telemetry.max_events",
                    message="Telemetry max_events must be greater than zero.",
                )
            )
        return issues
