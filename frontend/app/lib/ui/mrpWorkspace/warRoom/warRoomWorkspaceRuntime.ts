/**
 * MRP:4F:1 / 4F:2 — War Room workspace runtime.
 */

import { resetWarRoomBoundaryRuntimeForTests } from "./warRoomBoundaryRuntime.ts";
import { resetWarRoomScenarioHandoffRuntimeForTests } from "./warRoomScenarioHandoffRuntime.ts";
import { resetWarRoomScenarioIntakeRuntimeForTests } from "./warRoomScenarioIntakeRuntime.ts";
import { resetWarRoomActionPlanRuntimeForTests } from "./warRoomActionPlanRuntime.ts";
import { resetWarRoomMonitoringRuntimeForTests } from "./warRoomMonitoringRuntime.ts";
import { resetWarRoomStateRuntimeForTests } from "./warRoomStateRuntime.ts";
import { resetWarRoomWorkspaceContextRuntimeForTests } from "./warRoomWorkspaceContextRuntime.ts";
import {
  getWarRoomWorkspaceState,
  resetWarRoomWorkspaceStateRuntimeForTests,
} from "./warRoomWorkspaceStateRuntime.ts";
import { resetWarRoomVisualContractForTests } from "./warRoomVisualContract.ts";
import { buildWarRoomWorkspaceViewFromState } from "./warRoomWorkspaceStateViewMapper.ts";
import type { WarRoomWorkspaceView } from "./warRoomWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceWarRoomFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getWarRoomWorkspaceState();
  globalThis.console?.debug?.("[MRP_WARROOM_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    phase: state.phase,
  });
}

export function resetWarRoomWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetWarRoomVisualContractForTests();
  resetWarRoomBoundaryRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetWarRoomScenarioIntakeRuntimeForTests();
  resetWarRoomActionPlanRuntimeForTests();
  resetWarRoomMonitoringRuntimeForTests();
  resetWarRoomStateRuntimeForTests();
  resetWarRoomWorkspaceContextRuntimeForTests();
  resetWarRoomWorkspaceStateRuntimeForTests();
}

export function buildWarRoomWorkspaceView(_input?: {
  mountKey?: string | null;
}): WarRoomWorkspaceView {
  return buildWarRoomWorkspaceViewFromState(getWarRoomWorkspaceState());
}
