"""Deterministic resolution of global, tenant, and workspace policy overlays."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_overlays import (
    EffectivePolicyResolution,
    OverlayConflictRecord,
    OverlayMergeTrace,
    PolicyOverlayReference,
    TenantPolicyOverlay,
    WorkspacePolicyOverlay,
)
from app.services.ai.control_plane.overlay_guards import apply_overlay_guards


class PolicyOverlayResolver:
    """Resolve effective AI policy for global, tenant, and workspace scopes."""

    def resolve(
        self,
        *,
        base_snapshot: AIPolicySnapshot,
        tenant_overlay: TenantPolicyOverlay | None = None,
        workspace_overlay: WorkspacePolicyOverlay | None = None,
        tenant_id: str | None = None,
        workspace_id: str | None = None,
    ) -> EffectivePolicyResolution:
        """Resolve effective policy with explicit precedence and traceability."""
        effective_payload = base_snapshot.model_dump()
        merge_trace: list[OverlayMergeTrace] = []
        conflicts: list[OverlayConflictRecord] = []
        sources = [base_snapshot.version_info.source]
        tenant_version: str | None = None
        workspace_version: str | None = None

        if tenant_overlay is not None and tenant_overlay.enabled:
            effective_payload, trace_entry, trace_conflicts = self._apply_overlay(
                base_payload=effective_payload,
                overlay=tenant_overlay,
            )
            merge_trace.append(trace_entry)
            conflicts.extend(trace_conflicts)
            tenant_version = tenant_overlay.policy_version
            sources.append(tenant_overlay.source)

        if workspace_overlay is not None and workspace_overlay.enabled:
            if workspace_overlay.tenant_id and tenant_id and workspace_overlay.tenant_id != tenant_id:
                conflicts.append(
                    OverlayConflictRecord(
                        scope_type="workspace",
                        scope_id=workspace_overlay.scope_id,
                        field_path="workspace.tenant_id",
                        attempted_value=workspace_overlay.tenant_id,
                        effective_value=tenant_id,
                        reason="Workspace overlay tenant_id does not match requested tenant scope",
                    )
                )
            else:
                effective_payload, trace_entry, trace_conflicts = self._apply_overlay(
                    base_payload=effective_payload,
                    overlay=workspace_overlay,
                )
                merge_trace.append(trace_entry)
                conflicts.extend(trace_conflicts)
                workspace_version = workspace_overlay.policy_version
                sources.append(workspace_overlay.source)

        effective_snapshot = AIPolicySnapshot.model_validate(effective_payload)
        effective_version = _build_effective_version(
            base_snapshot.version_info.policy_version,
            tenant_version,
            workspace_version,
        )
        effective_snapshot.version_info.policy_version = effective_version
        effective_snapshot.version_info.loaded_at = datetime.now(UTC).isoformat()
        effective_snapshot.version_info.source = "overlay_resolution"

        return EffectivePolicyResolution(
            tenant_id=tenant_id,
            workspace_id=workspace_id,
            resolution_timestamp=datetime.now(UTC).isoformat(),
            base_policy_version=base_snapshot.version_info.policy_version,
            tenant_overlay_version=tenant_version,
            workspace_overlay_version=workspace_version,
            effective_policy_version=effective_version,
            sources=sources,
            effective_policy=effective_snapshot,
            merge_trace=merge_trace,
            conflicts=conflicts,
        )

    def _apply_overlay(
        self,
        *,
        base_payload: dict[str, Any],
        overlay: TenantPolicyOverlay | WorkspacePolicyOverlay,
    ) -> tuple[dict[str, Any], OverlayMergeTrace, list[OverlayConflictRecord]]:
        sanitized_payload, conflicts = apply_overlay_guards(
            base_payload=base_payload,
            overlay_payload=overlay.overlay,
            scope_type=overlay.scope_type,
            scope_id=overlay.scope_id,
        )
        overridden_fields = _flatten_keys(sanitized_payload)
        merged_payload = _deep_merge(base_payload, sanitized_payload)
        blocked_fields = [record.field_path for record in conflicts]
        return (
            merged_payload,
            OverlayMergeTrace(
                overlay_reference=PolicyOverlayReference(
                    scope_type=overlay.scope_type,
                    scope_id=overlay.scope_id,
                    policy_version=overlay.policy_version,
                    source=overlay.source,
                    enabled=overlay.enabled,
                    overlay_priority=overlay.overlay_priority,
                    inherited_from=overlay.inherited_from,
                ),
                overridden_fields=overridden_fields,
                blocked_fields=blocked_fields,
            ),
            conflicts,
        )


def _flatten_keys(payload: dict[str, Any], prefix: str = "") -> list[str]:
    keys: list[str] = []
    for key, value in payload.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            keys.extend(_flatten_keys(value, path))
        else:
            keys.append(path)
    return keys


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _build_effective_version(
    base_policy_version: str,
    tenant_overlay_version: str | None,
    workspace_overlay_version: str | None,
) -> str:
    parts = [base_policy_version]
    if tenant_overlay_version:
        parts.append(f"tenant:{tenant_overlay_version}")
    if workspace_overlay_version:
        parts.append(f"workspace:{workspace_overlay_version}")
    return "|".join(parts)
