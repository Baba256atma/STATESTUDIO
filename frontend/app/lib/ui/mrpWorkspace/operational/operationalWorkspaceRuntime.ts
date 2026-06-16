/**
 * MRP:4:7 / MRP:4:8 — Operational workspace runtime.
 *
 * Builds workspace views from operational runtime state only.
 */

import {
  getOperationalWorkspaceState,
  resetOperationalWorkspaceStateRuntimeForTests,
} from "./operationalWorkspaceStateRuntime.ts";
import { resetOperationalObjectContextRuntimeForTests } from "./operationalObjectContextRuntime.ts";
import { resetOperationalSceneAwarenessRuntimeForTests } from "./operationalSceneAwarenessRuntime.ts";
import { resetOperationalVisualContractForTests } from "./operationalVisualContract.ts";
import { buildOperationalWorkspaceViewFromState } from "./operationalWorkspaceStateViewMapper.ts";
import type { OperationalWorkspaceView } from "./operationalWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceOperationalFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getOperationalWorkspaceState();
  globalThis.console?.debug?.("[OPERATIONAL_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    operationalStatus: state.operationalStatus,
    activityLevel: state.activityLevel,
    phase: state.phase,
  });
}

export function resetOperationalWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetOperationalSceneAwarenessRuntimeForTests();
  resetOperationalVisualContractForTests();
  resetOperationalObjectContextRuntimeForTests();
  resetOperationalWorkspaceStateRuntimeForTests();
}

export function buildOperationalWorkspaceView(_input?: {
  mountKey?: string | null;
}): OperationalWorkspaceView {
  return buildOperationalWorkspaceViewFromState(getOperationalWorkspaceState());
}
