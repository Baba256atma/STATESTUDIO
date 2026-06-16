/**
 * MRP:4D:3 — Timeline workspace object context contract.
 *
 * Read-only structural integration — no selection authority, scene writes, or panel opens.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";

export const MRP_TIMELINE_OBJECT_CONTEXT_TAG = "[MRP_TIMELINE_OBJECT_CONTEXT]" as const;

export const TIMELINE_OBJECT_CONTEXT_VERSION = "4D.3.0";

export const TIMELINE_NO_OBJECT_SELECTED_LABEL = "No object selected." as const;

export type TimelineObjectContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  lastActivity: string;
  lastChange: string;
  recentEventsCount: string;
  hasSelection: boolean;
}>;

export type TimelineObjectContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  sceneJson?: SceneJson | null;
  navigationHistoryEntries?: readonly WorkspaceNavigationHistoryEntry[] | null;
}>;

export const DEFAULT_TIMELINE_OBJECT_CONTEXT: TimelineObjectContext = Object.freeze({
  selectedObjectId: null,
  selectedObject: TIMELINE_NO_OBJECT_SELECTED_LABEL,
  lastActivity: "None",
  lastChange: "None",
  recentEventsCount: "0",
  hasSelection: false,
});

export const TIMELINE_OBJECT_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  lastActivity: "Last Activity",
  lastChange: "Last Change",
  recentEventsCount: "Recent Events Count",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const TIMELINE_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      lastActivity: string;
      lastChange: string;
      recentEventsCount: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    lastActivity: "Today · Operational review",
    lastChange: "Status updated to watch",
    recentEventsCount: "2",
  }),
  "supplier network": Object.freeze({
    lastActivity: "Yesterday · Supply checkpoint",
    lastChange: "Lead time adjustment logged",
    recentEventsCount: "3",
  }),
  "production line": Object.freeze({
    lastActivity: "Today · Line inspection",
    lastChange: "Throughput variance noted",
    recentEventsCount: "1",
  }),
  "project alpha": Object.freeze({
    lastActivity: "Today · Milestone review",
    lastChange: "Decision checkpoint opened",
    recentEventsCount: "4",
  }),
});
