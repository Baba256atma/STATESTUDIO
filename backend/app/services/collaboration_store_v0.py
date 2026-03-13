from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from typing import Any


COLLAB_DIR = Path(__file__).resolve().parents[2] / "data" / "collaboration"


def _safe_episode_id(episode_id: str) -> str:
    raw = str(episode_id or "").strip()
    return "".join(ch for ch in raw if ch.isalnum() or ch in ("-", "_"))


def _path_for_episode(episode_id: str) -> Path:
    safe_id = _safe_episode_id(episode_id)
    return COLLAB_DIR / f"collaboration_{safe_id}.json"


def build_summary(notes: list[dict[str, Any]], viewpoints: list[dict[str, Any]]) -> str:
    count = len(notes or []) + len(viewpoints or [])
    return f"{count} collaboration items attached."


def _empty_collaboration(episode_id: str) -> dict[str, Any]:
    return {
        "episode_id": episode_id,
        "notes": [],
        "viewpoints": [],
        "summary": build_summary([], []),
    }


def load_collaboration_v0(episode_id: str) -> dict[str, Any]:
    COLLAB_DIR.mkdir(parents=True, exist_ok=True)
    eid = _safe_episode_id(episode_id)
    if not eid:
        return _empty_collaboration("")

    path = _path_for_episode(eid)
    if not path.exists():
        return _empty_collaboration(eid)

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        notes = payload.get("notes") if isinstance(payload.get("notes"), list) else []
        viewpoints = payload.get("viewpoints") if isinstance(payload.get("viewpoints"), list) else []
        return {
            "episode_id": eid,
            "notes": notes,
            "viewpoints": viewpoints,
            "summary": build_summary(notes, viewpoints),
        }
    except Exception:
        return _empty_collaboration(eid)


def save_collaboration_v0(episode_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    eid = _safe_episode_id(episode_id)
    if not eid:
        return _empty_collaboration("")

    COLLAB_DIR.mkdir(parents=True, exist_ok=True)

    notes = payload.get("notes") if isinstance(payload.get("notes"), list) else []
    viewpoints = payload.get("viewpoints") if isinstance(payload.get("viewpoints"), list) else []
    out = {
        "episode_id": eid,
        "notes": notes,
        "viewpoints": viewpoints,
        "summary": build_summary(notes, viewpoints),
    }

    path = _path_for_episode(eid)
    temp_path = path.with_suffix(".json.tmp")
    temp_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    temp_path.replace(path)
    return out


def add_note_v0(episode_id: str, author: str, text: str) -> dict[str, Any]:
    data = load_collaboration_v0(episode_id)
    notes = data.get("notes") if isinstance(data.get("notes"), list) else []
    notes.append(
        {
            "id": f"note_{uuid4().hex}",
            "author": str(author or "").strip() or "Anonymous",
            "text": str(text or "").strip(),
            "created_at": datetime.utcnow().isoformat() + "Z",
        }
    )
    data["notes"] = notes
    return save_collaboration_v0(episode_id, data)


def add_viewpoint_v0(episode_id: str, author: str, label: str, summary: str) -> dict[str, Any]:
    data = load_collaboration_v0(episode_id)
    viewpoints = data.get("viewpoints") if isinstance(data.get("viewpoints"), list) else []
    viewpoints.append(
        {
            "id": f"view_{uuid4().hex}",
            "author": str(author or "").strip() or "Anonymous",
            "label": str(label or "").strip(),
            "summary": str(summary or "").strip(),
        }
    )
    data["viewpoints"] = viewpoints
    return save_collaboration_v0(episode_id, data)
