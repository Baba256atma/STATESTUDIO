"""File-based storage for replay episodes with safety guards."""
from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import List, Tuple
from uuid import uuid4

from app.models.replay import ReplayEpisode, ReplayFrame
from app.utils.clamp import ensure_finite


def _safe_log(msg: str):
    # Keep logs minimal; avoid embedding user content.
    print(msg)


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _atomic_write(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(path.suffix + ".tmp")
    with tmp_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, sort_keys=True)
    tmp_path.replace(path)


class ReplayStore:
    def __init__(self, base_dir: str = "backend/data/replay", max_frames: int = 2000):
        self.base_dir = Path(base_dir)
        self.current_dir = self.base_dir / "current"
        self.archive_dir = self.base_dir / "archive"
        self.corrupt_dir = self.base_dir / "corrupt"
        self.max_frames = max_frames
        self.current_dir.mkdir(parents=True, exist_ok=True)
        self.archive_dir.mkdir(parents=True, exist_ok=True)
        self.corrupt_dir.mkdir(parents=True, exist_ok=True)

    def _path(self, episode_id: str) -> Path:
        safe = "".join(ch for ch in episode_id if ch.isalnum() or ch in ("-", "_"))
        if not safe:
            raise ValueError("invalid episode_id")
        return self.current_dir / f"{safe}.json"

    def _archive_path(self, episode_id: str) -> Path:
        safe = "".join(ch for ch in episode_id if ch.isalnum() or ch in ("-", "_"))
        if not safe:
            raise ValueError("invalid episode_id")
        return self.archive_dir / f"{safe}.json"

    def create_episode(self, title: str | None = None) -> ReplayEpisode:
        now = _now()
        episode = ReplayEpisode(
            episode_id=str(uuid4()),
            created_at=now,
            updated_at=now,
            title=title,
            frames=[],
            duration=0.0,
            version="v1",
        )
        payload = episode.model_dump()
        payload["created_at"] = episode.created_at.isoformat()
        payload["updated_at"] = episode.updated_at.isoformat()
        _atomic_write(self._path(episode.episode_id), payload)
        return episode

    def append_frame(self, episode_id: str, frame: ReplayFrame) -> Tuple[ReplayEpisode, List[str]]:
        warnings: List[str] = []
        episode = self.get_episode(episode_id)
        frames = list(episode.frames)
        last_t = frames[-1].t if frames else 0.0
        incoming_t = ensure_finite(frame.t, last_t)
        if incoming_t <= last_t:
            incoming_t = last_t + 1e-3
        safe_frame = frame.model_copy(update={"t": incoming_t})
        frames.append(safe_frame)

        if len(frames) > self.max_frames:
            drop = len(frames) - self.max_frames
            frames = frames[drop:]
            warnings.append("frame_limit_reached_oldest_dropped")

        frames.sort(key=lambda f: f.t)
        max_t = max((f.t for f in frames), default=0.0)
        updated = episode.model_copy(
            update={
                "frames": frames,
                "updated_at": _now(),
                "duration": max(episode.duration, max_t),
            }
        )
        payload = updated.model_dump()
        payload["created_at"] = updated.created_at.isoformat()
        payload["updated_at"] = updated.updated_at.isoformat()
        _atomic_write(self._path(episode_id), payload)
        return updated, warnings

    def get_episode(self, episode_id: str) -> ReplayEpisode:
        path = self._path(episode_id)
        if not path.exists():
            raise FileNotFoundError("episode not found")
        try:
            with path.open("r", encoding="utf-8") as f:
                raw = json.load(f)
            return ReplayEpisode.model_validate(raw)
        except json.JSONDecodeError:
            corrupt_path = self.corrupt_dir / path.name
            path.replace(corrupt_path)
            _safe_log(f"[ReplayStore] Corrupt episode moved to {corrupt_path}")
            raise FileNotFoundError("episode corrupted")

    def list_episodes(self) -> List[dict]:
        summaries: List[dict] = []
        for path in sorted(self.current_dir.glob("*.json")):
            try:
                with path.open("r", encoding="utf-8") as f:
                    raw = json.load(f)
                frames = raw.get("frames", []) or []
                summaries.append(
                    {
                        "episode_id": raw.get("episode_id"),
                        "title": raw.get("title"),
                        "updated_at": raw.get("updated_at"),
                        "frame_count": len(frames),
                        "duration": raw.get("duration", 0.0),
                    }
                )
            except json.JSONDecodeError:
                corrupt_path = self.corrupt_dir / path.name
                path.replace(corrupt_path)
                _safe_log(f"[ReplayStore] Corrupt episode moved to {corrupt_path}")
                continue
        return summaries

    def delete_episode(self, episode_id: str) -> None:
        src = self._path(episode_id)
        dst = self._archive_path(episode_id)
        if not src.exists():
            raise FileNotFoundError("episode not found")
        dst.parent.mkdir(parents=True, exist_ok=True)
        src.replace(dst)
