/**
 * MRP:9:4 — Workspace Recents Registry.
 *
 * Read-oriented projection of navigation history. Never mutates history.
 */

import {
  getExecutiveWorkspaceEntry,
  validateExecutiveWorkspaceOpenRequest,
  type ExecutiveWorkspaceId,
} from "../dashboard/executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import {
  DEFAULT_WORKSPACE_HISTORY_DEPTH,
  type WorkspaceNavigationHistoryEntry,
} from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import {
  getWorkspaceNavigationHistoryEntries,
  getWorkspaceNavigationSummary,
  peekWorkspaceBackStackTarget,
} from "../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  mapTransitionToActivityType,
  warnRecentsHistoryAuthorityBrake,
  warnRecentsRetentionBrake,
  warnRecentsWorkspaceAuthorityBrake,
  warnWorkspaceRecentsBrake,
  warnWorkspaceReturnPathBrake,
  type WorkspaceRecentItemView,
  type WorkspaceRecentReturnKind,
  type WorkspaceRecentReturnValidation,
  type WorkspaceRecentsContextInput,
  type WorkspaceRecentsStateView,
} from "./workspaceRecentsContract.ts";

function resolveRetentionLimit(input: WorkspaceRecentsContextInput): number {
  const configured = input.retention?.maxRecentEntries;
  if (typeof configured === "number" && configured > 0) {
    return configured;
  }
  const summary = getWorkspaceNavigationSummary();
  return summary.maxDepth > 0 ? summary.maxDepth : DEFAULT_WORKSPACE_HISTORY_DEPTH;
}

function buildContextSummary(
  entry: WorkspaceNavigationHistoryEntry,
  objectLabel: string | null
): string {
  const label = objectLabel?.trim();
  const name = entry.workspaceName;

  if (entry.transitionType === "back") {
    return label ? `Returned to ${name} — ${label}` : `Returned to ${name}`;
  }

  switch (entry.workspaceId) {
    case "analyze":
      return label ? `Analyzed ${label}` : `Opened ${name}`;
    case "compare":
      return label ? `Compared ${label}` : "Compared demand scenarios";
    case "scenario":
      return label ? `Opened scenario for ${label}` : "Opened scenario simulation";
    case "war_room":
      return label ? `Reviewed war room for ${label}` : "Reviewed war room session";
    case "focus":
      return label ? `Focused on ${label}` : `Focused in ${name}`;
    case "risk":
      return label ? `Investigated risk: ${label}` : "Investigated risk object";
    default:
      return label ? `Opened ${name} — ${label}` : `Opened ${name}`;
  }
}

function resolveReturnKind(input: {
  workspaceId: ExecutiveWorkspaceId;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  backStackHead: ExecutiveWorkspaceId | null;
}): WorkspaceRecentReturnKind | null {
  if (input.activeWorkspaceId === input.workspaceId) return null;
  if (input.backStackHead === input.workspaceId) return "back_via_history";
  return "forward_via_launch";
}

function buildRecentItem(input: {
  entry: WorkspaceNavigationHistoryEntry;
  objectLabel: string | null;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  backStackHead: ExecutiveWorkspaceId | null;
}): WorkspaceRecentItemView {
  const historyReference = `${input.entry.timestamp}:${input.entry.workspaceId}:${input.entry.transitionType}`;
  const returnKind = resolveReturnKind({
    workspaceId: input.entry.workspaceId,
    activeWorkspaceId: input.activeWorkspaceId,
    backStackHead: input.backStackHead,
  });
  const registryValid = validateExecutiveWorkspaceOpenRequest({
    workspaceId: input.entry.workspaceId,
  }).valid;

  return Object.freeze({
    id: historyReference,
    workspaceId: input.entry.workspaceId,
    workspaceName: input.entry.workspaceName,
    timestamp: input.entry.timestamp,
    activityType: mapTransitionToActivityType(input.entry.transitionType),
    contextSummary: buildContextSummary(input.entry, input.objectLabel),
    historyReference,
    returnKind,
    returnable: returnKind !== null && registryValid,
    isActive: input.activeWorkspaceId === input.entry.workspaceId,
    isBackStackHead: input.backStackHead === input.entry.workspaceId,
  });
}

