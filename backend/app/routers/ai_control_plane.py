"""Developer-facing routes for the Nexora AI control plane."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.control_plane import AIControlPlaneState, AIPolicySnapshot, PolicyVersionInfo
from app.schemas.policy_canary import (
    CanaryHealthSummary,
    CanaryLifecycleAction,
    CanaryReleaseState,
    PolicyCanaryConfig,
)
from app.schemas.policy_changes import (
    PolicyApprovalAction,
    PolicyApprovalDecision,
    PolicyChangeAuditRecord,
    PolicyChangeDiagnostics,
    PolicyChangeListResponse,
    PolicyChangePreview,
    PolicyChangeRecord,
    PolicyChangeRequest,
    PolicyDiffResult,
    PolicyValidationResult,
)
from app.schemas.policy_experiments import (
    ExperimentLifecycleAction,
    ExperimentListResponse,
    ExperimentResultsResponse,
    ExperimentRunState,
    PolicyExperimentConfig,
)
from app.schemas.policy_optimization import (
    OptimizationAction,
    OptimizationApplicationResult,
    OptimizationProposalListResponse,
    OptimizationProposalSet,
    PolicyOptimizationProposal,
)
from app.schemas.policy_overlays import EffectivePolicyResolution, OverlayMergeTrace
from app.schemas.policy_promotion import (
    EnvironmentType,
    PolicyEnvironmentListResponse,
    PolicyEnvironmentState,
    PolicyPromotionRequest,
    PolicyPromotionResult,
    PolicyRollbackRequest,
    PolicyRollbackResult,
    PromotionHistoryResponse,
)
from app.services.ai.control_plane.control_plane_service import (
    AIControlPlaneService,
    get_ai_control_plane_service,
)


router = APIRouter(prefix="/control-plane", tags=["ai-control-plane"])


@router.get(
    "/state",
    response_model=AIControlPlaneState,
    summary="Inspect control plane state",
    description="Returns the current effective AI control plane state.",
)
async def ai_control_plane_state(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> AIControlPlaneState:
    """Return the current control plane state."""
    try:
        return control_plane.get_state()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_STATE_ERROR",
                    "message": "AI control plane state is currently unavailable.",
                },
            },
        )


@router.get(
    "/policies",
    response_model=AIPolicySnapshot,
    summary="Inspect effective policies",
    description="Returns the effective AI policy snapshot currently used by the control plane.",
)
async def ai_control_plane_policies(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> AIPolicySnapshot:
    """Return the effective policy snapshot."""
    try:
        return control_plane.get_snapshot()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICIES_ERROR",
                    "message": "AI control plane policies are currently unavailable.",
                },
            },
        )


@router.get(
    "/version",
    response_model=PolicyVersionInfo,
    summary="Inspect policy version",
    description="Returns the current AI policy version metadata.",
)
async def ai_control_plane_version(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyVersionInfo:
    """Return policy version metadata."""
    try:
        return control_plane.get_version_info()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_VERSION_ERROR",
                    "message": "AI control plane version is currently unavailable.",
                },
            },
        )


@router.post(
    "/reload",
    response_model=AIControlPlaneState,
    summary="Reload control plane policies",
    description="Reloads the AI control plane policy snapshot from local storage while retaining the last known-good policy on failure.",
)
async def ai_control_plane_reload(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> AIControlPlaneState:
    """Reload policy state from local storage."""
    try:
        return control_plane.reload()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_RELOAD_ERROR",
                    "message": "AI control plane reload is currently unavailable.",
                },
            },
        )


@router.get(
    "/effective-policy",
    response_model=EffectivePolicyResolution,
    summary="Inspect effective global policy",
    description="Returns the effective policy resolution for global scope.",
)
async def ai_control_plane_effective_policy(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> EffectivePolicyResolution:
    """Return effective policy for global scope."""
    try:
        return control_plane.resolve_effective_policy()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_EFFECTIVE_POLICY_ERROR",
                    "message": "Effective AI policy is currently unavailable.",
                },
            },
        )


@router.get(
    "/effective-policy/{tenant_id}",
    response_model=EffectivePolicyResolution,
    summary="Inspect effective tenant policy",
    description="Returns the effective policy resolution for a tenant scope.",
)
async def ai_control_plane_effective_tenant_policy(
    tenant_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> EffectivePolicyResolution:
    """Return effective policy for a tenant scope."""
    try:
        return control_plane.resolve_effective_policy(tenant_id=tenant_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_EFFECTIVE_TENANT_POLICY_ERROR",
                    "message": "Effective tenant AI policy is currently unavailable.",
                },
            },
        )


@router.get(
    "/effective-policy/{tenant_id}/{workspace_id}",
    response_model=EffectivePolicyResolution,
    summary="Inspect effective workspace policy",
    description="Returns the effective policy resolution for a tenant and workspace scope.",
)
async def ai_control_plane_effective_workspace_policy(
    tenant_id: str,
    workspace_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> EffectivePolicyResolution:
    """Return effective policy for a workspace scope."""
    try:
        return control_plane.resolve_effective_policy(
            tenant_id=tenant_id,
            workspace_id=workspace_id,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_EFFECTIVE_WORKSPACE_POLICY_ERROR",
                    "message": "Effective workspace AI policy is currently unavailable.",
                },
            },
        )


@router.get(
    "/overlay-trace/{tenant_id}/{workspace_id}",
    response_model=list[OverlayMergeTrace],
    summary="Inspect overlay merge trace",
    description="Returns the overlay merge trace for a tenant and workspace scope.",
)
async def ai_control_plane_overlay_trace(
    tenant_id: str,
    workspace_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> list[OverlayMergeTrace]:
    """Return overlay merge trace for a workspace scope."""
    try:
        return control_plane.resolve_effective_policy(
            tenant_id=tenant_id,
            workspace_id=workspace_id,
        ).merge_trace
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_OVERLAY_TRACE_ERROR",
                    "message": "AI control plane overlay trace is currently unavailable.",
                },
            },
        )


@router.post(
    "/reload-overlays",
    response_model=AIControlPlaneState,
    summary="Reload policy overlays",
    description="Reloads tenant and workspace AI policy overlays from local storage while retaining the last known-good overlay state on failure.",
)
async def ai_control_plane_reload_overlays(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> AIControlPlaneState:
    """Reload overlay state from local storage."""
    try:
        return control_plane.reload_overlays()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_RELOAD_OVERLAYS_ERROR",
                    "message": "AI control plane overlay reload is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy-changes/preview",
    response_model=PolicyChangePreview,
    summary="Preview a policy change",
    description="Returns diff, validation, approval, and resulting version information for a staged policy change.",
)
async def ai_control_plane_preview_policy_change(
    payload: PolicyChangeRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangePreview:
    """Preview a policy change without storing it."""
    try:
        return control_plane.preview_policy_change(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_PREVIEW_ERROR",
                    "message": "Policy change preview is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy-changes",
    response_model=PolicyChangeRecord,
    summary="Create a staged policy change",
    description="Stores a staged policy change after diffing and validation.",
)
async def ai_control_plane_submit_policy_change(
    payload: PolicyChangeRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Store a staged policy change."""
    try:
        return control_plane.submit_policy_change(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_SUBMIT_ERROR",
                    "message": "Policy change submission is currently unavailable.",
                },
            },
        )


