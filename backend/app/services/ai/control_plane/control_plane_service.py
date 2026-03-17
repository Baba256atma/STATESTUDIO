"""Central AI control plane service for policy lookup, staging, activation, and promotion."""

from __future__ import annotations

from datetime import UTC, datetime
from functools import lru_cache
from pathlib import Path
from typing import Any
from uuid import uuid4

from app.core.config import LocalAISettings, get_local_ai_settings
from app.schemas.control_plane import AIControlPlaneState, AIPolicySnapshot, PolicyVersionInfo
from app.schemas.policy_canary import (
    CanaryAssignmentRequest,
    CanaryAssignmentResult,
    CanaryHealthSummary,
    CanaryLifecycleAction,
    CanaryReleaseState,
    PolicyCanaryConfig,
)
from app.schemas.policy_changes import (
    PolicyActivationResult,
    PolicyApprovalAction,
    PolicyApprovalDecision,
    PolicyApprovalRecord,
    PolicyChangeAuditRecord,
    PolicyChangeDiagnostics,
    PolicyChangeListResponse,
    PolicyChangePreview,
    PolicyChangeRecord,
    PolicyChangeRequest,
)
from app.schemas.policy_experiments import (
    ExperimentAssignmentRequest,
    ExperimentAssignmentResult,
    ExperimentLifecycleAction,
    ExperimentListResponse,
    ExperimentResultsResponse,
    ExperimentRunState,
    PolicyExperimentConfig,
)
from app.schemas.policy_optimization import (
    OptimizationAction,
    OptimizationApplicationResult,
    OptimizationProposalListResponse,
    OptimizationProposalSet,
    PolicyOptimizationProposal,
)
from app.schemas.policy_overlays import (
    EffectivePolicyResolution,
    PolicyOverlayPayload,
    TenantPolicyOverlay,
    WorkspacePolicyOverlay,
)
from app.schemas.policy_promotion import (
    EnvironmentType,
    PolicyEnvironmentListResponse,
    PolicyEnvironmentState,
    PolicyPromotionRequest,
    PolicyPromotionResult,
    PolicyRollbackRequest,
    PolicyRollbackResult,
    PromotionHistoryResponse,
)
from app.schemas.telemetry import TelemetryEvent
from app.services.ai.audit_redaction import minimize_audit_metadata
from app.services.ai.control_plane.canary_assignment import CanaryAssignmentEngine
from app.services.ai.control_plane.canary_health import CanaryHealthEvaluator
from app.services.ai.control_plane.canary_service import CanaryService
from app.services.ai.control_plane.canary_store import CanaryStore
from app.services.ai.control_plane.environment_policy_store import EnvironmentPolicyStore
from app.services.ai.control_plane.default_policies import build_default_policy_snapshot
from app.services.ai.control_plane.experiment_analysis import ExperimentAnalysisEngine
from app.services.ai.control_plane.experiment_assignment import ExperimentAssignmentEngine
from app.services.ai.control_plane.experiment_service import ExperimentService
from app.services.ai.control_plane.experiment_store import ExperimentStore
from app.services.ai.control_plane.optimization_risk import OptimizationRiskEngine
from app.services.ai.control_plane.optimization_service import OptimizationService
from app.services.ai.control_plane.optimization_signals import OptimizationSignalCollector
from app.services.ai.control_plane.optimization_store import OptimizationStore
from app.services.ai.control_plane.overlay_resolver import PolicyOverlayResolver
from app.services.ai.control_plane.overlay_store import PolicyOverlayStore
from app.services.ai.control_plane.policy_approval import PolicyApprovalEngine
from app.services.ai.control_plane.policy_optimizer import PolicyOptimizer
from app.services.ai.control_plane.policy_change_service import PolicyChangeService
from app.services.ai.control_plane.policy_change_store import PolicyChangeStore
from app.services.ai.control_plane.policy_diff import PolicyDiffEngine
from app.services.ai.control_plane.policy_engine import AIPolicyEngine
from app.services.ai.control_plane.policy_loader import PolicyLoader
from app.services.ai.control_plane.policy_rollback import PolicyRollbackService
from app.services.ai.control_plane.policy_validation import PolicyValidator
from app.services.ai.control_plane.promotion_engine import PolicyPromotionEngine
from app.services.ai.control_plane.promotion_gates import PromotionGateEvaluator


