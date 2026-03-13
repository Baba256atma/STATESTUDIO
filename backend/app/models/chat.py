from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


class Action(BaseModel):
    """Represents an action to apply to a target object."""

    model_config = ConfigDict(extra="forbid")

    target_id: str = Field(..., min_length=1)
    verb: str = Field(..., min_length=1)
    value: Optional[str] = None
    color: Optional[str] = None
    intensity: Optional[float] = None

    @field_validator("intensity", mode="before")
    @classmethod
    def _clamp_intensity(cls, value: float | None) -> float | None:
        if value is None:
            return None
        return _clamp01(float(value))


class ChatRequest(BaseModel):
    """Incoming chat payload."""

    model_config = ConfigDict(extra="forbid")

    text: str
    mode: Optional[str] = None
    user_id: Optional[str] = None
    allowed_objects: Optional[List[str]] = None


class ChatResponse(BaseModel):
    """Outgoing chat response."""

    model_config = ConfigDict(extra="forbid")

    reply: str = Field(..., min_length=1)
    actions: List[Action] = Field(default_factory=list)
    debug: Optional[Dict[str, Any]] = None
