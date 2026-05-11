from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator


def _clean_text(value: str, max_length: int) -> str:
    text = " ".join(str(value or "").split()).strip()
    if len(text) <= max_length:
        return text
    return text[: max(0, max_length - 1)].rstrip() + "…"


class TypeCDecisionRecommendationPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommendedScenarioId: str | None = None
    reasoning: str = ""
    tradeoff: str = ""
    riskWarning: str = ""
    nextAction: str = ""
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class TypeCAdaptiveGuidancePayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    message: str = ""
    contextFactors: list[str] = Field(default_factory=list)
    recommendedAdjustment: str = ""
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class TypeCMemorySummaryPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    repeatedRisks: list[str] = Field(default_factory=list)
    stablePatterns: list[str] = Field(default_factory=list)
    unstablePatterns: list[str] = Field(default_factory=list)


class TypeCAIInsightRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decisionRecommendation: TypeCDecisionRecommendationPayload | None = None
    adaptiveGuidance: TypeCAdaptiveGuidancePayload | None = None
    memorySummary: TypeCMemorySummaryPayload | None = None


class TypeCAIInsightResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    executiveSummary: str = Field(..., min_length=1, max_length=420)
    strategicInsight: str = Field(..., min_length=1, max_length=420)
    cautionNote: str = Field(..., min_length=1, max_length=320)
    suggestedQuestions: list[str] = Field(default_factory=list, max_length=4)
    confidence: float = Field(default=0.35, ge=0.0, le=1.0)
    source: Literal["ai_assisted"] = "ai_assisted"

    @field_validator("executiveSummary", "strategicInsight", "cautionNote", mode="before")
    @classmethod
    def _clamp_text(cls, value: object, info: ValidationInfo) -> str:
        limit = 320 if info.field_name == "cautionNote" else 420
        return _clean_text(str(value or ""), limit)

    @field_validator("suggestedQuestions", mode="before")
    @classmethod
    def _clamp_questions(cls, value: object) -> list[str]:
        if not isinstance(value, list):
            return []
        questions = [_clean_text(str(item or ""), 140) for item in value]
        return [question for question in questions if question][:4]

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_confidence(cls, value: object) -> float:
        try:
            numeric = float(value)
        except (TypeError, ValueError):
            return 0.35
        return max(0.0, min(1.0, numeric))


class TypeCMultiAgentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommendation: TypeCDecisionRecommendationPayload | None = None
    adaptiveGuidance: TypeCAdaptiveGuidancePayload | None = None
    memorySummary: TypeCMemorySummaryPayload | None = None


class TypeCAgentResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    agent: str = Field(..., min_length=1, max_length=80)
    insight: str = Field(..., min_length=1, max_length=360)
    concerns: list[str] = Field(default_factory=list, max_length=4)
    recommendations: list[str] = Field(default_factory=list, max_length=4)
    confidence: float = Field(default=0.35, ge=0.0, le=1.0)

    @field_validator("agent", "insight", mode="before")
    @classmethod
    def _clamp_agent_text(cls, value: object, info: ValidationInfo) -> str:
        return _clean_text(str(value or ""), 80 if info.field_name == "agent" else 360)

    @field_validator("concerns", "recommendations", mode="before")
    @classmethod
    def _clamp_agent_lists(cls, value: object) -> list[str]:
        if not isinstance(value, list):
            return []
        items = [_clean_text(str(item or ""), 160) for item in value]
        return [item for item in items if item][:4]

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_agent_confidence(cls, value: object) -> float:
        try:
            numeric = float(value)
        except (TypeError, ValueError):
            return 0.35
        return max(0.0, min(1.0, numeric))


class TypeCMultiAgentSynthesis(BaseModel):
    model_config = ConfigDict(extra="forbid")

    executiveSummary: str = Field(..., min_length=1, max_length=460)
    keyAgreement: str = Field(default="", max_length=360)
    keyConflict: str = Field(default="", max_length=360)
    strategicRecommendation: str = Field(..., min_length=1, max_length=420)
    cautionAreas: list[str] = Field(default_factory=list, max_length=4)
    confidence: float = Field(default=0.35, ge=0.0, le=1.0)

    @field_validator("executiveSummary", "keyAgreement", "keyConflict", "strategicRecommendation", mode="before")
    @classmethod
    def _clamp_synthesis_text(cls, value: object, info: ValidationInfo) -> str:
        limits = {
            "executiveSummary": 460,
            "strategicRecommendation": 420,
            "keyAgreement": 360,
            "keyConflict": 360,
        }
        return _clean_text(str(value or ""), limits.get(info.field_name, 360))

    @field_validator("cautionAreas", mode="before")
    @classmethod
    def _clamp_caution_areas(cls, value: object) -> list[str]:
        if not isinstance(value, list):
            return []
        items = [_clean_text(str(item or ""), 160) for item in value]
        return [item for item in items if item][:4]

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_synthesis_confidence(cls, value: object) -> float:
        try:
            numeric = float(value)
        except (TypeError, ValueError):
            return 0.35
        return max(0.0, min(1.0, numeric))


class TypeCMultiAgentResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    agentResponses: list[TypeCAgentResponse] = Field(default_factory=list, max_length=6)
    synthesis: TypeCMultiAgentSynthesis
    source: Literal["multi_agent_ai"] = "multi_agent_ai"
