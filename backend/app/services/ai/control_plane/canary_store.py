"""In-memory and file-backed storage for policy canary state."""

from __future__ import annotations

import json
from pathlib import Path

from app.schemas.policy_canary import CanaryReleaseState


BACKEND_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_CANARY_STATE_PATH = BACKEND_ROOT / "config" / "policies" / "canary_release.json"


class CanaryStore:
    """Store the current canary release state for the MVP."""

    def __init__(self, state_path: str | Path | None = None) -> None:
        self.state_path = Path(state_path) if state_path is not None else DEFAULT_CANARY_STATE_PATH
        self._state: CanaryReleaseState | None = None
        self._last_error: str | None = None

    def reload(self) -> bool:
        """Reload canary state from disk."""
        try:
            if self.state_path.exists():
                payload = json.loads(self.state_path.read_text(encoding="utf-8"))
                self._state = CanaryReleaseState.model_validate(payload)
            self._last_error = None
            return True
        except Exception as exc:
            self._last_error = str(exc)
            return False

    def last_error(self) -> str | None:
        """Return the last reload error."""
        return self._last_error

    def get(self) -> CanaryReleaseState | None:
        """Return the active canary state."""
        return self._state.model_copy(deep=True) if self._state is not None else None

    def save(self, state: CanaryReleaseState | None) -> CanaryReleaseState | None:
        """Persist canary state."""
        self._state = state.model_copy(deep=True) if state is not None else None
        self._persist()
        return self.get()

    def clear(self) -> None:
        """Clear the active canary state."""
        self._state = None
        if self.state_path.exists():
            self.state_path.unlink()

    def _persist(self) -> None:
        if self._state is None:
            return
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.state_path.write_text(
            json.dumps(self._state.model_dump(), indent=2) + "\n",
            encoding="utf-8",
        )
