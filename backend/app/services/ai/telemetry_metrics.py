"""In-memory telemetry metric aggregation helpers."""

from __future__ import annotations

from collections import defaultdict

from app.schemas.telemetry import (
    ModelExecutionMetric,
    ProviderExecutionMetric,
    StageMetric,
    TelemetryEvent,
    TelemetryMetricsResponse,
    TelemetryStageListResponse,
)


def build_telemetry_metrics(events: list[TelemetryEvent]) -> TelemetryMetricsResponse:
    """Aggregate in-memory telemetry events into a compact metrics snapshot."""
    total_events = len(events)
    trace_ids = {event.trace_id for event in events}
    stage_entries = _build_stage_metrics(events)
    provider_usage = _build_provider_metrics(events)
    model_usage = _build_model_metrics(events)

    fallback_events = [event for event in events if event.stage == "fallback_applied"]
    routing_events = [event for event in events if event.stage == "routing_decided"]
    response_events = [event for event in events if event.stage == "response_returned"]
    privacy_events = [event for event in events if event.stage == "privacy_classified"]
    average_stage_latency_ms = round(
        sum(stage.avg_latency_ms for stage in stage_entries) / len(stage_entries),
        2,
    ) if stage_entries else 0.0

    return TelemetryMetricsResponse(
        total_events=total_events,
        total_traces=len(trace_ids),
        average_stage_latency_ms=average_stage_latency_ms,
        fallback_rate=_rate(len(fallback_events), len(trace_ids)),
        routing_policy_override_rate=_rate(
            sum(1 for event in routing_events if event.routing_reason and "override" in event.routing_reason.lower()),
            len(routing_events),
        ),
        response_valid_rate=_rate(
            sum(1 for event in response_events if event.success is True),
            len(response_events),
        ),
        privacy_cloud_block_rate=_rate(
            sum(1 for event in privacy_events if event.metadata.get("cloud_allowed") is False),
            len(privacy_events),
        ),
        provider_usage=provider_usage,
        model_usage=model_usage,
        stages=stage_entries,
    )


def build_stage_metric_response(events: list[TelemetryEvent]) -> TelemetryStageListResponse:
    """Return stage metric diagnostics from a telemetry event list."""
    return TelemetryStageListResponse(stages=_build_stage_metrics(events))


def _build_stage_metrics(events: list[TelemetryEvent]) -> list[StageMetric]:
    grouped: dict[str, list[TelemetryEvent]] = defaultdict(list)
    for event in events:
        grouped[event.stage].append(event)

    stages: list[StageMetric] = []
    for stage_name in sorted(grouped):
        stage_events = grouped[stage_name]
        latencies = [event.latency_ms for event in stage_events if event.latency_ms is not None]
        successes = [event for event in stage_events if event.success is True]
        stages.append(
            StageMetric(
                stage=stage_name,  # type: ignore[arg-type]
                count=len(stage_events),
                avg_latency_ms=round(sum(latencies) / len(latencies), 2) if latencies else 0.0,
                success_rate=_rate(len(successes), len(stage_events)),
            )
        )
    return stages


def _build_provider_metrics(events: list[TelemetryEvent]) -> list[ProviderExecutionMetric]:
    grouped: dict[str, list[TelemetryEvent]] = defaultdict(list)
    for event in events:
        if event.provider:
            grouped[event.provider].append(event)
    metrics: list[ProviderExecutionMetric] = []
    for provider in sorted(grouped):
        provider_events = grouped[provider]
        latencies = [event.latency_ms for event in provider_events if event.latency_ms is not None]
        metrics.append(
            ProviderExecutionMetric(
                provider=provider,
                request_count=len(provider_events),
                avg_latency_ms=round(sum(latencies) / len(latencies), 2) if latencies else 0.0,
            )
        )
    return metrics


def _build_model_metrics(events: list[TelemetryEvent]) -> list[ModelExecutionMetric]:
    grouped: dict[str, list[TelemetryEvent]] = defaultdict(list)
    for event in events:
        if event.model:
            grouped[event.model].append(event)
    metrics: list[ModelExecutionMetric] = []
    for model in sorted(grouped):
        model_events = grouped[model]
        latencies = [event.latency_ms for event in model_events if event.latency_ms is not None]
        metrics.append(
            ModelExecutionMetric(
                model=model,
                request_count=len(model_events),
                avg_latency_ms=round(sum(latencies) / len(latencies), 2) if latencies else 0.0,
            )
        )
    return metrics


def _rate(numerator: int, denominator: int) -> float:
    return round((numerator / denominator), 4) if denominator else 0.0
