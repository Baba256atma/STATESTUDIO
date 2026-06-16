/**
 * MRP:4F:3 — War Room scenario handoff intake runtime.
 *
 * Accepts ScenarioCommitPackage, validates, creates active decision, populates strategy summary.
 * Does not regenerate scenarios or simulate future states.
 */

import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";
import { buildScenarioCommitPackageSignature } from "../scenario/scenarioHandoffResolver.ts";
import {
  guardWarRoomForbiddenAction,
  guardWarRoomSimulationBoundary,
} from "./warRoomBoundaryRuntime.ts";
import { receiveScenarioCommitPackage } from "./warRoomScenarioHandoffRuntime.ts";
import {
  WAR_ROOM_SCENARIO_INTAKE_TAG,
  type WarRoomScenarioIntakeResult,
} from "./warRoomScenarioIntakeContract.ts";
import {
  buildWarRoomIntakeStatePatch,
  validateScenarioCommitPackage,
} from "./warRoomScenarioIntakeResolver.ts";
import { syncWarRoomActionPlan } from "./warRoomActionPlanRuntime.ts";
import { syncWarRoomMonitoring } from "./warRoomMonitoringRuntime.ts";
import { getWarRoomState, publishWarRoomState } from "./warRoomStateRuntime.ts";

const loggedIntakeKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logIntakeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedIntakeKeys.has(key)) return;
  loggedIntakeKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_SCENARIO_INTAKE_TAG, detail);
}

export function guardWarRoomScenarioIntakeForbiddenAction(input: {
  action: "regenerate_scenario" | "simulate_future";
  source?: string | null;
}): ReturnType<typeof guardWarRoomSimulationBoundary> {
  if (input.action === "regenerate_scenario") {
    return guardWarRoomForbiddenAction({
      action: "generate_simulation",
      source: input.source ?? "scenario_intake",
    });
  }

  return guardWarRoomSimulationBoundary(input.source ?? "scenario_intake");
}

export function intakeScenarioCommitPackage(
  commitPackage: ScenarioCommitPackage,
  source?: string | null
): WarRoomScenarioIntakeResult {
  const validation = validateScenarioCommitPackage(commitPackage);
  if (!validation.valid) {
    return Object.freeze({
      ok: false,
      reason: validation.errors.join("; "),
      regeneratedScenario: false,
      simulatedFuture: false,
    });
  }

  receiveScenarioCommitPackage(commitPackage);

  const intakePatch = buildWarRoomIntakeStatePatch(commitPackage);
  publishWarRoomState(intakePatch);
  syncWarRoomActionPlan();
  syncWarRoomMonitoring();

  const signature = buildScenarioCommitPackageSignature(commitPackage);
  const warRoomState = getWarRoomState();

  logIntakeOnce(signature, {
    action: "scenario_commit_package_intake",
    scenarioId: commitPackage.scenarioId,
    title: commitPackage.title,
    selectedObjectId: commitPackage.selectedObjectId,
    activeDecisionId: intakePatch.activeDecisionId,
    status: warRoomState.status,
    regeneratedScenario: false,
    simulatedFuture: false,
  });

  return Object.freeze({
    ok: true,
    commitPackage,
    activeDecisionId: intakePatch.activeDecisionId,
    warRoomState,
    regeneratedScenario: false,
    simulatedFuture: false,
  });
}

export function traceWarRoomScenarioIntakeOnce(mountKey?: string | null): void {
  logIntakeOnce(`trace:${mountKey ?? "default"}`, {
    action: "war_room_scenario_intake_active",
    mountKey: mountKey ?? null,
    consumesOnly: true,
    regeneratesScenario: false,
    simulatesFuture: false,
  });
}

export function resetWarRoomScenarioIntakeRuntimeForTests(): void {
  loggedIntakeKeys.clear();
}
