/**
 * MRP:10:7 — Executive Workspace Snapshot + Daily Readiness runtime.
 *
 * Read-only aggregation from registry, lifecycle, history, recommendations, recovery.
 * No scoring engines, no persistence, no AI orchestration.
 */

import { dashboardModeLabel, type DashboardMode } from "../dashboardModeRuntimeContract.ts";
import {
  getExecutiveWorkspaceEntry,
  type ExecutiveWorkspaceId,
} from "../executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../executiveWorkspaceRegistryRuntime.ts";
import { getActiveWorkspaceLifecycleState } from "../executiveWorkspaceLifecycleRuntime.ts";
import {
  getWorkspaceNavigationHistoryEntries,
  getWorkspaceNavigationSummary,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import { evaluateWorkspaceRecommendations } from "../../workspaces/workspaceRecommendationEngine.ts";
import { getWorkspaceFavoritesSnapshot } from "../../workspaces/workspaceFavoritesRegistry.ts";
import { buildExecutiveWorkspaceRecoveryView } from "../executiveRecovery/executiveRecoveryRuntime.ts";
import type {
  DailyReadinessActionView,
  DailyReadinessState,
  DailyReadinessView,
  ExecutiveWorkspaceSnapshotInput,
  ExecutiveWorkspaceSnapshotView,
  WorkspaceSnapshotCardView,
} from "./executiveWorkspaceSnapshotContract.ts";
import { DAILY_READINESS_STATE_LABELS } from "./executiveWorkspaceSnapshotContract.ts";

function formatLifecycleState(state: string | null): string {
  if (!state) return "Available";
  return state.replace(/_/g, " ");
}

function formatLastInteraction(timestamp: number | null): string {
  if (!timestamp) return "No recent interaction";
  const now = new Date();
  const date = new Date(timestamp);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfEntryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDelta = Math.round((startOfToday - startOfEntryDay) / 86_400_000);

  if (dayDelta === 0) return "Today";
  if (dayDelta === 1) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function resolveRuntimeAvailable(activeId: ExecutiveWorkspaceId | null): boolean {
  if (!activeId) return true;
  try {
    const entry = getExecutiveWorkspaceEntry(activeId);
    return entry.availability !== "deprecated";
  } catch {
    return false;
  }
}

function resolveReadinessState(input: {
  recommendationCount: number;
  recoverableCount: number;
}): DailyReadinessState {
  if (input.recoverableCount > 0) return "review_pending";
  if (input.recommendationCount > 0) return "attention_recommended";
  return "ready";
}

function buildReadinessSummary(state: DailyReadinessState): string {
  switch (state) {
    case "ready":
      return "Workspace is ready for continued operational review.";
    case "attention_recommended":
      return "Several unresolved items may require attention.";
    case "review_pending":
      return "Recoverable workspace sessions are available to resume.";
    default:
      return "Workspace is ready for continued operational review.";
  }
}

function buildReadinessActions(input: {
  state: DailyReadinessState;
  recoveryEntry: ReturnType<typeof buildExecutiveWorkspaceRecoveryView>["entries"][number] | null;
  hasRecommendations: boolean;
}): readonly DailyReadinessActionView[] {
  const actions: DailyReadinessActionView[] = [];

  if (input.state === "review_pending" && input.recoveryEntry?.resumeEnabled) {
    actions.push(
      Object.freeze({
        kind: "resume_session",
        label: "Resume Session",
        enabled: true,
        workspaceId: input.recoveryEntry.workspaceId,
        returnKind: input.recoveryEntry.returnKind,
      })
    );
  }

  if (input.hasRecommendations) {
    actions.push(
      Object.freeze({
        kind: "review_recommendations",
        label: "Review Recommendations",
        enabled: true,
        workspaceId: null,
        returnKind: null,
      })
    );
  }

  if (input.state === "ready") {
    actions.push(
      Object.freeze({
        kind: "open_analyze",
        label: "Open Analyze",
        enabled: true,
        workspaceId: "analyze",
        returnKind: null,
      })
    );
  }

  actions.push(
    Object.freeze({
      kind: "open_dashboard",
      label: "Open Dashboard",
      enabled: true,
      workspaceId: "overview",
      returnKind: null,
    })
  );

  return Object.freeze(actions);
}

export function buildExecutiveWorkspaceSnapshotView(
  input: ExecutiveWorkspaceSnapshotInput
): ExecutiveWorkspaceSnapshotView {
  initializeExecutiveWorkspaceRegistry();

  const navigation = getWorkspaceNavigationSummary();
  const activeLifecycle = getActiveWorkspaceLifecycleState();
  const activeId =
    input.activeWorkspaceId ?? navigation.currentWorkspaceId ?? activeLifecycle?.workspaceId ?? null;
  const runtimeAvailable = resolveRuntimeAvailable(activeId);

  const selectedObjectId = input.selectedObjectId?.trim() || null;
  const hasSelection = Boolean(selectedObjectId);

  const recommendations = evaluateWorkspaceRecommendations({
    ...(input.recommendationContext ?? {}),
    activeWorkspaceId: activeId,
    selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
  });

  const recovery = buildExecutiveWorkspaceRecoveryView({
    ...(input.recentsContext ?? {}),
    activeWorkspaceId: activeId,
    selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
  });

  const recoverableCount = recovery.entries.filter((entry) => entry.resumeEnabled).length;
  const favoritesCount = getWorkspaceFavoritesSnapshot().items.length;

  const historyEntries = getWorkspaceNavigationHistoryEntries();
  const lastEntry = historyEntries[historyEntries.length - 1] ?? null;

  const entry = activeId ? getExecutiveWorkspaceEntry(activeId) : null;
  const modeLabel = dashboardModeLabel(input.dashboardMode);
  const workspaceName =
    entry?.name ?? (input.dashboardMode === "overview" ? "Dashboard Home" : modeLabel);

  const workflowName = lastEntry?.workspaceName ?? workspaceName;
  const lastInteraction = formatLastInteraction(lastEntry?.timestamp ?? null);

  const readinessState = resolveReadinessState({
    recommendationCount: recommendations.recommendations.length,
    recoverableCount,
  });

  const primaryRecovery = recovery.entries.find((entry) => entry.resumeEnabled) ?? null;

  const cards: WorkspaceSnapshotCardView[] = runtimeAvailable
    ? [
        Object.freeze({
          id: "active_workspace",
          title: "Active Workspace",
          primaryValue: workspaceName,
          secondaryValue: formatLifecycleState(activeLifecycle?.currentState ?? null),
          detail: `Mode: ${modeLabel}`,
        }),
        Object.freeze({
          id: "active_object",
          title: "Active Object Context",
          primaryValue: hasSelection
            ? input.selectedObjectLabel?.trim() || selectedObjectId!
            : "No Active Object",
          secondaryValue: hasSelection
            ? input.selectedObjectType?.trim() || "Object"
            : "None selected",
          detail: hasSelection
            ? `Status: ${input.selectedObjectStatus?.trim() || "Active"}`
            : "Select an object to establish context",
        }),
        Object.freeze({
          id: "active_workflow",
          title: "Active Workflow",
          primaryValue: workflowName,
          secondaryValue: lastEntry ? `Last: ${lastEntry.workspaceName}` : "Dashboard Home",
          detail: `Last interaction: ${lastInteraction}`,
        }),
        Object.freeze({
          id: "operational_awareness",
          title: "Operational Awareness",
          primaryValue: `${recommendations.recommendations.length} open recommendations`,
          secondaryValue: `${recoverableCount} recoverable sessions`,
          detail: `${favoritesCount} pinned favorites · ${navigation.entryCount} navigation entries`,
        }),
      ]
    : [];

  const readiness: DailyReadinessView = Object.freeze({
    state: runtimeAvailable ? readinessState : "ready",
    stateLabel: runtimeAvailable
      ? DAILY_READINESS_STATE_LABELS[readinessState]
      : "Workspace status unavailable",
    summary: runtimeAvailable
      ? buildReadinessSummary(readinessState)
      : "Workspace status unavailable.",
    actions: runtimeAvailable
      ? buildReadinessActions({
          state: readinessState,
          recoveryEntry: primaryRecovery,
          hasRecommendations: recommendations.recommendations.length > 0,
        })
      : Object.freeze([]),
  });

  return Object.freeze({
    cards: Object.freeze(cards),
    readiness,
    runtimeAvailable,
    evaluatedAt: Date.now(),
    source: "executive_workspace_snapshot",
  });
}

export function resolveSnapshotDashboardModeLabel(mode: DashboardMode): string {
  return dashboardModeLabel(mode);
}
