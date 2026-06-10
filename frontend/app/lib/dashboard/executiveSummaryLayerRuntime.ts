/**
 * MRP:10:2 — Executive Summary Layer runtime.
 *
 * Pure read-only aggregation from registry, lifecycle, history, recommendations, recents, diagnostics.
 */

import { dashboardModeLabel, type DashboardMode } from "./dashboardModeRuntimeContract.ts";
import {
  getExecutiveWorkspaceEntry,
  type ExecutiveWorkspaceId,
} from "./executiveWorkspaceRegistryContract.ts";
import { getActiveWorkspaceLifecycleState } from "./executiveWorkspaceLifecycleRuntime.ts";
import {
  getWorkspaceNavigationHistoryEntries,
  getWorkspaceNavigationSummary,
} from "./executiveWorkspaceNavigationHistoryRuntime.ts";
import { buildConnectionRuntimeStabilitySummary } from "../diagnostics/connectionRuntimeStabilityAudit.ts";
import { getDiagnosticStatus } from "../runtime/diagnosticSwitch.ts";
import { evaluateWorkspaceRecommendations } from "../workspaces/workspaceRecommendationEngine.ts";
import { buildWorkspaceRecentsView } from "../workspaces/workspaceRecentsRegistry.ts";
import type {
  DashboardHomeSummaryCardView,
  DashboardHomeSummaryLayerInput,
  DashboardHomeSummaryLayerView,
} from "./executiveSummaryLayerContract.ts";

function formatLifecycleState(state: string | null): string {
  if (!state) return "Landing view";
  return state.replace(/_/g, " ");
}

function formatLastTransition(): string {
  const entries = getWorkspaceNavigationHistoryEntries();
  const last = entries[entries.length - 1];
  if (!last) return "No transitions yet";
  const origin = last.originWorkspaceId
    ? getExecutiveWorkspaceEntry(last.originWorkspaceId).name
    : "Start";
  return `${origin} → ${last.workspaceName}`;
}

function countAttentionNotices(
  recommendations: ReturnType<typeof evaluateWorkspaceRecommendations>["recommendations"]
): number {
  return recommendations.filter(
    (card) => card.priority === "critical" || card.priority === "high"
  ).length;
}

function countRuntimeWarnings(): number {
  const summary = buildConnectionRuntimeStabilitySummary("executive_summary_layer");
  return [
    summary.possibleRenderLoop,
    summary.possibleTopologyStorm,
    summary.possibleConnectionStorm,
    summary.possibleGeometryLeak,
    summary.possibleMaterialLeak,
    summary.possiblePanelWriteStorm,
    summary.possibleHudDriftStorm,
    summary.possibleListenerLeak,
  ].filter(Boolean).length;
}

function resolveActiveWorkspace(input: DashboardHomeSummaryLayerInput): {
  id: ExecutiveWorkspaceId | null;
  name: string;
  lifecycle: string | null;
  modeLabel: string;
} {
  const navigation = getWorkspaceNavigationSummary();
  const activeLifecycle = getActiveWorkspaceLifecycleState();
  const id =
    input.activeWorkspaceId ?? navigation.currentWorkspaceId ?? activeLifecycle?.workspaceId ?? null;
  const entry = id ? getExecutiveWorkspaceEntry(id) : null;
  const modeLabel = dashboardModeLabel(input.dashboardMode);
  const name =
    entry?.name ??
    (input.dashboardMode === "overview" ? "Dashboard Home" : modeLabel);

  return {
    id,
    name,
    lifecycle: activeLifecycle?.currentState ?? null,
    modeLabel,
  };
}

export function buildExecutiveSummaryLayerView(
  input: DashboardHomeSummaryLayerInput
): DashboardHomeSummaryLayerView {
  const active = resolveActiveWorkspace(input);
  const selectedObjectId = input.selectedObjectId?.trim() || null;
  const hasSelection = Boolean(selectedObjectId);

  const recommendations = evaluateWorkspaceRecommendations({
    ...(input.recommendationContext ?? {}),
    activeWorkspaceId: active.id,
    selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
  });

  const recents = buildWorkspaceRecentsView({
    ...(input.recentsContext ?? {}),
    activeWorkspaceId: active.id ?? input.recentsContext?.activeWorkspaceId ?? null,
    selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
  });

  const diagnostics = getDiagnosticStatus();
  const warningCount = countRuntimeWarnings();
  const runtimeHealthy = warningCount === 0;

  const cards: DashboardHomeSummaryCardView[] = [
    Object.freeze({
      id: "active_workspace",
      title: "Active Workspace",
      primaryValue: active.name,
      secondaryValue: formatLifecycleState(active.lifecycle),
      detail: `Mode: ${active.modeLabel}`,
      tone: active.id && active.id !== "overview" ? "accent" : "neutral",
    }),
    Object.freeze({
      id: "selected_object",
      title: "Selected Object",
      primaryValue: hasSelection
        ? input.selectedObjectLabel?.trim() || selectedObjectId!
        : "No Object Selected",
      secondaryValue: hasSelection
        ? input.selectedObjectType?.trim() || "Object"
        : "Awaiting selection",
      detail: hasSelection
        ? `Status: ${input.selectedObjectStatus?.trim() || "Active"}`
        : "Select a scene object to unlock object-scoped workspaces",
      tone: hasSelection ? "neutral" : "muted",
    }),
    Object.freeze({
      id: "executive_attention",
      title: "Executive Attention",
      primaryValue: `${countAttentionNotices(recommendations.recommendations)} notices`,
      secondaryValue: `${recommendations.recommendations.length} recommendations`,
      detail: `${recents.items.length} recent actions · ${input.favoritesCount ?? 0} pinned favorites`,
      tone:
        countAttentionNotices(recommendations.recommendations) > 0 ? "warning" : "neutral",
    }),
    Object.freeze({
      id: "navigation_health",
      title: "Navigation Health",
      primaryValue: active.modeLabel,
      secondaryValue: `Route: Dashboard / ${active.modeLabel}`,
      detail: `Last transition: ${formatLastTransition()}`,
      tone: "neutral",
    }),
    Object.freeze({
      id: "system_status",
      title: "System Status",
      primaryValue: runtimeHealthy ? "Runtime Healthy" : "Warnings Present",
      secondaryValue: `${warningCount} runtime warning${warningCount === 1 ? "" : "s"}`,
      detail: diagnostics.enabled ? "Diagnostics active" : "Diagnostics idle",
      tone: runtimeHealthy ? "neutral" : "warning",
    }),
  ];

  return Object.freeze({
    cards: Object.freeze(cards),
    evaluatedAt: Date.now(),
    source: "executive_summary_layer",
  });
}
