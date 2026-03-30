"""Normalized what-if propagation models for Nexora simulation overlays."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class PropagationGraphEdge(BaseModel):
    """Normalized relation edge used by the propagation scaffold."""

    from_id: str
    to_id: str
    weight: float = Field(default=1.0, ge=0.0, le=1.0)


class PropagationObjectGraph(BaseModel):
    """Optional normalized graph contract accepted by the propagation service."""

    object_ids: list[str] = Field(default_factory=list)
    edges: list[PropagationGraphEdge] = Field(default_factory=list)


class PropagationRequest(BaseModel):
    """Request contract for heuristic propagation preview."""

    source_object_id: str
    max_depth: int = Field(default=2, ge=0, le=5)
    decay: float = Field(default=0.74, gt=0.0, le=1.0)
    relation_weight_default: float = Field(default=1.0, gt=0.0, le=1.0)
    scene_json: dict[str, Any] | None = None
    object_graph: PropagationObjectGraph | None = None
    mode: str = "preview"


class PropagationNodeImpact(BaseModel):
    """Node-level propagated impact returned for UI overlays."""

    object_id: str
    depth: int = Field(ge=0)
    strength: float = Field(ge=0.0, le=1.0)
    role: str


class PropagationEdgeImpact(BaseModel):
    """Edge-level propagated path impact returned for UI overlays."""

    from_id: str
    to_id: str
    depth: int = Field(ge=1)
    strength: float = Field(ge=0.0, le=1.0)


class PropagationResult(BaseModel):
    """Normalized propagation result for frontend visualization shells."""

    active: bool
    source_object_id: str
    impacted_nodes: list[PropagationNodeImpact] = Field(default_factory=list)
    impacted_edges: list[PropagationEdgeImpact] = Field(default_factory=list)
    meta: dict[str, Any] = Field(default_factory=dict)
