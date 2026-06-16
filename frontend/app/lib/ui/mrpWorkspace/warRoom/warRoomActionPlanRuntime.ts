/**
 * MRP:4F:4 — Sync War Room action plan into workspace state.
 */

import { getWarRoomScenarioHandoffState } from "./warRoomScenarioHandoffRuntime.ts";
import {
  WAR_ROOM_ACTION_PLAN_CONTEXT,
  WAR_ROOM_ACTION_PLAN_PURPOSE,
  WAR_ROOM_ACTION_PLAN_TAG,
  type WarRoomActionPlanLayer,
  type WarRoomActionPlanSurface,
} from "./warRoomActionPlanContract.ts";
import {
  buildWarRoomActionPlanCardSnapshot,
  buildWarRoomActionPlanSignature,
  buildWarRoomActionPlanSurface,
  deriveWarRoomActionPlanLayer,
} from "./warRoomActionPlanResolver.ts";
import { getWarRoomState } from "./warRoomStateRuntime.ts";
import {
  getWarRoomWorkspaceState,
  publishWarRoomWorkspaceState,
} from "./warRoomWorkspaceStateRuntime.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logActionPlanOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_ACTION_PLAN_TAG, detail);
}

export function buildWarRoomActionPlanSurfaceFromLayer(
  layer: WarRoomActionPlanLayer
): WarRoomActionPlanSurface {
  return buildWarRoomActionPlanSurface(layer);
}

export function syncWarRoomActionPlan(): WarRoomActionPlanLayer {
  const workspaceState = getWarRoomWorkspaceState();
  const warRoomState = getWarRoomState();
  const handoff = getWarRoomScenarioHandoffState();

  const layer = deriveWarRoomActionPlanLayer({
    selectedStrategy: warRoomState.selectedStrategy,
    activeDecisionId: warRoomState.activeDecisionId,
    status: warRoomState.status,
    workspaceContext: workspaceState.workspaceContext,
    commitPackage: handoff.commitPackage,
  });
  const signature = buildWarRoomActionPlanSignature(layer);

  const result = publishWarRoomWorkspaceState({
    phase: workspaceState.phase === "loading" ? "ready" : workspaceState.phase,
    actionPlanLayer: layer,
    actionPlanExecutionOwned: true,
    actionPlan: buildWarRoomActionPlanCardSnapshot(layer),
  });

  logActionPlanOnce(signature, {
    action: "war_room_action_plan_synced",
    changed: result.changed,
    revision: result.revision,
    itemCount: layer.sections.reduce((total, section) => total + section.items.length, 0),
    dashboardContext: WAR_ROOM_ACTION_PLAN_CONTEXT,
    executionPlanningOwned: true,
  });

  return layer;
}

export function traceWarRoomActionPlanOnce(mountKey?: string | null): void {
  logActionPlanOnce(`trace:${mountKey ?? "default"}`, {
    action: "war_room_action_plan_active",
    purpose: WAR_ROOM_ACTION_PLAN_PURPOSE,
    mountKey: mountKey ?? null,
  });
}

export function resetWarRoomActionPlanRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
