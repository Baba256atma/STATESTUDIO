/**
 * MRP:10:3 — Workflow Launcher runtime.
 *
 * Read-only projection of action availability and recent workflow sessions.
 * No state ownership, no routing execution.
 */

import {
  type ExecutiveWorkspaceId,
} from "../executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../executiveWorkspaceRegistryRuntime.ts";
import {
  getWorkspaceNavigationHistoryEntries,
  getWorkspaceNavigationSummary,
  peekWorkspaceBackStackTarget,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import { previewRecentReturnPath } from "../../workspaces/workspaceRecentsRegistry.ts";
import {
  WORKFLOW_DEDICATED_WORKSPACE_IDS,
  WORKFLOW_LAUNCHER_ACTION_DEFINITIONS,
  type RecentWorkflowSessionView,
  type WorkflowLauncherActionView,
  type WorkflowLauncherView,
} from "./workflowLauncherContract.ts";

const SESSION_LABELS: Readonly<Record<(typeof WORKFLOW_DEDICATED_WORKSPACE_IDS)[number], string>> =
  Object.freeze({
    analyze: "Last Analyze Session",
    compare: "Last Compare Session",
    scenario: "Last Scenario Session",
    war_room: "Last War Room Session",
  });

function hasSelectedObject(selectedObjectId: string | null | undefined): boolean {
  return Boolean(selectedObjectId?.trim());
}

function isActionEnabled(input: {
  definition: (typeof WORKFLOW_LAUNCHER_ACTION_DEFINITIONS)[number];
  selectedObjectId: string | null;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
}): { enabled: boolean; disabledReason: string | null } {
  const { definition } = input;

  if (definition.handler === "focus_recommendations") {
    return { enabled: true, disabledReason: null };
  }

  if (definition.handler === "return_workspace") {
    const target = resolveReturnToWorkspaceTarget({
      activeWorkspaceId: input.activeWorkspaceId,
      selectedObjectId: input.selectedObjectId,
    });
    if (!target) {
      return { enabled: false, disabledReason: "No operational workspace to return to" };
    }
    return { enabled: true, disabledReason: null };
  }

  if (definition.requiresObject && !hasSelectedObject(input.selectedObjectId)) {
    return { enabled: false, disabledReason: "Select a scene object first" };
  }

  if (
    definition.targetWorkspaceId &&
    input.activeWorkspaceId === definition.targetWorkspaceId
  ) {
    return { enabled: false, disabledReason: "Already in this workspace" };
  }

  return { enabled: true, disabledReason: null };
}

export function resolveReturnToWorkspaceTarget(input: {
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  returnKind: "back_via_history" | "forward_via_launch";
}> | null {
  initializeExecutiveWorkspaceRegistry();
  const summary = getWorkspaceNavigationSummary();
  const backStackHead = peekWorkspaceBackStackTarget();
  const currentId = input.activeWorkspaceId ?? summary.currentWorkspaceId ?? null;

  const candidate =
    currentId && currentId !== "overview" ? currentId : backStackHead ?? summary.previousWorkspaceId;

  if (!candidate || candidate === "overview") {
    return null;
  }

  if (!WORKFLOW_DEDICATED_WORKSPACE_IDS.includes(candidate as (typeof WORKFLOW_DEDICATED_WORKSPACE_IDS)[number])) {
    return null;
  }

  const preview = previewRecentReturnPath({
    workspaceId: candidate,
    activeWorkspaceId: currentId ?? "overview",
    selectedObjectId: input.selectedObjectId ?? null,
  });

  if (preview.approved && preview.returnKind) {
    return Object.freeze({ workspaceId: candidate, returnKind: preview.returnKind });
  }

  if (currentId === candidate) {
    return null;
  }

  return Object.freeze({ workspaceId: candidate, returnKind: "forward_via_launch" });
}

export function buildRecentWorkflowSessions(input: {
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  selectedObjectId?: string | null;
}): readonly RecentWorkflowSessionView[] {
  initializeExecutiveWorkspaceRegistry();
  const entries = getWorkspaceNavigationHistoryEntries();
  const seen = new Set<ExecutiveWorkspaceId>();
  const sessions: RecentWorkflowSessionView[] = [];

  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index]!;
    if (
      !WORKFLOW_DEDICATED_WORKSPACE_IDS.includes(
        entry.workspaceId as (typeof WORKFLOW_DEDICATED_WORKSPACE_IDS)[number]
      )
    ) {
      continue;
    }
    if (seen.has(entry.workspaceId)) continue;
    seen.add(entry.workspaceId);

    const preview = previewRecentReturnPath({
      workspaceId: entry.workspaceId,
      activeWorkspaceId: input.activeWorkspaceId ?? null,
      selectedObjectId: input.selectedObjectId ?? null,
    });

    sessions.push(
      Object.freeze({
        workspaceId: entry.workspaceId,
        workspaceName: entry.workspaceName,
        sessionLabel:
          SESSION_LABELS[entry.workspaceId as (typeof WORKFLOW_DEDICATED_WORKSPACE_IDS)[number]] ??
          `Last ${entry.workspaceName} Session`,
        lastVisitedAt: entry.timestamp,
        returnKind: preview.returnKind ?? "forward_via_launch",
      })
    );
  }

  return Object.freeze(sessions);
}

export function buildWorkflowLauncherView(input: {
  selectedObjectId?: string | null;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
}): WorkflowLauncherView {
  initializeExecutiveWorkspaceRegistry();
  const selectedObjectId = input.selectedObjectId?.trim() || null;

  const actions: WorkflowLauncherActionView[] = WORKFLOW_LAUNCHER_ACTION_DEFINITIONS.map(
    (definition) => {
      const availability = isActionEnabled({
        definition,
        selectedObjectId,
        activeWorkspaceId: input.activeWorkspaceId ?? null,
      });
      return Object.freeze({
        ...definition,
        enabled: availability.enabled,
        disabledReason: availability.disabledReason,
      });
    }
  );

  const recentSessions = buildRecentWorkflowSessions({
    activeWorkspaceId: input.activeWorkspaceId,
    selectedObjectId,
  });

  return Object.freeze({
    actions: Object.freeze(actions),
    recentSessions,
    evaluatedAt: Date.now(),
    source: "workflow_launcher",
  });
}

export function getWorkflowLauncherActionTargetWorkspace(
  actionId: WorkflowLauncherActionView["id"]
): ExecutiveWorkspaceId | null {
  const definition = WORKFLOW_LAUNCHER_ACTION_DEFINITIONS.find((entry) => entry.id === actionId);
  return definition?.targetWorkspaceId ?? null;
}

export function formatRecentSessionTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
