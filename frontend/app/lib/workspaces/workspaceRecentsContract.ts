/**
 * MRP:9:4 — Workspace Recents contract.
 *
 * Recents read history. History remembers. Dashboard presents. Controller governs.
 */

import type { ExecutiveWorkspaceId } from "../dashboard/executiveWorkspaceRegistryContract.ts";
import type { WorkspaceNavigationTransitionType } from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";

export type WorkspaceRecentActivityType =
  | "workspace_launch"
  | "return_navigation"
  | "investigation_step"
  | "passive_pause"
  | "passive_resume"
  | "audit_failure";

export type WorkspaceRecentReturnKind = "back_via_history" | "forward_via_launch";

/** Generic recent entry — no workspace-specific UI fields. */
export type WorkspaceRecentItemView = Readonly<{
  id: string;
  workspaceId: ExecutiveWorkspaceId;
  workspaceName: string;
  timestamp: number;
  activityType: WorkspaceRecentActivityType;
  contextSummary: string;
  historyReference: string;
  returnKind: WorkspaceRecentReturnKind | null;
  returnable: boolean;
  isActive: boolean;
  isBackStackHead: boolean;
}>;

export type WorkspaceRecentsRetentionPolicy = Readonly<{
  maxRecentEntries?: number;
}>;

export type WorkspaceRecentsContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  retention?: WorkspaceRecentsRetentionPolicy;
}>;

export type WorkspaceRecentsStateView = Readonly<{
  items: readonly WorkspaceRecentItemView[];
  recentPath: readonly ExecutiveWorkspaceId[];
  backStack: readonly ExecutiveWorkspaceId[];
  currentWorkspaceId: ExecutiveWorkspaceId | null;
  retentionLimit: number;
  evaluatedAt: number;
  source: "workspace_recents_registry";
}>;

export type WorkspaceRecentReturnValidation = Readonly<{
  approved: boolean;
  workspaceId: ExecutiveWorkspaceId | null;
  returnKind: WorkspaceRecentReturnKind | null;
  reason: string;
}>;

const loggedBrakes = new Set<string>();

function logBrake(prefix: string, message: string, detail: Readonly<Record<string, unknown>> = {}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${prefix}:${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.(prefix, { message, ...detail });
}

export function warnWorkspaceRecentsBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceRecents][Brake]", message, detail);
}

export function warnWorkspaceReturnPathBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceReturnPath][Brake]", message, detail);
}

export function warnRecentsHistoryAuthorityBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[RecentsHistoryAuthority][Brake]", message, detail);
}

export function warnRecentsWorkspaceAuthorityBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[RecentsWorkspaceAuthority][Brake]", message, detail);
}

export function warnRecentsRetentionBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[RecentsRetention][Brake]", message, detail);
}

export function resetWorkspaceRecentsBrakesForTests(): void {
  loggedBrakes.clear();
}

export function mapTransitionToActivityType(
  transitionType: WorkspaceNavigationTransitionType
): WorkspaceRecentActivityType {
  switch (transitionType) {
    case "back":
      return "return_navigation";
    case "passive_pause":
      return "passive_pause";
    case "passive_resume":
      return "passive_resume";
    case "audit_failure":
      return "audit_failure";
    default:
      return "workspace_launch";
  }
}
