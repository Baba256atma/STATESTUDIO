from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator

from app.models.typec_ai_models import TypeCDecisionRecommendationPayload


def _clean_text(value: object, max_length: int) -> str:
    text = " ".join(str(value or "").split()).strip()
    if len(text) <= max_length:
        return text
    return text[: max(0, max_length - 1)].rstrip() + "…"


class TypeCScenarioDraftPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str = ""
    title: str = ""
    description: str = ""
    trigger: str = ""
    impact: str = ""
    confidence: float = Field(default=0.35, ge=0.0, le=1.0)
    relatedObjectIds: list[str] = Field(default_factory=list)
    basedOnConnections: list[str] = Field(default_factory=list)


class TypeCSandboxRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sceneSnapshot: dict[str, Any]
    currentRecommendation: TypeCDecisionRecommendationPayload | None = None
    activeScenario: TypeCScenarioDraftPayload | None = None


class TypeCSandboxStrategy(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., min_length=1, max_length=90)
    title: str = Field(..., min_length=1, max_length=120)
    description: str = Field(..., min_length=1, max_length=360)
    proposedActions: list[str] = Field(default_factory=list, max_length=5)
    expectedBenefits: list[str] = Field(default_factory=list, max_length=5)
    risks: list[str] = Field(default_factory=list, max_length=5)
    confidence: float = Field(default=0.35, ge=0.0, le=1.0)

    @field_validator("id", "title", "description", mode="before")
    @classmethod
    def _clamp_text(cls, value: object, info: ValidationInfo) -> str:
        limits = {"id": 90, "title": 120, "description": 360}
        return _clean_text(value, limits.get(info.field_name, 160))

    @field_validator("proposedActions", "expectedBenefits", "risks", mode="before")
    @classmethod
    def _clamp_lists(cls, value: object) -> list[str]:
        if not isinstance(value, list):
            return []
        items = [_clean_text(item, 160) for item in value]
        return [item for item in items if item][:5]

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_confidence(cls, value: object) -> float:
        try:
            numeric = float(value)
        except (TypeError, ValueError):
            return 0.35
        return max(0.0, min(1.0, numeric))


class TypeCSandboxResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    strategies: list[TypeCSandboxStrategy] = Field(default_factory=list, max_length=4)
    bestStrategyId: str | None = None
    summary: str = Field(..., min_length=1, max_length=460)
    source: str = "sandbox"

    @field_validator("summary", mode="before")
    @classmethod
    def _clamp_summary(cls, value: object) -> str:
        return _clean_text(value, 460)
