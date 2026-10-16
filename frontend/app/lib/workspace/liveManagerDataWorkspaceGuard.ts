/**
 * NPA-T MWI:2 — narrow write guard.
 * Legacy callers may still store under cockpit-mode keys while the active
 * registry record is demo or unclassified. Once a real Manager Workspace is
 * active, those five keys are refused so new manager data cannot use them.
 * A real Manager Workspace id is never a demo bootstrap target.
 */

import {
  DEMO_WORKSPACE_ID,
  isLegacyWorkflowWorkspaceIdentifier,
  isManagerWorkspaceKind,
  type WorkspaceId,
} from "./workspaceRegistryContract.ts";
import { getActiveWorkspace, getWorkspaceById } from "./workspaceRegistryStore.ts";
import { readLiveExecutiveDataWorkspaceId } from "./managerWorkspaceIdentity.ts";

export function legacyWorkflowKeyBlockedForActiveManager(workspaceId: unknown): boolean {
  if (!isLegacyWorkflowWorkspaceIdentifier(workspaceId)) return false;
  return isManagerWorkspaceKind(getActiveWorkspace()?.kind);
}

/**
 * OWN-MVP:2 — manager CSV may be written only for the canonical live workspace.
 * A workflow mode is not an owner. A caller-supplied id is not reassigned.
 */
export function refuseCrossWorkspaceCsvTarget(
  workspaceId: unknown,
): "wrong_workspace" | "refused_workflow_key" | null {
  if (isLegacyWorkflowWorkspaceIdentifier(workspaceId)) {
    return legacyWorkflowKeyBlockedForActiveManager(workspaceId) ? "refused_workflow_key" : null;
  }
  if (typeof workspaceId !== "string" || workspaceId.trim().length === 0) return "wrong_workspace";
  const live = readLiveExecutiveDataWorkspaceId();
  if (isRealManagerWorkspaceId(workspaceId) && workspaceId !== live) return "wrong_workspace";
  if (workspaceId === DEMO_WORKSPACE_ID && isRealManagerWorkspaceId(live)) return "wrong_workspace";
  return null;
}

export function isRealManagerWorkspaceId(workspaceId: WorkspaceId): boolean {
  return isManagerWorkspaceKind(getWorkspaceById(workspaceId)?.kind);
}

/** Shared unnamed bucket used when Decision Memory, Approval, or Collaboration omit a workspace. */
export const LEGACY_MANAGER_WORKSPACE_FALLBACK = "default_workspace" as const;

const ACCEPTED_FALLBACK_MIGRATION_BASES = new Set([
  "persisted-canonical-id",
  "linked-decision-owner",
  "linked-execution-owner",
  "business-project-reference",
  "durable-source-metadata",
  "explicit-source-link",
  "canonical-collaboration-target",
]);

/**
 * New manager records use the live Manager Workspace when the caller omits an id
 * or still passes the legacy fallback. An explicit non-fallback id is kept.
 * Workflow-mode keys are refused while a real Manager Workspace is active.
 * Historical records are not rewritten here.
 */
export function resolveManagerRecordWorkspaceId(workspaceId: unknown): string | null {
  if (isLegacyWorkflowWorkspaceIdentifier(workspaceId)) {
    return legacyWorkflowKeyBlockedForActiveManager(workspaceId) ? null : String(workspaceId);
  }
  const raw = typeof workspaceId === "string" ? workspaceId.trim() : "";
  const active = getActiveWorkspace();
  if ((!raw || raw === LEGACY_MANAGER_WORKSPACE_FALLBACK) && isManagerWorkspaceKind(active?.kind)) {
    return readLiveExecutiveDataWorkspaceId();
  }
  return raw || LEGACY_MANAGER_WORKSPACE_FALLBACK;
}

export type LegacyManagerFallbackProof = Readonly<{
  recordId: string;
  targetWorkspaceId: string;
  basis: string;
}>;

export function applyLegacyManagerFallbackMigration<T extends {
  readonly id: string;
  readonly workspace_id?: string | null;
}>(
  records: readonly T[],
  options: {
    readonly activeWorkspaceId?: string | null;
    readonly proofs?: readonly LegacyManagerFallbackProof[];
  } = {},
): Readonly<{ activeWorkspaceUsedAsEvidence: false; changed: boolean; records: readonly T[] }> {
  void options.activeWorkspaceId;
  const proofs = options.proofs ?? [];
  let changed = false;
  const next = records.map((record) => {
    const current = record.workspace_id?.trim() ?? "";
    if (current && current !== LEGACY_MANAGER_WORKSPACE_FALLBACK && !isLegacyWorkflowWorkspaceIdentifier(current)) {
      return record;
    }
    const accepted = proofs.filter(
      (proof) =>
        proof.recordId === record.id &&
        ACCEPTED_FALLBACK_MIGRATION_BASES.has(proof.basis) &&
        !isLegacyWorkflowWorkspaceIdentifier(proof.targetWorkspaceId) &&
        proof.targetWorkspaceId.trim() !== "" &&
        proof.targetWorkspaceId !== LEGACY_MANAGER_WORKSPACE_FALLBACK,
    );
    const targets = [...new Set(accepted.map((proof) => proof.targetWorkspaceId))];
    if (targets.length !== 1) return record;
    changed = true;
    return { ...record, workspace_id: targets[0]! };
  });
  return Object.freeze({
    activeWorkspaceUsedAsEvidence: false as const,
    changed,
    records: changed ? Object.freeze(next) : records,
  });
}
