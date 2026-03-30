"""Typed contracts for Nexora's system intelligence interpretation layer."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


InterpretationMode = Literal["analysis", "simulation", "decision"]


class SystemIntelligenceInput(BaseModel):
    scenario_action: dict[str, Any] | None = None
    propagation: dict[str, Any] | None = None
    decision_path: dict[str, Any] | None = None
    scanner_summary: dict[str, Any] | None = None
    scene_json: dict[str, Any] | None = None
    current_focus_object_id: str | None = None
    mode: InterpretationMode = "analysis"


class SystemIntelligenceObjectInsight(BaseModel):
    object_id: str
    role: Literal["source", "impacted", "leverage", "bottleneck", "protected", "destination", "context"]
    strategic_priority: float = Field(ge=0.0, le=1.0)
    pressure_score: float = Field(ge=0.0, le=1.0)
    leverage_score: float = Field(ge=0.0, le=1.0)
    fragility_score: float | None = Field(default=None, ge=0.0, le=1.0)
    rationale: str | None = None


class SystemIntelligencePathInsight(BaseModel):
    path_id: str
    source_object_id: str | None = None
    target_object_id: str | None = None
    path_strength: float = Field(ge=0.0, le=1.0)
    path_role: Literal["primary", "secondary", "tradeoff", "feedback"]
    significance_score: float = Field(ge=0.0, le=1.0)
    rationale: str | None = None


class SystemIntelligenceSummary(BaseModel):
    headline: str
    summary: str
    key_signal: str | None = None
    suggested_focus_object_id: str | None = None
    suggested_mode: InterpretationMode | None = None


class SystemIntelligenceAdvice(BaseModel):
    advice_id: str
    kind: Literal["focus", "mitigate", "protect", "investigate", "simulate_next"]
    target_object_id: str | None = None
    title: str
    body: str
    confidence: float = Field(ge=0.0, le=1.0)


class SystemIntelligenceResult(BaseModel):
    active: bool
    object_insights: list[SystemIntelligenceObjectInsight] = Field(default_factory=list)
    path_insights: list[SystemIntelligencePathInsight] = Field(default_factory=list)
    summary: SystemIntelligenceSummary
    advice: list[SystemIntelligenceAdvice] = Field(default_factory=list)
    meta: dict[str, Any] = Field(default_factory=dict)
