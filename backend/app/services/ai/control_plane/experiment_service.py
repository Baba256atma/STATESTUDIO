"""Policy experiment lifecycle and analysis orchestration."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Callable
from uuid import uuid4

from app.schemas.policy_experiments import (
    ExperimentAssignmentRequest,
    ExperimentAssignmentResult,
    ExperimentDecisionResult,
    ExperimentLifecycleAction,
    ExperimentListResponse,
    ExperimentMetricsSummary,
    ExperimentResultsResponse,
    ExperimentRunState,
    PolicyExperimentConfig,
)
from app.services.ai.control_plane.experiment_analysis import ExperimentAnalysisEngine
from app.services.ai.control_plane.experiment_assignment import ExperimentAssignmentEngine
from app.services.ai.control_plane.experiment_store import ExperimentStore


class ExperimentService:
    """Manage policy experiment lifecycle, assignment, and analysis."""

    def __init__(
        self,
        *,
        store: ExperimentStore,
        assignment_engine: ExperimentAssignmentEngine,
        analysis_engine: ExperimentAnalysisEngine,
        telemetry_events_fn: Callable[[int], list],
        audit_events_fn: Callable[[int], list],
    ) -> None:
        self.store = store
        self.assignment_engine = assignment_engine
        self.analysis_engine = analysis_engine
        self.telemetry_events_fn = telemetry_events_fn
        self.audit_events_fn = audit_events_fn
        self.store.reload()

    def create(self, config: PolicyExperimentConfig, action: ExperimentLifecycleAction) -> ExperimentRunState:
        """Create a draft experiment."""
        _validate_split(config)
        now = datetime.now(UTC).isoformat()
        experiment = ExperimentRunState(
            experiment_id=f"policy-experiment-{uuid4().hex}",
            experiment_name=config.experiment_name,
            description=config.description,
            status="draft",
            control_policy_version=config.control_policy_version,
            variants=config.variants,
            traffic_split=dict(config.traffic_split),
            assignment_scope=config.assignment_scope,
            tenant_id=config.tenant_id,
            workspace_id=config.workspace_id,
            created_at=now,
            updated_at=now,
            updated_by=action.actor_id,
            decision_reason=action.reason or "Experiment created.",
        )
        return self.store.save(experiment)

    def start(self, experiment_id: str, action: ExperimentLifecycleAction) -> ExperimentRunState:
        """Start a draft or paused experiment."""
        experiment = self.store.get(experiment_id)
        now = datetime.now(UTC).isoformat()
        experiment.status = "active"
        experiment.started_at = experiment.started_at or now
        experiment.updated_at = now
        experiment.updated_by = action.actor_id
        experiment.decision_reason = action.reason or "Experiment started."
        return self.store.save(experiment)

    def pause(self, experiment_id: str, action: ExperimentLifecycleAction) -> ExperimentRunState:
        """Pause an active experiment."""
        experiment = self.store.get(experiment_id)
        experiment.status = "paused"
        experiment.updated_at = datetime.now(UTC).isoformat()
        experiment.updated_by = action.actor_id
        experiment.decision_reason = action.reason or "Experiment paused."
        return self.store.save(experiment)

    def stop(self, experiment_id: str, action: ExperimentLifecycleAction) -> ExperimentRunState:
        """Stop an experiment safely."""
        experiment = self.store.get(experiment_id)
        experiment.status = "stopped"
        experiment.ended_at = datetime.now(UTC).isoformat()
        experiment.updated_at = experiment.ended_at
        experiment.updated_by = action.actor_id
        experiment.decision_reason = action.reason or "Experiment stopped."
        return self.store.save(experiment)

    def complete(self, experiment_id: str, action: ExperimentLifecycleAction) -> ExperimentRunState:
        """Complete an experiment and persist the latest decision."""
        experiment = self.store.get(experiment_id)
        metrics, decision = self._analyze(experiment)
        experiment.status = "completed"
        experiment.ended_at = datetime.now(UTC).isoformat()
        experiment.updated_at = experiment.ended_at
        experiment.updated_by = action.actor_id
        experiment.winning_variant = decision.winning_variant
        experiment.decision_reason = action.reason or decision.decision_reason
        experiment.metrics_summary = metrics
        experiment.decision = decision
        return self.store.save(experiment)

    def assign(self, experiment_id: str, request: ExperimentAssignmentRequest) -> ExperimentAssignmentResult:
        """Assign one request to control or variant."""
        experiment = self.store.get(experiment_id)
        return self.assignment_engine.assign(experiment=experiment, request=request)

    def list(self) -> ExperimentListResponse:
        """Return all experiments."""
        return self.store.list()

    def get(self, experiment_id: str) -> ExperimentRunState:
        """Return one experiment."""
        return self.store.get(experiment_id)

    def results(self, experiment_id: str) -> ExperimentResultsResponse:
        """Return results for one experiment."""
        experiment = self.store.get(experiment_id)
        metrics, decision = self._analyze(experiment)
        experiment.metrics_summary = metrics
        experiment.decision = decision
        if decision.winning_variant is not None:
            experiment.winning_variant = decision.winning_variant
        experiment.updated_at = datetime.now(UTC).isoformat()
        saved = self.store.save(experiment)
        return ExperimentResultsResponse(
            experiment=saved,
            metrics_summary=metrics,
            decision=decision,
        )

    def _analyze(
        self,
        experiment: ExperimentRunState,
    ) -> tuple[ExperimentMetricsSummary, ExperimentDecisionResult]:
        return self.analysis_engine.analyze(
            experiment=experiment,
            telemetry_events=self.telemetry_events_fn(1000),
            audit_events=self.audit_events_fn(1000),
        )


def _validate_split(config: PolicyExperimentConfig) -> None:
    expected_variants = {"control", *(variant.variant_name for variant in config.variants)}
    actual_variants = set(config.traffic_split)
    if "control" not in config.traffic_split:
        raise ValueError("traffic_split_requires_control")
    if actual_variants != expected_variants:
        raise ValueError("traffic_split_variants_must_match_defined_variants")
    if sum(config.traffic_split.values()) != 100:
        raise ValueError("traffic_split_must_sum_to_100")
