"""Response mappers for the local AI layer."""

from __future__ import annotations

from typing import Any

from app.schemas.ai import (
    AIResponse,
    HealthResponse,
    ModelInfo,
    LocalAIModelsResponse,
    ObjectCandidate,
    RiskSignal,
)
from app.services.ai.validators import StructuredAIOutput


def _normalize_risk_signals(signals: list[RiskSignal]) -> list[RiskSignal]:
    normalized: list[RiskSignal] = []
    for signal in signals:
        key = signal.key.strip()
        if not key:
            continue
        label = signal.label.strip() if isinstance(signal.label, str) else None
        normalized.append(
            signal.model_copy(
                update={
                    "key": key,
                    "label": label or key.replace("_", " ").title(),
                }
            )
        )
    return normalized


def _normalize_object_candidates(candidates: list[ObjectCandidate]) -> list[ObjectCandidate]:
    normalized: list[ObjectCandidate] = []
    for candidate in candidates:
        object_id = candidate.object_id.strip()
        if not object_id:
            continue
        label = candidate.label.strip() if isinstance(candidate.label, str) else None
        normalized.append(
            candidate.model_copy(
                update={
                    "object_id": object_id,
                    "label": label or object_id.replace("_", " ").title(),
                }
            )
        )
    return normalized


def map_health_response(
    *,
    provider: str,
    base_url: str,
    available: bool,
    default_model: str,
) -> HealthResponse:
    """Build a health response payload."""
    return HealthResponse(
        ok=True,
        provider=provider,
        base_url=base_url,
        available=available,
        default_model=default_model,
    )


def map_models_response(*, provider: str, models: list[str]) -> LocalAIModelsResponse:
    """Build a model listing response payload."""
    return LocalAIModelsResponse(
        ok=True,
        provider=provider,
        models=[ModelInfo(name=name, provider=provider) for name in models],
    )


def map_ai_response(
    *,
    provider: str,
    model: str,
    output: str,
    metadata: dict[str, Any],
    trace_id: str | None = None,
    raw_model: str | None = None,
    latency_ms: float | None = None,
    ok: bool = True,
) -> AIResponse:
    """Build a basic AI response payload."""
    safe_output = output.strip() if isinstance(output, str) else ""
    return AIResponse(
        ok=ok,
        provider=provider,
        model=model,
        output=safe_output,
        summary=safe_output or None,
        trace_id=trace_id,
        raw_model=raw_model,
        latency_ms=latency_ms,
        metadata=metadata,
    )


def map_structured_ai_response(
    *,
    provider: str,
    model: str,
    validated: StructuredAIOutput | None,
    raw_output: str,
    raw_model: str | None,
    trace_id: str | None,
    latency_ms: float | None,
    metadata: dict[str, Any] | None = None,
    ok: bool = True,
) -> AIResponse:
    """Build a normalized AI response from validated semantic model output."""
    normalized_metadata = dict(metadata or {})
    normalized_metadata.setdefault("raw_output_present", bool(raw_output))
    normalized_metadata.setdefault("has_structured_data", validated is not None)

    if validated is None:
        return AIResponse(
            ok=False,
            provider=provider,
            model=model,
            output="",
            summary="No structured output was produced.",
            risk_signals=[],
            object_candidates=[],
            trace_id=trace_id,
            raw_model=raw_model,
            latency_ms=latency_ms,
            metadata=normalized_metadata,
        )

    summary = (validated.summary or "").strip() or "Structured analysis completed."
    output = raw_output.strip()
    if not output:
        output = "{}"

    return AIResponse(
        ok=ok,
        provider=provider,
        model=model,
        output=output,
        summary=summary,
        risk_signals=_normalize_risk_signals(validated.risk_signals),
        object_candidates=_normalize_object_candidates(validated.object_candidates),
        trace_id=trace_id,
        raw_model=raw_model,
        latency_ms=latency_ms,
        metadata={**validated.metadata, **normalized_metadata},
    )
