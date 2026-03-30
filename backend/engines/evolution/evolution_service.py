"""Evolution orchestration and policy input access for Nexora."""

from __future__ import annotations

from typing import Any

from engines.evolution.evolution_policy import build_policy_inputs
from engines.evolution.learning_models import EvolutionState
from engines.evolution.learning_service import run_learning_pass
from engines.evolution.memory_models import (
    ComparisonMemoryRecord,
    MemorySaveRequest,
    OutcomeUpdateRequest,
    ScenarioMemoryRecord,
    StrategyMemoryRecord,
)
from engines.evolution.memory_store import (
    get_all_records,
    get_evolution_state,
    get_recent_records,
    save_comparison_record,
    save_evolution_state,
    save_scenario_record,
    save_strategy_record,
    update_scenario_outcome,
)


def save_memory(request: MemorySaveRequest) -> dict[str, Any]:
    saved: dict[str, Any] = {
        "scenario_record": None,
        "strategy_records": [],
        "comparison_record": None,
    }
    if request.scenario_record is not None:
        saved["scenario_record"] = save_scenario_record(request.scenario_record).model_dump(mode="python")
    for item in request.strategy_records:
        saved["strategy_records"].append(save_strategy_record(item).model_dump(mode="python"))
    if request.comparison_record is not None:
        saved["comparison_record"] = save_comparison_record(request.comparison_record).model_dump(mode="python")
    return saved


def update_outcome(request: OutcomeUpdateRequest) -> ScenarioMemoryRecord | None:
    return update_scenario_outcome(request.record_id, request.observed_outcome)


def run_evolution_pass() -> EvolutionState:
    records = get_all_records()
    state = run_learning_pass(records)
    return save_evolution_state(state)


def get_current_evolution_state() -> EvolutionState:
    return get_evolution_state()


def get_current_policy_inputs() -> dict[str, dict[str, float]]:
    return build_policy_inputs(get_evolution_state())


def get_recent_memory(limit: int = 12) -> dict[str, list[dict[str, Any]]]:
    return get_recent_records(limit)
