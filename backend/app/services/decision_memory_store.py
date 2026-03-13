from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any, Dict, List


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _default_doc(user_id: str) -> Dict[str, Any]:
    return {"user_id": user_id, "updated_at": _now_iso(), "events": []}


class DecisionMemoryStore:
    def __init__(self, base_dir: str = "data/decision_memory", max_events: int = 200):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self.max_events = max_events
        self._fallback_mem: Dict[str, Dict[str, Any]] = {}

    def _path(self, user_id: str) -> Path:
        safe = "".join(ch for ch in (user_id or "") if ch.isalnum() or ch in ("-", "_"))
        if not safe:
            safe = "anon"
        return self.base_dir / f"{safe}.json"

    def load(self, user_id: str) -> Dict[str, Any]:
        path = self._path(user_id)
        try:
            if not path.exists():
                return dict(_default_doc(user_id))
            with path.open("r", encoding="utf-8") as f:
                raw = json.load(f)
            if not isinstance(raw, dict):
                return dict(_default_doc(user_id))
            out = dict(raw)
            out["user_id"] = str(out.get("user_id") or user_id)
            out["updated_at"] = str(out.get("updated_at") or _now_iso())
            out["events"] = out.get("events") if isinstance(out.get("events"), list) else []
            return out
        except Exception:
            return dict(self._fallback_mem.get(user_id, _default_doc(user_id)))

    def save(self, user_id: str, data: Dict[str, Any]) -> None:
        doc = dict(data if isinstance(data, dict) else _default_doc(user_id))
        doc["user_id"] = str(doc.get("user_id") or user_id)
        doc["updated_at"] = _now_iso()
        doc["events"] = doc.get("events") if isinstance(doc.get("events"), list) else []
        path = self._path(user_id)
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            tmp = path.with_suffix(path.suffix + ".tmp")
            with tmp.open("w", encoding="utf-8") as f:
                json.dump(doc, f, ensure_ascii=False, indent=2, sort_keys=True)
            tmp.replace(path)
        except Exception:
            self._fallback_mem[user_id] = doc

    def upsert_event(self, user_id: str, event: Dict[str, Any]) -> None:
        doc = self.load(user_id)
        events = doc.get("events") if isinstance(doc.get("events"), list) else []
        events.append(event if isinstance(event, dict) else {})
        if len(events) > self.max_events:
            events = events[-self.max_events :]
        doc["events"] = events
        self.save(user_id, doc)

    def get_events(self, user_id: str) -> List[Dict[str, Any]]:
        doc = self.load(user_id)
        events = doc.get("events")
        return events if isinstance(events, list) else []
