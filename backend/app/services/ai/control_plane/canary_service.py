"""Policy canary release orchestration."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Callable

from app.schemas.policy_canary import (
    CanaryAssignmentRequest,
    CanaryAssignmentResult,
    CanaryLifecycleAction,
    CanaryReleaseState,
    PolicyCanaryConfig,
)
from app.schemas.policy_promotion import EnvironmentType
from app.services.ai.control_plane.canary_assignment import CanaryAssignmentEngine
from app.services.ai.control_plane.canary_health import CanaryHealthEvaluator
from app.services.ai.control_plane.canary_store import CanaryStore
from app.services.ai.control_plane.environment_policy_store import EnvironmentPolicyStore


class CanaryService:
    """Manage canary lifecycle, assignment, and health decisions."""

    def __init__(
        self,
        *,
        store: CanaryStore,
        assignment_engine: CanaryAssignmentEngine,
        health_evaluator: CanaryHealthEvaluator,
        environment_store: EnvironmentPolicyStore,
        audit_events_fn: Callable[[int], list],
        telemetry_events_fn: Callable[[int], list],
        audit_record_fn: Callable[..., bool],
        telemetry_record_fn: Callable[..., bool],
    ) -> None:
        self.store = store
        self.assignment_engine = assignment_engine
        self.health_evaluator = health_evaluator
        self.environment_store = environment_store
        self.audit_events_fn = audit_events_fn
        self.telemetry_events_fn = telemetry_events_fn
        self.audit_record_fn = audit_record_fn
        self.telemetry_record_fn = telemetry_record_fn
        self.store.reload()

    def start(self, config: PolicyCanaryConfig, action: CanaryLifecycleAction) -> CanaryReleaseState:
        """Start a canary release from a promoted source environment."""
        stable_snapshot = self.environment_store.get_snapshot(EnvironmentType.PRODUCTION)
        canary_snapshot = self.environment_store.get_snapshot(config.source_environment)
        if stable_snapshot.version_info.policy_version == canary_snapshot.version_info.policy_version:
            raise ValueError("canary_policy_must_differ_from_stable_policy")
        now = datetime.now(UTC).isoformat()
        state = CanaryReleaseState(
            status="active",
            stable_policy_version=stable_snapshot.version_info.policy_version,
            canary_policy_version=canary_snapshot.version_info.policy_version,
            canary_enabled=True,
            traffic_percentage=config.traffic_percentage,
            assignment_scope=config.assignment_scope,
            source_environment=config.source_environment,
            target_environment=config.target_environment,
            tenant_id=config.tenant_id,
            workspace_id=config.workspace_id,
            started_at=now,
            updated_at=now,
            updated_by=action.actor_id,
            decision_reason=action.reason or "Canary release started.",
            stable_snapshot=stable_snapshot,
            canary_snapshot=canary_snapshot,
        )
        saved = self.store.save(state)
        if saved is None:
            raise RuntimeError("canary_state_not_persisted")
        return saved

    def pause(self, action: CanaryLifecycleAction) -> CanaryReleaseState:
        """Pause an active canary release."""
        return self._update_status("paused", action)

    def resume(self, action: CanaryLifecycleAction) -> CanaryReleaseState:
        """Resume a paused canary release."""
        return self._update_status("active", action)

    def rollback(self, action: CanaryLifecycleAction) -> CanaryReleaseState:
        """Rollback the canary to stable-only traffic."""
        return self._update_status("rolled_back", action, disable_canary=True)

    def promote(self, action: CanaryLifecycleAction) -> CanaryReleaseState:
        """Promote the canary policy to stable state."""
        state = self.require_state()
        state.status = "promoted"
        state.canary_enabled = False
        state.updated_at = datetime.now(UTC).isoformat()
        state.updated_by = action.actor_id
        state.decision_reason = action.reason or "Canary promoted to stable."
        saved = self.store.save(state)
        if saved is None:
            raise RuntimeError("canary_state_not_persisted")
        return saved

    def get_state(self) -> CanaryReleaseState | None:
        """Return the current canary state."""
        return self.store.get()

    def assign_request(self, request: CanaryAssignmentRequest) -> CanaryAssignmentResult:
        """Assign one request to stable or canary deterministically."""
        state = self.store.get()
        result = self.assignment_engine.assign(state=state, request=request)
        self.audit_record_fn(
            trace_id=request.trace_id or request.request_id or "canary-assignment",
            stage="canary_assigned",
            task_type="policy_canary",
            decision_reason=result.decision_reason,
            success=True,
            metadata={
                "release_channel": result.assigned_channel,
                "policy_version": result.assigned_policy_version,
                "stable_policy_version": result.stable_policy_version,
                "canary_policy_version": result.canary_policy_version,
                "traffic_percentage": result.traffic_percentage,
                "request_hash_bucket": result.request_hash_bucket,
                "tenant_id": result.tenant_id,
                "workspace_id": result.workspace_id,
            },
        )
        self.telemetry_record_fn(
            trace_id=request.trace_id or request.request_id or "canary-assignment",
            stage="canary_assigned",
            task_type="policy_canary",
            success=True,
            metadata={
                "release_channel": result.assigned_channel,
                "policy_version": result.assigned_policy_version,
                "stable_policy_version": result.stable_policy_version,
                "canary_policy_version": result.canary_policy_version,
                "traffic_percentage": result.traffic_percentage,
                "request_hash_bucket": result.request_hash_bucket,
                "tenant_id": result.tenant_id,
                "workspace_id": result.workspace_id,
            },
        )
        return result

    def evaluate_health(self) -> CanaryReleaseState | None:
        """Evaluate canary health and apply deterministic decisions."""
        state = self.store.get()
        if state is None:
            return None
        telemetry_events = self.telemetry_events_fn(500)
        audit_events = self.audit_events_fn(500)
        summary, decision = self.health_evaluator.evaluate(
            state=state,
            telemetry_events=telemetry_events,
            audit_events=audit_events,
        )
        state.health_summary = summary
        state.decision = decision
        state.updated_at = datetime.now(UTC).isoformat()
        state.decision_reason = decision.decision_reason
        if decision.recommended_action == "pause" and state.status == "active":
            state.status = "paused"
        if decision.recommended_action == "rollback":
            state.status = "rolled_back"
            state.canary_enabled = False
        saved = self.store.save(state)
        if saved is None:
            raise RuntimeError("canary_state_not_persisted")
        return saved

    def require_state(self) -> CanaryReleaseState:
        """Return the active canary state or raise."""
        state = self.store.get()
        if state is None:
            raise KeyError("canary_state_not_found")
        return state

    def _update_status(
        self,
        status: str,
        action: CanaryLifecycleAction,
        *,
        disable_canary: bool = False,
    ) -> CanaryReleaseState:
        state = self.require_state()
        state.status = status  # type: ignore[assignment]
        state.canary_enabled = False if disable_canary else True
        state.updated_at = datetime.now(UTC).isoformat()
        state.updated_by = action.actor_id
        state.decision_reason = action.reason
        saved = self.store.save(state)
        if saved is None:
            raise RuntimeError("canary_state_not_persisted")
        return saved
