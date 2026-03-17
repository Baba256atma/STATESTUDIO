"""Safety guards for tenant and workspace policy overlays."""

from __future__ import annotations

from copy import deepcopy

from app.schemas.policy_overlays import OverlayConflictRecord, PolicyOverlayPayload


def apply_overlay_guards(
    *,
    base_payload: dict,
    overlay_payload: PolicyOverlayPayload,
    scope_type: str,
    scope_id: str,
) -> tuple[dict, list[OverlayConflictRecord]]:
    """Return a sanitized overlay payload and any blocked overlay conflicts."""
    sanitized = overlay_payload.model_dump(exclude_none=True)
    conflicts: list[OverlayConflictRecord] = []

    _guard_bool_relaxation(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="routing",
        field="enabled",
    )
    _guard_bool_relaxation(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="routing",
        field="cloud_fallback_enabled",
    )
    _guard_bool_relaxation(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="routing",
        field="cloud_for_reasoning_enabled",
    )
    _guard_bool_relaxation(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="provider",
        field="cloud_provider_enabled",
    )
    _guard_bool_relaxation(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="privacy",
        field="strict_mode",
    )

    _guard_list_subset(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="routing",
        field="cloud_allowed_tasks",
    )
    _guard_list_subset(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="privacy",
        field="cloud_blocked_sensitivity_levels",
        reverse_subset=True,
    )
    _guard_list_subset(
        conflicts=conflicts,
        sanitized=sanitized,
        base_payload=base_payload,
        scope_type=scope_type,
        scope_id=scope_id,
        section="privacy",
        field="local_required_sensitivity_levels",
        reverse_subset=True,
    )

    return sanitized, conflicts


def _guard_bool_relaxation(
    *,
    conflicts: list[OverlayConflictRecord],
    sanitized: dict,
    base_payload: dict,
    scope_type: str,
    scope_id: str,
    section: str,
    field: str,
) -> None:
    section_payload = deepcopy(sanitized.get(section, {}))
    if field not in section_payload:
        return
    attempted = section_payload[field]
    effective_base = bool(base_payload.get(section, {}).get(field))
    if effective_base is False and attempted is True:
        section_payload.pop(field, None)
        if section_payload:
            sanitized[section] = section_payload
        else:
            sanitized.pop(section, None)
        conflicts.append(
            OverlayConflictRecord(
                scope_type=scope_type,
                scope_id=scope_id,
                field_path=f"{section}.{field}",
                attempted_value=attempted,
                effective_value=effective_base,
                reason="Broader policy disabled this capability; overlay cannot re-enable it",
            )
        )


def _guard_list_subset(
    *,
    conflicts: list[OverlayConflictRecord],
    sanitized: dict,
    base_payload: dict,
    scope_type: str,
    scope_id: str,
    section: str,
    field: str,
    reverse_subset: bool = False,
) -> None:
    section_payload = deepcopy(sanitized.get(section, {}))
    if field not in section_payload:
        return
    attempted_list = section_payload[field]
    if not isinstance(attempted_list, list):
        return
    base_list = base_payload.get(section, {}).get(field, [])
    if not isinstance(base_list, list):
        return

    attempted_set = set(attempted_list)
    base_set = set(base_list)
    allowed = attempted_set.issubset(base_set) if not reverse_subset else base_set.issubset(attempted_set)
    if allowed:
        return

    if reverse_subset:
        section_payload[field] = sorted(base_set.union(attempted_set))
        reason = "Overlay may tighten restrictions but cannot remove broader restricted values"
        effective_value = sorted(base_set.union(attempted_set))
    else:
        section_payload[field] = [item for item in attempted_list if item in base_set]
        reason = "Overlay may narrow allowed values but cannot add new broader-scope allowances"
        effective_value = section_payload[field]

    sanitized[section] = section_payload
    conflicts.append(
        OverlayConflictRecord(
            scope_type=scope_type,
            scope_id=scope_id,
            field_path=f"{section}.{field}",
            attempted_value=attempted_list,
            effective_value=effective_value,
            reason=reason,
        )
    )
