from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class SceneJson(BaseModel):
    meta: Dict[str, Any] = Field(default_factory=dict)
    domain_model: Dict[str, Any] = Field(default_factory=dict)
    state_vector: Dict[str, float] = Field(default_factory=dict)
    scene: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        extra = "allow"


class SceneResponseModel(BaseModel):
    reply: str
    active_mode: str
    scene_json: SceneJson

    class Config:
        extra = "allow"
