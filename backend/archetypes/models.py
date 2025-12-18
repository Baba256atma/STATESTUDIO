"""Data model for archetype analysis and visual instructions."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Literal, Tuple

Vec3 = Tuple[float, float, float]

NodeShape = Literal["sphere", "box", "ico", "dodeca"]
LoopType = Literal["R", "B"]
FlowType = Literal["line", "tube"]


@dataclass
class VisualNode:
    id: str
    shape: NodeShape
    pos: Vec3
    color: str
    intensity: float
    opacity: float
    scale: float | None = None


@dataclass
class VisualLoop:
    id: str
    type: LoopType
    center: Vec3
    radius: float
    intensity: float
    flow_speed: float
    bottleneck: float | None = None
    delay: float | None = None


@dataclass
class VisualLever:
    id: str
    target: str
    pos: Vec3
    strength: float


@dataclass
class VisualFlow:
    id: str
    from_id: str
    to_id: str
    type: FlowType
    speed: float
    intensity: float | None = None
    color: str | None = None


@dataclass
class VisualField:
    chaos: float
    density: float
    noise_amp: float


@dataclass
class VisualState:
    t: float | None = None
    focus: str | None = None
    nodes: List[VisualNode] = field(default_factory=list)
    loops: List[VisualLoop] = field(default_factory=list)
    levers: List[VisualLever] = field(default_factory=list)
    flows: List[VisualFlow] | None = None
    field: VisualField | None = None


@dataclass
class FeedbackLoop:
    id: str
    type: LoopType
    nodes: List[str]
    strength: float
    delay: float | None = None


@dataclass
class LeverageHint:
    id: str
    target_id: str
    action: str
    impact: float
    rationale: str | None = None


@dataclass
class ArchetypeDetection:
    id: str
    label: str
    confidence: float
    loops: List[FeedbackLoop] = field(default_factory=list)
    notes: List[str] = field(default_factory=list)


@dataclass
class ArchetypeReport:
    archetypes: List[ArchetypeDetection]
    leverage: List[LeverageHint]
    visual: VisualState
