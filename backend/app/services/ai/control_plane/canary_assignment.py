"""Deterministic canary assignment helpers."""

from __future__ import annotations

import hashlib

from app.schemas.policy_canary import (
    CanaryAssignmentRequest,
    CanaryAssignmentResult,
    CanaryReleaseState,
)


class CanaryAssignmentEngine:
    """Assign requests deterministically to stable or canary policy."""

    def assign(
        self,
        *,
        state: CanaryReleaseState | None,
        request: CanaryAssignmentRequest,
    ) -> CanaryAssignmentResult:
        """Return a deterministic canary assignment result."""
        if state is None or not state.canary_enabled or state.status != "active":
            stable_version = state.stable_policy_version if state is not None else "stable"
            canary_version = state.canary_policy_version if state is not None else None
            return CanaryAssignmentResult(
                stable_policy_version=stable_version,
                canary_policy_version=canary_version,
                assigned_channel="stable",
                assigned_policy_version=stable_version,
                canary_enabled=False if state is None else state.canary_enabled,
                traffic_percentage=0 if state is None else state.traffic_percentage,
                assignment_scope="global" if state is None else state.assignment_scope,
                tenant_id=request.tenant_id,
                workspace_id=request.workspace_id,
                request_hash_bucket=0,
                decision_reason="Canary is not active; stable policy remains the default baseline.",
            )

        eligible, eligibility_reason = _is_request_eligible(state=state, request=request)
        bucket = _request_bucket(request)
        if not eligible:
            return CanaryAssignmentResult(
                stable_policy_version=state.stable_policy_version,
                canary_policy_version=state.canary_policy_version,
                assigned_channel="stable",
                assigned_policy_version=state.stable_policy_version,
                canary_enabled=state.canary_enabled,
                traffic_percentage=state.traffic_percentage,
                assignment_scope=state.assignment_scope,
                tenant_id=request.tenant_id,
                workspace_id=request.workspace_id,
                request_hash_bucket=bucket,
                decision_reason=eligibility_reason,
            )

        assigned_channel = "canary" if bucket < state.traffic_percentage else "stable"
        assigned_policy_version = (
            state.canary_policy_version if assigned_channel == "canary" else state.stable_policy_version
        )
        return CanaryAssignmentResult(
            stable_policy_version=state.stable_policy_version,
            canary_policy_version=state.canary_policy_version,
            assigned_channel=assigned_channel,
            assigned_policy_version=assigned_policy_version,
            canary_enabled=state.canary_enabled,
            traffic_percentage=state.traffic_percentage,
            assignment_scope=state.assignment_scope,
            tenant_id=request.tenant_id,
            workspace_id=request.workspace_id,
            request_hash_bucket=bucket,
            decision_reason=(
                "Request assigned to canary by deterministic hash bucket."
                if assigned_channel == "canary"
                else "Request assigned to stable policy because the hash bucket exceeds canary traffic percentage."
            ),
        )


def _request_bucket(request: CanaryAssignmentRequest) -> int:
    seed = (
        request.trace_id
        or request.request_id
        or f"{request.tenant_id or 'global'}:{request.workspace_id or 'workspace'}"
    )
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % 100


def _is_request_eligible(
    *,
    state: CanaryReleaseState,
    request: CanaryAssignmentRequest,
) -> tuple[bool, str]:
    if state.assignment_scope == "global":
        return True, "Global canary scope is eligible."
    if state.assignment_scope == "tenant":
        if state.tenant_id and state.tenant_id == request.tenant_id:
            return True, "Tenant-scoped canary is eligible for this tenant."
        return False, "Request tenant is outside the canary tenant scope."
    if state.workspace_id and state.workspace_id == request.workspace_id:
        return True, "Workspace-scoped canary is eligible for this workspace."
    return False, "Request workspace is outside the canary workspace scope."
