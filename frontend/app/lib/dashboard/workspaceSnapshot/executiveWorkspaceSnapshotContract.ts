/**
 * MRP:10:7 — Executive Workspace Snapshot + Daily Readiness contract.
 *
 * Read-only operational context presentation.
 * Workspace Snapshot ≠ Executive Summary. Daily Readiness ≠ Recommendations.
 */

import type { DashboardMode } from "../dashboardModeRuntimeContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import type { WorkspaceRecommendationContext } from "../../workspaces/workspaceRecommendationContract.ts";
import type { WorkspaceRecentsContextInput } from "../../workspaces/workspaceRecentsContract.ts";
import type { WorkspaceRecentReturnKind } from "../../workspaces/workspaceRecentsContract.ts";

export type WorkspaceSnapshotCardKind =
  | "active_workspace"
  | "active_object"
  | "active_workflow"
  | "operational_awareness";

export type DailyReadinessState = "ready" | "attention_recommended" | "review_pending";

export type DailyReadinessActionKind =
  | "review_recommendations"
  | "resume_session"
  | "open_analyze"
  | "open_dashboard"
  | "none";

export type WorkspaceSnapshotCardView = Readonly<{
  id: WorkspaceSnapshotCardKind;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  detail: string;
}>;

export type DailyReadinessActionView = Readonly<{
  kind: DailyReadinessActionKind;
  label: string;
  enabled: boolean;
  workspaceId: ExecutiveWorkspaceId | null;
  returnKind: WorkspaceRecentReturnKind | null;
}>;

export type DailyReadinessView = Readonly<{
  state: DailyReadinessState;
  stateLabel: string;
  summary: string;
  actions: readonly DailyReadinessActionView[];
}>;

export type ExecutiveWorkspaceSnapshotView = Readonly<{
  cards: readonly WorkspaceSnapshotCardView[];
  readiness: DailyReadinessView;
  runtimeAvailable: boolean;
  evaluatedAt: number;
  source: "executive_workspace_snapshot";
}>;

export type ExecutiveWorkspaceSnapshotInput = Readonly<{
  dashboardMode: DashboardMode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
}>;

export const DAILY_READINESS_STATE_LABELS: Readonly<Record<DailyReadinessState, string>> =
  Object.freeze({
    ready: "Workspace Ready",
    attention_recommended: "Attention Recommended",
    review_pending: "Review Pending Items",
  });

/** Reserved for future governance / intelligence integration. */
export const FUTURE_WORKSPACE_SNAPSHOT_SOURCE_SLOTS = Object.freeze([
  "strategic_planning",
  "scenario_intelligence",
  "advisory_systems",
  "operational_intelligence",
  "executive_governance",
] as const);

const loggedBrakes = new Set<string>();

export function warnWorkspaceSnapshotBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WorkspaceSnapshot][Brake]", { message, ...detail });
}

export function resetWorkspaceSnapshotBrakesForTests(): void {
  loggedBrakes.clear();
}
