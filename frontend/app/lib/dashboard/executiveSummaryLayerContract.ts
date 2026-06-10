/**
 * MRP:10:2 — Executive Summary Layer contract.
 *
 * Read-only presentation aggregation for Dashboard Home. No state ownership.
 */

import type { DashboardMode } from "./dashboardModeRuntimeContract.ts";
import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import type { ExecutiveWorkspaceLifecycleState } from "./executiveWorkspaceLifecycleContract.ts";
import type { WorkspaceRecommendationContext } from "../workspaces/workspaceRecommendationContract.ts";
import type { WorkspaceRecentsContextInput } from "../workspaces/workspaceRecentsContract.ts";

export type DashboardHomeSummaryCardKind =
  | "active_workspace"
  | "selected_object"
  | "executive_attention"
  | "navigation_health"
  | "system_status";

/** Reserved slots for future summary cards — no UI until wired. */
export const FUTURE_EXECUTIVE_SUMMARY_CARD_SLOTS = Object.freeze([
  "risk_summary",
  "scenario_summary",
  "operational_summary",
  "executive_briefing_summary",
] as const);

export type FutureExecutiveSummaryCardSlot = (typeof FUTURE_EXECUTIVE_SUMMARY_CARD_SLOTS)[number];

export type DashboardHomeSummaryCardView = Readonly<{
  id: DashboardHomeSummaryCardKind;
  title: string;
  primaryValue: string;
  secondaryValue: string;
  detail: string;
  tone: "neutral" | "accent" | "warning" | "muted";
}>;

export type DashboardHomeSummaryLayerView = Readonly<{
  cards: readonly DashboardHomeSummaryCardView[];
  evaluatedAt: number;
  source: "executive_summary_layer";
}>;

export type DashboardHomeSummaryLayerInput = Readonly<{
  dashboardMode: DashboardMode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  favoritesCount?: number;
  recommendationContext?: WorkspaceRecommendationContext;
  recentsContext?: WorkspaceRecentsContextInput;
}>;

export type ExecutiveSummaryActiveWorkspaceCardData = Readonly<{
  workspaceName: string;
  lifecycleState: ExecutiveWorkspaceLifecycleState | null;
  dashboardModeLabel: string;
}>;

export type ExecutiveSummarySelectedObjectCardData = Readonly<{
  objectName: string;
  objectType: string;
  objectStatus: string;
  hasSelection: boolean;
}>;

export type ExecutiveSummaryAttentionCardData = Readonly<{
  unresolvedNotices: number;
  activeRecommendations: number;
  recentActions: number;
}>;

export type ExecutiveSummaryNavigationHealthCardData = Readonly<{
  currentRoute: string;
  dashboardModeLabel: string;
  lastTransition: string;
}>;

export type ExecutiveSummarySystemStatusCardData = Readonly<{
  runtimeHealthy: boolean;
  warningsPresent: number;
  diagnosticsActive: boolean;
}>;
