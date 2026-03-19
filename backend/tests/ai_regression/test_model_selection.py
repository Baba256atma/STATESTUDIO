from __future__ import annotations

import pytest

from app.core.config import LocalAISettings
from app.schemas.ai import ModelSelectionRequest
from app.services.ai.model_selection_engine import LocalAIModelSelectionEngine
from tests.ai_regression.utils import get_case, run_case_result


def _build_settings() -> LocalAISettings:
    return LocalAISettings(
        ai_model_selection_enabled=True,
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )


@pytest.mark.regression
@pytest.mark.model_selection
def test_reasoning_tasks_choose_reasoning_model():
    case = get_case("internal_operational_analysis")
    result = run_case_result(case)

    assert result.model_selection_passed is True
    assert result.selected_model == "reasoning-model"


@pytest.mark.regression
@pytest.mark.model_selection
def test_extraction_tasks_choose_extraction_model():
    engine = LocalAIModelSelectionEngine(_build_settings())

    result = engine.select(
        ModelSelectionRequest(
            task_type="extract_objects",
            available_models=["balanced-model", "fast-model", "reasoning-model", "extraction-model"],
            latency_sensitive=False,
            quality_policy="balanced",
        ),
        default_model="balanced-model",
    )

    assert result.selected_model == "extraction-model"
    assert result.model_class == "extraction"
