/**
 * MRP:10:5 — Executive Continuity + Recent Activity Timeline contract.
 *
 * Read-only presentation shapes. No state ownership, no event generation.
 * Dashboard Home Timeline ≠ Scene Timeline — separate products.
 */

import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import type { WorkspaceRecentReturnKind } from "../../workspaces/workspaceRecentsContract.ts";

export type ExecutiveActivityCategory =
  | "navigation"
  | "workspace"
  | "object"
  | "recommendation"
  | "scenario"
  | "war_room";

export type ExecutiveActivityActionKind = "reopen" | "review" | "continue" | "none";

export type ExecutiveActivityTimelineEntryView = Readonly<{
  id: string;
  title: string;
  activityCategory: ExecutiveActivityCategory;
  timestamp: number;
  timestampLabel: string;
  relatedWorkspaceId: ExecutiveWorkspaceId | null;
  relatedWorkspaceName: string | null;
  relatedObjectId: string | null;
  relatedObjectLabel: string | null;
  actionKind: ExecutiveActivityActionKind;
  actionLabel: string | null;
  returnKind: WorkspaceRecentReturnKind | null;
  actionEnabled: boolean;
  historyReference: string;
  source: "workspace_navigation_history";
}>;

export type ExecutiveContinuitySummaryView = Readonly<{
  narrative: string;
  isEmpty: boolean;
  dominantWorkspaceNames: readonly string[];
  activityCount: number;
}>;

export type ExecutiveActivityTimelineView = Readonly<{
  continuity: ExecutiveContinuitySummaryView;
  entries: readonly ExecutiveActivityTimelineEntryView[];
  evaluatedAt: number;
  source: "executive_continuity_layer";
}>;

export const EXECUTIVE_ACTIVITY_TIMELINE_MIN_DISPLAY = 5;
export const EXECUTIVE_ACTIVITY_TIMELINE_MAX_DISPLAY = 15;

export const EXECUTIVE_ACTIVITY_CATEGORY_LABELS: Readonly<
  Record<ExecutiveActivityCategory, string>
> = Object.freeze({
  navigation: "Navigation",
  workspace: "Workspace",
  object: "Object",
  recommendation: "Recommendation",
  scenario: "Scenario",
  war_room: "War Room",
});

/** Reserved slots for future event sources without Dashboard Home redesign. */
export const FUTURE_EXECUTIVE_ACTIVITY_SOURCE_SLOTS = Object.freeze([
  "strategic_planning_events",
  "advisory_events",
  "simulation_sessions",
  "executive_briefings",
  "operational_intelligence_sessions",
] as const);

const loggedBrakes = new Set<string>();

export function warnExecutiveContinuityBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[ExecutiveContinuity][Brake]", { message, ...detail });
}

export function resetExecutiveContinuityBrakesForTests(): void {
  loggedBrakes.clear();
}
