"""Lightweight persistent memory store for Nexora evolution."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from engines.evolution.learning_models import EvolutionState, EvolutionSummary
from engines.evolution.memory_models import (
    ComparisonMemoryRecord,
    ObservedOutcome,
    ScenarioMemoryRecord,
    StrategyMemoryRecord,
)


STORE_PATH = Path(__file__).resolve().parents[2] / "data" / "evolution_memory_store.json"


def _empty_store() -> dict[str, Any]:
    return {
        "scenario_records": [],
        "strategy_records": [],
        "comparison_records": [],
        "evolution_state": EvolutionState(
            active=False,
            learning_signals=[],
            policy_adjustments=[],
            summary=EvolutionSummary(
                headline="No learning signals yet.",
                explanation="Nexora needs stored scenarios, strategies, and outcomes before it can evolve policy guidance.",
            ),
        ).model_dump(mode="python"),
    }


def _load_store() -> dict[str, Any]:
    if not STORE_PATH.exists():
        return _empty_store()
    try:
        return json.loads(STORE_PATH.read_text())
    except Exception:
        return _empty_store()


def _write_store(store: dict[str, Any]) -> None:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STORE_PATH.write_text(json.dumps(store, indent=2, sort_keys=True))


def save_scenario_record(record: ScenarioMemoryRecord) -> ScenarioMemoryRecord:
    store = _load_store()
    existing = [item for item in store["scenario_records"] if str(item.get("record_id")) != record.record_id]
    existing.append(record.model_dump(mode="python"))
    store["scenario_records"] = sorted(existing, key=lambda item: float(item.get("timestamp", 0.0)), reverse=True)
    _write_store(store)
    return record


def save_strategy_record(record: StrategyMemoryRecord) -> StrategyMemoryRecord:
    store = _load_store()
    existing = [item for item in store["strategy_records"] if str(item.get("record_id")) != record.record_id]
    existing.append(record.model_dump(mode="python"))
    store["strategy_records"] = sorted(existing, key=lambda item: float(item.get("timestamp", 0.0)), reverse=True)
    _write_store(store)
    return record


def save_comparison_record(record: ComparisonMemoryRecord) -> ComparisonMemoryRecord:
    store = _load_store()
    existing = [item for item in store["comparison_records"] if str(item.get("record_id")) != record.record_id]
    existing.append(record.model_dump(mode="python"))
    store["comparison_records"] = sorted(existing, key=lambda item: float(item.get("timestamp", 0.0)), reverse=True)
    _write_store(store)
    return record


def update_scenario_outcome(record_id: str, observed_outcome: ObservedOutcome) -> ScenarioMemoryRecord | None:
    store = _load_store()
    updated = None
    next_records = []
    for item in store["scenario_records"]:
        if str(item.get("record_id")) == record_id:
            item = {
                **item,
                "observed_outcome": observed_outcome.model_dump(mode="python"),
            }
            updated = ScenarioMemoryRecord(**item)
        next_records.append(item)
    store["scenario_records"] = next_records
    _write_store(store)
    return updated


def get_recent_records(limit: int = 12) -> dict[str, list[dict[str, Any]]]:
    store = _load_store()
    return {
        "scenario_records": list(store["scenario_records"][:limit]),
        "strategy_records": list(store["strategy_records"][:limit]),
        "comparison_records": list(store["comparison_records"][:limit]),
    }


def get_records_by_object_id(object_id: str) -> list[dict[str, Any]]:
    store = _load_store()
    return [
        item
        for item in store["scenario_records"]
        if object_id in [str(entry) for entry in item.get("source_object_ids", [])]
    ]


def get_records_by_strategy_id(strategy_id: str) -> list[dict[str, Any]]:
    store = _load_store()
    return [item for item in store["strategy_records"] if str(item.get("strategy_id")) == strategy_id]


def get_records_by_mode(mode: str) -> list[dict[str, Any]]:
    store = _load_store()
    return [item for item in store["scenario_records"] if str(item.get("mode")) == mode]


def get_all_records() -> dict[str, list[dict[str, Any]]]:
    store = _load_store()
    return {
        "scenario_records": list(store["scenario_records"]),
        "strategy_records": list(store["strategy_records"]),
        "comparison_records": list(store["comparison_records"]),
    }


def save_evolution_state(state: EvolutionState) -> EvolutionState:
    store = _load_store()
    store["evolution_state"] = state.model_dump(mode="python")
    _write_store(store)
    return state


def get_evolution_state() -> EvolutionState:
    store = _load_store()
    return EvolutionState(**store.get("evolution_state", _empty_store()["evolution_state"]))
