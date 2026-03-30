from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


CouncilAgentRole = Literal["ceo", "cfo", "coo"]


class CouncilAgentInput(BaseModel):
    text: str = ""
    mode: str = "business"
    focused_object_id: str | None = None
    allowed_objects: list[str] = Field(default_factory=list)
    fragility: dict[str, Any] | None = None
    propagation: dict[str, Any] | None = None
    decision_path: dict[str, Any] | None = None
    compare_result: dict[str, Any] | None = None
    strategy_result: dict[str, Any] | None = None
    memory_summary: dict[str, Any] | None = None
    learning_summary: dict[str, Any] | None = None
    scene_json: dict[str, Any] | None = None


class CouncilAgentOpinion(BaseModel):
    role: CouncilAgentRole
    headline: str
    summary: str
    priorities: list[str] = Field(default_factory=list)
    concerns: list[str] = Field(default_factory=list)
    recommended_actions: list[str] = Field(default_factory=list)
    confidence: float = Field(ge=0.0, le=1.0)


class CouncilDisagreement(BaseModel):
    dimension: str
    ceo_position: str | None = None
    cfo_position: str | None = None
    coo_position: str | None = None
    tension_level: float = Field(ge=0.0, le=1.0)
    summary: str


class CouncilSynthesis(BaseModel):
    headline: str
    summary: str
    recommended_direction: str
    top_actions: list[str] = Field(default_factory=list)
    tradeoffs: list[str] = Field(default_factory=list)
    confidence: float = Field(ge=0.0, le=1.0)


class CouncilMeta(BaseModel):
    version: str = "v1"
    mode: str = "business"
    source: str = "strategic_council"
    timestamp: int


class StrategicCouncilResult(BaseModel):
    active: bool = False
    opinions: list[CouncilAgentOpinion] = Field(default_factory=list)
    disagreements: list[CouncilDisagreement] = Field(default_factory=list)
    synthesis: CouncilSynthesis
    meta: CouncilMeta
