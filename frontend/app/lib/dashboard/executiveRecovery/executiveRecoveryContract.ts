/**
 * MRP:10:6 — Executive Workspace Recovery contract.
 *
 * Read-only resumable context presentation. Recovery ≠ Activity Timeline.
 * Recovery ≠ Favorites. No session generation or persistence ownership.
 */

import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import type { WorkspaceRecentReturnKind } from "../../workspaces/workspaceRecentsContract.ts";

export type ExecutiveRecoveryWorkspaceKind =
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "object_investigation";

export type ExecutiveRecoveryEntryView = Readonly<{
  id: string;
  activityName: string;
  workspaceType: string;
  workspaceId: ExecutiveWorkspaceId;
  recoveryKind: ExecutiveRecoveryWorkspaceKind;
  timestamp: number;
  timestampLabel: string;
  resumeActionLabel: string;
  returnKind: WorkspaceRecentReturnKind | null;
  resumeEnabled: boolean;
  historyReference: string;
  source: "workspace_navigation_history";
}>;

export type ExecutiveWorkspaceRecoveryView = Readonly<{
  entries: readonly ExecutiveRecoveryEntryView[];
  evaluatedAt: number;
  source: "executive_workspace_recovery_layer";
}>;

export const EXECUTIVE_RECOVERY_MAX_ENTRIES = 5;

/** Reserved slots for future multi-step recovery without Dashboard Home redesign. */
export const FUTURE_EXECUTIVE_RECOVERY_SOURCE_SLOTS = Object.freeze([
  "multi_step_workflows",
  "scenario_chains",
  "advisory_sessions",
  "strategic_planning_sessions",
] as const);

const loggedBrakes = new Set<string>();

export function warnExecutiveRecoveryBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ExecutiveRecovery][Brake]", { message, ...detail });
}

export function resetExecutiveRecoveryBrakesForTests(): void {
  loggedBrakes.clear();
}