@router.get(
    "/policy-changes",
    response_model=PolicyChangeListResponse,
    summary="List staged policy changes",
    description="Returns staged, approved, rejected, and activated policy changes.",
)
async def ai_control_plane_list_policy_changes(
    status_filter: str | None = None,
    scope_type: str | None = None,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeListResponse:
    """List stored policy changes."""
    try:
        return control_plane.list_policy_changes(status=status_filter, scope_type=scope_type)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_LIST_ERROR",
                    "message": "Policy change diagnostics are currently unavailable.",
                },
            },
        )


@router.get(
    "/policy-changes/diagnostics/state",
    response_model=PolicyChangeDiagnostics,
    summary="Inspect policy change diagnostics",
    description="Returns active, last-known-good, and status counts for staged policy changes.",
)
async def ai_control_plane_policy_change_diagnostics(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeDiagnostics:
    """Return policy change diagnostics."""
    try:
        return control_plane.get_policy_change_diagnostics()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_DIAGNOSTICS_ERROR",
                    "message": "Policy change diagnostics are currently unavailable.",
                },
            },
        )


@router.post(
    "/policy-changes/diagnostics/reload",
    response_model=PolicyChangeDiagnostics,
    summary="Reload policy changes",
    description="Revalidates active staged policy changes and retains last-known-good safety on failure.",
)
async def ai_control_plane_reload_policy_changes(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeDiagnostics:
    """Reload staged policy changes."""
    try:
        return control_plane.reload_policy_changes()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_RELOAD_ERROR",
                    "message": "Policy change reload is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy/diff",
    response_model=PolicyDiffResult,
    summary="Diff a proposed policy change",
    description="Returns the field-level diff between current effective policy and a proposed policy change.",
)
async def ai_control_plane_policy_diff(
    payload: PolicyChangeRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyDiffResult:
    """Return the diff for a proposed policy change."""
    try:
        return control_plane.preview_policy_change(payload).diff
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_DIFF_ERROR",
                    "message": "Policy diff is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy/validate",
    response_model=PolicyValidationResult,
    summary="Validate a proposed policy change",
    description="Returns structural and logical validation for a proposed policy change.",
)
async def ai_control_plane_policy_validate(
    payload: PolicyChangeRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyValidationResult:
    """Return validation for a proposed policy change."""
    try:
        return control_plane.validate_policy_change(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_VALIDATE_ERROR",
                    "message": "Policy validation is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy/propose",
    response_model=PolicyChangeRecord,
    summary="Propose a policy change",
    description="Creates a staged policy change after diffing and validation.",
)
async def ai_control_plane_policy_propose(
    payload: PolicyChangeRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Create a staged policy change."""
    try:
        return control_plane.policy_change_service.propose(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_PROPOSE_ERROR",
                    "message": "Policy proposal is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy/approve",
    response_model=PolicyChangeRecord,
    summary="Approve a policy change",
    description="Approves a staged policy change by change identifier.",
)
async def ai_control_plane_policy_approve(
    change_id: str,
    payload: PolicyApprovalAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Approve a staged policy change."""
    try:
        return control_plane.policy_change_service.approve(change_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND", "message": "Policy change was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_APPROVE_ERROR", "message": "Policy approval is currently unavailable."}},
        )


@router.post(
    "/policy/reject",
    response_model=PolicyChangeRecord,
    summary="Reject a policy change",
    description="Rejects a staged policy change by change identifier.",
)
async def ai_control_plane_policy_reject(
    change_id: str,
    payload: PolicyApprovalAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Reject a staged policy change."""
    try:
        return control_plane.policy_change_service.reject(change_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND", "message": "Policy change was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_REJECT_ERROR", "message": "Policy rejection is currently unavailable."}},
        )


@router.get(
    "/policy/pending",
    response_model=PolicyChangeListResponse,
    summary="List pending policy changes",
    description="Returns pending policy changes only.",
)
async def ai_control_plane_policy_pending(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeListResponse:
    """Return pending policy changes."""
    try:
        return control_plane.get_pending_policy_changes()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_PENDING_ERROR", "message": "Pending policy changes are currently unavailable."}},
        )


@router.get(
    "/policy/history",
    response_model=PolicyChangeListResponse,
    summary="List policy change history",
    description="Returns full policy change history.",
)
async def ai_control_plane_policy_history(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeListResponse:
    """Return policy change history."""
    try:
        return control_plane.get_policy_change_history()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_HISTORY_ERROR", "message": "Policy change history is currently unavailable."}},
        )


@router.get(
    "/policy/diff/{change_id}",
    response_model=PolicyDiffResult,
    summary="Inspect stored policy diff",
    description="Returns the stored field-level diff for a policy change.",
)
async def ai_control_plane_policy_diff_by_id(
    change_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyDiffResult:
    """Return a stored policy diff."""
    try:
        return control_plane.get_policy_change_diff(change_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND", "message": "Policy change was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_DIFF_GET_ERROR", "message": "Stored policy diff is currently unavailable."}},
        )


@router.get(
    "/policy/approval/{change_id}",
    response_model=PolicyApprovalDecision,
    summary="Inspect policy approval decision",
    description="Returns approval decision metadata for a stored policy change.",
)
async def ai_control_plane_policy_approval_decision(
    change_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyApprovalDecision:
    """Return approval decision metadata."""
    try:
        return control_plane.get_policy_change_approval_decision(change_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND", "message": "Policy change was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_APPROVAL_DECISION_ERROR", "message": "Policy approval decision is currently unavailable."}},
        )


@router.get(
    "/policy/audit/{change_id}",
    response_model=PolicyChangeAuditRecord,
    summary="Inspect policy change audit record",
    description="Returns compact audit metadata for a stored policy change.",
)
async def ai_control_plane_policy_audit_record(
    change_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeAuditRecord:
    """Return compact policy change audit metadata."""
    try:
        return control_plane.get_policy_change_audit_record(change_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND", "message": "Policy change was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_AUDIT_RECORD_ERROR", "message": "Policy audit record is currently unavailable."}},
        )


@router.get(
    "/policy/environments",
    response_model=PolicyEnvironmentListResponse,
    summary="Inspect policy environments",
    description="Returns active policy snapshots for local, dev, staging, and production environments.",
)
async def ai_control_plane_policy_environments(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyEnvironmentListResponse:
    """Return environment policy states."""
    try:
        return control_plane.list_policy_environments()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_ENVIRONMENTS_ERROR", "message": "Policy environments are currently unavailable."}},
        )


@router.get(
    "/policy/environment/{environment}",
    response_model=PolicyEnvironmentState,
    summary="Inspect one policy environment",
    description="Returns the active policy state for one environment.",
)
async def ai_control_plane_policy_environment(
    environment: EnvironmentType,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyEnvironmentState:
    """Return one environment policy state."""
    try:
        return control_plane.get_policy_environment(environment)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_ENVIRONMENT_NOT_FOUND", "message": "Policy environment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_ENVIRONMENT_ERROR", "message": "Policy environment is currently unavailable."}},
        )


@router.get(
    "/policy/promotion-history",
    response_model=PromotionHistoryResponse,
    summary="Inspect promotion history",
    description="Returns policy promotion and rollback history.",
)
async def ai_control_plane_policy_promotion_history(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PromotionHistoryResponse:
    """Return policy promotion history."""
    try:
        return control_plane.get_policy_promotion_history()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_PROMOTION_HISTORY_ERROR", "message": "Policy promotion history is currently unavailable."}},
        )


@router.post(
    "/policy/promote",
    response_model=PolicyPromotionResult,
    summary="Promote a policy between environments",
    description="Promotes a policy forward through the environment pipeline after deterministic gates pass.",
)
async def ai_control_plane_policy_promote(
    payload: PolicyPromotionRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyPromotionResult:
    """Promote a policy between environments."""
    try:
        return control_plane.promote_policy(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_PROMOTE_ERROR", "message": "Policy promotion is currently unavailable."}},
        )


@router.post(
    "/policy/environment/{environment}/rollback",
    response_model=PolicyRollbackResult,
    summary="Rollback one policy environment",
    description="Rolls back an environment to its last-known-good policy snapshot.",
)
async def ai_control_plane_policy_rollback(
    environment: EnvironmentType,
    payload: PolicyRollbackRequest,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyRollbackResult:
    """Rollback one environment policy state."""
    try:
        return control_plane.rollback_policy_environment(environment, payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_POLICY_ROLLBACK_ERROR", "message": "Policy rollback is currently unavailable."}},
        )


@router.post(
    "/policy/canary/start",
    response_model=CanaryReleaseState,
    summary="Start a policy canary",
    description="Starts a deterministic policy canary release from the configured source environment.",
)
async def ai_control_plane_policy_canary_start(
    config: PolicyCanaryConfig,
    actor_id: str,
    reason: str | None = None,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryReleaseState:
    """Start a policy canary release."""
    try:
        return control_plane.start_policy_canary(config, {"actor_id": actor_id, "reason": reason})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_START_ERROR", "message": "Policy canary start is currently unavailable."}},
        )


@router.post(
    "/policy/canary/pause",
    response_model=CanaryReleaseState,
    summary="Pause a policy canary",
    description="Pauses the active policy canary release.",
)
async def ai_control_plane_policy_canary_pause(
    payload: CanaryLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryReleaseState:
    """Pause the active canary release."""
    try:
        return control_plane.pause_policy_canary(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_PAUSE_ERROR", "message": "Policy canary pause is currently unavailable."}},
        )


@router.post(
    "/policy/canary/resume",
    response_model=CanaryReleaseState,
    summary="Resume a policy canary",
    description="Resumes the active policy canary release.",
)
async def ai_control_plane_policy_canary_resume(
    payload: CanaryLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryReleaseState:
    """Resume the active canary release."""
    try:
        return control_plane.resume_policy_canary(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_RESUME_ERROR", "message": "Policy canary resume is currently unavailable."}},
        )


@router.post(
    "/policy/canary/rollback",
    response_model=CanaryReleaseState,
    summary="Rollback a policy canary",
    description="Disables canary traffic and rolls the release back to stable-only routing.",
)
async def ai_control_plane_policy_canary_rollback(
    payload: CanaryLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryReleaseState:
    """Rollback the active canary release."""
    try:
        return control_plane.rollback_policy_canary(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_ROLLBACK_ERROR", "message": "Policy canary rollback is currently unavailable."}},
        )


@router.post(
    "/policy/canary/promote",
    response_model=CanaryReleaseState,
    summary="Promote a policy canary",
    description="Promotes the canary policy to stable production.",
)
async def ai_control_plane_policy_canary_promote(
    payload: CanaryLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryReleaseState:
    """Promote the active canary release."""
    try:
        return control_plane.promote_policy_canary(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_PROMOTE_ERROR", "message": "Policy canary promotion is currently unavailable."}},
        )


@router.get(
    "/policy/canary/state",
    response_model=CanaryReleaseState | None,
    summary="Inspect policy canary state",
    description="Returns the current canary release state if one is active or retained.",
)
async def ai_control_plane_policy_canary_state(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryReleaseState | None:
    """Return canary release state."""
    try:
        return control_plane.get_policy_canary_state()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_STATE_ERROR", "message": "Policy canary state is currently unavailable."}},
        )


@router.get(
    "/policy/canary/health",
    response_model=CanaryHealthSummary | None,
    summary="Inspect policy canary health",
    description="Returns deterministic canary health signals and applies pause or rollback decisions when required.",
)
async def ai_control_plane_policy_canary_health(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> CanaryHealthSummary | None:
    """Return canary health summary."""
    try:
        return control_plane.get_policy_canary_health()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_CANARY_HEALTH_ERROR", "message": "Policy canary health is currently unavailable."}},
        )


@router.post(
    "/policy/experiments/create",
    response_model=ExperimentRunState,
    summary="Create a policy experiment",
    description="Creates a draft policy experiment with deterministic traffic split configuration.",
)
async def ai_control_plane_policy_experiment_create(
    config: PolicyExperimentConfig,
    actor_id: str,
    reason: str | None = None,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentRunState:
    """Create a draft policy experiment."""
    try:
        return control_plane.create_policy_experiment(config, {"actor_id": actor_id, "reason": reason})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_CREATE_ERROR", "message": "Policy experiment creation is currently unavailable."}},
        )


@router.post(
    "/policy/experiments/start",
    response_model=ExperimentRunState,
    summary="Start a policy experiment",
    description="Starts a draft or paused policy experiment.",
)
async def ai_control_plane_policy_experiment_start(
    experiment_id: str,
    payload: ExperimentLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentRunState:
    """Start a policy experiment."""
    try:
        return control_plane.start_policy_experiment(experiment_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_NOT_FOUND", "message": "Policy experiment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_START_ERROR", "message": "Policy experiment start is currently unavailable."}},
        )


@router.post(
    "/policy/experiments/pause",
    response_model=ExperimentRunState,
    summary="Pause a policy experiment",
    description="Pauses an active policy experiment.",
)
async def ai_control_plane_policy_experiment_pause(
    experiment_id: str,
    payload: ExperimentLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentRunState:
    """Pause a policy experiment."""
    try:
        return control_plane.pause_policy_experiment(experiment_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_NOT_FOUND", "message": "Policy experiment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_PAUSE_ERROR", "message": "Policy experiment pause is currently unavailable."}},
        )


@router.post(
    "/policy/experiments/stop",
    response_model=ExperimentRunState,
    summary="Stop a policy experiment",
    description="Stops a policy experiment safely without affecting baseline policy behavior.",
)
async def ai_control_plane_policy_experiment_stop(
    experiment_id: str,
    payload: ExperimentLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentRunState:
    """Stop a policy experiment."""
    try:
        return control_plane.stop_policy_experiment(experiment_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_NOT_FOUND", "message": "Policy experiment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_STOP_ERROR", "message": "Policy experiment stop is currently unavailable."}},
        )


@router.post(
    "/policy/experiments/complete",
    response_model=ExperimentRunState,
    summary="Complete a policy experiment",
    description="Completes a policy experiment and stores the latest winner decision.",
)
async def ai_control_plane_policy_experiment_complete(
    experiment_id: str,
    payload: ExperimentLifecycleAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentRunState:
    """Complete a policy experiment."""
    try:
        return control_plane.complete_policy_experiment(experiment_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_NOT_FOUND", "message": "Policy experiment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_COMPLETE_ERROR", "message": "Policy experiment completion is currently unavailable."}},
        )


@router.get(
    "/policy/experiments",
    response_model=ExperimentListResponse,
    summary="List policy experiments",
    description="Returns all stored policy experiments.",
)
async def ai_control_plane_policy_experiments(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentListResponse:
    """List policy experiments."""
    try:
        return control_plane.list_policy_experiments()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_LIST_ERROR", "message": "Policy experiments are currently unavailable."}},
        )


@router.get(
    "/policy/experiments/{experiment_id}",
    response_model=ExperimentRunState,
    summary="Inspect a policy experiment",
    description="Returns one stored policy experiment.",
)
async def ai_control_plane_policy_experiment(
    experiment_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentRunState:
    """Return one policy experiment."""
    try:
        return control_plane.get_policy_experiment(experiment_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_NOT_FOUND", "message": "Policy experiment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_GET_ERROR", "message": "Policy experiment details are currently unavailable."}},
        )


@router.get(
    "/policy/experiments/{experiment_id}/results",
    response_model=ExperimentResultsResponse,
    summary="Inspect policy experiment results",
    description="Returns the latest metrics summary and recommendation for one policy experiment.",
)
async def ai_control_plane_policy_experiment_results(
    experiment_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> ExperimentResultsResponse:
    """Return policy experiment results."""
    try:
        return control_plane.get_policy_experiment_results(experiment_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_NOT_FOUND", "message": "Policy experiment was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_EXPERIMENT_RESULTS_ERROR", "message": "Policy experiment results are currently unavailable."}},
        )


@router.post(
    "/policy/optimize/run",
    response_model=OptimizationProposalSet,
    summary="Run policy optimization",
    description="Collects optimization signals and generates explainable policy optimization proposals.",
)
async def ai_control_plane_policy_optimize_run(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> OptimizationProposalSet:
    """Run deterministic policy optimization."""
    try:
        return control_plane.run_policy_optimization()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_RUN_ERROR", "message": "Policy optimization run is currently unavailable."}},
        )


@router.get(
    "/policy/optimize/proposals",
    response_model=OptimizationProposalListResponse,
    summary="List optimization proposals",
    description="Returns stored policy optimization proposals.",
)
async def ai_control_plane_policy_optimize_proposals(
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> OptimizationProposalListResponse:
    """List optimization proposals."""
    try:
        return control_plane.list_policy_optimization_proposals()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_LIST_ERROR", "message": "Optimization proposals are currently unavailable."}},
        )


@router.get(
    "/policy/optimize/proposals/{proposal_id}",
    response_model=PolicyOptimizationProposal,
    summary="Inspect an optimization proposal",
    description="Returns one stored policy optimization proposal.",
)
async def ai_control_plane_policy_optimize_proposal(
    proposal_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyOptimizationProposal:
    """Return one optimization proposal."""
    try:
        return control_plane.get_policy_optimization_proposal(proposal_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_PROPOSAL_NOT_FOUND", "message": "Optimization proposal was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_GET_ERROR", "message": "Optimization proposal details are currently unavailable."}},
        )


@router.post(
    "/policy/optimize/proposals/{proposal_id}/approve",
    response_model=PolicyOptimizationProposal,
    summary="Approve an optimization proposal",
    description="Approves a stored policy optimization proposal for governed application.",
)
async def ai_control_plane_policy_optimize_proposal_approve(
    proposal_id: str,
    payload: OptimizationAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyOptimizationProposal:
    """Approve an optimization proposal."""
    try:
        return control_plane.approve_policy_optimization_proposal(proposal_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_PROPOSAL_NOT_FOUND", "message": "Optimization proposal was not found."}},
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_FORBIDDEN", "message": "Forbidden optimization proposals cannot be approved."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_APPROVE_ERROR", "message": "Optimization proposal approval is currently unavailable."}},
        )


@router.post(
    "/policy/optimize/proposals/{proposal_id}/reject",
    response_model=PolicyOptimizationProposal,
    summary="Reject an optimization proposal",
    description="Rejects a stored policy optimization proposal.",
)
async def ai_control_plane_policy_optimize_proposal_reject(
    proposal_id: str,
    payload: OptimizationAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyOptimizationProposal:
    """Reject an optimization proposal."""
    try:
        return control_plane.reject_policy_optimization_proposal(proposal_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_PROPOSAL_NOT_FOUND", "message": "Optimization proposal was not found."}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_REJECT_ERROR", "message": "Optimization proposal rejection is currently unavailable."}},
        )


@router.post(
    "/policy/optimize/proposals/{proposal_id}/apply",
    response_model=OptimizationApplicationResult,
    summary="Apply an optimization proposal",
    description="Applies a proposal through existing policy diff, validation, approval, and activation workflow.",
)
async def ai_control_plane_policy_optimize_proposal_apply(
    proposal_id: str,
    payload: OptimizationAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> OptimizationApplicationResult:
    """Apply an optimization proposal."""
    try:
        return control_plane.apply_policy_optimization_proposal(proposal_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_PROPOSAL_NOT_FOUND", "message": "Optimization proposal was not found."}},
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_APPLY_ERROR", "message": str(exc)}},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"ok": False, "error": {"type": "AI_CONTROL_PLANE_OPTIMIZATION_APPLY_ERROR", "message": "Optimization proposal application is currently unavailable."}},
        )


@router.get(
    "/policy-changes/{change_id}",
    response_model=PolicyChangeRecord,
    summary="Inspect a policy change",
    description="Returns the stored diff, validation, approval, and activation data for one policy change.",
)
async def ai_control_plane_get_policy_change(
    change_id: str,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Return one stored policy change."""
    try:
        return control_plane.get_policy_change(change_id)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND",
                    "message": "Policy change was not found.",
                },
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_GET_ERROR",
                    "message": "Policy change details are currently unavailable.",
                },
            },
        )


