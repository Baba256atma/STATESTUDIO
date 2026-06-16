/**
 * MRP:4D:2 — Derive Timeline workspace metrics from read-only workspace/runtime data.
 */

import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import { getWorkspaceNavigationHistoryEntries } from "../../../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import type {
  TimelineWorkspaceDataInput,
  TimelineWorkspaceMetrics,
} from "./timelineWorkspaceMetricsContract.ts";
import { DEFAULT_TIMELINE_WORKSPACE_METRICS } from "./timelineWorkspaceMetricsContract.ts";
import {
  mergeTimelineEvents,
  scanNavigationTimelineEvents,
  scanSceneTimelineEvents,
} from "./timelineEventScanResolver.ts";

function resolveSelectedObjectId(input: TimelineWorkspaceDataInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveNavigationEntries(
  input: TimelineWorkspaceDataInput
): readonly WorkspaceNavigationHistoryEntry[] {
  if (input.navigationHistoryEntries) {
    return input.navigationHistoryEntries;
  }
  return getWorkspaceNavigationHistoryEntries();
}

export function buildTimelineWorkspaceMetricsSignature(
  metrics: TimelineWorkspaceMetrics
): string {
  return JSON.stringify({
    selectedObjectId: metrics.selectedObjectId,
    totalEvents: metrics.totalEvents,
    recentEventCount: metrics.recentEventCount,
    decisionEventCount: metrics.decisionEventCount,
    riskEventCount: metrics.riskEventCount,
    lastEventAt: metrics.lastEventAt,
  });
}

export function deriveTimelineWorkspaceMetrics(
  input: TimelineWorkspaceDataInput,
  now = Date.now()
): TimelineWorkspaceMetrics {
  const selectedObjectId = resolveSelectedObjectId(input);
  const navigationEvents = scanNavigationTimelineEvents(resolveNavigationEntries(input), now);
  const sceneObjects = input.sceneJson?.scene?.objects;
  const sceneEvents = Array.isArray(sceneObjects)
    ? scanSceneTimelineEvents(sceneObjects, now)
    : Object.freeze([]);
  const events = mergeTimelineEvents(navigationEvents, sceneEvents);

  if (!events.length) {
    return Object.freeze({
      ...DEFAULT_TIMELINE_WORKSPACE_METRICS,
      selectedObjectId,
    });
  }

  let recentEventCount = 0;
  let decisionEventCount = 0;
  let riskEventCount = 0;
  let lastEventAt = 0;

  for (const event of events) {
    if (event.isRecent) recentEventCount += 1;
    if (event.isDecision) decisionEventCount += 1;
    if (event.isRisk) riskEventCount += 1;
    if (event.timestamp > lastEventAt) lastEventAt = event.timestamp;
  }

  return Object.freeze({
    selectedObjectId,
    totalEvents: events.length,
    recentEventCount,
    decisionEventCount,
    riskEventCount,
    lastEventAt,
  });
}
