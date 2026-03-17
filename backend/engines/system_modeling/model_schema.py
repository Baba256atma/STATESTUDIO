"""Pydantic schemas for Nexora universal system models."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class SystemObject(BaseModel):
    """An actor, institution, resource, or subsystem in the modeled system."""

    id: str
    type: str
    name: str
    description: str


class SystemSignal(BaseModel):
    """A measurable system variable or qualitative pressure signal."""

    id: str
    name: str
    type: str


class SystemRelationship(BaseModel):
    """A directed relationship between two system objects."""

    model_config = ConfigDict(populate_by_name=True)

    from_object: str = Field(alias="from")
    to_object: str = Field(alias="to")
    type: str


class SystemLoop(BaseModel):
    """A feedback loop inside the system."""

    name: str
    type: str
    path: list[str] = Field(default_factory=list)


class SystemConflict(BaseModel):
    """A strategic or operational tradeoff inside the system."""

    name: str
    actors: list[str] = Field(default_factory=list)
    tradeoff: list[str] = Field(default_factory=list)


class SystemFragilityPoint(BaseModel):
    """A threshold at which the system becomes fragile or unstable."""

    signal: str
    threshold: str


class SystemModel(BaseModel):
    """Structured machine-readable system model for Nexora."""

    problem_summary: str
    objects: list[SystemObject] = Field(default_factory=list)
    signals: list[SystemSignal] = Field(default_factory=list)
    relationships: list[SystemRelationship] = Field(default_factory=list)
    loops: list[SystemLoop] = Field(default_factory=list)
    conflicts: list[SystemConflict] = Field(default_factory=list)
    fragility_points: list[SystemFragilityPoint] = Field(default_factory=list)
