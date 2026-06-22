/**
 * MRP-STAB-1 — dashboard commit deduplication before dispatch.
 */

import type { DashboardContextRouteResult } from "../dashboard/dashboardContextRouter.ts";
import {
  reduceNexoraWorkspaceState,
  type NexoraWorkspaceAction,
  type NexoraWorkspaceState,
} from "../workspace/nexoraWorkspaceStateContract.ts";
import {
  buildMrpStateSignature,
  buildMrpStateSnapshot,
  isMeaningfulWorkspaceCommit,
  type MrpStateSnapshot,
} from "./mrpStateChangeContract.ts";
import { devLogOnSignatureChange } from "./diagnosticIdleGate.ts";

export function buildMrpStateSnapshotFromWorkspace(
  workspace: NexoraWorkspaceState,
  extras?: {
    surfaceId?: string | null;
    workspaceId?: string | null;
    view?: string | null;
    contextId?: string | null;
  }
): MrpStateSnapshot {
  return buildMrpStateSnapshot({
    view: extras?.view ?? null,
    tab: workspace.activeMRPTab ?? null,
    dashboardContext: workspace.dashboardContext ?? null,
    dashboardMode: workspace.dashboardMode ?? null,
    surfaceId: extras?.surfaceId ?? null,
    contextId: extras?.contextId ?? null,
    selectedObjectId: workspace.selectedObjectId ?? null,
    workspaceId: extras?.workspaceId ?? null,
  });
}

export function predictWorkspaceStateAfterActions(
  state: NexoraWorkspaceState,
  actions: readonly NexoraWorkspaceAction[]
): NexoraWorkspaceState {
  return actions.reduce(reduceNexoraWorkspaceState, state);
}

export type MrpWorkspaceCommitEvaluation = Readonly<{
  shouldCommit: boolean;
  reason: "same_state" | "meaningful_change";
  previousSignature: string;
  nextSignature: string;
  previous: MrpStateSnapshot;
  next: MrpStateSnapshot;
}>;

export function evaluateMrpWorkspaceCommit(input: {
  currentWorkspace: NexoraWorkspaceState;
  routeResult: Pick<DashboardContextRouteResult, "surfaceId" | "workspaceActions">;
  workspaceId?: string | null;
  view?: string | null;
  contextId?: string | null;
}): MrpWorkspaceCommitEvaluation {
  const previous = buildMrpStateSnapshotFromWorkspace(input.currentWorkspace, {
    workspaceId: input.workspaceId ?? null,
    view: input.view ?? null,
    contextId: input.contextId ?? null,
  });
  const predictedWorkspace = predictWorkspaceStateAfterActions(
    input.currentWorkspace,
    input.routeResult.workspaceActions
  );
  const next = buildMrpStateSnapshotFromWorkspace(predictedWorkspace, {
    surfaceId: input.routeResult.surfaceId,
    workspaceId: input.workspaceId ?? null,
    view: input.view ?? null,
    contextId: input.contextId ?? null,
  });
  const meaningful = isMeaningfulWorkspaceCommit(previous, next);
  return Object.freeze({
    shouldCommit: meaningful,
    reason: meaningful ? "meaningful_change" : "same_state",
    previousSignature: buildMrpStateSignature(previous),
    nextSignature: buildMrpStateSignature(next),
    previous,
    next,
  });
}

export function logMrpWriteSkipped(
  reason: string,
  signature: string,
  detail?: Record<string, unknown>
): void {
  devLogOnSignatureChange(
    "[NEXORA_RIGHT_PANEL_WRITE_SKIPPED]",
    signature,
    { reason, signature, ...detail },
    "warn"
  );
}
