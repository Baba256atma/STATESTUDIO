/**
 * MRP:10:5 — Executive Continuity runtime.
 *
 * Read-only projection from navigation history and recents registry.
 * No event creation, no persistence, no scene timeline consumption.
 */

import { getExecutiveWorkspaceEntry } from "../executiveWorkspaceRegistryContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import {
  getWorkspaceNavigationHistoryEntries,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import type { WorkspaceNavigationHistoryEntry } from "../executiveWorkspaceNavigationHistoryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../executiveWorkspaceRegistryRuntime.ts";
import {
  previewRecentReturnPath,
} from "../../workspaces/workspaceRecentsRegistry.ts";
import type { WorkspaceRecentReturnKind } from "../../workspaces/workspaceRecentsContract.ts";
import type { WorkspaceRecentsContextInput } from "../../workspaces/workspaceRecentsContract.ts";
import {
  EXECUTIVE_ACTIVITY_TIMELINE_MAX_DISPLAY,
  type ExecutiveActivityCategory,
  type ExecutiveActivityActionKind,
  type ExecutiveActivityTimelineEntryView,
  type ExecutiveActivityTimelineView,
  type ExecutiveContinuitySummaryView,
} from "./executiveContinuityContract.ts";

const WORKSPACE_THEME_NAMES: Readonly<Partial<Record<ExecutiveWorkspaceId, string>>> = Object.freeze({
  analyze: "Analyze",
  compare: "Compare",
  scenario: "Scenario",
  war_room: "War Room",
  focus: "Focus",
  overview: "Dashboard Home",
});

function formatTimelineTimestamp(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  const timeLabel = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfEntryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDelta = Math.round((startOfToday - startOfEntryDay) / 86_400_000);

  if (dayDelta === 0) return `Today · ${timeLabel}`;
  if (dayDelta === 1) return `Yesterday · ${timeLabel}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} · ${timeLabel}`;
}

function resolveActivityCategory(
  entry: WorkspaceNavigationHistoryEntry
): ExecutiveActivityCategory {
  if (entry.transitionType === "back") return "navigation";
  if (entry.workspaceId === "war_room") return "war_room";
  if (entry.workspaceId === "scenario") return "scenario";
  if (entry.workspaceId === "focus") return "object";
  if (entry.transitionType === "passive_pause" || entry.transitionType === "passive_resume") {
    return "navigation";
  }
  if (entry.workspaceId === "recommendations") return "recommendation";
  return "workspace";
}

function resolveActivityTitle(input: {
  entry: WorkspaceNavigationHistoryEntry;
  objectLabel: string | null;
}): string {
  const { entry, objectLabel } = input;

  if (entry.transitionType === "back") {
    return `Returned to ${entry.workspaceName}`;
  }

  switch (entry.workspaceId) {
    case "analyze":
      return "Opened Analyze Mode";
    case "compare":
      return "Opened Compare Mode";
    case "scenario":
      return "Opened Scenario Mode";
    case "war_room":
      return "Opened War Room";
    case "focus":
      return objectLabel ? `Selected ${objectLabel}` : "Selected Object";
    case "overview":
      return "Returned to Dashboard Home";
    default:
      return `Opened ${entry.workspaceName}`;
  }
}

function resolveAction(input: {
  workspaceId: ExecutiveWorkspaceId;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  selectedObjectId: string | null;
  isLatest: boolean;
}): Readonly<{
  actionKind: ExecutiveActivityActionKind;
  actionLabel: string | null;
  returnKind: WorkspaceRecentReturnKind | null;
  actionEnabled: boolean;
}> {
  if (input.activeWorkspaceId === input.workspaceId) {
    return Object.freeze({
      actionKind: "none",
      actionLabel: null,
      returnKind: null,
      actionEnabled: false,
    });
  }

  const preview = previewRecentReturnPath({
    workspaceId: input.workspaceId,
    activeWorkspaceId: input.activeWorkspaceId,
    selectedObjectId: input.selectedObjectId,
  });

  if (!preview.approved || !preview.returnKind) {
    return Object.freeze({
      actionKind: "none",
      actionLabel: null,
      returnKind: null,
      actionEnabled: false,
    });
  }

  const actionKind: ExecutiveActivityActionKind = input.isLatest ? "continue" : "reopen";
  const actionLabel =
    preview.returnKind === "back_via_history"
      ? "Reopen"
      : input.isLatest
        ? "Continue"
        : "Reopen";

  return Object.freeze({
    actionKind,
    actionLabel,
    returnKind: preview.returnKind,
    actionEnabled: true,
  });
}

