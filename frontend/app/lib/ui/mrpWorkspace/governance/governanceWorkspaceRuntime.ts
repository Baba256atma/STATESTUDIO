/**
 * MRP:5B:2 — Governance workspace runtime (delegates to runtime state store).
 */

import type { GovernanceWorkspaceView } from "./governanceWorkspaceContract.ts";
import {
  resetGovernanceWorkspaceFoundationBoundaryForTests,
  traceGovernanceFoundationBoundaryOnce,
} from "./governanceWorkspaceFoundationBoundary.ts";
import { resetGovernanceDecisionGateForTests } from "./governanceDecisionGateRuntime.ts";
import { resetGovernanceDecisionGateBoundaryForTests } from "./governanceDecisionGateBoundary.ts";
import { resetGovernanceApprovalLayerBoundaryForTests } from "./governanceApprovalLayerBoundary.ts";
import { resetGovernanceApprovalLayerIntelligenceForTests } from "./governanceApprovalLayerIntelligenceRuntime.ts";
import { resetGovernancePolicyConstraintBoundaryForTests } from "./governancePolicyConstraintBoundary.ts";
import { resetGovernancePolicyConstraintIntelligenceForTests } from "./governancePolicyConstraintIntelligenceRuntime.ts";
import { resetGovernanceVisualContractForTests } from "./governanceVisualContract.ts";
import type { GovernanceWorkspaceRuntimeSnapshot } from "./governanceWorkspaceRuntimeContract.ts";
import {
  GOVERNANCE_RUNTIME_TAG,
  getGovernanceWorkspaceState,
  hydrateGovernanceWorkspaceStateOnMount as hydrateGovernanceStateOnMount,
  resetGovernanceWorkspaceStateForTests,
  teardownGovernanceWorkspaceStateOnUnmount,
} from "./governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governanceWorkspaceStateViewMapper.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function toRuntimeSnapshot(mountKey: string): GovernanceWorkspaceRuntimeSnapshot {
  const state = getGovernanceWorkspaceState();
  return Object.freeze({
    mountKey,
    phase: state.phase === "closed" ? "empty" : state.phase,
    revision: state.revision,
    hydratedAt: state.phase === "ready" ? Date.now() : null,
  });
}

export function hydrateGovernanceWorkspaceStateOnMount(
  mountKey: string
): GovernanceWorkspaceRuntimeSnapshot {
  hydrateGovernanceStateOnMount(mountKey);
  return toRuntimeSnapshot(mountKey);
}

export function getGovernanceWorkspaceRuntimeSnapshot(): GovernanceWorkspaceRuntimeSnapshot {
  const state = getGovernanceWorkspaceState();
  return Object.freeze({
    mountKey: null,
    phase: state.phase === "closed" ? "empty" : state.phase,
    revision: state.revision,
    hydratedAt: state.phase === "ready" ? Date.now() : null,
  });
}

export function traceGovernanceFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  globalThis.console?.debug?.("[MRP_5B1_FOUNDATION]", {
    action: "governance_workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    phase: getGovernanceWorkspaceState().phase,
  });
}

export function traceGovernanceRuntimeOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  globalThis.console?.debug?.(GOVERNANCE_RUNTIME_TAG, {
    action: "governance_workspace_runtime_mounted",
    mountKey: mountKey ?? null,
    phase: getGovernanceWorkspaceState().phase,
    workspaceId: "governance",
  });
}

export function resetGovernanceWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetGovernanceWorkspaceStateForTests();
  resetGovernancePolicyConstraintIntelligenceForTests();
  resetGovernancePolicyConstraintBoundaryForTests();
  resetGovernanceApprovalLayerIntelligenceForTests();
  resetGovernanceApprovalLayerBoundaryForTests();
  resetGovernanceDecisionGateForTests();
  resetGovernanceDecisionGateBoundaryForTests();
  resetGovernanceVisualContractForTests();
  resetGovernanceWorkspaceFoundationBoundaryForTests();
}

export function buildGovernanceWorkspaceView(_input?: {
  mountKey?: string | null;
}): GovernanceWorkspaceView {
  return buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());
}

export { teardownGovernanceWorkspaceStateOnUnmount };

export const governanceWorkspaceRuntimeContract = Object.freeze({
  version: "5B.2.0",
  tag: GOVERNANCE_RUNTIME_TAG,
  owner: "governanceWorkspaceRuntime" as const,
  hydrateOnMount: hydrateGovernanceWorkspaceStateOnMount,
  buildView: buildGovernanceWorkspaceView,
  traceFoundationOnce: traceGovernanceFoundationOnce,
  resetForTests: resetGovernanceWorkspaceRuntimeForTests,
});
