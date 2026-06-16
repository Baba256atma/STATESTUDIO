/**
 * MRP:4C:1 — Risk workspace runtime.
 */

import { resetRiskWorkspaceDataRuntimeForTests } from "./riskWorkspaceDataRuntime.ts";
import { resetRiskObjectContextRuntimeForTests } from "./riskObjectContextRuntime.ts";
import { resetRiskSceneAwarenessRuntimeForTests } from "./riskSceneAwarenessRuntime.ts";
import {
  getRiskWorkspaceState,
  resetRiskWorkspaceStateRuntimeForTests,
} from "./riskWorkspaceStateRuntime.ts";
import { resetRiskVisualContractForTests } from "./riskVisualContract.ts";
import { buildRiskWorkspaceViewFromState } from "./riskWorkspaceStateViewMapper.ts";
import type { RiskWorkspaceView } from "./riskWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceRiskFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getRiskWorkspaceState();
  globalThis.console?.debug?.("[MRP_RISK_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    phase: state.phase,
  });
}

export function resetRiskWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetRiskVisualContractForTests();
  resetRiskObjectContextRuntimeForTests();
  resetRiskSceneAwarenessRuntimeForTests();
  resetRiskWorkspaceDataRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
}

export function buildRiskWorkspaceView(_input?: {
  mountKey?: string | null;
}): RiskWorkspaceView {
  return buildRiskWorkspaceViewFromState(getRiskWorkspaceState());
}
