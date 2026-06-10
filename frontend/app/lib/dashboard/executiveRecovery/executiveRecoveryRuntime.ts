/**
 * MRP:10:6 — Executive Workspace Recovery runtime.
 *
 * Read-only projection of resumable contexts from navigation history.
 * No session creation, no persistence, no AI orchestration.
 */

import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../executiveWorkspaceRegistryRuntime.ts";
import {
  getWorkspaceNavigationHistoryEntries,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import type { WorkspaceNavigationHistoryEntry } from "../executiveWorkspaceNavigationHistoryContract.ts";
import { previewRecentReturnPath } from "../../workspaces/workspaceRecentsRegistry.ts";
import type { WorkspaceRecentsContextInput } from "../../workspaces/workspaceRecentsContract.ts";
import {
  EXECUTIVE_RECOVERY_MAX_ENTRIES,
  type ExecutiveRecoveryEntryView,
  type ExecutiveRecoveryWorkspaceKind,
  type ExecutiveWorkspaceRecoveryView,
} from "./executiveRecoveryContract.ts";

const RESUMABLE_WORKSPACE_IDS = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "focus",
] as const satisfies readonly ExecutiveWorkspaceId[]);

const RECOVERY_CONFIG: Readonly<
  Record<
    (typeof RESUMABLE_WORKSPACE_IDS)[number],
    Readonly<{ activityName: string; workspaceType: string; recoveryKind: ExecutiveRecoveryWorkspaceKind }>
  >
> = Object.freeze({
  analyze: Object.freeze({
    activityName: "Continue Last Analyze Session",
    workspaceType: "Analyze",
    recoveryKind: "analyze",
  }),
  compare: Object.freeze({
    activityName: "Continue Last Compare Session",
    workspaceType: "Compare",
    recoveryKind: "compare",
  }),
  scenario: Object.freeze({
    activityName: "Continue Last Scenario Review",
    workspaceType: "Scenario",
    recoveryKind: "scenario",
  }),
  war_room: Object.freeze({
    activityName: "Continue Last War Room Session",
    workspaceType: "War Room",
    recoveryKind: "war_room",
  }),
  focus: Object.freeze({
    activityName: "Continue Last Object Investigation",
    workspaceType: "Object",
    recoveryKind: "object_investigation",
  }),
});

function formatRecoveryTimestamp(timestamp: number): string {
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

function isResumableWorkspace(
  workspaceId: ExecutiveWorkspaceId
): workspaceId is (typeof RESUMABLE_WORKSPACE_IDS)[number] {
  return (RESUMABLE_WORKSPACE_IDS as readonly ExecutiveWorkspaceId[]).includes(workspaceId);
}

function projectRecoveryEntry(input: {
  entry: WorkspaceNavigationHistoryEntry;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  selectedObjectId: string | null;
}): ExecutiveRecoveryEntryView | null {
  if (input.entry.transitionType === "audit_failure") return null;
  if (!isResumableWorkspace(input.entry.workspaceId)) return null;

  const config = RECOVERY_CONFIG[input.entry.workspaceId];
  const preview = previewRecentReturnPath({
    workspaceId: input.entry.workspaceId,
    activeWorkspaceId: input.activeWorkspaceId,
    selectedObjectId: input.selectedObjectId,
  });

  return Object.freeze({
    id: `recovery:${input.entry.timestamp}:${input.entry.workspaceId}`,
    activityName: config.activityName,
    workspaceType: config.workspaceType,
    workspaceId: input.entry.workspaceId,
    recoveryKind: config.recoveryKind,
    timestamp: input.entry.timestamp,
    timestampLabel: formatRecoveryTimestamp(input.entry.timestamp),
    resumeActionLabel: preview.approved ? "Resume" : "Unavailable",
    returnKind: preview.returnKind,
    resumeEnabled: preview.approved,
    historyReference: `${input.entry.timestamp}:${input.entry.workspaceId}:${input.entry.transitionType}`,
    source: "workspace_navigation_history",
  });
}

export function buildExecutiveWorkspaceRecoveryView(
  input: WorkspaceRecentsContextInput = {}
): ExecutiveWorkspaceRecoveryView {
  initializeExecutiveWorkspaceRegistry();

  const activeWorkspaceId = input.activeWorkspaceId ?? null;
  const selectedObjectId = input.selectedObjectId?.trim() || null;
  const historyEntries = getWorkspaceNavigationHistoryEntries();

  const latestByWorkspace = new Map<
    (typeof RESUMABLE_WORKSPACE_IDS)[number],
    WorkspaceNavigationHistoryEntry
  >();

  for (let index = historyEntries.length - 1; index >= 0; index -= 1) {
    const entry = historyEntries[index]!;
    if (!isResumableWorkspace(entry.workspaceId)) continue;
    if (latestByWorkspace.has(entry.workspaceId)) continue;
    latestByWorkspace.set(entry.workspaceId, entry);
  }

  const projected = [...latestByWorkspace.values()]
    .map((entry) => projectRecoveryEntry({ entry, activeWorkspaceId, selectedObjectId }))
    .filter((entry): entry is ExecutiveRecoveryEntryView => entry !== null)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, EXECUTIVE_RECOVERY_MAX_ENTRIES);

  return Object.freeze({
    entries: Object.freeze(projected),
    evaluatedAt: Date.now(),
    source: "executive_workspace_recovery_layer",
  });
}
