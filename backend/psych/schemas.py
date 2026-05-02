from typing import Any, Literal

from pydantic import BaseModel, Field


PsychBackendElement = Literal["fire", "liquid", "air", "earth", "sun", "ego"]
PsychInterpretElement = Literal["fire", "water", "air", "earth", "ego", "sun"]
PsychFocus = Literal["self", "others", "environment"]


class PsychObjectInput(BaseModel):
    id: str
    brightness: float | None = None
    activity: float | None = None


class PsychAnalyzeRequest(BaseModel):
    text: str = Field(min_length=1)
    current_state: dict[str, Any] = Field(default_factory=dict)
    objects: list[PsychObjectInput] = Field(default_factory=list)


class PsychAnalyzeResponse(BaseModel):
    dominant_element: PsychBackendElement
    intensity: float = Field(ge=0, le=1)
    secondary_elements: list[PsychBackendElement] = Field(default_factory=list)
    message: str


class PsychState(BaseModel):
    emotion: str
    intensity: float = Field(ge=0, le=1)
    secondary_emotion: str | None = None
    focus: PsychFocus
    dominant_element: PsychInterpretElement
    confidence: float = Field(ge=0, le=1)


class PsychInterpretRequest(BaseModel):
    text: str = Field(min_length=1)
