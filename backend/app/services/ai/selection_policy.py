"""Deterministic policy helpers for Local AI model selection."""

from __future__ import annotations

from typing import Any


TASK_MODEL_CLASS_POLICY: dict[str, str] = {
    "analyze_scenario": "reasoning",
    "extract_objects": "extraction",
    "explain": "reasoning",
    "classify_intent": "fast",
    "summarize_context": "reasoning",
}


def resolve_context_model_class_hint(metadata: dict[str, Any] | None) -> str | None:
    """Resolve an optional model-class hint from request metadata."""
    if not isinstance(metadata, dict):
        return None

    context = metadata.get("context", {})
    if not isinstance(context, dict):
        return None

    raw_hint = context.get("selection_preference") or context.get("model_class_hint")
    if not isinstance(raw_hint, str):
        return None

    normalized = raw_hint.strip().lower()
    if normalized in {"default", "fast", "reasoning", "extraction"}:
        return normalized
    return None


def resolve_model_class(
    *,
    task_type: str,
    latency_sensitive: bool,
    quality_policy: str,
    metadata: dict[str, Any] | None = None,
) -> str:
    """Resolve the preferred model class for a task."""
    context_hint = resolve_context_model_class_hint(metadata)
    if context_hint is not None:
        return context_hint

    if latency_sensitive:
        return "fast"

    normalized_quality = (quality_policy or "balanced").strip().lower()
    if normalized_quality in {"high", "reasoning"}:
        return "reasoning"

    return TASK_MODEL_CLASS_POLICY.get(task_type, "default")


def resolve_benchmark_priority(task_type: str, latency_sensitive: bool) -> str:
    """Resolve the benchmark scoring priority for a task."""
    if latency_sensitive:
        return "latency"
    if task_type == "extract_objects":
        return "extraction"
    return "reasoning"
