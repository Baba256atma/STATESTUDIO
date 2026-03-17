from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_local import get_local_ai_orchestrator
from app.schemas.ai import (
    ModelSelectionRequest,
    ModelSelectionResult,
    SelectionHistoryEntry,
    SelectionStatsResponse,
)
from app.services.ai.model_selection_engine import LocalAIModelSelectionEngine


def _build_settings() -> LocalAISettings:
    return LocalAISettings(
        ai_model_selection_enabled=True,
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )


class FakeSelectionOrchestrator:
    async def select_model(self, payload) -> ModelSelectionResult:
        return ModelSelectionResult(
            task_type=payload.task_type,
            selected_model="reasoning-model",
            model_class="reasoning",
            strategy="task_policy",
            provider="ollama",
            reason="task_policy:reasoning",
            fallback_used=False,
            benchmark_used=False,
            metadata={"profile_quality_class": "high"},
        )

    def get_selection_stats(self) -> SelectionStatsResponse:
        return SelectionStatsResponse(
            total_selections=3,
            selections_by_model={"reasoning-model": 2, "fast-model": 1},
            selections_by_task={"analyze_scenario": 2, "classify_intent": 1},
            fallback_rate=0.3333,
            selections_by_latency_bucket={"1_to_5ms": 3},
            recent_history=[
                SelectionHistoryEntry(
                    task_type="analyze_scenario",
                    selected_model="reasoning-model",
                    fallback_used=False,
                    timestamp="2026-03-14T12:00:00+00:00",
                    latency_bucket="1_to_5ms",
                )
            ],
        )


def _make_client(orchestrator) -> TestClient:
    main.app.dependency_overrides[get_local_ai_orchestrator] = lambda: orchestrator
    return TestClient(main.app)


def teardown_function():
    main.app.dependency_overrides.clear()


def _write_benchmark_file(path: Path, summary: list[dict]) -> None:
    path.write_text(json.dumps({"summary": summary}), encoding="utf-8")


def test_reasoning_task_selects_reasoning_preferred_model():
    settings = _build_settings()
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["fast-model", "reasoning-model", "extraction-model"],
            latency_sensitive=False,
            quality_policy="balanced",
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "reasoning-model"
    assert result.model_class == "reasoning"
    assert result.fallback_used is False


def test_extraction_task_selects_extraction_preferred_model():
    settings = _build_settings()
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="extract_objects",
            available_models=["fast-model", "reasoning-model", "extraction-model"],
            latency_sensitive=False,
            quality_policy="balanced",
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "extraction-model"
    assert result.model_class == "extraction"
    assert result.fallback_used is False


def test_latency_sensitive_task_selects_fast_model():
    settings = _build_settings()
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["fast-model", "reasoning-model", "extraction-model"],
            latency_sensitive=True,
            quality_policy="balanced",
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "fast-model"
    assert result.model_class == "fast"
    assert result.fallback_used is False


def test_unavailable_preferred_model_falls_back_safely():
    settings = _build_settings()
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["balanced-model", "fast-model"],
            latency_sensitive=False,
            quality_policy="balanced",
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "balanced-model"
    assert result.model_class == "default"
    assert result.fallback_used is True
    assert "fell back" in result.reason.lower()


def test_select_model_endpoint_returns_expected_structure():
    with _make_client(FakeSelectionOrchestrator()) as client:
        response = client.post(
            "/ai/local/select-model",
            json={
                "task_type": "analyze_scenario",
                "context": {"domain": "operations"},
                "latency_sensitive": False,
                "quality_policy": "balanced",
            },
        )

    assert response.status_code == 200
    body = response.json()
    assert body["selected_model"] == "reasoning-model"
    assert body["selection_reason"] == "task_policy:reasoning"
    assert body["fallback_used"] is False
    assert body["benchmark_used"] is False
    assert body["model_class"] == "reasoning"
    assert body["strategy"] == "task_policy"


def test_selection_stats_endpoint_returns_expected_structure():
    with _make_client(FakeSelectionOrchestrator()) as client:
        response = client.get("/ai/local/selection-stats")

    assert response.status_code == 200
    body = response.json()
    assert body["total_selections"] == 3
    assert body["selections_by_model"]["reasoning-model"] == 2
    assert body["selections_by_task"]["analyze_scenario"] == 2
    assert body["fallback_rate"] == 0.3333
    assert body["recent_history"][0]["selected_model"] == "reasoning-model"