function projectTimelineEntry(input: {
  entry: WorkspaceNavigationHistoryEntry;
  objectId: string | null;
  objectLabel: string | null;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  isLatest: boolean;
}): ExecutiveActivityTimelineEntryView | null {
  if (input.entry.transitionType === "audit_failure") {
    return null;
  }

  const action = resolveAction({
    workspaceId: input.entry.workspaceId,
    activeWorkspaceId: input.activeWorkspaceId,
    selectedObjectId: input.objectId,
    isLatest: input.isLatest,
  });

  const relatedObjectLabel =
    input.entry.workspaceId === "focus" ? input.objectLabel : input.objectLabel;

  return Object.freeze({
    id: `${input.entry.timestamp}:${input.entry.workspaceId}:${input.entry.transitionType}`,
    title: resolveActivityTitle({
      entry: input.entry,
      objectLabel: input.objectLabel,
    }),
    activityCategory: resolveActivityCategory(input.entry),
    timestamp: input.entry.timestamp,
    timestampLabel: formatTimelineTimestamp(input.entry.timestamp),
    relatedWorkspaceId: input.entry.workspaceId,
    relatedWorkspaceName: input.entry.workspaceName,
    relatedObjectId: input.entry.workspaceId === "focus" ? input.objectId : null,
    relatedObjectLabel:
      input.entry.workspaceId === "focus" || input.objectLabel
        ? relatedObjectLabel
        : null,
    actionKind: action.actionKind,
    actionLabel: action.actionLabel,
    returnKind: action.returnKind,
    actionEnabled: action.actionEnabled,
    historyReference: `${input.entry.timestamp}:${input.entry.workspaceId}:${input.entry.transitionType}`,
    source: "workspace_navigation_history",
  });
}

function buildContinuitySummary(
  entries: readonly ExecutiveActivityTimelineEntryView[]
): ExecutiveContinuitySummaryView {
  if (entries.length === 0) {
    return Object.freeze({
      narrative: "No recent activity available.",
      isEmpty: true,
      dominantWorkspaceNames: Object.freeze([]),
      activityCount: 0,
    });
  }

  const themeCounts = new Map<string, number>();
  for (const entry of entries) {
    const theme =
      WORKSPACE_THEME_NAMES[entry.relatedWorkspaceId ?? "overview"] ??
      entry.relatedWorkspaceName ??
      "workspace activity";
    themeCounts.set(theme, (themeCounts.get(theme) ?? 0) + 1);
  }

  const sortedThemes = [...themeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const dominant = sortedThemes.slice(0, 3);
  let narrative: string;

  if (dominant.length === 1) {
    narrative = `Your recent activity focused on ${dominant[0]} workflows.`;
  } else if (dominant.length === 2) {
    narrative = `Most recent activity occurred in ${dominant[0]} and ${dominant[1]} workflows.`;
  } else {
    narrative = `Recent activity focused on ${dominant.slice(0, 2).join(", ")}, and ${dominant[2]} workflows.`;
  }

  return Object.freeze({
    narrative,
    isEmpty: false,
    dominantWorkspaceNames: Object.freeze(dominant),
    activityCount: entries.length,
  });
}

export function buildExecutiveActivityTimelineView(
  input: WorkspaceRecentsContextInput = {}
): ExecutiveActivityTimelineView {
  initializeExecutiveWorkspaceRegistry();

  const objectId = input.selectedObjectId?.trim() || null;
  const objectLabel = input.selectedObjectLabel?.trim() || null;
  const activeWorkspaceId = input.activeWorkspaceId ?? null;

  const historyEntries = getWorkspaceNavigationHistoryEntries();
  const reversed = historyEntries.slice().reverse();

  const projected: ExecutiveActivityTimelineEntryView[] = [];
  const seenIds = new Set<string>();

  for (let index = 0; index < reversed.length; index += 1) {
    if (projected.length >= EXECUTIVE_ACTIVITY_TIMELINE_MAX_DISPLAY) break;

    const entry = reversed[index]!;
    const view = projectTimelineEntry({
      entry,
      objectId,
      objectLabel,
      activeWorkspaceId,
      isLatest: index === 0,
    });
    if (!view) continue;
    if (seenIds.has(view.id)) continue;
    seenIds.add(view.id);
    projected.push(view);
  }

  const continuity = buildContinuitySummary(projected);

  return Object.freeze({
    continuity,
    entries: Object.freeze(projected),
    evaluatedAt: Date.now(),
    source: "executive_continuity_layer",
  });
}

export function resolveExecutiveActivityWorkspaceEntry(
  workspaceId: ExecutiveWorkspaceId
): Readonly<{ name: string; dashboardMode: string | null }> {
  const entry = getExecutiveWorkspaceEntry(workspaceId);
  return Object.freeze({
    name: entry.name,
    dashboardMode: entry.dashboardMode,
  });
}