class AIControlPlaneService:
    """Source of truth for effective AI policy configuration."""

    def __init__(
        self,
        settings: LocalAISettings | None = None,
        policy_path: str | Path | None = None,
        tenant_dir: str | Path | None = None,
        workspace_dir: str | Path | None = None,
        env_policy_dir: str | Path | None = None,
        canary_state_path: str | Path | None = None,
        experiment_state_path: str | Path | None = None,
        optimization_state_path: str | Path | None = None,
    ) -> None:
        self.settings = settings or get_local_ai_settings()
        self.policy_loader = PolicyLoader(self.settings, policy_path=policy_path)
        self.overlay_store = PolicyOverlayStore(tenant_dir=tenant_dir, workspace_dir=workspace_dir)
        self.overlay_resolver = PolicyOverlayResolver()
        self.policy_diff_engine = PolicyDiffEngine()
        self.policy_validator = PolicyValidator()
        self.policy_approval_engine = PolicyApprovalEngine()
        self.policy_change_store = PolicyChangeStore()
        self.environment_policy_store = EnvironmentPolicyStore(base_dir=env_policy_dir)
        self.canary_store = CanaryStore(state_path=canary_state_path)
        self.canary_assignment_engine = CanaryAssignmentEngine()
        self.canary_health_evaluator = CanaryHealthEvaluator()
        self.experiment_store = ExperimentStore(state_path=experiment_state_path)
        self.experiment_assignment_engine = ExperimentAssignmentEngine()
        self.experiment_analysis_engine = ExperimentAnalysisEngine()
        self.optimization_store = OptimizationStore(state_path=optimization_state_path)
        self.optimization_risk_engine = OptimizationRiskEngine()
        self._canary_telemetry_events: list[TelemetryEvent] = []
        self.promotion_gate_evaluator = PromotionGateEvaluator(self.policy_validator)
        self.promotion_engine = PolicyPromotionEngine(
            store=self.environment_policy_store,
            gates=self.promotion_gate_evaluator,
        )
        self.policy_rollback_service = PolicyRollbackService(self.environment_policy_store)
        self.canary_service = CanaryService(
            store=self.canary_store,
            assignment_engine=self.canary_assignment_engine,
            health_evaluator=self.canary_health_evaluator,
            environment_store=self.environment_policy_store,
            audit_events_fn=self._audit_events,
            telemetry_events_fn=self._telemetry_events,
            audit_record_fn=self._record_audit_event,
            telemetry_record_fn=self._record_telemetry_event,
        )
        self.experiment_service = ExperimentService(
            store=self.experiment_store,
            assignment_engine=self.experiment_assignment_engine,
            analysis_engine=self.experiment_analysis_engine,
            telemetry_events_fn=self._telemetry_events,
            audit_events_fn=self._audit_events,
        )
        self.optimization_signal_collector = OptimizationSignalCollector(
            telemetry_events_fn=self._telemetry_events,
            canary_state_fn=self.get_policy_canary_state,
            experiments_fn=lambda: self.list_policy_experiments().experiments,
            current_policy_fn=self.get_snapshot,
        )
        self.policy_optimizer = PolicyOptimizer(
            risk_engine=self.optimization_risk_engine,
            current_policy_fn=self.get_snapshot,
            canary_state_fn=self.get_policy_canary_state,
            experiments_fn=lambda: self.list_policy_experiments().experiments,
            environment_snapshot_fn=lambda environment: self.get_policy_environment(EnvironmentType(environment)).snapshot,
        )
        self.optimization_service = OptimizationService(
            store=self.optimization_store,
            signal_collector=self.optimization_signal_collector,
            optimizer=self.policy_optimizer,
            auto_apply_enabled_fn=lambda: self.get_evaluation_policy().optimization_auto_apply_enabled,
            submit_policy_change_fn=self.submit_policy_change,
            approve_policy_change_fn=lambda change_id, action: self.approve_policy_change(change_id, action),
            activate_policy_change_fn=lambda change_id, action: self.activate_policy_change(change_id, action),
        )
        self.policy_change_service = PolicyChangeService(
            preview_fn=self.preview_policy_change,
            submit_fn=self.submit_policy_change,
            approve_fn=self.approve_policy_change,
            reject_fn=self.reject_policy_change,
            activate_fn=self.activate_policy_change,
            list_fn=lambda status, scope: self.list_policy_changes(status=status, scope_type=scope),
            get_fn=self.get_policy_change,
            reload_fn=self.reload_policy_changes,
            current_snapshot_fn=lambda tenant_id, workspace_id: self.get_snapshot(
                tenant_id=tenant_id,
                workspace_id=workspace_id,
            ),
        )
        self._snapshot = self._load_defaults()
        self._last_error: str | None = None
        self._overlay_last_error: str | None = None
        self.reload()

    def get_state(self) -> AIControlPlaneState:
        """Return the current control plane state."""
        snapshot = self.get_snapshot()
        return AIControlPlaneState(
            enabled=snapshot.enabled,
            snapshot=snapshot,
            reload_succeeded=self._last_error is None and self._overlay_last_error is None,
            last_error=self._overlay_last_error or self._last_error,
        )

    def get_snapshot(self, *, tenant_id: str | None = None, workspace_id: str | None = None) -> AIPolicySnapshot:
        """Return the effective policy snapshot."""
        if tenant_id or workspace_id:
            return self.resolve_effective_policy(tenant_id=tenant_id, workspace_id=workspace_id).effective_policy
        return self._get_active_global_snapshot()

    def get_version_info(self) -> PolicyVersionInfo:
        """Return the current policy version metadata."""
        return self.get_snapshot().version_info

    def get_routing_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return routing policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).routing

    def get_privacy_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return privacy policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).privacy

    def get_provider_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return provider policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).provider

    def get_model_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return model policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).model

    def get_benchmark_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return benchmark policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).benchmark

    def get_audit_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return audit policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).audit

    def get_telemetry_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return telemetry policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).telemetry

    def get_evaluation_policy(self, *, tenant_id: str | None = None, workspace_id: str | None = None):
        """Return evaluation policy config."""
        return self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id).evaluation

    def get_policy_engine(
        self,
        *,
        tenant_id: str | None = None,
        workspace_id: str | None = None,
    ) -> AIPolicyEngine:
        """Return a policy engine bound to the current snapshot."""
        return AIPolicyEngine(self.get_snapshot(tenant_id=tenant_id, workspace_id=workspace_id))

    def resolve_effective_policy(
        self,
        *,
        tenant_id: str | None = None,
        workspace_id: str | None = None,
    ) -> EffectivePolicyResolution:
        """Resolve effective policy for global, tenant, or workspace scope."""
        return self.overlay_resolver.resolve(
            base_snapshot=self._get_active_global_snapshot(),
            tenant_overlay=self._get_effective_tenant_overlay(tenant_id),
            workspace_overlay=self._get_effective_workspace_overlay(tenant_id=tenant_id, workspace_id=workspace_id),
            tenant_id=tenant_id,
            workspace_id=workspace_id,
        )

    def preview_policy_change(self, request: PolicyChangeRequest | dict[str, Any]) -> PolicyChangePreview:
        """Preview a policy change before storage or activation."""
        request = PolicyChangeRequest.model_validate(request)
        scope_id = self._resolve_scope_id(request)
        before_snapshot = self.get_snapshot(tenant_id=request.tenant_id, workspace_id=request.workspace_id)
        after_snapshot, conflicts, sanitized_payload = self._build_preview_snapshot(request)
        diff = self.policy_diff_engine.diff(before_snapshot.model_dump(), after_snapshot.model_dump())
        validation = self.policy_validator.validate(snapshot=after_snapshot, conflicts=conflicts)
        approval = self.policy_approval_engine.requirement_for(diff.risk_level)
        return PolicyChangePreview(
            scope_type=request.scope_type,
            scope_id=scope_id,
            tenant_id=request.tenant_id,
            workspace_id=request.workspace_id,
            diff=diff,
            validation=validation,
            approval=approval,
            resulting_policy_version=after_snapshot.version_info.policy_version,
            blocked_fields=[conflict.field_path for conflict in conflicts],
        )

    def submit_policy_change(self, request: PolicyChangeRequest | dict[str, Any]) -> PolicyChangeRecord:
        """Validate and store a staged policy change."""
        request = PolicyChangeRequest.model_validate(request)
        now = datetime.now(UTC).isoformat()
        after_snapshot, conflicts, sanitized_payload = self._build_preview_snapshot(request)
        before_snapshot = self.get_snapshot(tenant_id=request.tenant_id, workspace_id=request.workspace_id)
        diff = self.policy_diff_engine.diff(before_snapshot.model_dump(), after_snapshot.model_dump())
        validation = self.policy_validator.validate(snapshot=after_snapshot, conflicts=conflicts)
        approval = self.policy_approval_engine.requirement_for(diff.risk_level)

        status = "pending"
        approval_record = PolicyApprovalRecord(status="pending")
        if not validation.valid:
            status = "validation_failed"
        elif not approval.approval_required:
            status = "approved"
            approval_record = PolicyApprovalRecord(
                status="not_required",
                actor_id="system",
                reason="auto_approved_low_risk",
                timestamp=now,
            )

        record = PolicyChangeRecord(
            change_id=f"policy-change-{uuid4().hex}",
            title=request.title,
            description=request.description,
            scope_type=request.scope_type,
            scope_id=self._resolve_scope_id(request),
            tenant_id=request.tenant_id,
            workspace_id=request.workspace_id,
            proposed_by=request.proposed_by,
            source=request.source,
            created_at=now,
            updated_at=now,
            status=status,
            payload=request.payload,
            sanitized_payload=PolicyOverlayPayload.model_validate(sanitized_payload),
            diff=diff,
            validation=validation,
            approval_requirement=approval,
            approval_record=approval_record,
            resulting_policy_version=after_snapshot.version_info.policy_version,
        )
        self.policy_change_store.save(record)
        self._record_change_audit_event(
            stage="policy_change_submitted",
            record=record,
            success=record.status != "validation_failed",
        )
        self._record_change_audit_event(
            stage="policy_change_validated",
            record=record,
            success=validation.valid,
            reason=validation.issues[0].message if validation.issues else validation.conflicts[0].reason if validation.conflicts else "policy_change_validated",
        )
        if approval.approval_required and status == "pending":
            self._record_change_audit_event(
                stage="policy_change_approval_required",
                record=record,
                success=True,
                reason=approval.reason,
            )
        return record

    def list_policy_changes(
        self,
        *,
        status: str | None = None,
        scope_type: str | None = None,
    ) -> PolicyChangeListResponse:
        """List stored policy changes."""
        return PolicyChangeListResponse(
            changes=self.policy_change_store.list(status=status, scope_type=scope_type)
        )

    def get_policy_change(self, change_id: str) -> PolicyChangeRecord:
        """Return a stored policy change."""
        record = self.policy_change_store.get(change_id)
        if record is None:
            raise KeyError("policy_change_not_found")
        return record

    def approve_policy_change(
        self,
        change_id: str,
        action: PolicyApprovalAction | dict[str, Any],
    ) -> PolicyChangeRecord:
        """Approve a staged policy change."""
        action = PolicyApprovalAction.model_validate(action)
        record = self.get_policy_change(change_id)
        if record.status in {"rejected", "activated"}:
            return record
        record.status = "approved"
        record.updated_at = datetime.now(UTC).isoformat()
        record.approval_record = PolicyApprovalRecord(
            status="approved",
            actor_id=action.actor_id,
            reason=action.reason,
            timestamp=record.updated_at,
        )
        self.policy_change_store.save(record)
        self._record_change_audit_event(
            stage="policy_change_approved",
            record=record,
            success=True,
            reason=action.reason,
        )
        return record

    def reject_policy_change(
        self,
        change_id: str,
        action: PolicyApprovalAction | dict[str, Any],
    ) -> PolicyChangeRecord:
        """Reject a staged policy change."""
        action = PolicyApprovalAction.model_validate(action)
        record = self.get_policy_change(change_id)
        record.status = "rejected"
        record.updated_at = datetime.now(UTC).isoformat()
        record.approval_record = PolicyApprovalRecord(
            status="rejected",
            actor_id=action.actor_id,
            reason=action.reason,
            timestamp=record.updated_at,
        )
        self.policy_change_store.save(record)
        self._record_change_audit_event(
            stage="policy_change_rejected",
            record=record,
            success=True,
            reason=action.reason,
        )
        return record

    def activate_policy_change(
        self,
        change_id: str,
        action: PolicyApprovalAction | dict[str, Any],
    ) -> PolicyChangeRecord:
        """Activate an approved policy change with last-known-good safety."""
        action = PolicyApprovalAction.model_validate(action)
        record = self.get_policy_change(change_id)
        if record.status not in {"approved", "activated"}:
            raise ValueError("policy_change_not_approved")

        after_snapshot, conflicts, sanitized_payload = self._build_preview_snapshot(
            PolicyChangeRequest(
                title=record.title,
                description=record.description,
                scope_type=record.scope_type,
                tenant_id=record.tenant_id,
                workspace_id=record.workspace_id,
                proposed_by=record.proposed_by,
                source=record.source,
                payload=record.sanitized_payload,
            )
        )
        validation = self.policy_validator.validate(snapshot=after_snapshot, conflicts=conflicts)
        diff = self.policy_diff_engine.diff(
            self.get_snapshot(tenant_id=record.tenant_id, workspace_id=record.workspace_id).model_dump(),
            after_snapshot.model_dump(),
        )
        record.validation = validation
        record.diff = diff
        record.sanitized_payload = PolicyOverlayPayload.model_validate(sanitized_payload)
        record.resulting_policy_version = after_snapshot.version_info.policy_version

        if not validation.valid:
            record.status = "activation_failed"
            record.updated_at = datetime.now(UTC).isoformat()
            record.activation = PolicyActivationResult(
                activated=False,
                activated_at=record.updated_at,
                activated_by=action.actor_id,
                effective_policy_version=record.resulting_policy_version,
                message="Activation blocked because validation failed against current policy state.",
            )
            self.policy_change_store.save(record)
            self._record_change_audit_event(
                stage="policy_change_activation_failed",
                record=record,
                success=False,
                reason=validation.issues[0].message if validation.issues else "policy_change_activation_failed",
            )
            return record

        scope_key = self._scope_key(record.scope_type, record.tenant_id, record.workspace_id)
        previous_active = self.policy_change_store.activate(scope_key, record.change_id)
        record.status = "activated"
        record.updated_at = datetime.now(UTC).isoformat()
        record.activation = PolicyActivationResult(
            activated=True,
            activated_at=record.updated_at,
            activated_by=action.actor_id,
            previous_active_change_id=previous_active,
            effective_policy_version=record.resulting_policy_version,
            message="Policy change activated successfully.",
        )
        self.policy_change_store.save(record)
        self._record_change_audit_event(
            stage="policy_change_activated",
            record=record,
            success=True,
            reason=action.reason,
        )
        self._sync_environment_runtime()
        return record

    def get_policy_change_diagnostics(self) -> PolicyChangeDiagnostics:
        """Return policy change diagnostics."""
        return self.policy_change_store.diagnostics()

    def get_pending_policy_changes(self) -> PolicyChangeListResponse:
        """Return pending policy changes only."""
        return self.policy_change_service.list_pending()

    def get_policy_change_history(self) -> PolicyChangeListResponse:
        """Return policy change history."""
        return self.policy_change_service.list_history()

    def get_policy_change_diff(self, change_id: str):
        """Return diff details for a stored policy change."""
        return self.policy_change_service.diff_for(change_id)

    def validate_policy_change(self, request: PolicyChangeRequest | dict[str, Any]):
        """Return validation result for a proposed policy change."""
        return self.policy_change_service.validate(request)

    def get_policy_change_approval_decision(self, change_id: str) -> PolicyApprovalDecision:
        """Return approval decision metadata for a stored policy change."""
        record = self.get_policy_change(change_id)
        return PolicyApprovalDecision(
            status=record.approval_record.status,
            actor_id=record.approval_record.actor_id,
            reason=record.approval_record.reason,
            timestamp=record.approval_record.timestamp,
            approval_required=record.approval_requirement.approval_required,
            decision_reason=record.approval_requirement.reason,
        )

    def get_policy_change_audit_record(self, change_id: str) -> PolicyChangeAuditRecord:
        """Return compact audit-ready metadata for a stored policy change."""
        record = self.get_policy_change(change_id)
        return PolicyChangeAuditRecord(
            change_id=record.change_id,
            scope_type=record.scope_type,
            scope_id=record.scope_id,
            base_policy_version=self.get_snapshot().version_info.policy_version,
            proposed_policy_version=record.resulting_policy_version,
            approval_status=record.approval_record.status,
            approved_by=record.approval_record.actor_id,
            activation_allowed=record.status in {"approved", "activated"},
            decision_reason=record.approval_record.reason or record.approval_requirement.reason,
        )

    def list_policy_environments(self) -> PolicyEnvironmentListResponse:
        """Return the current environment states."""
        self._sync_environment_runtime()
        return self.environment_policy_store.list_environment_states()

    def get_policy_environment(self, environment: EnvironmentType) -> PolicyEnvironmentState:
        """Return one environment state."""
        self._sync_environment_runtime()
        return self.environment_policy_store.get_environment_state(environment)

    def get_policy_promotion_history(self) -> PromotionHistoryResponse:
        """Return promotion and rollback history."""
        return self.environment_policy_store.get_history()

    def promote_policy(self, request: PolicyPromotionRequest | dict[str, Any]) -> PolicyPromotionResult:
        """Promote a policy between adjacent environments."""
        request = PolicyPromotionRequest.model_validate(request)
        self._sync_environment_runtime()
        result = self.promotion_engine.promote(request)

        if result.promotion_status == "promoted" and request.target_environment == EnvironmentType.PRODUCTION:
            self._snapshot = self.environment_policy_store.get_snapshot(EnvironmentType.PRODUCTION)

        if result.promotion_status == "promoted":
            self._record_promotion_audit_event(
                stage="policy_promoted",
                result=result,
                success=True,
                reason=result.promotion_reason or "policy_promoted",
            )
        elif result.gate_results:
            for gate_result in result.gate_results:
                if not gate_result.passed:
                    self._record_promotion_audit_event(
                        stage="promotion_gate_failed",
                        result=result,
                        success=False,
                        reason=f"{gate_result.gate_name}: {gate_result.reason}",
                    )
            self._record_promotion_audit_event(
                stage="promotion_blocked",
                result=result,
                success=False,
                reason=result.promotion_reason,
            )
        else:
            self._record_promotion_audit_event(
                stage="promotion_blocked",
                result=result,
                success=False,
                reason=result.promotion_reason,
            )

        return result

    def rollback_policy_environment(
        self,
        environment: EnvironmentType,
        request: PolicyRollbackRequest | dict[str, Any],
    ) -> PolicyRollbackResult:
        """Rollback one environment to its last-known-good policy."""
        request = PolicyRollbackRequest.model_validate(request)
        result = self.policy_rollback_service.rollback(environment=environment, request=request)
        if result.rolled_back and environment == EnvironmentType.PRODUCTION:
            self._snapshot = self.environment_policy_store.get_snapshot(EnvironmentType.PRODUCTION)
        self._record_rollback_audit_event(result=result)
        return result

    def start_policy_canary(
        self,
        config: PolicyCanaryConfig | dict[str, Any],
        action: CanaryLifecycleAction | dict[str, Any],
    ) -> CanaryReleaseState:
        """Start a policy canary release."""
        config = PolicyCanaryConfig.model_validate(config)
        action = CanaryLifecycleAction.model_validate(action)
        state = self.canary_service.start(config, action)
        self._record_canary_audit_event(
            stage="canary_started",
            state=state,
            success=True,
            reason=action.reason or "Canary started.",
        )
        return state

    def pause_policy_canary(self, action: CanaryLifecycleAction | dict[str, Any]) -> CanaryReleaseState:
        """Pause the active canary release."""
        action = CanaryLifecycleAction.model_validate(action)
        state = self.canary_service.pause(action)
        self._record_canary_audit_event(
            stage="canary_paused",
            state=state,
            success=True,
            reason=action.reason,
        )
        return state

    def resume_policy_canary(self, action: CanaryLifecycleAction | dict[str, Any]) -> CanaryReleaseState:
        """Resume the active canary release."""
        action = CanaryLifecycleAction.model_validate(action)
        state = self.canary_service.resume(action)
        self._record_canary_audit_event(
            stage="canary_resumed",
            state=state,
            success=True,
            reason=action.reason,
        )
        return state

    def rollback_policy_canary(self, action: CanaryLifecycleAction | dict[str, Any]) -> CanaryReleaseState:
        """Rollback the active canary release."""
        action = CanaryLifecycleAction.model_validate(action)
        state = self.canary_service.rollback(action)
        self._record_canary_audit_event(
            stage="canary_rolled_back",
            state=state,
            success=True,
            reason=action.reason,
        )
        return state

    def promote_policy_canary(self, action: CanaryLifecycleAction | dict[str, Any]) -> CanaryReleaseState:
        """Promote the active canary policy to stable production."""
        action = CanaryLifecycleAction.model_validate(action)
        state = self.canary_service.promote(action)
        self.environment_policy_store.set_snapshot(
            EnvironmentType.PRODUCTION,
            state.canary_snapshot,
            source_environment=state.source_environment,
        )
        self._snapshot = self.environment_policy_store.get_snapshot(EnvironmentType.PRODUCTION)
        self._record_canary_audit_event(
            stage="canary_promoted",
            state=state,
            success=True,
            reason=action.reason,
        )
        return state

    def get_policy_canary_state(self) -> CanaryReleaseState | None:
        """Return the active canary release state."""
        return self.canary_service.get_state()

    def get_policy_canary_health(self) -> CanaryHealthSummary | None:
        """Return canary health and apply deterministic control actions."""
        state = self.canary_service.evaluate_health()
        if state is None or state.health_summary is None:
            return None
        if state.decision is not None and state.decision.health_status == "degraded":
            self._record_canary_audit_event(
                stage="canary_health_degraded",
                state=state,
                success=False,
                reason=state.decision.decision_reason,
            )
            if state.status == "rolled_back":
                self._record_canary_audit_event(
                    stage="canary_rolled_back",
                    state=state,
                    success=True,
                    reason=state.decision.decision_reason,
                )
            elif state.status == "paused":
                self._record_canary_audit_event(
                    stage="canary_paused",
                    state=state,
                    success=True,
                    reason=state.decision.decision_reason,
                )
        return state.health_summary

    def assign_policy_canary(self, request: CanaryAssignmentRequest | dict[str, Any]) -> CanaryAssignmentResult:
        """Return deterministic canary assignment for one request."""
        request = CanaryAssignmentRequest.model_validate(request)
        return self.canary_service.assign_request(request)

    def create_policy_experiment(
        self,
        config: PolicyExperimentConfig | dict[str, Any],
        action: ExperimentLifecycleAction | dict[str, Any],
    ) -> ExperimentRunState:
        """Create a draft policy experiment."""
        config = PolicyExperimentConfig.model_validate(config)
        action = ExperimentLifecycleAction.model_validate(action)
        experiment = self.experiment_service.create(config, action)
        self._record_experiment_audit_event(
            stage="experiment_created",
            experiment=experiment,
            success=True,
            reason=action.reason,
        )
        return experiment

    def start_policy_experiment(
        self,
        experiment_id: str,
        action: ExperimentLifecycleAction | dict[str, Any],
    ) -> ExperimentRunState:
        """Start a policy experiment."""
        action = ExperimentLifecycleAction.model_validate(action)
        experiment = self.experiment_service.start(experiment_id, action)
        self._record_experiment_audit_event(
            stage="experiment_started",
            experiment=experiment,
            success=True,
            reason=action.reason,
        )
        return experiment

    def pause_policy_experiment(
        self,
        experiment_id: str,
        action: ExperimentLifecycleAction | dict[str, Any],
    ) -> ExperimentRunState:
        """Pause a policy experiment."""
        action = ExperimentLifecycleAction.model_validate(action)
        experiment = self.experiment_service.pause(experiment_id, action)
        self._record_experiment_audit_event(
            stage="experiment_paused",
            experiment=experiment,
            success=True,
            reason=action.reason,
        )
        return experiment

    def stop_policy_experiment(
        self,
        experiment_id: str,
        action: ExperimentLifecycleAction | dict[str, Any],
    ) -> ExperimentRunState:
        """Stop a policy experiment safely."""
        action = ExperimentLifecycleAction.model_validate(action)
        experiment = self.experiment_service.stop(experiment_id, action)
        self._record_experiment_audit_event(
            stage="experiment_stopped",
            experiment=experiment,
            success=True,
            reason=action.reason,
        )
        return experiment

    def complete_policy_experiment(
        self,
        experiment_id: str,
        action: ExperimentLifecycleAction | dict[str, Any],
    ) -> ExperimentRunState:
        """Complete a policy experiment and persist the latest decision."""
        action = ExperimentLifecycleAction.model_validate(action)
        experiment = self.experiment_service.complete(experiment_id, action)
        self._record_experiment_audit_event(
            stage="experiment_completed",
            experiment=experiment,
            success=True,
            reason=experiment.decision_reason,
        )
        if experiment.winning_variant is not None:
            self._record_experiment_audit_event(
                stage="experiment_winner_selected",
                experiment=experiment,
                success=True,
                reason=experiment.decision_reason,
            )
        return experiment

    def list_policy_experiments(self) -> ExperimentListResponse:
        """Return all stored policy experiments."""
        return self.experiment_service.list()

    def get_policy_experiment(self, experiment_id: str) -> ExperimentRunState:
        """Return one stored policy experiment."""
        return self.experiment_service.get(experiment_id)

    def get_policy_experiment_results(self, experiment_id: str) -> ExperimentResultsResponse:
        """Return experiment metrics and recommendation."""
        results = self.experiment_service.results(experiment_id)
        if results.decision is not None and results.decision.winning_variant is not None:
            self._record_experiment_audit_event(
                stage="experiment_winner_selected",
                experiment=results.experiment,
                success=True,
                reason=results.decision.decision_reason,
            )
        return results

    def assign_policy_experiment(
        self,
        experiment_id: str,
        request: ExperimentAssignmentRequest | dict[str, Any],
    ) -> ExperimentAssignmentResult:
        """Return deterministic experiment assignment for one request."""
        request = ExperimentAssignmentRequest.model_validate(request)
        result = self.experiment_service.assign(experiment_id, request)
        self._record_audit_event(
            trace_id=request.trace_id or request.request_id or experiment_id,
            stage="experiment_assigned",
            task_type="policy_experiment",
            decision_reason=result.decision_reason,
            success=True,
            metadata={
                "experiment_id": result.experiment_id,
                "experiment_name": result.experiment_name,
                "selected_variant": result.selected_variant,
                "policy_version": result.assigned_policy_version,
                "assignment_scope": result.assignment_scope,
                "traffic_split": result.traffic_split,
                "tenant_id": result.tenant_id,
                "workspace_id": result.workspace_id,
                "request_hash_bucket": result.request_hash_bucket,
            },
        )
        self._record_telemetry_event(
            trace_id=request.trace_id or request.request_id or experiment_id,
            stage="experiment_assigned",
            task_type="policy_experiment",
            success=True,
            metadata={
                "experiment_id": result.experiment_id,
                "experiment_name": result.experiment_name,
                "selected_variant": result.selected_variant,
                "policy_version": result.assigned_policy_version,
                "assignment_scope": result.assignment_scope,
                "traffic_split": result.traffic_split,
                "tenant_id": result.tenant_id,
                "workspace_id": result.workspace_id,
                "request_hash_bucket": result.request_hash_bucket,
            },
        )
        return result

    def run_policy_optimization(self) -> OptimizationProposalSet:
        """Run deterministic optimization heuristics and store resulting proposals."""
        self._record_audit_event(
            trace_id=f"optimization:{datetime.now(UTC).isoformat()}",
            stage="optimization_run_started",
            task_type="policy_optimization",
            decision_reason="Optimization run started.",
            success=True,
            metadata={"policy_version": self.get_version_info().policy_version},
        )
        proposal_set = self.optimization_service.run()
        for proposal in proposal_set.proposals:
            self._record_optimization_audit_event(
                stage="optimization_proposal_created",
                proposal=proposal,
                success=True,
                reason=proposal.decision.decision_reason,
            )
        for result in proposal_set.auto_applied_results:
            if result.applied:
                proposal = self.get_policy_optimization_proposal(result.proposal_id)
                self._record_optimization_audit_event(
                    stage="optimization_proposal_applied",
                    proposal=proposal,
                    success=True,
                    reason=result.decision_reason,
                )
        return proposal_set

    def list_policy_optimization_proposals(self) -> OptimizationProposalListResponse:
        """Return stored optimization proposals."""
        return self.optimization_service.list_proposals()

    def get_policy_optimization_proposal(self, proposal_id: str) -> PolicyOptimizationProposal:
        """Return one optimization proposal."""
        return self.optimization_service.get_proposal(proposal_id)

    def approve_policy_optimization_proposal(
        self,
        proposal_id: str,
        action: OptimizationAction | dict[str, Any],
    ) -> PolicyOptimizationProposal:
        """Approve one optimization proposal."""
        action = OptimizationAction.model_validate(action)
        proposal = self.optimization_service.approve(proposal_id, action)
        self._record_optimization_audit_event(
            stage="optimization_proposal_approved",
            proposal=proposal,
            success=True,
            reason=action.reason,
        )
        return proposal

    def reject_policy_optimization_proposal(
        self,
        proposal_id: str,
        action: OptimizationAction | dict[str, Any],
    ) -> PolicyOptimizationProposal:
        """Reject one optimization proposal."""
        action = OptimizationAction.model_validate(action)
        proposal = self.optimization_service.reject(proposal_id, action)
        self._record_optimization_audit_event(
            stage="optimization_proposal_rejected",
            proposal=proposal,
            success=True,
            reason=action.reason,
        )
        return proposal

    def apply_policy_optimization_proposal(
        self,
        proposal_id: str,
        action: OptimizationAction | dict[str, Any],
    ) -> OptimizationApplicationResult:
        """Apply one optimization proposal through policy governance workflow."""
        action = OptimizationAction.model_validate(action)
        result = self.optimization_service.apply(proposal_id, action)
        proposal = self.get_policy_optimization_proposal(proposal_id)
        self._record_optimization_audit_event(
            stage="optimization_proposal_applied",
            proposal=proposal,
            success=result.applied,
            reason=result.decision_reason,
        )
        return result

    def reload(self) -> AIControlPlaneState:
        """Reload policy from storage while retaining the last known-good state on failure."""
        try:
            self._snapshot = self.policy_loader.load()
            self._last_error = None
        except Exception as exc:
            self._last_error = str(exc)
        self.reload_overlays()
        self.reload_policy_changes()
        self._reload_environment_policies()
        self.canary_store.reload()
        self.experiment_store.reload()
        self.optimization_store.reload()
        return self.get_state()

    def reload_overlays(self) -> AIControlPlaneState:
        """Reload tenant and workspace overlays while retaining last known-good state on failure."""
        reloaded = self.overlay_store.reload()
        self._overlay_last_error = None if reloaded else self.overlay_store.last_error()
        return self.get_state()

    def reload_policy_changes(self) -> PolicyChangeDiagnostics:
        """Revalidate active staged policy changes."""
        try:
            for scope_key, change_id in list(self.policy_change_store.diagnostics().active_changes.items()):
                record = self.policy_change_store.get(change_id)
                if record is None:
                    self.policy_change_store.clear_active(scope_key)
                    continue
                after_snapshot, conflicts, _ = self._build_preview_snapshot(
                    PolicyChangeRequest(
                        title=record.title,
                        description=record.description,
                        scope_type=record.scope_type,
                        tenant_id=record.tenant_id,
                        workspace_id=record.workspace_id,
                        proposed_by=record.proposed_by,
                        source=record.source,
                        payload=record.sanitized_payload,
                    )
                )
                validation = self.policy_validator.validate(snapshot=after_snapshot, conflicts=conflicts)
                if validation.valid:
                    continue
                fallback_change_id = self.policy_change_store.get_last_known_good_change_id(scope_key)
                if fallback_change_id:
                    self.policy_change_store.activate(scope_key, fallback_change_id)
                else:
                    self.policy_change_store.clear_active(scope_key)
            self.policy_change_store.mark_reload(succeeded=True, error=None)
        except Exception as exc:
            self.policy_change_store.mark_reload(succeeded=False, error=str(exc))
        self._sync_environment_runtime()
        return self.policy_change_store.diagnostics()

    def _get_active_global_snapshot(self) -> AIPolicySnapshot:
        active_change_id = self.policy_change_store.get_active_change_id(self._scope_key("global", None, None))
        if active_change_id is None:
            return self._snapshot
        record = self.policy_change_store.get(active_change_id)
        if record is None:
            return self._snapshot
        payload = _deep_merge(self._snapshot.model_dump(), record.sanitized_payload.model_dump(exclude_none=True))
        snapshot = AIPolicySnapshot.model_validate(payload)
        snapshot.version_info.updated_at = record.activation.activated_at
        snapshot.version_info.source = f"activated_change:{record.change_id}"
        snapshot.version_info.policy_version = record.activation.effective_policy_version or record.resulting_policy_version
        return snapshot

    def _get_effective_tenant_overlay(self, tenant_id: str | None) -> TenantPolicyOverlay | None:
        if not tenant_id:
            return None
        overlay = self.overlay_store.get_tenant_overlay(tenant_id)
        active_change_id = self.policy_change_store.get_active_change_id(self._scope_key("tenant", tenant_id, None))
        if active_change_id is None:
            return overlay
        record = self.policy_change_store.get(active_change_id)
        if record is None:
            return overlay
        return self._merge_overlay_payload(
            overlay=overlay,
            payload=record.sanitized_payload,
            scope_type="tenant",
            scope_id=tenant_id,
            tenant_id=tenant_id,
            source=f"activated_change:{record.change_id}",
            policy_version=record.activation.effective_policy_version or record.resulting_policy_version,
        )

    def _get_effective_workspace_overlay(
        self,
        *,
        tenant_id: str | None,
        workspace_id: str | None,
    ) -> WorkspacePolicyOverlay | None:
        if not workspace_id:
            return None
        overlay = self.overlay_store.get_workspace_overlay(workspace_id)
        active_change_id = self.policy_change_store.get_active_change_id(
            self._scope_key("workspace", tenant_id, workspace_id)
        )
        if active_change_id is None:
            return overlay
        record = self.policy_change_store.get(active_change_id)
        if record is None:
            return overlay
        return self._merge_overlay_payload(
            overlay=overlay,
            payload=record.sanitized_payload,
            scope_type="workspace",
            scope_id=workspace_id,
            tenant_id=tenant_id,
            source=f"activated_change:{record.change_id}",
            policy_version=record.activation.effective_policy_version or record.resulting_policy_version,
        )

    def _build_preview_snapshot(
        self,
        request: PolicyChangeRequest,
    ) -> tuple[AIPolicySnapshot, list, dict[str, Any]]:
        if request.scope_type == "global":
            candidate_payload = _deep_merge(
                self.get_snapshot().model_dump(),
                request.payload.model_dump(exclude_none=True),
            )
            snapshot = AIPolicySnapshot.model_validate(candidate_payload)
            snapshot.version_info.updated_at = datetime.now(UTC).isoformat()
            snapshot.version_info.source = "staged_change"
            snapshot.version_info.policy_version = _build_change_version(
                self.get_snapshot().version_info.policy_version,
                "global",
                "global",
            )
            return snapshot, [], request.payload.model_dump(exclude_none=True)

        tenant_overlay = self._get_effective_tenant_overlay(request.tenant_id)
        workspace_overlay = self._get_effective_workspace_overlay(
            tenant_id=request.tenant_id,
            workspace_id=request.workspace_id,
        )

        if request.scope_type == "tenant":
            tenant_overlay = self._merge_overlay_payload(
                overlay=tenant_overlay,
                payload=request.payload,
                scope_type="tenant",
                scope_id=request.tenant_id or "tenant",
                tenant_id=request.tenant_id,
            )
            sanitized_payload = tenant_overlay.overlay.model_dump(exclude_none=True)
        else:
            workspace_overlay = self._merge_overlay_payload(
                overlay=workspace_overlay,
                payload=request.payload,
                scope_type="workspace",
                scope_id=request.workspace_id or "workspace",
                tenant_id=request.tenant_id,
            )
            sanitized_payload = workspace_overlay.overlay.model_dump(exclude_none=True)

        resolution = self.overlay_resolver.resolve(
            base_snapshot=self._get_active_global_snapshot(),
            tenant_overlay=tenant_overlay,
            workspace_overlay=workspace_overlay,
            tenant_id=request.tenant_id,
            workspace_id=request.workspace_id,
        )
        return resolution.effective_policy, resolution.conflicts, sanitized_payload

    def _merge_overlay_payload(
        self,
        *,
        overlay: TenantPolicyOverlay | WorkspacePolicyOverlay | None,
        payload: PolicyOverlayPayload,
        scope_type: str,
        scope_id: str,
        tenant_id: str | None,
        source: str = "staged_change",
        policy_version: str | None = None,
    ) -> TenantPolicyOverlay | WorkspacePolicyOverlay:
        base_payload = overlay.overlay.model_dump(exclude_none=True) if overlay is not None else {}
        merged_payload = _deep_merge(base_payload, payload.model_dump(exclude_none=True))
        version = policy_version or _build_change_version(self.get_snapshot().version_info.policy_version, scope_type, scope_id)
        if scope_type == "tenant":
            return TenantPolicyOverlay.model_validate(
                {
                    "scope_id": scope_id,
                    "policy_version": version,
                    "source": source if overlay is None else overlay.source,
                    "enabled": True if overlay is None else overlay.enabled,
                    "overlay_priority": 100 if overlay is None else overlay.overlay_priority,
                    "inherited_from": "global" if overlay is None else overlay.inherited_from,
                    "overlay": merged_payload,
                }
            )
        return WorkspacePolicyOverlay.model_validate(
            {
                "scope_id": scope_id,
                "tenant_id": tenant_id,
                "policy_version": version,
                "source": source if overlay is None else overlay.source,
                "enabled": True if overlay is None else overlay.enabled,
                "overlay_priority": 200 if overlay is None else overlay.overlay_priority,
                "inherited_from": "tenant" if overlay is None else overlay.inherited_from,
                "overlay": merged_payload,
            }
        )

    def _resolve_scope_id(self, request: PolicyChangeRequest) -> str:
        if request.scope_type == "global":
            return "global"
        if request.scope_type == "tenant":
            if not request.tenant_id:
                raise ValueError("tenant_scope_requires_tenant_id")
            return request.tenant_id or "tenant"
        if not request.workspace_id:
            raise ValueError("workspace_scope_requires_workspace_id")
        return request.workspace_id or "workspace"

    @staticmethod
    def _scope_key(scope_type: str, tenant_id: str | None, workspace_id: str | None) -> str:
        if scope_type == "global":
            return "global:global"
        if scope_type == "tenant":
            return f"tenant:{tenant_id}"
        return f"workspace:{tenant_id}:{workspace_id}"

    def _reload_environment_policies(self) -> None:
        if not self.environment_policy_store.reload(self._get_active_global_snapshot()):
            return
        self._sync_environment_runtime()
        production_snapshot = self.environment_policy_store.get_snapshot(EnvironmentType.PRODUCTION)
        if production_snapshot.version_info.policy_version:
            self._snapshot = production_snapshot

    def _sync_environment_runtime(self) -> None:
        self.environment_policy_store.sync_runtime_environment(
            EnvironmentType.LOCAL,
            self._get_active_global_snapshot(),
        )

    def _record_change_audit_event(
        self,
        *,
        stage: str,
        record: PolicyChangeRecord,
        success: bool,
        reason: str | None = None,
    ) -> None:
        try:
            from app.services.ai.audit_logger import get_audit_logger

            get_audit_logger().record_event(
                trace_id=record.change_id,
                stage=stage,
                task_type="policy_change",
                decision_reason=reason or record.diff.summary,
                policy_tags=[record.scope_type, record.status],
                success=success,
                metadata={
                    "scope_type": record.scope_type,
                    "scope_id": record.scope_id,
                    "tenant_id": record.tenant_id,
                    "workspace_id": record.workspace_id,
                    "risk_level": record.diff.risk_level,
                    "resulting_policy_version": record.resulting_policy_version,
                },
            )
        except Exception:
            return

    def _record_promotion_audit_event(
        self,
        *,
        stage: str,
        result: PolicyPromotionResult,
        success: bool,
        reason: str | None = None,
    ) -> None:
        try:
            from app.services.ai.audit_logger import get_audit_logger

            get_audit_logger().record_event(
                trace_id=result.promotion_id,
                stage=stage,
                task_type="policy_promotion",
                decision_reason=reason or result.promotion_reason,
                policy_tags=[result.source_environment.value, result.target_environment.value, result.promotion_status],
                success=success,
                metadata={
                    "source_environment": result.source_environment.value,
                    "target_environment": result.target_environment.value,
                    "policy_version": result.policy_version,
                    "approved_by": result.approved_by,
                },
            )
        except Exception:
            return

    def _record_rollback_audit_event(self, *, result: PolicyRollbackResult) -> None:
        try:
            from app.services.ai.audit_logger import get_audit_logger

            get_audit_logger().record_event(
                trace_id=f"rollback:{result.environment.value}:{result.rollback_timestamp}",
                stage="policy_rolled_back",
                task_type="policy_promotion",
                decision_reason=result.reason,
                policy_tags=[result.environment.value, "rolled_back" if result.rolled_back else "rollback_blocked"],
                success=result.rolled_back,
                metadata={
                    "environment": result.environment.value,
                    "policy_version": result.policy_version,
                    "previous_policy_version": result.previous_policy_version,
                    "actor_id": result.actor_id,
                },
            )
        except Exception:
            return

    def _record_canary_audit_event(
        self,
        *,
        stage: str,
        state: CanaryReleaseState,
        success: bool,
        reason: str | None = None,
    ) -> None:
        self._record_audit_event(
            trace_id=f"canary:{state.canary_policy_version}",
            stage=stage,
            task_type="policy_canary",
            decision_reason=reason or state.decision_reason,
            policy_tags=[state.status, state.assignment_scope],
            success=success,
            metadata={
                "stable_policy_version": state.stable_policy_version,
                "canary_policy_version": state.canary_policy_version,
                "traffic_percentage": state.traffic_percentage,
                "source_environment": state.source_environment.value,
                "target_environment": state.target_environment.value,
                "tenant_id": state.tenant_id,
                "workspace_id": state.workspace_id,
            },
        )

    def _record_experiment_audit_event(
        self,
        *,
        stage: str,
        experiment: ExperimentRunState,
        success: bool,
        reason: str | None = None,
    ) -> None:
        self._record_audit_event(
            trace_id=experiment.experiment_id,
            stage=stage,
            task_type="policy_experiment",
            decision_reason=reason or experiment.decision_reason,
            policy_tags=[experiment.status, experiment.assignment_scope],
            success=success,
            metadata={
                "experiment_name": experiment.experiment_name,
                "control_policy_version": experiment.control_policy_version,
                "variant_policy_versions": {
                    variant.variant_name: variant.policy_version for variant in experiment.variants
                },
                "traffic_split": experiment.traffic_split,
                "tenant_id": experiment.tenant_id,
                "workspace_id": experiment.workspace_id,
                "winning_variant": experiment.winning_variant,
            },
        )

    def _record_optimization_audit_event(
        self,
        *,
        stage: str,
        proposal: PolicyOptimizationProposal,
        success: bool,
        reason: str | None = None,
    ) -> None:
        self._record_audit_event(
            trace_id=proposal.proposal_id,
            stage=stage,
            task_type="policy_optimization",
            decision_reason=reason or proposal.decision.decision_reason,
            policy_tags=[proposal.status, proposal.optimization_type],
            success=success,
            metadata={
                "current_policy_version": proposal.current_policy_version,
                "target_scope": proposal.target_scope,
                "risk_level": proposal.risk_assessment.risk_level,
                "approval_required": proposal.risk_assessment.approval_required,
                "auto_apply_eligible": proposal.risk_assessment.auto_apply_eligible,
                "linked_policy_change_id": proposal.linked_policy_change_id,
            },
        )

    def _record_audit_event(self, **kwargs) -> bool:
        try:
            from app.services.ai.audit_logger import get_audit_logger

            return get_audit_logger().record_event(**kwargs)
        except Exception:
            return False

    def _audit_events(self, limit: int) -> list:
        try:
            from app.services.ai.audit_logger import get_audit_logger

            return get_audit_logger().list_events(limit=limit)
        except Exception:
            return []

    def _record_telemetry_event(
        self,
        *,
        trace_id: str,
        stage: str,
        task_type: str | None = None,
        provider: str | None = None,
        model: str | None = None,
        latency_ms: float | None = None,
        token_usage: dict[str, int] | None = None,
        fallback_used: bool = False,
        benchmark_used: bool = False,
        routing_reason: str | None = None,
        privacy_mode: str | None = None,
        sensitivity_level: str | None = None,
        success: bool | None = None,
        error_code: str | None = None,
        metadata: dict | None = None,
    ) -> bool:
        event = TelemetryEvent(
            trace_id=trace_id,
            timestamp=datetime.now(UTC).isoformat(),
            stage=stage,  # type: ignore[arg-type]
            task_type=task_type,
            provider=provider,
            model=model,
            latency_ms=round(latency_ms, 2) if latency_ms is not None else None,
            token_usage=token_usage,
            fallback_used=fallback_used,
            benchmark_used=benchmark_used,
            routing_reason=routing_reason,
            privacy_mode=privacy_mode,
            sensitivity_level=sensitivity_level,
            success=success,
            error_code=error_code,
            metadata=minimize_audit_metadata(
                metadata or {},
                sensitivity_level=sensitivity_level,
                redact_sensitive_fields=True,
                include_provider_metadata=False,
            ),
        )
        self._canary_telemetry_events.append(event)
        max_events = self.get_telemetry_policy().max_events
        if len(self._canary_telemetry_events) > max_events:
            self._canary_telemetry_events = self._canary_telemetry_events[-max_events:]
        return True

    def _telemetry_events(self, limit: int) -> list[TelemetryEvent]:
        if limit >= 0:
            return self._canary_telemetry_events[-limit:]
        return list(self._canary_telemetry_events)

    def _load_defaults(self) -> AIPolicySnapshot:
        return build_default_policy_snapshot(self.settings)


@lru_cache(maxsize=1)
def get_ai_control_plane_service() -> AIControlPlaneService:
    """Return the shared AI control plane service."""
    return AIControlPlaneService()


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _build_change_version(base_policy_version: str, scope_type: str, scope_id: str) -> str:
    return f"{base_policy_version}|staged:{scope_type}:{scope_id}"
