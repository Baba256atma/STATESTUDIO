"""Typed contracts for Nexora compare mode."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from engines.system_intelligence.intelligence_models import SystemIntelligenceResult


CompareFocusDimension = Literal["risk", "efficiency", "stability", "growth", "balanced"]
CompareWinner = Literal["A", "B", "tie"]


class CompareScenarioInput(BaseModel):
    scenario: dict[str, Any] = Field(default_factory=dict)
    intelligence: SystemIntelligenceResult


class CompareInput(BaseModel):
    scenarioA: CompareScenarioInput
    scenarioB: CompareScenarioInput
    focusDimension: CompareFocusDimension = "balanced"


class CompareObjectDelta(BaseModel):
    object_id: str
    impactA: float = Field(ge=0.0, le=1.0)
    impactB: float = Field(ge=0.0, le=1.0)
    delta: float = Field(ge=-1.0, le=1.0)
    interpretation: Literal["improved", "worse", "neutral"]
    rationale: str


class ComparePathDelta(BaseModel):
    path_id: str
    strengthA: float = Field(ge=0.0, le=1.0)
    strengthB: float = Field(ge=0.0, le=1.0)
    delta: float = Field(ge=-1.0, le=1.0)
    interpretation: Literal["stronger", "weaker", "equal"]
    strategicRole: Literal["critical", "supporting", "secondary"]
    rationale: str


class CompareTradeoff(BaseModel):
    dimension: Literal["risk", "efficiency", "stability", "growth"]
    winner: CompareWinner
    confidence: float = Field(ge=0.0, le=1.0)
    explanation: str


class CompareSummary(BaseModel):
    headline: str
    winner: CompareWinner
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str
    keyTradeoffs: list[str] = Field(default_factory=list)


class CompareAdvice(BaseModel):
    advice_id: str
    recommendation: Literal["choose_A", "choose_B", "investigate_more", "hybrid"]
    title: str
    explanation: str
    confidence: float = Field(ge=0.0, le=1.0)


class CompareResult(BaseModel):
    object_deltas: list[CompareObjectDelta] = Field(default_factory=list)
    path_deltas: list[ComparePathDelta] = Field(default_factory=list)
    tradeoffs: list[CompareTradeoff] = Field(default_factory=list)
    summary: CompareSummary
    advice: list[CompareAdvice] = Field(default_factory=list)
    meta: dict[str, Any] = Field(default_factory=dict)
