/**
 * MRP:5A:1 — Advisory workspace runtime.
 */

import { resetAdvisoryBoundaryRuntimeForTests } from "./advisoryBoundaryRuntime.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "./advisoryExplainabilityRuntime.ts";
import { resetAdvisoryHandoffRuntimeForTests } from "./advisoryHandoffRuntime.ts";
import { resetAdvisoryRecommendationRuntimeForTests } from "./advisoryRecommendationRuntime.ts";
import { resetAdvisorySceneAwarenessRuntimeForTests } from "./advisorySceneAwarenessRuntime.ts";
import { resetAdvisoryStateRuntimeForTests } from "./advisoryStateRuntime.ts";
import { resetAdvisoryWorkspaceContextRuntimeForTests } from "./advisoryWorkspaceContextRuntime.ts";
import {
  getAdvisoryWorkspaceState,
  resetAdvisoryWorkspaceStateRuntimeForTests,
} from "./advisoryWorkspaceStateRuntime.ts";
import { resetAdvisoryVisualContractForTests } from "./advisoryVisualContract.ts";
import { buildAdvisoryWorkspaceViewFromState } from "./advisoryWorkspaceStateViewMapper.ts";
import type { AdvisoryWorkspaceView } from "./advisoryWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceAdvisoryFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getAdvisoryWorkspaceState();
  globalThis.console?.debug?.("[MRP_ADVISORY_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    phase: state.phase,
  });
}

export function resetAdvisoryWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetAdvisoryVisualContractForTests();
  resetAdvisoryBoundaryRuntimeForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryHandoffRuntimeForTests();
  resetAdvisoryRecommendationRuntimeForTests();
  resetAdvisorySceneAwarenessRuntimeForTests();
  resetAdvisoryStateRuntimeForTests();
  resetAdvisoryWorkspaceContextRuntimeForTests();
  resetAdvisoryWorkspaceStateRuntimeForTests();
}

export function buildAdvisoryWorkspaceView(_input?: {
  mountKey?: string | null;
}): AdvisoryWorkspaceView {
  return buildAdvisoryWorkspaceViewFromState(getAdvisoryWorkspaceState());
}
