from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List
from uuid import uuid4

Event = Dict[str, object]


class EventStoreMem:
    """In-memory per-user event store."""

    def __init__(self, max_per_user: int = 50):
        self.max_per_user = max_per_user
        self._events: Dict[str, List[Event]] = {}

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def append(self, user_id: str, user_text: str, reply: str, actions: List[object]) -> Event:
        event: Event = {
            "id": str(uuid4()),
            "timestamp": self._now_iso(),
            "user_id": user_id,
            "user_text": user_text,
            "reply": reply,
            "actions": [a for a in actions] if actions else [],
        }
        bucket = self._events.get(user_id, [])
        bucket.append(event)
        if len(bucket) > self.max_per_user:
            bucket = bucket[-self.max_per_user :]
        self._events[user_id] = bucket
        return event

    def recent(self, user_id: str, limit: int = 20) -> List[Event]:
        bucket = self._events.get(user_id, [])
        return list(bucket[-limit:])

    def replay(self, user_id: str, from_event_id: str | None, limit: int) -> List[Event]:
        events = self._events.get(user_id, [])
        if from_event_id:
            for idx, evt in enumerate(events):
                if evt.get("id") == from_event_id:
                    return events[idx + 1 : idx + 1 + limit]
        return events[-limit:]
