"""Deterministic analysis for policy experiments."""

from __future__ import annotations

from datetime import UTC, datetime

from app.schemas.audit import AuditEvent
from app.schemas.policy_experiments import (
    ExperimentDecisionResult,
    ExperimentMetricsSummary,
    ExperimentRunState,
    VariantMetricsSummary,
)
from app.schemas.telemetry import TelemetryEvent


class ExperimentAnalysisEngine:
    """Compare control and variant outcomes deterministically."""

    def analyze(
        self,
        *,
        experiment: ExperimentRunState,
        telemetry_events: list[TelemetryEvent],
        audit_events: list[AuditEvent],
    ) -> tuple[ExperimentMetricsSummary, ExperimentDecisionResult]:
        """Return experiment metrics and a simple winner decision."""
        compared_at = datetime.now(UTC).isoformat()
        control_summary = _variant_summary(
            experiment=experiment,
            variant_name="control",
            policy_version=experiment.control_policy_version,
            telemetry_events=telemetry_events,
            audit_events=audit_events,
        )
        variant_summaries = [
            _variant_summary(
                experiment=experiment,
                variant_name=variant.variant_name,
                policy_version=variant.policy_version,
                telemetry_events=telemetry_events,
                audit_events=audit_events,
            )
            for variant in experiment.variants
        ]
        enough_data = control_summary.request_count >= 5 and all(
            summary.request_count >= 5 for summary in variant_summaries
        )

        winning_variant: str | None = None
        decision_reason = "More control and variant samples are required."
        stop_required = False
        promotion_ready = False

        if enough_data and variant_summaries:
            unsafe_variants = [
                summary
                for summary in variant_summaries
                if summary.response_validity_rate < 0.95
                or summary.audit_completeness_rate < 0.95
                or summary.routing_error_rate > (control_summary.routing_error_rate + 0.05)
            ]
            if unsafe_variants:
                winning_variant = None
                stop_required = True
                decision_reason = "One or more experiment variants degraded safety or routing quality beyond tolerated thresholds."
            else:
                scored_variants = sorted(
                    variant_summaries,
                    key=lambda summary: (
                        summary.response_validity_rate - control_summary.response_validity_rate,
                        control_summary.fallback_rate - summary.fallback_rate,
                        control_summary.routing_error_rate - summary.routing_error_rate,
                        control_summary.average_latency_ms - summary.average_latency_ms,
                    ),
                    reverse=True,
                )
                best = scored_variants[0]
                improves_validity = best.response_validity_rate >= control_summary.response_validity_rate
                improves_fallback = best.fallback_rate <= control_summary.fallback_rate
                improves_latency = best.average_latency_ms <= (control_summary.average_latency_ms + 150.0)
                if improves_validity and improves_fallback and improves_latency:
                    winning_variant = best.variant_name
                    promotion_ready = True
                    decision_reason = "A winning variant outperformed control without violating safety thresholds."
                else:
                    decision_reason = "Experiment remains inconclusive; keep collecting data or stop without promotion."

        metrics = ExperimentMetricsSummary(
            experiment_id=experiment.experiment_id,
            experiment_name=experiment.experiment_name,
            status=experiment.status,
            control_variant=control_summary,
            variant_summaries=variant_summaries,
            winning_variant=winning_variant,
            enough_data=enough_data,
            summary=decision_reason,
            compared_at=compared_at,
        )
        decision = ExperimentDecisionResult(
            experiment_id=experiment.experiment_id,
            status=experiment.status,
            winning_variant=winning_variant,
            promotion_ready=promotion_ready,
            stop_required=stop_required,
            decision_reason=decision_reason,
        )
        return metrics, decision


def _variant_summary(
    *,
    experiment: ExperimentRunState,
    variant_name: str,
    policy_version: str,
    telemetry_events: list[TelemetryEvent],
    audit_events: list[AuditEvent],
) -> VariantMetricsSummary:
    variant_telemetry = [
        event
        for event in telemetry_events
        if event.metadata.get("experiment_id") == experiment.experiment_id
        and event.metadata.get("selected_variant") == variant_name
    ]
    variant_audit = [
        event
        for event in audit_events
        if event.metadata.get("experiment_id") == experiment.experiment_id
        and event.metadata.get("selected_variant") == variant_name
    ]
    request_count = len({event.trace_id for event in variant_telemetry})
    return VariantMetricsSummary(
        variant_name=variant_name,
        policy_version=policy_version,
        request_count=request_count,
        response_validity_rate=_response_validity_rate(variant_telemetry),
        fallback_rate=_fallback_rate(variant_telemetry),
        routing_error_rate=_routing_error_rate(variant_telemetry),
        audit_completeness_rate=_audit_completeness_rate(request_count, variant_audit),
        average_latency_ms=_average_latency(variant_telemetry),
    )


def _response_validity_rate(events: list[TelemetryEvent]) -> float:
    responses = [event for event in events if event.stage == "response_returned"]
    if not responses:
        return 0.0
    valid = sum(1 for event in responses if event.success is True)
    return round(valid / len(responses), 4)


def _fallback_rate(events: list[TelemetryEvent]) -> float:
    trace_count = len({event.trace_id for event in events})
    if not trace_count:
        return 0.0
    fallbacks = len({event.trace_id for event in events if event.stage == "fallback_applied"})
    return round(fallbacks / trace_count, 4)


def _routing_error_rate(events: list[TelemetryEvent]) -> float:
    trace_count = len({event.trace_id for event in events})
    if not trace_count:
        return 0.0
    failures = len({event.trace_id for event in events if event.stage == "provider_execution_failed"})
    return round(failures / trace_count, 4)


def _audit_completeness_rate(request_count: int, events: list[AuditEvent]) -> float:
    if not request_count:
        return 0.0
    completed = len({event.trace_id for event in events if event.stage == "response_returned"})
    return round(completed / request_count, 4)


def _average_latency(events: list[TelemetryEvent]) -> float:
    responses = [
        event.latency_ms
        for event in events
        if event.stage == "response_returned" and event.latency_ms is not None
    ]
    if not responses:
        return 0.0
    return round(sum(responses) / len(responses), 2)
