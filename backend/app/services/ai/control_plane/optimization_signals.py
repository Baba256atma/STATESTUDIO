"""Signal collection for autonomous policy optimization."""

from __future__ import annotations

from typing import Callable

from app.schemas.policy_canary import CanaryReleaseState
from app.schemas.policy_experiments import ExperimentRunState
from app.schemas.policy_optimization import PolicyOptimizationSignal
from app.schemas.telemetry import TelemetryEvent


class OptimizationSignalCollector:
    """Collect compact optimization signals from control-plane diagnostics."""

    def __init__(
        self,
        *,
        telemetry_events_fn: Callable[[int], list[TelemetryEvent]],
        canary_state_fn: Callable[[], CanaryReleaseState | None],
        experiments_fn: Callable[[], list[ExperimentRunState]],
        current_policy_fn: Callable[[], object],
    ) -> None:
        self.telemetry_events_fn = telemetry_events_fn
        self.canary_state_fn = canary_state_fn
        self.experiments_fn = experiments_fn
        self.current_policy_fn = current_policy_fn

    def collect(self) -> list[PolicyOptimizationSignal]:
        """Return deterministic optimization signals."""
        signals: list[PolicyOptimizationSignal] = []
        telemetry_events = self.telemetry_events_fn(1000)
        snapshot = self.current_policy_fn()

        trace_count = len({event.trace_id for event in telemetry_events})
        fallback_traces = len({event.trace_id for event in telemetry_events if event.stage == "fallback_applied"})
        failure_traces = len({event.trace_id for event in telemetry_events if event.stage == "provider_execution_failed"})
        fallback_rate = round(fallback_traces / trace_count, 4) if trace_count else 0.0
        failure_rate = round(failure_traces / trace_count, 4) if trace_count else 0.0

        if trace_count >= 5 and fallback_rate >= 0.25 and snapshot.routing.cloud_fallback_enabled:
            signals.append(
                PolicyOptimizationSignal(
                    signal_type="high_fallback_rate",
                    source_component="telemetry",
                    metric_name="fallback_rate",
                    current_value=fallback_rate,
                    threshold_value=0.25,
                    signal_metadata={"trace_count": trace_count},
                    decision_reason="Fallback rate remained elevated while cloud fallback is enabled.",
                )
            )

        if trace_count >= 5 and failure_rate >= 0.15 and snapshot.routing.cloud_for_reasoning_enabled:
            signals.append(
                PolicyOptimizationSignal(
                    signal_type="high_routing_failure_rate",
                    source_component="telemetry",
                    metric_name="routing_failure_rate",
                    current_value=failure_rate,
                    threshold_value=0.15,
                    signal_metadata={"trace_count": trace_count},
                    decision_reason="Provider execution failures remained elevated while cloud reasoning is enabled.",
                )
            )

        canary_state = self.canary_state_fn()
        if (
            canary_state is not None
            and canary_state.health_summary is not None
            and canary_state.health_summary.promotion_ready
        ):
            signals.append(
                PolicyOptimizationSignal(
                    signal_type="canary_promotion_ready",
                    source_component="canary",
                    metric_name="promotion_ready",
                    current_value=True,
                    threshold_value=True,
                    signal_metadata={
                        "canary_policy_version": canary_state.canary_policy_version,
                        "stable_policy_version": canary_state.stable_policy_version,
                    },
                    decision_reason=canary_state.health_summary.decision_reason,
                )
            )

        for experiment in self.experiments_fn():
            if (
                experiment.decision is not None
                and experiment.decision.promotion_ready
                and experiment.decision.winning_variant is not None
            ):
                signals.append(
                    PolicyOptimizationSignal(
                        signal_type="experiment_winner",
                        source_component="experiments",
                        metric_name="winning_variant",
                        current_value=experiment.decision.winning_variant,
                        threshold_value="promotion_ready",
                        signal_metadata={"experiment_id": experiment.experiment_id},
                        decision_reason=experiment.decision.decision_reason,
                    )
                )

        if snapshot.benchmark.enabled and not snapshot.benchmark.weights:
            signals.append(
                PolicyOptimizationSignal(
                    signal_type="benchmark_weights_missing",
                    source_component="benchmark",
                    metric_name="weights_configured",
                    current_value=False,
                    threshold_value=True,
                    signal_metadata={},
                    decision_reason="Benchmark tuning is enabled but benchmark weights are empty.",
                )
            )

        return signals
