/**
 * MRP:8:4 — Executive Workspace Navigation History runtime.
 *
 * Tracks back stack and navigation sequence. Never executes transitions.
 */

import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import { getActiveWorkspaceLifecycleState } from "./executiveWorkspaceLifecycleRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
  requestExecutiveWorkspaceTransition,
} from "./executiveWorkspaceTransitionControllerRuntime.ts";
import {
  buildWorkspaceNavigationHistoryEntry,
  DEFAULT_WORKSPACE_HISTORY_DEPTH,
  resetExecutiveWorkspaceNavigationHistoryForTests,
  trimHistoryToDepth,
  validateBackNavigationTarget,
  warnWorkspaceHistoryBrake,
  type WorkspaceNavigationHistoryEntry,
  type WorkspaceNavigationHistorySummary,
  type WorkspaceNavigationTransitionType,
} from "./executiveWorkspaceNavigationHistoryContract.ts";

let historyInitialized = false;
let maxDepth = DEFAULT_WORKSPACE_HISTORY_DEPTH;
const backStack: ExecutiveWorkspaceId[] = [];
const historyLog: WorkspaceNavigationHistoryEntry[] = [];
const recentPath: ExecutiveWorkspaceId[] = [];
let pendingBackTarget: ExecutiveWorkspaceId | null = null;
let lastRecordedOrigin: ExecutiveWorkspaceId | null = null;

export function resetExecutiveWorkspaceNavigationHistoryRuntimeForTests(): void {
  historyInitialized = false;
  maxDepth = DEFAULT_WORKSPACE_HISTORY_DEPTH;
  backStack.length = 0;
  historyLog.length = 0;
  recentPath.length = 0;
  pendingBackTarget = null;
  lastRecordedOrigin = null;
  resetExecutiveWorkspaceNavigationHistoryForTests();
}

export function initializeExecutiveWorkspaceNavigationHistory(
  options: { maxDepth?: number } = {}
): Readonly<{ maxDepth: number; entryCount: number }> {
  if (options.maxDepth && options.maxDepth > 0) {
    maxDepth = options.maxDepth;
  }
  historyInitialized = true;
  return Object.freeze({ maxDepth, entryCount: historyLog.length });
}

function ensureInitialized(): void {
  if (!historyInitialized) {
    initializeExecutiveWorkspaceNavigationHistory();
  }
}

function pushBackStack(workspaceId: ExecutiveWorkspaceId): void {
  if (backStack[0] === workspaceId) return;
  backStack.unshift(workspaceId);
  while (backStack.length > maxDepth) {
    backStack.pop();
  }
}

function appendRecentPath(workspaceId: ExecutiveWorkspaceId): void {
  if (recentPath[recentPath.length - 1] === workspaceId) return;
  recentPath.push(workspaceId);
  while (recentPath.length > maxDepth) {
    recentPath.shift();
  }
}

function appendHistoryEntry(entry: WorkspaceNavigationHistoryEntry): void {
  historyLog.push(entry);
  while (historyLog.length > maxDepth) {
    historyLog.shift();
  }
}

export function recordWorkspaceNavigationCommit(input: {
  originWorkspaceId: ExecutiveWorkspaceId | null;
  targetWorkspaceId: ExecutiveWorkspaceId;
  transitionType?: WorkspaceNavigationTransitionType;
}): WorkspaceNavigationHistoryEntry {
  ensureInitialized();
  const lifecycle = getActiveWorkspaceLifecycleState();
  const transitionType = input.transitionType ?? "forward";

  if (transitionType === "forward" && input.originWorkspaceId) {
    pushBackStack(input.originWorkspaceId);
  }

  if (transitionType === "back" && pendingBackTarget === input.targetWorkspaceId) {
    const index = backStack.indexOf(input.targetWorkspaceId);
    if (index >= 0) {
      backStack.splice(index, 1);
    }
    pendingBackTarget = null;
  }

  appendRecentPath(input.targetWorkspaceId);

  const entry = buildWorkspaceNavigationHistoryEntry({
    workspaceId: input.targetWorkspaceId,
    transitionType,
    originWorkspaceId: input.originWorkspaceId,
    targetWorkspaceId: input.targetWorkspaceId,
    lifecycleSnapshot: lifecycle?.currentState ?? null,
  });

  appendHistoryEntry(entry);
  lastRecordedOrigin = input.originWorkspaceId;

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[WorkspaceHistory][Record]", {
      type: transitionType,
      from: input.originWorkspaceId,
      to: input.targetWorkspaceId,
      backStackDepth: backStack.length,
    });
  }

  return entry;
}

