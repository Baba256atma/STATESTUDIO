/**
 * MRP:4F:5 — War Room watch & monitor runtime.
 */

import { getWarRoomScenarioHandoffState } from "./warRoomScenarioHandoffRuntime.ts";
import {
  countWarRoomActionPlanItems,
} from "./warRoomActionPlanResolver.ts";
import {
  WAR_ROOM_MONITORING_CONTEXT,
  WAR_ROOM_MONITORING_PURPOSE,
  WAR_ROOM_MONITORING_TAG,
  type WarRoomMonitoringLayer,
} from "./warRoomMonitoringContract.ts";
import {
  buildWarRoomMonitoringDecisionStatusCardSnapshot,
  buildWarRoomMonitoringSignature,
  buildWarRoomMonitoringWatchListCardSnapshot,
  countWarRoomMonitoringSignals,
  deriveWarRoomMonitoringLayer,
} from "./warRoomMonitoringResolver.ts";
import { guardWarRoomForbiddenAction } from "./warRoomBoundaryRuntime.ts";
import { getWarRoomState } from "./warRoomStateRuntime.ts";
import {
  getWarRoomWorkspaceState,
  publishWarRoomWorkspaceState,
} from "./warRoomWorkspaceStateRuntime.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logMonitoringOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_MONITORING_TAG, detail);
}

export function guardWarRoomMonitoringForbiddenAction(input: {
  action: "simulate_future" | "modify_timeline" | "own_forecasting";
  source?: string | null;
}): ReturnType<typeof guardWarRoomForbiddenAction> {
  if (input.action === "modify_timeline") {
    return guardWarRoomForbiddenAction({
      action: "modify_timeline",
      source: input.source ?? "war_room_monitoring",
    });
  }
  if (input.action === "simulate_future") {
    return guardWarRoomForbiddenAction({
      action: "generate_simulation",
      source: input.source ?? "war_room_monitoring",
    });
  }
  return guardWarRoomForbiddenAction({
    action: "own_forecasting",
    source: input.source ?? "war_room_monitoring",
  });
}

export function syncWarRoomMonitoring(): WarRoomMonitoringLayer {
  const workspaceState = getWarRoomWorkspaceState();
  const warRoomState = getWarRoomState();
  const handoff = getWarRoomScenarioHandoffState();

  const layer = deriveWarRoomMonitoringLayer({
    selectedStrategy: warRoomState.selectedStrategy,
    activeDecisionId: warRoomState.activeDecisionId,
    status: warRoomState.status,
    workspaceContext: workspaceState.workspaceContext,
    commitPackage: handoff.commitPackage,
    actionPlanItemCount: countWarRoomActionPlanItems(workspaceState.actionPlanLayer),
  });
  const signature = buildWarRoomMonitoringSignature(layer);
  const hasSignals = countWarRoomMonitoringSignals(layer) > 0;

  const result = publishWarRoomWorkspaceState({
    phase: workspaceState.phase === "loading" ? "ready" : workspaceState.phase,
    monitoringLayer: layer,
    monitoringExecutionTracked: true,
    watchList: hasSignals
      ? buildWarRoomMonitoringWatchListCardSnapshot(layer)
      : workspaceState.watchList,
    decisionStatus: hasSignals
      ? buildWarRoomMonitoringDecisionStatusCardSnapshot(layer, warRoomState.status)
      : workspaceState.decisionStatus,
  });

  logMonitoringOnce(signature, {
    action: "war_room_monitoring_synced",
    changed: result.changed,
    revision: result.revision,
    watchCount: layer.watchItems.length,
    alertCount: layer.alerts.length,
    dashboardContext: WAR_ROOM_MONITORING_CONTEXT,
    executionTrackingOwned: true,
  });

  return layer;
}

export function traceWarRoomMonitoringOnce(mountKey?: string | null): void {
  logMonitoringOnce(`trace:${mountKey ?? "default"}`, {
    action: "war_room_monitoring_active",
    purpose: WAR_ROOM_MONITORING_PURPOSE,
    mountKey: mountKey ?? null,
  });
}

export function resetWarRoomMonitoringRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
