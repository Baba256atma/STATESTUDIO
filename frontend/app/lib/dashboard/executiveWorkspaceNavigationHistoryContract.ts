/**
 * MRP:8:4 — Executive Workspace Back Stack + Navigation History contract.
 *
 * History remembers. Controller validates. Dashboard executes.
 * History is observational only — never execution authority.
 */

import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import { getExecutiveWorkspaceEntry } from "./executiveWorkspaceRegistryContract.ts";
import type { ExecutiveWorkspaceLifecycleState } from "./executiveWorkspaceLifecycleContract.ts";

export const DEFAULT_WORKSPACE_HISTORY_DEPTH = 10;

export type WorkspaceNavigationTransitionType =
  | "forward"
  | "back"
  | "passive_pause"
  | "passive_resume"
  | "audit_failure";

export type WorkspaceNavigationHistoryEntry = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  workspaceName: string;
  transitionType: WorkspaceNavigationTransitionType;
  timestamp: number;
  originWorkspaceId: ExecutiveWorkspaceId | null;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  lifecycleSnapshot: ExecutiveWorkspaceLifecycleState | null;
  source: "workspace_navigation_history";
}>;

export type WorkspaceNavigationHistorySummary = Readonly<{
  currentWorkspaceId: ExecutiveWorkspaceId | null;
  previousWorkspaceId: ExecutiveWorkspaceId | null;
  backStack: readonly ExecutiveWorkspaceId[];
  recentPath: readonly ExecutiveWorkspaceId[];
  entryCount: number;
  maxDepth: number;
  source: "workspace_navigation_history";
}>;

export type WorkspaceBackNavigationValidationResult = Readonly<{
  valid: boolean;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  reason: string;
}>;

/** Reserved future workspace IDs for history expansion — placeholder only. */
export const FUTURE_NAVIGATION_HISTORY_WORKSPACE_IDS = Object.freeze([
  "timeline",
  "risk",
  "decision_center",
  "simulation",
  "governance",
  "optimization",
  "forecasting",
  "recommendations",
] as const);

const loggedBrakes = new Set<string>();

export function warnWorkspaceHistoryBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WorkspaceHistory][Brake]", { message, ...detail });
}

export function resetExecutiveWorkspaceNavigationHistoryForTests(): void {
  loggedBrakes.clear();
}

export function buildWorkspaceNavigationHistoryEntry(input: {
  workspaceId: ExecutiveWorkspaceId;
  transitionType: WorkspaceNavigationTransitionType;
  timestamp?: number;
  originWorkspaceId?: ExecutiveWorkspaceId | null;
  targetWorkspaceId?: ExecutiveWorkspaceId | null;
  lifecycleSnapshot?: ExecutiveWorkspaceLifecycleState | null;
}): WorkspaceNavigationHistoryEntry {
  const entry = getExecutiveWorkspaceEntry(input.workspaceId);
  return Object.freeze({
    workspaceId: input.workspaceId,
    workspaceName: entry.name,
    transitionType: input.transitionType,
    timestamp: input.timestamp ?? Date.now(),
    originWorkspaceId: input.originWorkspaceId ?? null,
    targetWorkspaceId: input.targetWorkspaceId ?? null,
    lifecycleSnapshot: input.lifecycleSnapshot ?? null,
    source: "workspace_navigation_history",
  });
}

export function validateBackNavigationTarget(
  targetWorkspaceId: ExecutiveWorkspaceId | null
): WorkspaceBackNavigationValidationResult {
  if (!targetWorkspaceId) {
    warnWorkspaceHistoryBrake("Missing workspace.");
    return Object.freeze({ valid: false, targetWorkspaceId: null, reason: "missing_workspace" });
  }

  const entry = getExecutiveWorkspaceEntry(targetWorkspaceId);
  if (!entry) {
    warnWorkspaceHistoryBrake("Missing workspace.", { targetWorkspaceId });
    return Object.freeze({ valid: false, targetWorkspaceId: null, reason: "missing_workspace" });
  }

  if (entry.availability === "future" || entry.availability === "deprecated") {
    warnWorkspaceHistoryBrake("Transition mismatch.", {
      targetWorkspaceId,
      availability: entry.availability,
    });
    return Object.freeze({
      valid: false,
      targetWorkspaceId,
      reason: "transition_mismatch",
    });
  }

  return Object.freeze({
    valid: true,
    targetWorkspaceId,
    reason: "back_navigation_validated",
  });
}

export function trimHistoryToDepth<T>(
  entries: readonly T[],
  maxDepth: number
): readonly T[] {
  if (entries.length <= maxDepth) return entries;
  warnWorkspaceHistoryBrake("History overflow.", {
    length: entries.length,
    maxDepth,
  });
  return Object.freeze(entries.slice(entries.length - maxDepth));
}

export function assertHistoryCannotMutateWorkspace(mutationKind: string): void {
  warnWorkspaceHistoryBrake("Unauthorized history mutation.", { mutationKind });
}
