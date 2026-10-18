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
import os
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Mapping
from uuid import uuid4

USAGE_STORE_IDENTITY = "LLM-MVP:4/UsageStore"
NEXORA_LLM_USAGE_STORE_PATH = "NEXORA_LLM_USAGE_STORE_PATH"


def default_usage_store_path(environ: Mapping[str, str] | None = None) -> Path:
    env = environ if environ is not None else os.environ
    configured = env.get(NEXORA_LLM_USAGE_STORE_PATH)
    if configured is not None:
        raw_path = str(configured).strip()
        if not raw_path:
            raise ValueError(f"{NEXORA_LLM_USAGE_STORE_PATH} must not be empty")
        path = Path(raw_path)
        if not path.is_absolute():
            raise ValueError(f"{NEXORA_LLM_USAGE_STORE_PATH} must be an absolute path")
        return path
    if env.get("NEXORA_DEPLOYMENT_MODE") == "hosted":
        raise ValueError(f"{NEXORA_LLM_USAGE_STORE_PATH} is required in hosted mode")
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

    def admit_rate(
        self,
        *,
        scope_id: str,
        now: datetime,
        window_seconds: int,
        limit: int,
        burst_window_seconds: int,
        burst_limit: int,
    ) -> str | None:
        with self._locked() as state:
            node = self._traffic(state, scope_id)
            stamps = [stamp for stamp in (self._parse_time(item) for item in node["rateTimestamps"]) if stamp is not None]
            horizon = now - timedelta(seconds=window_seconds)
            burst_horizon = now - timedelta(seconds=burst_window_seconds)
            stamps = [stamp for stamp in stamps if stamp >= horizon]
            burst_count = sum(1 for stamp in stamps if stamp >= burst_horizon)
            if len(stamps) >= limit or burst_count >= burst_limit:
                node["rateTimestamps"] = [stamp.isoformat() for stamp in stamps]
                self._write(state)
                return "rate_limit_exceeded"
            stamps.append(now)
            node["rateTimestamps"] = [stamp.isoformat() for stamp in stamps]
            self._write(state)
            return None

    def acquire_turn(self, *, scope_id: str, turn_id: str, limit: int) -> bool:
        with self._locked() as state:
            node = self._traffic(state, scope_id)
            active = [item for item in node["activeTurns"] if isinstance(item, str)]
            if turn_id in active:
                return True
            if len(active) >= limit:
                return False
            active.append(turn_id)
            node["activeTurns"] = active
            self._write(state)
            return True

    def release_turn(self, *, scope_id: str, turn_id: str) -> None:
        with self._locked() as state:
            node = self._traffic(state, scope_id)
            node["activeTurns"] = [item for item in node["activeTurns"] if item != turn_id]
            self._write(state)

    def spent_usd(self, *, scope_id: str, period_key: str, floor_usd: float) -> float:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            return self._spent(bucket, floor_usd)

    def spent_usd_for_user(self, *, user_id: str, period_key: str, floor_usd: float) -> float:
        prefix = f"hosted:{user_id}:"
        with self._locked() as state:
            total = 0.0
            for scope_id, scope in state.get("scopes", {}).items():
                if not isinstance(scope_id, str) or not scope_id.startswith(prefix) or not isinstance(scope, dict):
                    continue
                bucket = scope.get(period_key)
                if isinstance(bucket, dict):
                    total += self._spent(bucket, floor_usd)
            return total

    def close_reservation(self, *, scope_id: str, period_key: str, turn_id: str) -> None:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            existing = bucket["reservations"].get(turn_id)
            if existing and existing.get("state") == "reserved":
                existing["state"] = "settled"
                self._write(state)

    def prune_expired_details(self, *, now: datetime, retention_days: int) -> None:
        cutoff = now - timedelta(days=retention_days)
        with self._locked() as state:
            for scope in state.get("scopes", {}).values():
                if not isinstance(scope, dict):
                    continue
                for key, bucket in scope.items():
                    if key in {"rateTimestamps", "activeTurns"} or not isinstance(bucket, dict):
                        continue
                    kept = []
                    for record in bucket.get("records", []):
                        stamp = self._parse_time(record.get("recordedAt") if isinstance(record, dict) else None)
                        if stamp is not None and stamp >= cutoff:
                            kept.append(record)
                    bucket["records"] = kept
                    kept_turns = {record.get("turnId") for record in kept if isinstance(record, dict)}
                    reservations = bucket.get("reservations", {})
                    if isinstance(reservations, dict):
                        for turn_id, reservation in list(reservations.items()):
                            if (
                                isinstance(reservation, dict)
                                and reservation.get("state") == "settled"
                                and turn_id not in kept_turns
                            ):
                                del reservations[turn_id]
            self._write(state)

    def authorized_attempts(self, *, scope_id: str, period_key: str) -> int:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            return int(bucket["authorizedAttempts"])

    def records(self, *, scope_id: str, period_key: str) -> list[dict[str, Any]]:
        with self._locked() as state:
            bucket = self._bucket(state, scope_id, period_key)
            return list(bucket["records"])

    def _traffic(self, state: dict[str, Any], scope_id: str) -> dict[str, Any]:
        scopes = state.setdefault("scopes", {})
        scope = scopes.setdefault(scope_id, {})
        scope.setdefault("rateTimestamps", [])
        scope.setdefault("activeTurns", [])
        return scope

    def _spent(self, bucket: dict[str, Any], floor_usd: float) -> float:
        total = 0.0
        for record in bucket.get("records", []):
            if not isinstance(record, dict):
                continue
            cost = record.get("cost") if isinstance(record.get("cost"), dict) else {}
            amount = cost.get("amount")
            if isinstance(amount, (int, float)) and not isinstance(amount, bool):
                total += float(amount)
            elif record.get("request", {}).get("attempted") is True:
                total += floor_usd
        return total

    def _parse_time(self, value: Any) -> datetime | None:
        if not isinstance(value, str) or not value.strip():
            return None
        try:
            stamp = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
        if stamp.tzinfo is None:
            stamp = stamp.replace(tzinfo=timezone.utc)
        return stamp.astimezone(timezone.utc)

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