export function buildWorkspaceRecentsView(
  input: WorkspaceRecentsContextInput = {}
): WorkspaceRecentsStateView {
  initializeExecutiveWorkspaceRegistry();
  const summary = getWorkspaceNavigationSummary();
  const retentionLimit = resolveRetentionLimit(input);
  const activeWorkspaceId = input.activeWorkspaceId ?? summary.currentWorkspaceId ?? null;
  const backStackHead = peekWorkspaceBackStackTarget();
  const objectLabel = input.selectedObjectLabel?.trim() || null;

  const entries = getWorkspaceNavigationHistoryEntries();
  if (entries.length > retentionLimit) {
    warnRecentsRetentionBrake("Recents trimmed to retention limit.", {
      entries: entries.length,
      retentionLimit,
    });
  }

  const trimmed = entries.slice(-retentionLimit);
  const items = trimmed
    .slice()
    .reverse()
    .map((entry) =>
      buildRecentItem({
        entry,
        objectLabel,
        activeWorkspaceId,
        backStackHead,
      })
    );

  const deduped: WorkspaceRecentItemView[] = [];
  const seenIds = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    deduped.push(item);
  }

  return Object.freeze({
    items: Object.freeze(deduped),
    recentPath: summary.recentPath,
    backStack: summary.backStack,
    currentWorkspaceId: activeWorkspaceId,
    retentionLimit,
    evaluatedAt: Date.now(),
    source: "workspace_recents_registry",
  });
}

export function previewRecentReturnPath(input: {
  workspaceId: ExecutiveWorkspaceId;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): WorkspaceRecentReturnValidation {
  initializeExecutiveWorkspaceRegistry();
  const summary = getWorkspaceNavigationSummary();
  const activeWorkspaceId = input.activeWorkspaceId ?? summary.currentWorkspaceId ?? null;
  const backStackHead = peekWorkspaceBackStackTarget();

  if (activeWorkspaceId === input.workspaceId) {
    return Object.freeze({
      approved: false,
      workspaceId: input.workspaceId,
      returnKind: null,
      reason: "already_active",
    });
  }

  const entry = getExecutiveWorkspaceEntry(input.workspaceId);
  if (!entry || entry.availability !== "available") {
    return Object.freeze({
      approved: false,
      workspaceId: input.workspaceId,
      returnKind: null,
      reason: "invalid_workspace",
    });
  }

  const registryValidation = validateExecutiveWorkspaceOpenRequest({ workspaceId: input.workspaceId });
  if (!registryValidation.valid) {
    return Object.freeze({
      approved: false,
      workspaceId: input.workspaceId,
      returnKind: null,
      reason: registryValidation.reason,
    });
  }

  const requiresObject = Boolean(entry.objectPanelAction);
  const hasObject = Boolean(input.selectedObjectId?.trim());
  if (requiresObject && !hasObject) {
    return Object.freeze({
      approved: false,
      workspaceId: input.workspaceId,
      returnKind: null,
      reason: "missing_object",
    });
  }

  if (backStackHead === input.workspaceId) {
    return Object.freeze({
      approved: true,
      workspaceId: input.workspaceId,
      returnKind: "back_via_history",
      reason: "back_return_approved",
    });
  }

  const inRecentPath = summary.recentPath.includes(input.workspaceId);
  if (!inRecentPath && !summary.backStack.includes(input.workspaceId)) {
    return Object.freeze({
      approved: false,
      workspaceId: input.workspaceId,
      returnKind: null,
      reason: "not_in_recents",
    });
  }

  return Object.freeze({
    approved: true,
    workspaceId: input.workspaceId,
    returnKind: "forward_via_launch",
    reason: "forward_return_approved",
  });
}

export function validateRecentReturnPath(input: {
  workspaceId: ExecutiveWorkspaceId;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): WorkspaceRecentReturnValidation {
  const result = previewRecentReturnPath(input);
  if (result.approved) return result;

  if (result.reason === "already_active") {
    warnRecentsWorkspaceAuthorityBrake("Already active workspace.", { workspaceId: input.workspaceId });
  } else if (result.reason === "invalid_workspace") {
    warnWorkspaceRecentsBrake("Invalid recent workspace.", { workspaceId: input.workspaceId });
  } else if (result.reason === "missing_object") {
    warnRecentsWorkspaceAuthorityBrake("Missing object for return.", { workspaceId: input.workspaceId });
  } else if (result.reason === "not_in_recents") {
    warnWorkspaceReturnPathBrake("Workspace not in recent history.", { workspaceId: input.workspaceId });
  } else {
    warnRecentsWorkspaceAuthorityBrake("Registry rejected return.", {
      workspaceId: input.workspaceId,
      reason: result.reason,
    });
  }

  return result;
}

export function assertRecentsCannotMutateHistory(operation: string): void {
  warnRecentsHistoryAuthorityBrake("Unauthorized history mutation blocked.", { operation });
}