@router.post(
    "/policy-changes/{change_id}/approve",
    response_model=PolicyChangeRecord,
    summary="Approve a policy change",
    description="Approves a staged policy change so it can be activated.",
)
async def ai_control_plane_approve_policy_change(
    change_id: str,
    payload: PolicyApprovalAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Approve a staged policy change."""
    try:
        return control_plane.approve_policy_change(change_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND",
                    "message": "Policy change was not found.",
                },
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_APPROVE_ERROR",
                    "message": "Policy change approval is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy-changes/{change_id}/reject",
    response_model=PolicyChangeRecord,
    summary="Reject a policy change",
    description="Rejects a staged policy change.",
)
async def ai_control_plane_reject_policy_change(
    change_id: str,
    payload: PolicyApprovalAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Reject a staged policy change."""
    try:
        return control_plane.reject_policy_change(change_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND",
                    "message": "Policy change was not found.",
                },
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_REJECT_ERROR",
                    "message": "Policy change rejection is currently unavailable.",
                },
            },
        )


@router.post(
    "/policy-changes/{change_id}/activate",
    response_model=PolicyChangeRecord,
    summary="Activate a policy change",
    description="Activates an approved policy change while keeping last-known-good safety.",
)
async def ai_control_plane_activate_policy_change(
    change_id: str,
    payload: PolicyApprovalAction,
    control_plane: AIControlPlaneService = Depends(get_ai_control_plane_service),
) -> PolicyChangeRecord:
    """Activate an approved policy change."""
    try:
        return control_plane.activate_policy_change(change_id, payload)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_FOUND",
                    "message": "Policy change was not found.",
                },
            },
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_NOT_APPROVED",
                    "message": "Policy change must be approved before activation.",
                },
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_CONTROL_PLANE_POLICY_CHANGE_ACTIVATE_ERROR",
                    "message": "Policy change activation is currently unavailable.",
                },
            },
        )
