"""Output models for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from mapping.schemas import ObjectImpactSet


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def _trim_string(value: str) -> str:
    return value.strip()


class FragilityDriver(BaseModel):
    """A primary driver contributing to system fragility."""

    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    category: str
    strength: float = 0.0
    reason: str
    source_signal_ids: list[str] = Field(default_factory=list)
    score: float = 0.0
    severity: str = "low"
    dimension: str | None = None
    evidence_text: str | None = None

    @field_validator("id", "label", "category", "reason", "severity", "dimension", "evidence_text", mode="before")
    @classmethod
    def _trim_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None

    @field_validator("source_signal_ids", mode="before")
    @classmethod
    def _trim_signal_ids(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("strength", "score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(value)


class FragilitySummary(BaseModel):
    """Canonical scanner summary."""

    model_config = ConfigDict(extra="forbid")

    text: str
    confidence: float

    @field_validator("text", mode="before")
    @classmethod
    def _trim_summary_text(cls, value: str) -> str:
        return _trim_string(value)

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_confidence(cls, value: float) -> float:
        return _clamp01(value)


class FragilitySceneObject(BaseModel):
    """Legacy-compatible scene object emphasis entry."""

    model_config = ConfigDict(extra="forbid")

    id: str
    emphasis: float = 0.0
    reason: str

    @field_validator("id", "reason", mode="before")
    @classmethod
    def _trim_scene_fields(cls, value: str) -> str:
        return _trim_string(value)

    @field_validator("emphasis", mode="before")
    @classmethod
    def _clamp_emphasis(cls, value: float) -> float:
        return _clamp01(value)


class FragilitySceneHighlight(BaseModel):
    """Legacy-compatible scene highlight entry."""

    model_config = ConfigDict(extra="forbid")

    type: str
    target: str
    severity: str

    @field_validator("type", "target", "severity", mode="before")
    @classmethod
    def _trim_highlight_fields(cls, value: str) -> str:
        return _trim_string(value)


class FragilitySceneOverlay(BaseModel):
    """Legacy-compatible scene overlay note."""

    model_config = ConfigDict(extra="forbid")

    summary: str
    top_driver_ids: list[str] = Field(default_factory=list)

    @field_validator("summary", mode="before")
    @classmethod
    def _trim_overlay_summary(cls, value: str) -> str:
        return _trim_string(value)

    @field_validator("top_driver_ids", mode="before")
    @classmethod
    def _trim_driver_ids(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class FragilitySceneHint(BaseModel):
    """Overlay-safe scene hint used by unified reactions and legacy scanner UI."""

    model_config = ConfigDict(extra="forbid")

    highlighted_object_ids: list[str] = Field(default_factory=list)
    primary_object_ids: list[str] = Field(default_factory=list)
    affected_object_ids: list[str] = Field(default_factory=list)
    dim_unrelated_objects: bool = False
    reasons_by_object: dict[str, list[str]] = Field(default_factory=dict)
    objects: list[FragilitySceneObject] = Field(default_factory=list)
    highlights: list[FragilitySceneHighlight] = Field(default_factory=list)
    suggested_focus: list[str] = Field(default_factory=list)
    scanner_overlay: FragilitySceneOverlay | None = None
    state_vector: dict[str, Any] = Field(default_factory=dict)

    @field_validator("highlighted_object_ids", "primary_object_ids", "affected_object_ids", "suggested_focus", mode="before")
    @classmethod
    def _trim_object_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class PanelAdviceSlice(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    summary: str
    why: str | None = None
    recommendation: str | None = None
    risk_summary: str | None = None
    recommendations: list[str] = Field(default_factory=list)
    related_object_ids: list[str] = Field(default_factory=list)
    supporting_driver_labels: list[str] = Field(default_factory=list)
    recommended_actions: list[dict[str, Any]] = Field(default_factory=list)
    primary_recommendation: dict[str, Any] | None = None
    confidence: dict[str, float] | None = None

    @field_validator("title", "summary", "why", "recommendation", "risk_summary", mode="before")
    @classmethod
    def _trim_advice_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _trim_string(value)

    @field_validator("recommendations", "related_object_ids", "supporting_driver_labels", mode="before")
    @classmethod
    def _normalize_string_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("recommended_actions", mode="before")
    @classmethod
    def _normalize_recommended_actions(cls, value: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
        if not value:
            return []
        normalized: list[dict[str, Any]] = []
        for item in value:
            if not isinstance(item, dict):
                continue
            normalized.append(
                {
                    "action": _trim_string(str(item.get("action", "") or "")) if item.get("action") is not None else None,
                    "impact_summary": _trim_string(str(item.get("impact_summary", "") or "")) if item.get("impact_summary") is not None else None,
                    "tradeoff": _trim_string(str(item.get("tradeoff", "") or "")) if item.get("tradeoff") is not None else None,
                }
            )
        return normalized

    @field_validator("primary_recommendation", mode="before")
    @classmethod
    def _normalize_primary_recommendation(cls, value: dict[str, Any] | None) -> dict[str, Any] | None:
        if not isinstance(value, dict):
            return None
        action = value.get("action")
        if action is None:
            return None
        trimmed = _trim_string(str(action))
        return {"action": trimmed} if trimmed else None

    @field_validator("confidence", mode="before")
    @classmethod
    def _normalize_confidence(cls, value: Any) -> dict[str, float] | None:
        if value is None:
            return None
        if isinstance(value, (int, float)):
            return {"score": _clamp01(float(value))}
        if not isinstance(value, dict):
            return None
        result: dict[str, float] = {}
        if isinstance(value.get("level"), (int, float)):
            result["level"] = _clamp01(float(value["level"]))
        if isinstance(value.get("score"), (int, float)):
            result["score"] = _clamp01(float(value["score"]))
        return result or None


class PanelTimelineEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    type: str
    order: int
    confidence: float
    related_object_ids: list[str] = Field(default_factory=list)

    @field_validator("id", "label", "type", mode="before")
    @classmethod
    def _trim_timeline_fields(cls, value: str) -> str:
        return _trim_string(value)

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_timeline_confidence(cls, value: float) -> float:
        return _clamp01(value)

    @field_validator("related_object_ids", mode="before")
    @classmethod
    def _normalize_related_ids(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class PanelTimelineSlice(BaseModel):
    model_config = ConfigDict(extra="forbid")

    headline: str | None = None
    events: list[PanelTimelineEvent] = Field(default_factory=list)
    related_object_ids: list[str] = Field(default_factory=list)
    summary: str | None = None

    @field_validator("headline", "summary", mode="before")
    @classmethod
    def _trim_timeline_slice_strings(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _trim_string(value)

    @field_validator("related_object_ids", mode="before")
    @classmethod
    def _normalize_timeline_related_ids(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class PanelWarRoomSlice(BaseModel):
    model_config = ConfigDict(extra="forbid")

    headline: str
    posture: str
    priorities: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    related_object_ids: list[str] = Field(default_factory=list)
    summary: str | None = None
    recommendation: str | None = None
    simulation_summary: str | None = None
    compare_summary: str | None = None
    executive_summary: str | None = None
    advice_summary: str | None = None

    @field_validator(
        "headline",
        "posture",
        "summary",
        "recommendation",
        "simulation_summary",
        "compare_summary",
        "executive_summary",
        "advice_summary",
        mode="before",
    )
    @classmethod
    def _trim_war_room_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return _trim_string(value)

    @field_validator("priorities", "risks", "related_object_ids", mode="before")
    @classmethod
    def _normalize_war_room_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class FragilityFinding(BaseModel):
    """One concrete fragility finding returned by the scanner."""

    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    severity: str
    explanation: str
    recommendation: str

    @field_validator("id", "title", "severity", "explanation", "recommendation", mode="before")
    @classmethod
    def _trim_text_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None


class FragilityScanResponse(BaseModel):
    """Frontend-friendly fragility scanner response payload."""

    model_config = ConfigDict(extra="forbid")

    ok: bool
    summary: str
    summary_detail: FragilitySummary
    fragility_score: float
    fragility_level: Literal["low", "moderate", "high", "critical"]
    drivers: list[FragilityDriver] = Field(default_factory=list)
    signals: list[str] = Field(default_factory=list)
    object_impacts: ObjectImpactSet = Field(default_factory=ObjectImpactSet)
    scene_payload: FragilitySceneHint = Field(default_factory=FragilitySceneHint)
    advice_slice: PanelAdviceSlice
    timeline_slice: PanelTimelineSlice
    war_room_slice: PanelWarRoomSlice
    findings: list[FragilityFinding] = Field(default_factory=list)
    suggested_objects: list[str] = Field(default_factory=list)
    suggested_actions: list[str] = Field(default_factory=list)
    debug: dict[str, Any] | None = None

    @field_validator("summary", "fragility_level", mode="before")
    @classmethod
    def _trim_response_strings(cls, value: str) -> str:
        return _trim_string(value)

    @field_validator("signals", "suggested_objects", "suggested_actions", mode="before")
    @classmethod
    def _trim_response_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("fragility_score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(value)
