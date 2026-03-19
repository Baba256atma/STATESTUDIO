"""Pydantic schemas for the Nexora Strategy War-Room Engine."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from engines.system_modeling.model_schema import SystemModel


class WarRoomActor(BaseModel):
    """A strategic actor participating in the war-room simulation."""

    id: str
    type: str
    objectives: list[str] = Field(default_factory=list)
    resources: float = Field(default=0.6, ge=0.0, le=1.0)
    influence: float = Field(default=0.5, ge=0.0, le=1.0)


class WarRoomStrategy(BaseModel):
    """A normalized actor strategy with behavioral style and signal impacts."""

    id: str
    actor_id: str
    name: str
    style: str
    description: str
    shocks: dict[str, float] = Field(default_factory=dict)


class WarRoomTimelineStep(BaseModel):
    """System state snapshot and actor choices for one time step."""

    t: int = Field(ge=0)
    signals: dict[str, float] = Field(default_factory=dict)
    actor_strategies: dict[str, str] = Field(default_factory=dict)


class WarRoomConflictEvent(BaseModel):
    """A strategic conflict or cooperation event between actors."""

    time: int = Field(ge=0)
    type: str
    actors: list[str] = Field(default_factory=list)
    description: str
    severity: str = "medium"


class WarRoomActorOutcome(BaseModel):
    """Aggregated outcome for one actor over the full war-room horizon."""

    actor_id: str
    selected_strategy: str
    payoff: float = Field(ge=0.0, le=1.0)
    risk_exposure: float = Field(ge=0.0, le=1.0)
    stability_impact: float = Field(ge=-1.0, le=1.0)
    strategy_history: list[str] = Field(default_factory=list)


class DominantStrategy(BaseModel):
    """The strongest strategy observed in the simulation."""

    actor_id: str
    strategy: str
    reason: str
    score: float


class WarRoomResult(BaseModel):
    """Output for a full multi-actor war-room simulation."""

    timeline: list[WarRoomTimelineStep] = Field(default_factory=list)
    strategy_paths: list[WarRoomActorOutcome] = Field(default_factory=list)
    actor_outcomes: list[WarRoomActorOutcome] = Field(default_factory=list)
    conflict_events: list[WarRoomConflictEvent] = Field(default_factory=list)
    system_fragility: dict[str, Any] = Field(default_factory=dict)
    dominant_strategy: DominantStrategy | None = None
    stability_score: float = Field(ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class WarRoomSimulation(BaseModel):
    """Input payload for a war-room simulation."""

    system_model: SystemModel
    actors: list[WarRoomActor] = Field(default_factory=list)
    strategies: dict[str, list[str]] = Field(default_factory=dict)
    time_steps: int = Field(default=20, ge=1, le=50)