export function recordWorkspaceNavigationAuditFailure(input: {
  originWorkspaceId: ExecutiveWorkspaceId | null;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  reason: string;
}): WorkspaceNavigationHistoryEntry | null {
  ensureInitialized();
  if (!input.targetWorkspaceId) return null;

  const entry = buildWorkspaceNavigationHistoryEntry({
    workspaceId: input.targetWorkspaceId,
    transitionType: "audit_failure",
    originWorkspaceId: input.originWorkspaceId,
    targetWorkspaceId: input.targetWorkspaceId,
    lifecycleSnapshot: null,
  });

  appendHistoryEntry(entry);
  warnWorkspaceHistoryBrake("Transition mismatch.", { reason: input.reason });
  return entry;
}

export function getWorkspaceNavigationBackStack(): readonly ExecutiveWorkspaceId[] {
  ensureInitialized();
  return Object.freeze([...backStack]);
}

export function peekWorkspaceBackStackTarget(): ExecutiveWorkspaceId | null {
  ensureInitialized();
  return backStack[0] ?? null;
}

export function getWorkspaceNavigationSummary(): WorkspaceNavigationHistorySummary {
  ensureInitialized();
  const active = getActiveWorkspaceLifecycleState();
  const currentId = active?.workspaceId ?? null;

  return Object.freeze({
    currentWorkspaceId: currentId,
    previousWorkspaceId: backStack[0] ?? lastRecordedOrigin ?? null,
    backStack: Object.freeze([...backStack]),
    recentPath: Object.freeze([...recentPath]),
    entryCount: historyLog.length,
    maxDepth,
    source: "workspace_navigation_history",
  });
}

/** Read-only history log access for recents projection (MRP:9:4). */
export function getWorkspaceNavigationHistoryEntries(): readonly WorkspaceNavigationHistoryEntry[] {
  ensureInitialized();
  return Object.freeze([...historyLog]);
}

export function requestExecutiveWorkspaceBackNavigation(): Readonly<{
  approved: boolean;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  reason: string;
}> {
  ensureInitialized();
  const target = peekWorkspaceBackStackTarget();
  const validation = validateBackNavigationTarget(target);
  if (!validation.valid || !validation.targetWorkspaceId) {
    return Object.freeze({
      approved: false,
      targetWorkspaceId: null,
      reason: validation.reason,
    });
  }

  pendingBackTarget = validation.targetWorkspaceId;
  const transition = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: validation.targetWorkspaceId,
    source: "dashboard_direct",
  });

  if (!transition.approved) {
    pendingBackTarget = null;
    recordWorkspaceNavigationAuditFailure({
      originWorkspaceId: getActiveWorkspaceLifecycleState()?.workspaceId ?? null,
      targetWorkspaceId: validation.targetWorkspaceId,
      reason: transition.reason,
    });
    return Object.freeze({
      approved: false,
      targetWorkspaceId: null,
      reason: transition.reason,
    });
  }

  return Object.freeze({
    approved: true,
    targetWorkspaceId: validation.targetWorkspaceId,
    reason: "back_navigation_approved",
  });
}

export function commitExecutiveWorkspaceBackNavigation(
  targetWorkspaceId: ExecutiveWorkspaceId
): Readonly<{
  committed: boolean;
  reason: string;
}> {
  ensureInitialized();

  if (pendingBackTarget && pendingBackTarget !== targetWorkspaceId) {
    warnWorkspaceHistoryBrake("Transition mismatch.", {
      pending: pendingBackTarget,
      received: targetWorkspaceId,
    });
    return Object.freeze({ committed: false, reason: "transition_mismatch" });
  }

  const origin = getActiveWorkspaceLifecycleState()?.workspaceId ?? null;
  const commit = commitExecutiveWorkspaceTransition(targetWorkspaceId);
  if (!commit.approved) {
    pendingBackTarget = null;
    recordWorkspaceNavigationAuditFailure({
      originWorkspaceId: origin,
      targetWorkspaceId,
      reason: commit.reason,
    });
    return Object.freeze({ committed: false, reason: commit.reason });
  }

  recordWorkspaceNavigationCommit({
    originWorkspaceId: origin,
    targetWorkspaceId,
    transitionType: "back",
  });

  return Object.freeze({ committed: true, reason: "back_navigation_committed" });
}

export function recordForwardNavigationAfterCommit(input: {
  originWorkspaceId: ExecutiveWorkspaceId | null;
  targetWorkspaceId: ExecutiveWorkspaceId;
}): void {
  recordWorkspaceNavigationCommit({
    originWorkspaceId: input.originWorkspaceId,
    targetWorkspaceId: input.targetWorkspaceId,
    transitionType: "forward",
  });
}
