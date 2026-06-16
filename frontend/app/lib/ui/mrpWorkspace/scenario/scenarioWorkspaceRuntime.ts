/**
 * MRP:4E:1 — Scenario workspace runtime.
 */

import { resetScenarioBoundaryRuntimeForTests } from "./scenarioBoundaryRuntime.ts";
import { resetScenarioGenerationRuntimeForTests } from "./scenarioGenerationRuntime.ts";
import { resetScenarioComparisonRuntimeForTests } from "./scenarioComparisonRuntime.ts";
import { resetScenarioHandoffRuntimeForTests } from "./scenarioHandoffRuntime.ts";
import { resetScenarioProjectionRuntimeForTests } from "./scenarioProjectionRuntime.ts";
import { resetWarRoomScenarioHandoffRuntimeForTests } from "../warRoom/warRoomScenarioHandoffRuntime.ts";
import { resetScenarioWorkspaceContextRuntimeForTests } from "./scenarioWorkspaceContextRuntime.ts";
import {
  getScenarioWorkspaceState,
  resetScenarioWorkspaceStateRuntimeForTests,
} from "./scenarioWorkspaceStateRuntime.ts";
import { resetScenarioVisualContractForTests } from "./scenarioVisualContract.ts";
import { buildScenarioWorkspaceViewFromState } from "./scenarioWorkspaceStateViewMapper.ts";
import type { ScenarioWorkspaceView } from "./scenarioWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceScenarioFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getScenarioWorkspaceState();
  globalThis.console?.debug?.("[MRP_SCENARIO_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    phase: state.phase,
  });
}

export function resetScenarioWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetScenarioVisualContractForTests();
  resetScenarioBoundaryRuntimeForTests();
  resetScenarioGenerationRuntimeForTests();
  resetScenarioComparisonRuntimeForTests();
  resetScenarioProjectionRuntimeForTests();
  resetScenarioHandoffRuntimeForTests();
  resetWarRoomScenarioHandoffRuntimeForTests();
  resetScenarioWorkspaceContextRuntimeForTests();
  resetScenarioWorkspaceStateRuntimeForTests();
}

export function buildScenarioWorkspaceView(_input?: {
  mountKey?: string | null;
}): ScenarioWorkspaceView {
  return buildScenarioWorkspaceViewFromState(getScenarioWorkspaceState());
}
