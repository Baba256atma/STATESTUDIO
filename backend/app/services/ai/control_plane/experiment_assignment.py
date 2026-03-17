"""Deterministic assignment for policy experiments."""

from __future__ import annotations

import hashlib

from app.schemas.policy_experiments import (
    ExperimentAssignmentRequest,
    ExperimentAssignmentResult,
    ExperimentRunState,
)


class ExperimentAssignmentEngine:
    """Assign requests deterministically across control and variant arms."""

    def assign(
        self,
        *,
        experiment: ExperimentRunState,
        request: ExperimentAssignmentRequest,
    ) -> ExperimentAssignmentResult:
        """Return deterministic experiment assignment."""
        bucket = _request_bucket(request)
        if experiment.status != "active":
            return ExperimentAssignmentResult(
                experiment_id=experiment.experiment_id,
                experiment_name=experiment.experiment_name,
                selected_variant="control",
                assigned_policy_version=experiment.control_policy_version,
                request_hash_bucket=bucket,
                assignment_scope=experiment.assignment_scope,
                traffic_split=dict(experiment.traffic_split),
                tenant_id=request.tenant_id,
                workspace_id=request.workspace_id,
                decision_reason="Experiment is not active; control policy remains the baseline.",
            )

        eligible, reason = _eligible(experiment=experiment, request=request)
        if not eligible:
            return ExperimentAssignmentResult(
                experiment_id=experiment.experiment_id,
                experiment_name=experiment.experiment_name,
                selected_variant="control",
                assigned_policy_version=experiment.control_policy_version,
                request_hash_bucket=bucket,
                assignment_scope=experiment.assignment_scope,
                traffic_split=dict(experiment.traffic_split),
                tenant_id=request.tenant_id,
                workspace_id=request.workspace_id,
                decision_reason=reason,
            )

        selected_variant = _bucket_to_variant(bucket, experiment)
        assigned_policy_version = experiment.control_policy_version
        for variant in experiment.variants:
            if variant.variant_name == selected_variant:
                assigned_policy_version = variant.policy_version
                break
        if selected_variant == "control":
            reason = "Request assigned to control by deterministic traffic split."
        else:
            reason = "Request assigned to policy variant by deterministic traffic split."
        return ExperimentAssignmentResult(
            experiment_id=experiment.experiment_id,
            experiment_name=experiment.experiment_name,
            selected_variant=selected_variant,
            assigned_policy_version=assigned_policy_version,
            request_hash_bucket=bucket,
            assignment_scope=experiment.assignment_scope,
            traffic_split=dict(experiment.traffic_split),
            tenant_id=request.tenant_id,
            workspace_id=request.workspace_id,
            decision_reason=reason,
        )


def _request_bucket(request: ExperimentAssignmentRequest) -> int:
    seed = (
        request.trace_id
        or request.request_id
        or f"{request.tenant_id or 'global'}:{request.workspace_id or 'workspace'}"
    )
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % 100


def _eligible(
    *,
    experiment: ExperimentRunState,
    request: ExperimentAssignmentRequest,
) -> tuple[bool, str]:
    if experiment.assignment_scope == "global":
        return True, "Global experiment scope is eligible."
    if experiment.assignment_scope == "tenant":
        if experiment.tenant_id == request.tenant_id:
            return True, "Tenant-scoped experiment is eligible for this tenant."
        return False, "Request tenant is outside the experiment tenant scope."
    if experiment.workspace_id == request.workspace_id:
        return True, "Workspace-scoped experiment is eligible for this workspace."
    return False, "Request workspace is outside the experiment workspace scope."


def _bucket_to_variant(bucket: int, experiment: ExperimentRunState) -> str:
    cursor = 0
    for variant_name, percentage in experiment.traffic_split.items():
        cursor += percentage
        if bucket < cursor:
            return variant_name
    return "control"
