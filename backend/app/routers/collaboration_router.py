from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.collaboration_store_v0 import (
    add_note_v0,
    add_viewpoint_v0,
    load_collaboration_v0,
)


router = APIRouter()


class NoteIn(BaseModel):
    author: str = Field(min_length=1, max_length=120)
    text: str = Field(min_length=1, max_length=4000)


class ViewpointIn(BaseModel):
    author: str = Field(min_length=1, max_length=120)
    label: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1, max_length=4000)


@router.get("/collaboration/{episode_id}")
def get_collaboration(episode_id: str):
    return load_collaboration_v0(episode_id)


@router.post("/collaboration/{episode_id}/note")
def post_note(episode_id: str, body: NoteIn):
    return add_note_v0(episode_id, body.author, body.text)


@router.post("/collaboration/{episode_id}/viewpoint")
def post_viewpoint(episode_id: str, body: ViewpointIn):
    return add_viewpoint_v0(episode_id, body.author, body.label, body.summary)
