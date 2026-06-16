/**
 * MRP:4D:2 — Timeline workspace canonical metrics contract.
 *
 * Read-only derived state — no backend, no scene writes, no selection writes.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";

export const MRP_TIMELINE_STATE_TAG = "[MRP_TIMELINE_STATE]" as const;

export const TIMELINE_WORKSPACE_METRICS_VERSION = "4D.2.0";

export type TimelineWorkspaceMetrics = Readonly<{
  selectedObjectId: string | null;
  totalEvents: number;
  recentEventCount: number;
  decisionEventCount: number;
  riskEventCount: number;
  lastEventAt: number;
}>;

export type TimelineWorkspaceDataInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
  sceneJson?: SceneJson | null;
  navigationHistoryEntries?: readonly WorkspaceNavigationHistoryEntry[] | null;
}>;

export const DEFAULT_TIMELINE_WORKSPACE_METRICS: TimelineWorkspaceMetrics = Object.freeze({
  selectedObjectId: null,
  totalEvents: 0,
  recentEventCount: 0,
  decisionEventCount: 0,
  riskEventCount: 0,
  lastEventAt: 0,
});