def test_benchmark_data_improves_preferred_model_choice(tmp_path):
    benchmark_path = tmp_path / "benchmark_results.json"
    _write_benchmark_file(
        benchmark_path,
        [
            {
                "model": "fast-model",
                "avg_latency_ms": 120,
                "success_rate": 0.98,
                "json_valid_rate": 0.97,
                "avg_objects_detected": 2.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.95,
            },
        ],
    )
    settings = LocalAISettings(
        ai_model_selection_enabled=True,
        ai_benchmark_tuning_enabled=True,
        ai_benchmark_results_path=str(benchmark_path),
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["fast-model", "reasoning-model", "extraction-model"],
            latency_sensitive=False,
            quality_policy="balanced",
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "fast-model"
    assert result.benchmark_used is True
    assert "benchmark" in result.reason.lower()


def test_missing_benchmark_file_falls_back_safely(tmp_path):
    settings = LocalAISettings(
        ai_model_selection_enabled=True,
        ai_benchmark_tuning_enabled=True,
        ai_benchmark_results_path=str(tmp_path / "missing.json"),
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["fast-model", "reasoning-model", "extraction-model"],
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "reasoning-model"
    assert result.benchmark_used is False
    assert result.metadata["benchmark_error"] == "benchmark_results_unavailable"


def test_malformed_benchmark_file_does_not_crash_selection(tmp_path):
    benchmark_path = tmp_path / "benchmark_results.json"
    benchmark_path.write_text("{bad json", encoding="utf-8")
    settings = LocalAISettings(
        ai_model_selection_enabled=True,
        ai_benchmark_tuning_enabled=True,
        ai_benchmark_results_path=str(benchmark_path),
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="extract_objects",
            available_models=["fast-model", "reasoning-model", "extraction-model"],
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "extraction-model"
    assert result.benchmark_used is False
    assert result.metadata["benchmark_error"] == "benchmark_results_invalid"


def test_latency_sensitive_task_prefers_fast_model_when_benchmark_confirms_it(tmp_path):
    benchmark_path = tmp_path / "benchmark_results.json"
    _write_benchmark_file(
        benchmark_path,
        [
            {
                "model": "fast-model",
                "avg_latency_ms": 80,
                "success_rate": 0.9,
                "json_valid_rate": 0.85,
                "avg_objects_detected": 1.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.8,
            },
            {
                "model": "reasoning-model",
                "avg_latency_ms": 950,
                "success_rate": 0.95,
                "json_valid_rate": 0.9,
                "avg_objects_detected": 1.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.85,
            },
        ],
    )
    settings = LocalAISettings(
        ai_model_selection_enabled=True,
        ai_benchmark_tuning_enabled=True,
        ai_benchmark_results_path=str(benchmark_path),
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["fast-model", "reasoning-model"],
            latency_sensitive=True,
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "fast-model"
    assert result.benchmark_used is True
    assert "latency" in result.reason.lower()


def test_extraction_task_prefers_model_with_stronger_json_and_extraction_benchmark_signals(tmp_path):
    benchmark_path = tmp_path / "benchmark_results.json"
    _write_benchmark_file(
        benchmark_path,
        [
            {
                "model": "extraction-model",
                "avg_latency_ms": 500,
                "success_rate": 0.88,
                "json_valid_rate": 0.99,
                "avg_objects_detected": 6.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.8,
            },
            {
                "model": "fast-model",
                "avg_latency_ms": 200,
                "success_rate": 0.8,
                "json_valid_rate": 0.6,
                "avg_objects_detected": 1.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.75,
            },
        ],
    )
    settings = LocalAISettings(
        ai_model_selection_enabled=True,
        ai_benchmark_tuning_enabled=True,
        ai_benchmark_results_path=str(benchmark_path),
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="extract_objects",
            available_models=["fast-model", "extraction-model"],
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "extraction-model"
    assert result.benchmark_used is True
    assert "json validity" in result.reason.lower()


def test_reasoning_task_keeps_safe_baseline_when_benchmark_evidence_is_weak(tmp_path):
    benchmark_path = tmp_path / "benchmark_results.json"
    _write_benchmark_file(
        benchmark_path,
        [
            {
                "model": "fast-model",
                "avg_latency_ms": 100,
                "success_rate": 0.4,
                "json_valid_rate": 0.95,
                "avg_objects_detected": 2.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.9,
            },
            {
                "model": "reasoning-model",
                "avg_latency_ms": 700,
                "success_rate": 0.6,
                "json_valid_rate": 0.75,
                "avg_objects_detected": 1.0,
                "avg_risk_signals": 1.0,
                "avg_confidence": 0.7,
            },
        ],
    )
    settings = LocalAISettings(
        ai_model_selection_enabled=True,
        ai_benchmark_tuning_enabled=True,
        ai_benchmark_results_path=str(benchmark_path),
        ai_benchmark_min_success_rate=0.8,
        ollama_default_model="balanced-model",
        ai_default_fast_model="fast-model",
        ai_default_reasoning_model="reasoning-model",
        ai_default_extraction_model="extraction-model",
    )
    engine = LocalAIModelSelectionEngine(settings)

    result = engine.select(
        ModelSelectionRequest(
            task_type="analyze_scenario",
            available_models=["fast-model", "reasoning-model"],
        ),
        default_model=settings.default_model,
    )

    assert result.selected_model == "reasoning-model"
    assert result.benchmark_used is False
    assert "rules-based reasoning policy" in result.reason.lower()
