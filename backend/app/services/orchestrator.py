"""Full analysis orchestration with optional replay capture."""
from __future__ import annotations

from datetime import datetime, timezone

from app.services.catalog_store import CatalogStore
from app.services.human_signal_extractor import extract_signals
from app.services.human_archetype_engine import score_archetypes
from app.services.bridge_engine import map_human_to_system
from app.services.system_archetype_mapper import map_system_archetypes
from app.services.replay_store import ReplayStore
from app.services.replay_capture import build_replay_frame
from archetypes.visual_mapper import map_archetype_to_visual_state
from archetypes.library import get_archetype_library


def _now() -> datetime:
    return datetime.now(timezone.utc)


def analyze_full_pipeline(
    text: str,
    metrics: dict[str, float] | None = None,
    episode_id: str | None = None,
) -> dict:
    store = CatalogStore()
    replay_store = ReplayStore()
    replay_warning: str | None = None

    report = extract_signals(text)
    catalog = store.load_human_catalog()
    human_state = score_archetypes(report, catalog)
    bridge_cfg = store.load_bridge_config()
    system_signals = map_human_to_system(human_state, bridge_cfg)
    system_catalog = store.load_system_archetypes()
    system_state = map_system_archetypes(
        system_signals=system_signals,
        archetype_defs=system_catalog.items,
    )
    visual = map_archetype_to_visual_state(system_state, get_archetype_library())

    episode = None
    if episode_id:
        try:
            episode = replay_store.get_episode(episode_id)
        except FileNotFoundError:
            replay_warning = "Episode not found; created a new replay."
            episode = None
    if episode is None:
        episode = replay_store.create_episode(title="Analysis Replay")
        episode_id = episode.episode_id

    try:
        t = (_now() - episode.created_at).total_seconds()
        frame = build_replay_frame(
            t=t,
            input_text=text,
            human_state=human_state,
            system_signals=system_signals,
            system_state=system_state,
            visual=visual,
        )
        _, warnings = replay_store.append_frame(episode_id, frame)
        if warnings:
            replay_warning = (replay_warning or "") + ";".join(warnings)
    except Exception:
        replay_warning = replay_warning or "Replay capture failed; analysis returned."

    payload = {
        "episode_id": episode_id,
        "signals": report,
        "human_state": human_state,
        "system_signals": system_signals,
        "system_state": system_state,
        "visual": visual,
    }
    if replay_warning:
        payload["replay_warning"] = replay_warning
    return payload
