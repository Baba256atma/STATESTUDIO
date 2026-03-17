"""Task-based model routing for the local AI layer."""

from __future__ import annotations

from dataclasses import dataclass

from app.core.config import LocalAISettings
from app.schemas.ai import ModelSelectionRequest, ModelSelectionResult
from app.services.ai.model_selection_engine import LocalAIModelSelectionEngine
from app.services.ai.prompt_builder import AITaskType


@dataclass(frozen=True)
class ModelRoute:
    """Resolved model route for an AI task."""

    task: AITaskType
    model: str
    reason: str
    model_class: str = "default"


def select_model(
    requested_model: str | None,
    available_models: list[str],
    default_model: str,
) -> str:
    """Resolve the most appropriate local model for a request."""
    if requested_model:
        return requested_model
    if default_model:
        return default_model
    if available_models:
        return available_models[0]
    return "unknown"


def route_model(
    *,
    task: AITaskType,
    requested_model: str | None,
    available_models: list[str],
    default_model: str,
    settings: LocalAISettings | None = None,
    latency_sensitive: bool = False,
    quality_policy: str = "balanced",
) -> ModelRoute:
    """Resolve model selection policy for the given task."""
    selection_result = select_model_for_task(
        ModelSelectionRequest(
            task_type=task,
            requested_model=requested_model,
            available_models=available_models,
            latency_sensitive=latency_sensitive,
            quality_policy=quality_policy,
        ),
        settings=settings,
        default_model=default_model,
    )
    return ModelRoute(
        task=task,
        model=selection_result.selected_model,
        reason=selection_result.reason,
        model_class=selection_result.model_class,
    )


def select_model_for_task(
    request: ModelSelectionRequest,
    *,
    settings: LocalAISettings | None,
    default_model: str,
) -> ModelSelectionResult:
    """Resolve a model selection decision for a specific task."""
    if settings is None:
        selected = select_model(request.requested_model, request.available_models, default_model)
        return ModelSelectionResult(
            task_type=request.task_type,
            selected_model=selected,
            model_class="default",
            strategy="no_settings",
            provider=request.provider,
            reason="model_selection_settings_unavailable",
            fallback_used=True,
        )

    engine = LocalAIModelSelectionEngine(settings)
    return engine.select(request, default_model=default_model)
