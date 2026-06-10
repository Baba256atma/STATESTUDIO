/**
 * MRP:10:1 — Dashboard Home Surface runtime.
 *
 * Aggregates registry, lifecycle, and history metadata for the home landing view.
 * Does not launch workspaces or mutate navigation state.
 */

import { dashboardModeLabel, type DashboardMode } from "./dashboardModeRuntimeContract.ts";
import {
  getExecutiveWorkspaceEntry,
  type ExecutiveWorkspaceId,
} from "./executiveWorkspaceRegistryContract.ts";
import { getActiveWorkspaceLifecycleState } from "./executiveWorkspaceLifecycleRuntime.ts";
import { getWorkspaceNavigationSummary } from "./executiveWorkspaceNavigationHistoryRuntime.ts";
import { evaluateWorkspaceRecommendations } from "../workspaces/workspaceRecommendationEngine.ts";
import type { WorkspaceRecommendationContext } from "../workspaces/workspaceRecommendationContract.ts";
import type {
  DashboardHomeIntelligenceCard,
  DashboardHomeStatusView,
  DashboardHomeSurfaceView,
} from "./dashboardHomeSurfaceContract.ts";

export function buildDashboardHomeStatusView(input: {
  dashboardMode: DashboardMode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
}): DashboardHomeStatusView {
  const navigation = getWorkspaceNavigationSummary();
  const activeLifecycle = getActiveWorkspaceLifecycleState();
  const resolvedActiveId =
    input.activeWorkspaceId ?? navigation.currentWorkspaceId ?? activeLifecycle?.workspaceId ?? null;
  const activeEntry = resolvedActiveId ? getExecutiveWorkspaceEntry(resolvedActiveId) : null;
  const selectedObjectId = input.selectedObjectId?.trim() || null;
  const selectedObjectLabel = input.selectedObjectLabel?.trim() || null;

  return Object.freeze({
    dashboardMode: input.dashboardMode,
    dashboardModeLabel: dashboardModeLabel(input.dashboardMode),
    activeWorkspaceId: resolvedActiveId,
    activeWorkspaceName: activeEntry?.name ?? (input.dashboardMode === "overview" ? "Dashboard Home" : null),
    activeWorkspaceLifecycle: activeLifecycle?.currentState ?? null,
    selectedObjectId,
    selectedObjectLabel,
    navigationCurrentWorkspaceId: navigation.currentWorkspaceId,
    navigationRecentPath: navigation.recentPath,
    navigationBackStackDepth: navigation.backStack.length,
    hasSelectedObject: Boolean(selectedObjectId),
    isHomeMode: input.dashboardMode === "overview",
    source: "dashboard_home_surface",
  });
}

function buildIntelligenceCards(
  status: DashboardHomeStatusView,
  recommendedNextAction: string | null
): readonly DashboardHomeIntelligenceCard[] {
  const recentWorkspaceId = status.navigationRecentPath[0] ?? status.navigationCurrentWorkspaceId;
  const recentEntry = recentWorkspaceId ? getExecutiveWorkspaceEntry(recentWorkspaceId) : null;

  return Object.freeze([
    Object.freeze({
      id: "active_workspace",
      label: "Active Workspace",
      value: status.activeWorkspaceName ?? "Dashboard Home",
      detail: status.activeWorkspaceLifecycle
        ? `Lifecycle: ${status.activeWorkspaceLifecycle}`
        : "No dedicated workspace active",
    }),
    Object.freeze({
      id: "recent_workspace",
      label: "Recent Workspace",
      value: recentEntry?.name ?? "None yet",
      detail:
        status.navigationBackStackDepth > 0
          ? `${status.navigationBackStackDepth} step(s) in back stack`
          : "Navigation history will appear here",
    }),
    Object.freeze({
      id: "recommended_action",
      label: "Recommended Next Action",
      value: recommendedNextAction ?? "Review navigation guidance",
      detail: "Advisory placeholder — no AI engine",
    }),
    Object.freeze({
      id: "selected_object",
      label: "Selected Object Context",
      value: status.selectedObjectLabel ?? status.selectedObjectId ?? "No active object selected",
      detail: status.hasSelectedObject
        ? "Object context available for workspace launches"
        : "Select a scene object to unlock object-scoped workspaces",
    }),
  ]);
}

export function buildDashboardHomeSurfaceView(input: {
  dashboardMode: DashboardMode;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  recommendationContext?: WorkspaceRecommendationContext;
}): DashboardHomeSurfaceView {
  const status = buildDashboardHomeStatusView(input);
  const recommendations = evaluateWorkspaceRecommendations({
    ...(input.recommendationContext ?? {}),
    activeWorkspaceId: status.activeWorkspaceId,
    selectedObjectId: status.selectedObjectId ?? input.recommendationContext?.selectedObjectId,
    selectedObjectLabel: status.selectedObjectLabel ?? input.recommendationContext?.selectedObjectLabel,
  });
  const topRecommendation = recommendations.recommendations[0] ?? null;
  const recommendedNextAction = topRecommendation
    ? `${topRecommendation.title} → ${topRecommendation.suggestedWorkspaceName}`
    : null;

  return Object.freeze({
    status,
    intelligenceCards: buildIntelligenceCards(status, recommendedNextAction),
    recommendedNextAction,
    source: "dashboard_home_surface",
  });
}
