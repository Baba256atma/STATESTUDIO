"""Replay storage endpoints."""
from __future__ import annotations

import json
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.replay import ReplayEpisode, ReplayFrame
from app.services.replay_store import ReplayStore
from app.services.orchestrator import analyze_full_pipeline
from app.services.demo_scripts import DEMO_SCRIPTS, DEMO_TITLES, DemoId
from app.utils import responses

router = APIRouter()
store = ReplayStore()


class CreateEpisodeIn(BaseModel):
    title: str | None = None


class DemoSeedIn(BaseModel):
    demo_id: DemoId


def _episode_summary(episode: ReplayEpisode) -> dict:
    return {
        "episode_id": episode.episode_id,
        "title": episode.title,
        "created_at": episode.created_at,
        "updated_at": episode.updated_at,
        "duration": episode.duration,
        "frame_count": len(episode.frames),
    }


@router.post("/replay/episodes")
def create_episode(payload: CreateEpisodeIn) -> dict:
    episode = store.create_episode(payload.title)
    return {"episode_id": episode.episode_id, "created_at": episode.created_at}


@router.get("/replay/episodes")
def list_episodes() -> List[dict]:
    return store.list_episodes()


@router.get("/replay/episodes/{episode_id}")
def get_episode(episode_id: str) -> ReplayEpisode:
    try:
        return store.get_episode(episode_id)
    except FileNotFoundError:
        raise HTTPException(
          status_code=404,
          detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None


@router.post("/replay/episodes/{episode_id}/frames")
def append_frame(episode_id: str, frame: ReplayFrame) -> dict:
    try:
        episode, warnings = store.append_frame(episode_id, frame)
        return responses.ok(_episode_summary(episode), warnings=warnings or None)
    except FileNotFoundError:
        raise HTTPException(
          status_code=404,
          detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=responses.error("INVALID_INPUT", str(exc)),
        ) from exc


@router.post("/replay/episodes/{episode_id}/export")
def export_episode(episode_id: str) -> dict:
    try:
        episode = store.get_episode(episode_id)
        return json.loads(episode.model_dump_json())
    except FileNotFoundError:
        raise HTTPException(
          status_code=404,
          detail=responses.error("NOT_FOUND", "Episode not found"),
        ) from None


@router.post("/replay/demo")
def create_demo_episode() -> dict:
    try:
        episode = store.create_episode(title="Demo Episode")
        inputs = [
            "We are growing fast",
            "Now quality is dropping",
            "We are rushing fixes",
            "Side effects keep coming back",
            "Team conflict is escalating",
        ]
        for text in inputs:
            analyze_full_pipeline(text=text, episode_id=episode.episode_id)
        return responses.ok({"episode_id": episode.episode_id, "title": "Demo Episode"})
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=responses.error("INTERNAL_ERROR", "failed to create demo"),
        ) from exc


@router.post("/replay/demo/seed")
def seed_demo_episode(payload: DemoSeedIn) -> dict:
    try:
        demo_id = payload.demo_id
        title = DEMO_TITLES[demo_id]
        episode = store.create_episode(title=title)
        for text in DEMO_SCRIPTS[demo_id]:
            analyze_full_pipeline(text=text, episode_id=episode.episode_id)
        updated = store.get_episode(episode.episode_id)
        return responses.ok(
            {
                "episode_id": updated.episode_id,
                "title": updated.title,
                "frame_count": len(updated.frames),
            }
        )
    except KeyError:
        raise HTTPException(
            status_code=422,
            detail=responses.error("INVALID_INPUT", "unknown demo_id"),
        ) from None
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=responses.error("INTERNAL_ERROR", "failed to seed demo"),
        ) from exc
