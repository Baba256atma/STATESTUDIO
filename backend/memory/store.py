from __future__ import annotations

from dataclasses import asdict
import json
import os
from typing import Dict

from .models import ObjectMemoryState


class JsonMemoryStore:
    def __init__(self, base_dir: str = "backend/data/memory"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    def _path_for(self, user_id: str) -> str:
        safe = "".join(ch for ch in user_id if ch.isalnum() or ch in ("-", "_"))
        if not safe:
            safe = "anonymous"
        return os.path.join(self.base_dir, f"{safe}.json")

    def load(self, user_id: str) -> Dict[str, ObjectMemoryState]:
        path = self._path_for(user_id)
        if not os.path.exists(path):
            return {}
        try:
            with open(path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            if not isinstance(raw, dict):
                return {}
            state: Dict[str, ObjectMemoryState] = {}
            for key, value in raw.items():
                if not isinstance(value, dict):
                    continue
                try:
                    state[key] = ObjectMemoryState(
                        hits=int(value.get("hits", 0)),
                        energy=float(value.get("energy", 0.0)),
                        last_intensity=float(value.get("last_intensity", 0.0)),
                        last_ts=int(value.get("last_ts", 0)),
                        trend=str(value.get("trend", "stable")),
                    )
                except (TypeError, ValueError):
                    continue
            return state
        except (json.JSONDecodeError, OSError):
            bad_path = path + ".bad"
            try:
                os.replace(path, bad_path)
            except OSError:
                pass
            return {}

    def save(self, user_id: str, state: Dict[str, ObjectMemoryState]) -> None:
        path = self._path_for(user_id)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp_path = path + ".tmp"
        payload = {key: asdict(value) for key, value in state.items()}
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, sort_keys=True)
        os.replace(tmp_path, path)
