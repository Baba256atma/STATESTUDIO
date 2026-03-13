"""Pydantic v2 models for scenario replay storage."""
from __future__ import annotations

from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


class ReplayMeta(BaseModel):
    """Metadata for replay frames."""

    model_config = ConfigDict(extra="forbid")

    note: str | None = None
    tags: List[str] = []


class ReplayFrame(BaseModel):
    """Single replay frame in a deterministic episode."""

    model_config = ConfigDict(extra="forbid")

    t: float
    input_text: str | None = None
    human_state: dict | None = None
    system_signals: Dict[str, float]
    system_state: dict | None = None
    visual: dict
    meta: ReplayMeta

    @field_validator("t", mode="before")
    @classmethod
    def _clamp_time(cls, value: float) -> float:
        return max(0.0, float(value))

    @field_validator("system_signals", mode="before")
    @classmethod
    def _clamp_system_signals(cls, value: Dict[str, float]) -> Dict[str, float]:
        cleaned: Dict[str, float] = {}
        for key, weight in value.items():
            name = str(key).strip()
            if not name:
                raise ValueError("system_signals keys must be non-empty")
            cleaned[name] = _clamp01(float(weight))
        return cleaned


class ReplayEpisode(BaseModel):
    """Replay episode containing ordered frames."""

    model_config = ConfigDict(extra="forbid")

    episode_id: str
    created_at: datetime
    updated_at: datetime
    title: str | None = None
    frames: List[ReplayFrame]
    duration: float
    version: str

    @field_validator("duration", mode="before")
    @classmethod
    def _clamp_duration(cls, value: float) -> float:
        return max(0.0, float(value))

    @model_validator(mode="after")
    def _sort_frames(self) -> "ReplayEpisode":
        self.frames = sorted(self.frames, key=lambda f: f.t)
        if self.frames:
            max_t = max(frame.t for frame in self.frames)
            if self.duration < max_t:
                self.duration = max_t
        return self
