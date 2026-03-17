"""In-memory storage for pending and activated policy changes."""

from __future__ import annotations

from collections import Counter

from app.schemas.policy_changes import PolicyChangeDiagnostics, PolicyChangeRecord
from app.schemas.policy_overlays import PolicyOverlayScope


class PolicyChangeStore:
    """Store policy changes and active scope mappings in memory."""

    def __init__(self) -> None:
        self._changes: dict[str, PolicyChangeRecord] = {}
        self._active_by_scope: dict[str, str] = {}
        self._last_known_good_by_scope: dict[str, str] = {}
        self._last_reload_succeeded = True
        self._last_reload_error: str | None = None

    def save(self, record: PolicyChangeRecord) -> PolicyChangeRecord:
        """Persist a policy change record."""
        self._changes[record.change_id] = record
        return record

    def get(self, change_id: str) -> PolicyChangeRecord | None:
        """Return a policy change record by identifier."""
        return self._changes.get(change_id)

    def list(
        self,
        *,
        status: str | None = None,
        scope_type: PolicyOverlayScope | None = None,
    ) -> list[PolicyChangeRecord]:
        """List policy changes with optional filtering."""
        records = list(self._changes.values())
        if status:
            records = [record for record in records if record.status == status]
        if scope_type:
            records = [record for record in records if record.scope_type == scope_type]
        return sorted(records, key=lambda record: record.created_at, reverse=True)

    def activate(self, scope_key: str, change_id: str) -> str | None:
        """Mark a change as active for a scope and return the previous active identifier."""
        previous = self._active_by_scope.get(scope_key)
        if previous:
            self._last_known_good_by_scope[scope_key] = previous
        self._active_by_scope[scope_key] = change_id
        return previous

    def clear_active(self, scope_key: str) -> None:
        """Clear the active change for a scope."""
        self._active_by_scope.pop(scope_key, None)

    def get_active_change_id(self, scope_key: str) -> str | None:
        """Return the active change identifier for a scope."""
        return self._active_by_scope.get(scope_key)

    def get_last_known_good_change_id(self, scope_key: str) -> str | None:
        """Return the last-known-good change identifier for a scope."""
        return self._last_known_good_by_scope.get(scope_key)

    def diagnostics(self) -> PolicyChangeDiagnostics:
        """Return policy change diagnostics."""
        counts = Counter(record.status for record in self._changes.values())
        return PolicyChangeDiagnostics(
            active_changes=dict(self._active_by_scope),
            last_known_good_changes=dict(self._last_known_good_by_scope),
            counts_by_status=dict(counts),
            last_reload_succeeded=self._last_reload_succeeded,
            last_reload_error=self._last_reload_error,
        )

    def mark_reload(self, *, succeeded: bool, error: str | None = None) -> None:
        """Record the last policy change reload outcome."""
        self._last_reload_succeeded = succeeded
        self._last_reload_error = error
