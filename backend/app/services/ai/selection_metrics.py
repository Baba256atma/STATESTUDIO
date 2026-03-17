"""In-memory observability helpers for Local AI model selection."""

from __future__ import annotations

from collections import Counter, deque
from collections.abc import Deque
from datetime import datetime, timezone
from threading import Lock

from app.schemas.ai import SelectionHistoryEntry, SelectionStatsResponse


class LocalAISelectionMetricsStore:
    """Record compact selection metrics in memory for MVP diagnostics."""

    def __init__(self, max_history: int = 100) -> None:
        self._lock = Lock()
        self._max_history = max_history
        self._total_selections = 0
        self._fallback_count = 0
        self._selections_by_model: Counter[str] = Counter()
        self._selections_by_task: Counter[str] = Counter()
        self._selections_by_latency_bucket: Counter[str] = Counter()
        self._history: Deque[SelectionHistoryEntry] = deque(maxlen=max_history)

    def record(
        self,
        *,
        task_type: str,
        selected_model: str,
        fallback_used: bool,
        latency_bucket: str | None = None,
    ) -> None:
        """Record a single model selection event."""
        entry = SelectionHistoryEntry(
            task_type=task_type,
            selected_model=selected_model,
            fallback_used=fallback_used,
            timestamp=datetime.now(timezone.utc).isoformat(),
            latency_bucket=latency_bucket,
        )

        with self._lock:
            self._total_selections += 1
            if fallback_used:
                self._fallback_count += 1
            self._selections_by_model[selected_model] += 1
            self._selections_by_task[task_type] += 1
            if latency_bucket:
                self._selections_by_latency_bucket[latency_bucket] += 1
            self._history.appendleft(entry)

    def snapshot(self) -> SelectionStatsResponse:
        """Return the current aggregated metrics snapshot."""
        with self._lock:
            total = self._total_selections
            fallback_rate = (self._fallback_count / total) if total else 0.0
            return SelectionStatsResponse(
                total_selections=total,
                selections_by_model=dict(self._selections_by_model),
                selections_by_task=dict(self._selections_by_task),
                fallback_rate=round(fallback_rate, 4),
                selections_by_latency_bucket=dict(self._selections_by_latency_bucket),
                recent_history=list(self._history),
            )


_selection_metrics_store = LocalAISelectionMetricsStore()


def get_selection_metrics_store() -> LocalAISelectionMetricsStore:
    """Return the shared in-memory selection metrics store."""
    return _selection_metrics_store
