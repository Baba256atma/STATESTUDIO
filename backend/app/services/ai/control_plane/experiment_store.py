"""File-backed storage for policy experiments."""

from __future__ import annotations

import json
from pathlib import Path

from app.schemas.policy_experiments import ExperimentListResponse, ExperimentRunState


BACKEND_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_EXPERIMENT_STORE_PATH = BACKEND_ROOT / "config" / "policies" / "experiments.json"


class ExperimentStore:
    """Persist policy experiments for the MVP."""

    def __init__(self, state_path: str | Path | None = None) -> None:
        self.state_path = Path(state_path) if state_path is not None else DEFAULT_EXPERIMENT_STORE_PATH
        self._experiments: dict[str, ExperimentRunState] = {}
        self._last_error: str | None = None

    def reload(self) -> bool:
        """Reload experiments from disk."""
        try:
            if self.state_path.exists():
                payload = json.loads(self.state_path.read_text(encoding="utf-8"))
                experiments = payload.get("experiments", [])
                self._experiments = {
                    item["experiment_id"]: ExperimentRunState.model_validate(item)
                    for item in experiments
                }
            self._last_error = None
            return True
        except Exception as exc:
            self._last_error = str(exc)
            return False

    def last_error(self) -> str | None:
        """Return the last reload error."""
        return self._last_error

    def save(self, experiment: ExperimentRunState) -> ExperimentRunState:
        """Store one experiment."""
        self._experiments[experiment.experiment_id] = experiment.model_copy(deep=True)
        self._persist()
        return self.get(experiment.experiment_id)

    def get(self, experiment_id: str) -> ExperimentRunState:
        """Return one experiment."""
        experiment = self._experiments.get(experiment_id)
        if experiment is None:
            raise KeyError("policy_experiment_not_found")
        return experiment.model_copy(deep=True)

    def list(self) -> ExperimentListResponse:
        """Return all experiments."""
        experiments = sorted(
            (item.model_copy(deep=True) for item in self._experiments.values()),
            key=lambda item: item.created_at,
            reverse=True,
        )
        return ExperimentListResponse(experiments=experiments)

    def _persist(self) -> None:
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "experiments": [item.model_dump() for item in self._experiments.values()],
        }
        self.state_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
