"""Deterministic canary health evaluation."""

from __future__ import annotations

from app.schemas.audit import AuditEvent
from app.schemas.policy_canary import (
    CanaryDecisionResult,
    CanaryHealthSummary,
    CanaryReleaseState,
)
from app.schemas.telemetry import TelemetryEvent


class CanaryHealthEvaluator:
    """Evaluate canary health from audit and telemetry signals."""

    def evaluate(
        self,
        *,
        state: CanaryReleaseState,
        telemetry_events: list[TelemetryEvent],
        audit_events: list[AuditEvent],
    ) -> tuple[CanaryHealthSummary, CanaryDecisionResult]:
        """Return canary health summary and recommended decision."""
        stable_telemetry = _channel_events(telemetry_events, "stable", state.stable_policy_version)
        canary_telemetry = _channel_events(telemetry_events, "canary", state.canary_policy_version)
        stable_audit = _channel_events(audit_events, "stable", state.stable_policy_version)
        canary_audit = _channel_events(audit_events, "canary", state.canary_policy_version)

        stable_trace_count = _trace_count(stable_telemetry)
        canary_trace_count = _trace_count(canary_telemetry)

        routing_failure_rate = _routing_failure_rate(canary_telemetry)
        fallback_rate = _fallback_rate(canary_telemetry)
        response_validity_rate = _response_valid_rate(canary_telemetry)
        audit_completeness_rate = _audit_completeness_rate(canary_trace_count, canary_audit)
        average_latency_ms_stable = _average_latency(stable_telemetry)
        average_latency_ms_canary = _average_latency(canary_telemetry)
        latency_delta = round(average_latency_ms_canary - average_latency_ms_stable, 2)

        health_status = "healthy"
        action = "continue"
        reason = "Canary remains within health thresholds."
        rollback_required = False
        promotion_ready = False

        if canary_trace_count < 5 or stable_trace_count < 5:
            health_status = "insufficient_data"
            action = "continue"
            reason = "More stable and canary samples are required before making a canary decision."
        elif (
            routing_failure_rate > (_routing_failure_rate(stable_telemetry) + 0.05)
            or fallback_rate > (_fallback_rate(stable_telemetry) + 0.1)
            or response_validity_rate < 0.95
            or audit_completeness_rate < 0.95
        ):
            health_status = "degraded"
            action = "rollback"
            reason = "Canary degraded critical safety or quality metrics beyond tolerated thresholds."
            rollback_required = True
        elif latency_delta > 500.0:
            health_status = "degraded"
            action = "pause"
            reason = "Canary latency delta exceeded the pause threshold."
        elif canary_trace_count >= 20 and response_validity_rate >= 0.99 and audit_completeness_rate >= 0.99:
            action = "promote"
            promotion_ready = True
            reason = "Canary is healthy with enough validated traffic for promotion."

        summary = CanaryHealthSummary(
            stable_policy_version=state.stable_policy_version,
            canary_policy_version=state.canary_policy_version,
            health_status=health_status,
            stable_request_count=stable_trace_count,
            canary_request_count=canary_trace_count,
            routing_failure_rate=routing_failure_rate,
            fallback_rate=fallback_rate,
            response_validity_rate=response_validity_rate,
            audit_completeness_rate=audit_completeness_rate,
            average_latency_ms_stable=average_latency_ms_stable,
            average_latency_ms_canary=average_latency_ms_canary,
            average_latency_delta_ms=latency_delta,
            rollback_required=rollback_required,
            promotion_ready=promotion_ready,
            decision_reason=reason,
        )
        decision = CanaryDecisionResult(
            health_status=health_status,
            recommended_action=action,
            rollback_required=rollback_required,
            promotion_ready=promotion_ready,
            decision_reason=reason,
        )
        return summary, decision


def _channel_events(events: list, channel: str, policy_version: str | None) -> list:
    return [
        event
        for event in events
        if event.metadata.get("release_channel") == channel
        and (policy_version is None or event.metadata.get("policy_version") == policy_version)
    ]


def _trace_count(events: list) -> int:
    return len({event.trace_id for event in events})


def _routing_failure_rate(events: list[TelemetryEvent]) -> float:
    traces = _trace_count(events)
    failures = len({event.trace_id for event in events if event.stage == "provider_execution_failed"})
    return round(failures / traces, 4) if traces else 0.0


def _fallback_rate(events: list[TelemetryEvent]) -> float:
    traces = _trace_count(events)
    fallbacks = len({event.trace_id for event in events if event.stage == "fallback_applied"})
    return round(fallbacks / traces, 4) if traces else 0.0


def _response_valid_rate(events: list[TelemetryEvent]) -> float:
    responses = [event for event in events if event.stage == "response_returned"]
    if not responses:
        return 0.0
    valid = sum(1 for event in responses if event.success is True)
    return round(valid / len(responses), 4)


def _audit_completeness_rate(trace_count: int, events: list[AuditEvent]) -> float:
    if not trace_count:
        return 0.0
    completed = len({event.trace_id for event in events if event.stage == "response_returned"})
    return round(completed / trace_count, 4)


def _average_latency(events: list[TelemetryEvent]) -> float:
    responses = [event.latency_ms for event in events if event.stage == "response_returned" and event.latency_ms is not None]
    if not responses:
        return 0.0
    return round(sum(responses) / len(responses), 2)
