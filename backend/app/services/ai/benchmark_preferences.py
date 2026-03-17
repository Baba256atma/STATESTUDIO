"""Benchmark result loading helpers for benchmark-assisted model selection."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from threading import Lock

from app.core.config import LocalAISettings
from app.schemas.ai import BenchmarkModelPreference
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService


BACKEND_ROOT = Path(__file__).resolve().parents[3]


@dataclass(frozen=True)
class BenchmarkPreferencesSnapshot:
    """Immutable benchmark preference snapshot."""

    preferences: dict[str, BenchmarkModelPreference]
    source_path: str
    available: bool
    error: str | None = None


class BenchmarkPreferencesLoader:
    """Load benchmark summary data from a local JSON report file."""

    def __init__(self, settings: LocalAISettings) -> None:
        self.settings = settings
        self.control_plane = AIControlPlaneService(settings)
        self._lock = Lock()
        self._last_mtime_ns: int | None = None
        benchmark_policy = self.control_plane.get_benchmark_policy()
        self._snapshot = BenchmarkPreferencesSnapshot(
            preferences={},
            source_path=str(self._resolve_path()),
            available=False,
            error="benchmark_tuning_disabled" if not benchmark_policy.enabled else "not_loaded",
        )

    def load(self) -> BenchmarkPreferencesSnapshot:
        """Return the latest cached benchmark preference snapshot."""
        path = self._resolve_path()
        if not self.control_plane.get_benchmark_policy().enabled:
            return BenchmarkPreferencesSnapshot(
                preferences={},
                source_path=str(path),
                available=False,
                error="benchmark_tuning_disabled",
            )

        try:
            stat = path.stat()
        except OSError:
            return BenchmarkPreferencesSnapshot(
                preferences={},
                source_path=str(path),
                available=False,
                error="benchmark_results_unavailable",
            )

        with self._lock:
            if self._last_mtime_ns == stat.st_mtime_ns:
                return self._snapshot

            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
                preferences = self._parse_payload(payload)
            except (OSError, json.JSONDecodeError, ValueError):
                self._last_mtime_ns = stat.st_mtime_ns
                self._snapshot = BenchmarkPreferencesSnapshot(
                    preferences={},
                    source_path=str(path),
                    available=False,
                    error="benchmark_results_invalid",
                )
                return self._snapshot

            self._last_mtime_ns = stat.st_mtime_ns
            self._snapshot = BenchmarkPreferencesSnapshot(
                preferences=preferences,
                source_path=str(path),
                available=bool(preferences),
                error=None if preferences else "benchmark_results_empty",
            )
            return self._snapshot

    def _resolve_path(self) -> Path:
        raw_path = self.control_plane.get_benchmark_policy().results_path
        path = Path(raw_path)
        if path.is_absolute():
            return path
        return (BACKEND_ROOT / path).resolve()

    @staticmethod
    def _parse_payload(payload: object) -> dict[str, BenchmarkModelPreference]:
        if isinstance(payload, dict):
            summary = payload.get("summary", [])
        else:
            summary = payload

        if not isinstance(summary, list):
            raise ValueError("benchmark_summary_invalid")

        preferences: dict[str, BenchmarkModelPreference] = {}
        for item in summary:
            if not isinstance(item, dict):
                continue
            model = item.get("model")
            if not isinstance(model, str) or not model.strip():
                continue
            preference = BenchmarkModelPreference(
                model=model.strip(),
                avg_latency_ms=_as_float_or_none(item.get("avg_latency_ms")),
                success_rate=_clamp_rate(item.get("success_rate")),
                json_valid_rate=_clamp_rate(item.get("json_valid_rate")),
                avg_objects_detected=max(_as_float(item.get("avg_objects_detected")), 0.0),
                avg_risk_signals=max(_as_float(item.get("avg_risk_signals")), 0.0),
                avg_confidence=_clamp_rate(item.get("avg_confidence")),
                metadata={},
            )
            preferences[preference.model] = preference
        return preferences


def _as_float(value: object) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _as_float_or_none(value: object) -> float | None:
    try:
        if value is None:
            return None
        return max(float(value), 0.0)
    except (TypeError, ValueError):
        return None


def _clamp_rate(value: object) -> float:
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return 0.0
    return min(max(numeric, 0.0), 1.0)
