/**
 * MRP:4:1 / MRP:4:2 — Executive Summary workspace runtime.
 *
 * Builds workspace views from executive summary runtime state only.
 */

import {
  getExecutiveSummaryState,
  resetExecutiveSummaryStateRuntimeForTests,
} from "./executiveSummaryStateRuntime.ts";
import { resetExecutiveSummaryObjectContextRuntimeForTests } from "./executiveSummaryObjectContextRuntime.ts";
import { resetExecutiveSummaryVisualContractForTests } from "./executiveSummaryVisualContract.ts";
import { buildExecutiveSummaryWorkspaceViewFromState } from "./executiveSummaryStateViewMapper.ts";
import type { ExecutiveSummaryWorkspaceView } from "./executiveSummaryWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceExecutiveSummaryFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getExecutiveSummaryState();
  globalThis.console?.debug?.("[EXEC_SUMMARY_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    systemStatus: state.systemStatus,
    phase: state.phase,
  });
}

export function resetExecutiveSummaryWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetExecutiveSummaryVisualContractForTests();
  resetExecutiveSummaryObjectContextRuntimeForTests();
  resetExecutiveSummaryStateRuntimeForTests();
}

export function buildExecutiveSummaryWorkspaceView(_input?: {
  mountKey?: string | null;
}): ExecutiveSummaryWorkspaceView {
  return buildExecutiveSummaryWorkspaceViewFromState(getExecutiveSummaryState());
}
