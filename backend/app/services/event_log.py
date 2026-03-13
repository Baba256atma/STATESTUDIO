from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

Event = Dict[str, object]


class EventLog:
    def __init__(self, base_path: str = "backend/data/events", max_per_user: int = 100):
        self.max_per_user = max_per_user
        self.base_dir = Path(base_path)
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self.store_path = self.base_dir / "events.json"
        self._events: Dict[str, List[Event]] = self._load()

    def _load(self) -> Dict[str, List[Event]]:
        if not self.store_path.exists():
            return {}
        try:
            with self.store_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict):
                return {k: v for k, v in data.items() if isinstance(v, list)}
        except Exception:
            pass
        return {}

    def _persist(self) -> None:
        try:
            tmp = self.store_path.with_suffix(".tmp")
            with tmp.open("w", encoding="utf-8") as f:
                json.dump(self._events, f, indent=2)
            tmp.replace(self.store_path)
        except Exception:
            # best-effort; do not raise
            pass

    def log(self, user_id: str, user_text: str, reply: str, actions: List[object]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        entry: Event = {
            "timestamp": now,
            "user_text": user_text,
            "reply": reply,
            "actions": actions or [],
        }
        bucket = self._events.get(user_id, [])
        bucket.append(entry)
        if len(bucket) > self.max_per_user:
            bucket = bucket[-self.max_per_user :]
        self._events[user_id] = bucket
        self._persist()

    def recent(self, user_id: str, limit: int = 20) -> List[Event]:
        bucket = self._events.get(user_id, [])
        return list(bucket[-limit:])
