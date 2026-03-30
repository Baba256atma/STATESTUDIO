"""Scenario action contracts for Phase-2-ready Nexora decision overlays."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from engines.scenario_simulation.propagation_models import (
    PropagationObjectGraph,
    PropagationResult,
)


ScenarioActionKind = Literal[
    "stress_increase",
    "stress_reduce",
    "strategy_apply",
    "decision_path_request",
    "propagation_request",
    "compare_request",
]

ScenarioActionMode = Literal["what_if", "decision_path", "compare", "preview"]


class ScenarioActionIntent(BaseModel):
    """Explicit simulation intent from Scenario Studio or future War Room flows."""

    action_id: str
    action_kind: ScenarioActionKind
    source_object_id: str | None = None
    target_object_ids: list[str] = Field(default_factory=list)
    label: str | None = None
    description: str | None = None
    parameters: dict[str, Any] = Field(default_factory=dict)
    mode: ScenarioActionMode = "what_if"
    requested_outputs: list[str] = Field(default_factory=lambda: ["propagation"])
    created_at: int | None = None
    priority: int | None = None


class ScenarioActionRoutePolicy(BaseModel):
    reuse_payload_if_available: bool = True
    request_backend: bool = True
    allow_preview_fallback: bool = False


class ScenarioActionVisualizationHints(BaseModel):
    preferred_focus_object_id: str | None = None
    preserve_existing_scene: bool = True
    emphasis_mode: Literal["propagation", "decision_path", "mixed"] = "mixed"


class ScenarioActionMetadata(BaseModel):
    origin: Literal["scenario_studio", "war_room", "manual_action"] = "scenario_studio"
    version: str = "scenario_action_v1"


class ScenarioActionContract(BaseModel):
    intent: ScenarioActionIntent
    route_policy: ScenarioActionRoutePolicy = Field(default_factory=ScenarioActionRoutePolicy)
    visualization_hints: ScenarioActionVisualizationHints = Field(default_factory=ScenarioActionVisualizationHints)
    metadata: ScenarioActionMetadata = Field(default_factory=ScenarioActionMetadata)


class DecisionPathNode(BaseModel):
    object_id: str
    role: str
    depth: int = Field(ge=0)
    strength: float = Field(ge=0.0, le=1.0)
    direction: Literal["upstream", "downstream", "mixed"] | None = None
    rationale: str | None = None


class DecisionPathEdge(BaseModel):
    from_id: str
    to_id: str
    depth: int = Field(ge=1)
    strength: float = Field(ge=0.0, le=1.0)
    path_role: Literal["primary_path", "secondary_path", "tradeoff_path", "feedback_path"] | None = None


class DecisionPathResult(BaseModel):
    active: bool
    source_object_id: str | None = None
    nodes: list[DecisionPathNode] = Field(default_factory=list)
    edges: list[DecisionPathEdge] = Field(default_factory=list)
    meta: dict[str, Any] = Field(default_factory=dict)


class ScenarioAdviceItem(BaseModel):
    label: str
    rationale: str | None = None


class ScenarioAnalysisPayload(BaseModel):
    summary: str | None = None
    advice: list[ScenarioAdviceItem] = Field(default_factory=list)


class ScenarioActionRequest(BaseModel):
    scenario_action: ScenarioActionIntent
    scene_json: dict[str, Any] | None = None
    object_graph: PropagationObjectGraph | None = None
    current_context: dict[str, Any] | None = None
    max_depth: int = Field(default=2, ge=0, le=5)
    decay: float = Field(default=0.74, gt=0.0, le=1.0)


class ScenarioActionResponse(BaseModel):
    simulation: dict[str, Any] = Field(default_factory=dict)
    analysis: ScenarioAnalysisPayload | None = None


class ScenarioActionResultBundle(BaseModel):
    scenario_action: ScenarioActionContract
    propagation: PropagationResult | None = None
    decision_path: DecisionPathResult | None = None
    analysis: ScenarioAnalysisPayload | None = None
