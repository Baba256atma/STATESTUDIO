/**
 * MRP:4D:2 / 4D:4 — Sync Timeline workspace metrics and visual rows from read-only data.
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import {
  getTimelineWorkspaceState,
  publishTimelineWorkspaceState,
} from "./timelineWorkspaceStateRuntime.ts";
import {
  buildTimelineDecisionHistoryRowsSignature,
  deriveTimelineDecisionHistoryRows,
} from "./timelineDecisionHistoryResolver.ts";
import {
  buildTimelineRecentEventRowsSignature,
  deriveTimelineRecentEventRows,
} from "./timelineRecentEventsResolver.ts";
import {
  MRP_TIMELINE_STATE_TAG,
  type TimelineWorkspaceDataInput,
  type TimelineWorkspaceMetrics,
} from "./timelineWorkspaceMetricsContract.ts";
import {
  buildTimelineWorkspaceMetricsSignature,
  deriveTimelineWorkspaceMetrics,
} from "./timelineWorkspaceMetricsResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logTimelineStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_TIMELINE_STATE_TAG, detail);
}

export function buildTimelineWorkspaceDataInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: TimelineWorkspaceDataInput
): TimelineWorkspaceDataInput {
  return Object.freeze({
    selectedObjectId: extended?.selectedObjectId ?? snapshot.selectedObjectId,
    selectedObjectLabel:
      extended?.selectedObjectLabel ?? snapshot.header.selectedObject,
    routeObjectId: extended?.routeObjectId ?? null,
    routeObjectName: extended?.routeObjectName ?? null,
    sceneJson: extended?.sceneJson ?? null,
    navigationHistoryEntries: extended?.navigationHistoryEntries ?? null,
  });
}

function buildTimelineWorkspaceDataSignature(input: TimelineWorkspaceDataInput): string {
  const metrics = deriveTimelineWorkspaceMetrics(input);
  const recentEventRows = deriveTimelineRecentEventRows(input);
  const decisionHistoryRows = deriveTimelineDecisionHistoryRows(input);
  return `${buildTimelineWorkspaceMetricsSignature(metrics)}|${buildTimelineRecentEventRowsSignature(recentEventRows)}|${buildTimelineDecisionHistoryRowsSignature(decisionHistoryRows)}`;
}

export function syncTimelineWorkspaceData(
  input: TimelineWorkspaceDataInput
): TimelineWorkspaceMetrics {
  const metrics = deriveTimelineWorkspaceMetrics(input);
  const recentEventRows = deriveTimelineRecentEventRows(input);
  const decisionHistoryRows = deriveTimelineDecisionHistoryRows(input);
  const signature = buildTimelineWorkspaceDataSignature(input);
  const current = getTimelineWorkspaceState();
  const currentSignature = `${buildTimelineWorkspaceMetricsSignature({
    selectedObjectId: current.selectedObjectId,
    totalEvents: current.totalEvents,
    recentEventCount: current.recentEventCount,
    decisionEventCount: current.decisionEventCount,
    riskEventCount: current.riskEventCount,
    lastEventAt: current.lastEventAt,
  })}|${buildTimelineRecentEventRowsSignature(current.recentEventRows)}|${buildTimelineDecisionHistoryRowsSignature(current.decisionHistoryRows)}`;

  if (signature === currentSignature) {
    return Object.freeze({
      selectedObjectId: current.selectedObjectId,
      totalEvents: current.totalEvents,
      recentEventCount: current.recentEventCount,
      decisionEventCount: current.decisionEventCount,
      riskEventCount: current.riskEventCount,
      lastEventAt: current.lastEventAt,
    });
  }

  const result = publishTimelineWorkspaceState({
    phase: "ready",
    selectedObjectId: metrics.selectedObjectId,
    totalEvents: metrics.totalEvents,
    recentEventCount: metrics.recentEventCount,
    decisionEventCount: metrics.decisionEventCount,
    riskEventCount: metrics.riskEventCount,
    lastEventAt: metrics.lastEventAt,
    recentEventRows,
    decisionHistoryRows,
  });

  logTimelineStateOnce(signature, {
    action: "timeline_metrics_synced",
    changed: result.changed,
    revision: result.revision,
    totalEvents: metrics.totalEvents,
    selectedObjectId: metrics.selectedObjectId,
    recentEventRowCount: recentEventRows.length,
    decisionHistoryRowCount: decisionHistoryRows.length,
  });

  return metrics;
}

export function syncTimelineWorkspaceDataFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: TimelineWorkspaceDataInput
): TimelineWorkspaceMetrics {
  return syncTimelineWorkspaceData(buildTimelineWorkspaceDataInputFromMrpSnapshot(snapshot, extended));
}

export function resetTimelineWorkspaceDataRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
