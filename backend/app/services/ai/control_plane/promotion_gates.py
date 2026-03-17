"""Deterministic promotion gates for policy environment transitions."""

from __future__ import annotations

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_promotion import EnvironmentType, PolicyPromotionRequest, PromotionGateResult
from app.services.ai.control_plane.policy_validation import PolicyValidator


class PromotionGateEvaluator:
    """Evaluate deterministic gates for environment promotions."""

    def __init__(self, validator: PolicyValidator) -> None:
        self.validator = validator

    def evaluate(
        self,
        *,
        request: PolicyPromotionRequest,
        snapshot: AIPolicySnapshot,
    ) -> list[PromotionGateResult]:
        """Return gate results for a promotion attempt."""
        return [
            self._validation_gate(snapshot),
            self._evaluation_gate(request.target_environment, snapshot),
            self._regression_gate(request.target_environment, snapshot),
            self._approval_gate(request),
            self._observability_gate(request.target_environment, snapshot),
        ]

    def _validation_gate(self, snapshot: AIPolicySnapshot) -> PromotionGateResult:
        validation = self.validator.validate(snapshot=snapshot)
        return PromotionGateResult(
            gate_name="validation",
            passed=validation.valid,
            reason="Policy validation passed." if validation.valid else validation.issues[0].message,
            metrics_summary={
                "structural_valid": validation.structural_valid,
                "logical_valid": validation.logical_valid,
                "issue_count": len(validation.issues),
            },
        )

    def _evaluation_gate(
        self,
        target_environment: EnvironmentType,
        snapshot: AIPolicySnapshot,
    ) -> PromotionGateResult:
        if target_environment in {EnvironmentType.LOCAL, EnvironmentType.DEV}:
            return PromotionGateResult(
                gate_name="evaluation_harness",
                passed=True,
                reason="Evaluation harness gate is advisory for local and dev promotion.",
                metrics_summary={"include_audit_checks": snapshot.evaluation.include_audit_checks},
            )

        passed = snapshot.evaluation.include_audit_checks
        return PromotionGateResult(
            gate_name="evaluation_harness",
            passed=passed,
            reason="Evaluation harness gate passed." if passed else "Promotion requires evaluation audit checks in staging and production.",
            metrics_summary={
                "include_audit_checks": snapshot.evaluation.include_audit_checks,
                "use_mock_providers": snapshot.evaluation.use_mock_providers,
            },
        )

    def _regression_gate(
        self,
        target_environment: EnvironmentType,
        snapshot: AIPolicySnapshot,
    ) -> PromotionGateResult:
        if target_environment in {EnvironmentType.LOCAL, EnvironmentType.DEV}:
            return PromotionGateResult(
                gate_name="regression_suite",
                passed=True,
                reason="Regression suite gate is advisory for local and dev promotion.",
                metrics_summary={"regression_enabled": snapshot.evaluation.regression_enabled},
            )

        passed = snapshot.evaluation.regression_enabled
        return PromotionGateResult(
            gate_name="regression_suite",
            passed=passed,
            reason="Regression suite gate passed." if passed else "Promotion requires regression checks in staging and production.",
            metrics_summary={"regression_enabled": snapshot.evaluation.regression_enabled},
        )

    def _approval_gate(self, request: PolicyPromotionRequest) -> PromotionGateResult:
        approval_required = request.target_environment in {EnvironmentType.STAGING, EnvironmentType.PRODUCTION}
        passed = True if not approval_required else bool((request.approved_by or "").strip())
        return PromotionGateResult(
            gate_name="policy_approval",
            passed=passed,
            reason="Promotion approval gate passed." if passed else "Promotion to staging and production requires explicit approval metadata.",
            metrics_summary={"approval_required": approval_required, "approved_by": request.approved_by or ""},
        )

    def _observability_gate(
        self,
        target_environment: EnvironmentType,
        snapshot: AIPolicySnapshot,
    ) -> PromotionGateResult:
        if target_environment in {EnvironmentType.LOCAL, EnvironmentType.DEV}:
            return PromotionGateResult(
                gate_name="observability_sanity",
                passed=True,
                reason="Observability sanity gate is advisory for local and dev promotion.",
                metrics_summary={"audit_enabled": snapshot.audit.enabled, "telemetry_enabled": snapshot.telemetry.enabled},
            )

        passed = (
            snapshot.audit.enabled
            and snapshot.telemetry.enabled
            and snapshot.audit.redact_sensitive_fields
            and snapshot.telemetry.redact_sensitive_fields
        )
        return PromotionGateResult(
            gate_name="observability_sanity",
            passed=passed,
            reason="Observability sanity gate passed." if passed else "Promotion requires audit and telemetry to remain enabled with redaction.",
            metrics_summary={
                "audit_enabled": snapshot.audit.enabled,
                "telemetry_enabled": snapshot.telemetry.enabled,
                "audit_redaction": snapshot.audit.redact_sensitive_fields,
                "telemetry_redaction": snapshot.telemetry.redact_sensitive_fields,
            },
        )
