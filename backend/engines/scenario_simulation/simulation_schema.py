"""Pydantic schemas for Nexora scenario simulation."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from backend.engines.system_modeling.model_schema import SystemModel


class ScenarioShock(BaseModel):
    """An external disturbance applied to a signal."""

    signal: str
    delta: float = Field(ge=-1.0, le=1.0)


class ScenarioInput(BaseModel):
    """Simulation input describing shocks and step count."""

    shocks: list[ScenarioShock] = Field(default_factory=list)
    time_steps: int = Field(default=20, ge=1, le=50)
    metadata: dict[str, Any] = Field(default_factory=dict)


class SimulationStep(BaseModel):
    """Signal state snapshot for one simulation time step."""

    t: int = Field(ge=0)
    signals: dict[str, float] = Field(default_factory=dict)


class SimulationEvent(BaseModel):
    """Discrete event emitted during simulation."""

    time: int = Field(ge=0)
    type: str
    signal: str
    severity: str = "medium"
    message: str


class SimulationResult(BaseModel):
    """Simulation output timeline and summary state."""

    timeline: list[SimulationStep] = Field(default_factory=list)
    events: list[SimulationEvent] = Field(default_factory=list)
    final_state: dict[str, float] = Field(default_factory=dict)
    stability_score: float = Field(ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ScenarioComparisonEntry(BaseModel):
    """One named scenario result used for side-by-side comparison."""

    scenario_name: str
    result: SimulationResult


class ScenarioComparisonResult(BaseModel):
    """Comparison output for multiple deterministic scenario runs."""

    baseline: SimulationResult
    scenarios: list[ScenarioComparisonEntry] = Field(default_factory=list)
    best_scenario: str | None = None
    worst_scenario: str | None = None


class SimulationRequest(BaseModel):
    """Request wrapper combining a system model and scenario input."""

    system_model: SystemModel
    scenario: ScenarioInput = Field(default_factory=ScenarioInput)
