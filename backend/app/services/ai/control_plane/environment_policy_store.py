"""File-backed storage for environment-specific policy snapshots."""

from __future__ import annotations

import json
from copy import deepcopy
from datetime import UTC, datetime
from pathlib import Path

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_promotion import (
    EnvironmentType,
    PolicyEnvironmentListResponse,
    PolicyEnvironmentState,
    PromotionHistoryRecord,
    PromotionHistoryResponse,
)


BACKEND_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_ENVIRONMENT_POLICY_DIR = BACKEND_ROOT / "config" / "policies"


class EnvironmentPolicyStore:
    """Persist environment policy snapshots with last-known-good safety."""

    def __init__(self, base_dir: str | Path | None = None) -> None:
        self.base_dir = Path(base_dir) if base_dir is not None else DEFAULT_ENVIRONMENT_POLICY_DIR
        self._snapshots: dict[EnvironmentType, AIPolicySnapshot] = {}
        self._last_known_good: dict[EnvironmentType, AIPolicySnapshot] = {}
        self._history: list[PromotionHistoryRecord] = []
        self._last_error: str | None = None

    def reload(self, fallback_snapshot: AIPolicySnapshot) -> bool:
        """Reload environment snapshots from disk and seed missing entries."""
        try:
            self.base_dir.mkdir(parents=True, exist_ok=True)
            for environment in EnvironmentType:
                path = self._path_for(environment)
                if path.exists():
                    payload = json.loads(path.read_text(encoding="utf-8"))
                    self._snapshots[environment] = AIPolicySnapshot.model_validate(payload)
                elif environment not in self._snapshots:
                    self._snapshots[environment] = _clone_snapshot(fallback_snapshot)
                    self._persist_environment(environment)
            self._last_error = None
            return True
        except Exception as exc:
            self._last_error = str(exc)
            return False

    def last_error(self) -> str | None:
        """Return the last reload error."""
        return self._last_error

    def sync_runtime_environment(
        self,
        environment: EnvironmentType,
        snapshot: AIPolicySnapshot,
        *,
        source_environment: EnvironmentType | None = None,
    ) -> None:
        """Refresh an environment snapshot in memory without changing history."""
        self._snapshots[environment] = _annotated_snapshot(
            snapshot,
            source=f"environment:{environment.value}",
        )
        if source_environment is not None and environment not in self._last_known_good:
            self._last_known_good[environment] = _clone_snapshot(snapshot)

    def get_snapshot(self, environment: EnvironmentType) -> AIPolicySnapshot:
        """Return the current snapshot for an environment."""
        return _clone_snapshot(self._snapshots[environment])

    def get_last_known_good_snapshot(self, environment: EnvironmentType) -> AIPolicySnapshot | None:
        """Return the last-known-good snapshot for an environment."""
        snapshot = self._last_known_good.get(environment)
        return _clone_snapshot(snapshot) if snapshot is not None else None

    def set_snapshot(
        self,
        environment: EnvironmentType,
        snapshot: AIPolicySnapshot,
        *,
        source_environment: EnvironmentType | None = None,
    ) -> PolicyEnvironmentState:
        """Persist a new active snapshot for an environment."""
        previous = self._snapshots.get(environment)
        if previous is not None:
            self._last_known_good[environment] = _clone_snapshot(previous)
        annotated = _annotated_snapshot(
            snapshot,
            source=f"promoted:{source_environment.value}" if source_environment is not None else f"environment:{environment.value}",
        )
        self._snapshots[environment] = annotated
        self._persist_environment(environment)
        return self.get_environment_state(environment, source_environment=source_environment)

    def list_environment_states(self) -> PolicyEnvironmentListResponse:
        """Return all environment states."""
        return PolicyEnvironmentListResponse(
            environments=[self.get_environment_state(environment) for environment in EnvironmentType]
        )

    def get_environment_state(
        self,
        environment: EnvironmentType,
        *,
        source_environment: EnvironmentType | None = None,
    ) -> PolicyEnvironmentState:
        """Return one environment state."""
        snapshot = self._snapshots[environment]
        last_known_good = self._last_known_good.get(environment)
        return PolicyEnvironmentState(
            environment=environment,
            policy_version=snapshot.version_info.policy_version,
            updated_at=snapshot.version_info.updated_at or snapshot.version_info.loaded_at,
            source_environment=source_environment,
            last_known_good_version=last_known_good.version_info.policy_version if last_known_good is not None else None,
            snapshot=_clone_snapshot(snapshot),
        )

    def append_history(self, record: PromotionHistoryRecord) -> PromotionHistoryRecord:
        """Append a history record."""
        self._history.append(record)
        return record

    def get_history(self) -> PromotionHistoryResponse:
        """Return promotion and rollback history."""
        return PromotionHistoryResponse(records=list(reversed(self._history)))

    def _persist_environment(self, environment: EnvironmentType) -> None:
        path = self._path_for(environment)
        path.parent.mkdir(parents=True, exist_ok=True)
        payload = self._snapshots[environment].model_dump()
        path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    def _path_for(self, environment: EnvironmentType) -> Path:
        return self.base_dir / f"{environment.value}.json"


def _clone_snapshot(snapshot: AIPolicySnapshot | None) -> AIPolicySnapshot:
    if snapshot is None:
        raise KeyError("environment_snapshot_not_found")
    return AIPolicySnapshot.model_validate(deepcopy(snapshot.model_dump()))


def _annotated_snapshot(snapshot: AIPolicySnapshot, *, source: str) -> AIPolicySnapshot:
    cloned = _clone_snapshot(snapshot)
    cloned.version_info.loaded_at = datetime.now(UTC).isoformat()
    cloned.version_info.updated_at = cloned.version_info.loaded_at
    cloned.version_info.source = source
    return cloned
