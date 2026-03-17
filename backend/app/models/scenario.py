"""Core Scenario Studio MVP data contracts."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


ScenarioShockType = Literal[
    "supplier_failure",
    "delivery_delay",
    "demand_spike",
    "price_increase",
    "risk_event",
]
ScenarioMetric = Literal["inventory", "delivery", "risk", "fragility", "volatility"]
ScenarioEventType = Literal["shock_applied", "threshold_warning", "state_change", "runner_note"]
ScenarioSeverity = Literal["low", "medium", "high", "critical"]


class ScenarioShock(BaseModel):
    """A deterministic business shock applied during a scenario run."""

    shock_type: ScenarioShockType
    severity: float = Field(default=0.4, ge=0.0, le=1.0)
    label: str | None = None
    reason: str | None = None
    start_tick: int = Field(default=1, ge=0)
    duration_ticks: int = Field(default=1, ge=1)


class ScenarioParameters(BaseModel):
    """Run-level parameters for one deterministic scenario simulation."""

    time_steps: int = Field(default=12, ge=1, le=100)
    stop_on_critical: bool = False
    scenario_name: str | None = None
    shocks: list[ScenarioShock] = Field(default_factory=list)


class ScenarioState(BaseModel):
    """Normalized business state at a point in the scenario timeline."""

    inventory: float = Field(default=0.7, ge=0.0, le=1.0)
    delivery: float = Field(default=0.7, ge=0.0, le=1.0)
    risk: float = Field(default=0.2, ge=0.0, le=1.0)
    fragility: float = Field(default=0.2, ge=0.0, le=1.0)
    volatility: float = Field(default=0.2, ge=0.0, le=1.0)


class ScenarioEvent(BaseModel):
    """A notable event emitted during one scenario tick."""

    tick: int = Field(default=0, ge=0)
    event_type: ScenarioEventType = "runner_note"
    severity: ScenarioSeverity = "low"
    message: str
    metric: ScenarioMetric | None = None
    value: float | None = Field(default=None, ge=0.0, le=1.0)


class ScenarioTick(BaseModel):
    """A complete timeline snapshot for one tick."""

    tick: int = Field(default=0, ge=0)
    state: ScenarioState = Field(default_factory=ScenarioState)
    events: list[ScenarioEvent] = Field(default_factory=list)


class ScenarioRunResult(BaseModel):
    """The full structured output of a scenario run."""

    ok: bool = True
    scenario_id: str | None = None
    scenario_name: str | None = None
    parameters: ScenarioParameters = Field(default_factory=ScenarioParameters)
    initial_state: ScenarioState = Field(default_factory=ScenarioState)
    ticks: list[ScenarioTick] = Field(default_factory=list)
    final_state: ScenarioState = Field(default_factory=ScenarioState)
    events: list[ScenarioEvent] = Field(default_factory=list)
    summary: dict[str, str] | None = None
    stability_score: float = Field(default=0.8, ge=0.0, le=1.0)
