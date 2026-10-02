"""LLM-MVP:4 — durable server-side LLM usage ledger.

Operational accounting only. Not NMI, Data Reality, Scenario, Decision,
conversation memory, or LLM contribution storage.

Canonical MVP counter: one reserved/authorized provider attempt per
successful reservation. Released reservations do not count. Token
metadata is stored when present; null stays unknown.
"""

from __future__ import annotations

import fcntl
import json
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

USAGE_STORE_IDENTITY = "LLM-MVP:4/UsageStore"


def default_usage_store_path() -> Path:
    return Path(__file__).resolve().parents[3] / "data" / "nexora_llm" / "usage.json"


class NexoraLlmUsageStore:
    def __init__(self, path: Path | None = None) -> None:
        self.path = path or default_usage_store_path()
        self._thread = threading.Lock()

    def try_reserve(
        self,
        *,
        scope_id: str,
        period_key: str,
        turn_id: str,
        limit: int,
    ) -> dict[str, Any]:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            existing = bucket["reservations"].get(turn_id)
            if existing and existing.get("state") == "settled":
                return {
                    "allowed": False,
                    "reason": "POLICY_DECLINED",
                    "reservationId": existing.get("reservationId"),
                    "replay": True,
                }
            if existing and existing.get("state") == "reserved":
                return {
                    "allowed": False,
                    "reason": "POLICY_DECLINED",
                    "reservationId": existing.get("reservationId"),
                    "replay": True,
                }
            if int(bucket["authorizedAttempts"]) >= int(limit):
                return {
                    "allowed": False,
                    "reason": "ALLOWANCE_EXHAUSTED",
                    "reservationId": None,
                    "replay": False,
                }
            reservation_id = f"res_{uuid4().hex[:12]}"
            bucket["authorizedAttempts"] = int(bucket["authorizedAttempts"]) + 1
            bucket["reservations"][turn_id] = {
                "reservationId": reservation_id,
                "state": "reserved",
            }
            self._write(state)
            return {
                "allowed": True,
                "reason": "ALLOWED",
                "reservationId": reservation_id,
                "replay": False,
            }

    def release(self, *, scope_id: str, period_key: str, turn_id: str) -> None:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            existing = bucket["reservations"].get(turn_id)
            if not existing or existing.get("state") != "reserved":
                return
            existing["state"] = "released"
            bucket["authorizedAttempts"] = max(0, int(bucket["authorizedAttempts"]) - 1)
            self._write(state)

    def settle(
        self,
        *,
        scope_id: str,
        period_key: str,
        turn_id: str,
        reservation_id: str | None,
        record: dict[str, Any],
    ) -> None:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            existing = bucket["reservations"].get(turn_id)
            if existing and existing.get("state") == "settled":
                return
            if existing and existing.get("state") == "reserved":
                existing["state"] = "settled"
            else:
                bucket["reservations"][turn_id] = {
                    "reservationId": reservation_id,
                    "state": "settled",
                }
            compact = dict(record)
            compact.pop("contribution", None)
            compact.pop("deterministicResponse", None)
            compact.pop("managementContext", None)
            compact.pop("prompt", None)
            bucket["records"] = [
                item
                for item in bucket["records"]
                if not (isinstance(item, dict) and item.get("turnId") == turn_id)
            ]
            bucket["records"].append(compact)
            self._write(state)

    def authorized_attempts(self, *, scope_id: str, period_key: str) -> int:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            return int(bucket["authorizedAttempts"])

    def records(self, *, scope_id: str, period_key: str) -> list[dict[str, Any]]:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            return list(bucket["records"])

    def _bucket(self, state: dict[str, Any], scope_id: str, period_key: str) -> dict[str, Any]:
        scopes = state.setdefault("scopes", {})
        scope = scopes.setdefault(scope_id, {})
        bucket = scope.setdefault(
            period_key,
            {"authorizedAttempts": 0, "reservations": {}, "records": []},
        )
        bucket.setdefault("authorizedAttempts", 0)
        bucket.setdefault("reservations", {})
        bucket.setdefault("records", [])
        return bucket

    def _locked(self):
        return _FileLock(self)

    def _read(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"identity": USAGE_STORE_IDENTITY, "scopes": {}}
        try:
            raw = json.loads(self.path.read_text(encoding="utf-8"))
        except Exception:
            return {"identity": USAGE_STORE_IDENTITY, "scopes": {}}
        if not isinstance(raw, dict):
            return {"identity": USAGE_STORE_IDENTITY, "scopes": {}}
        raw.setdefault("identity", USAGE_STORE_IDENTITY)
        raw.setdefault("scopes", {})
        return raw

    def _write(self, state: dict[str, Any]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")
        tmp.replace(self.path)


class _FileLock:
    def __init__(self, store: NexoraLlmUsageStore) -> None:
        self.store = store
        self.handle = None

    def __enter__(self) -> dict[str, Any]:
        self.store._thread.acquire()
        self.store.path.parent.mkdir(parents=True, exist_ok=True)
        self.handle = self.store.path.open("a+", encoding="utf-8")
        fcntl.flock(self.handle.fileno(), fcntl.LOCK_EX)
        return self.store._read()

    def __exit__(self, exc_type, exc, tb) -> None:
        if self.handle is not None:
            try:
                fcntl.flock(self.handle.fileno(), fcntl.LOCK_UN)
            finally:
                self.handle.close()
        self.store._thread.release()


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()
