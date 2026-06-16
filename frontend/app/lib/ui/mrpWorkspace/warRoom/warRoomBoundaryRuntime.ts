/**
 * MRP:4F:1 — War Room workspace Rule #11 + Rule #13 boundary runtime.
 */

import {
  guardExecutiveWorkspaceCapability,
  guardNexoraRule11Boundary,
  traceNexoraRule11ActiveOnce,
} from "../governance/nexoraRule11BoundaryRuntime.ts";
import {
  NEXORA_RULE_11_BOUNDARY_TAG,
  type Rule11BoundaryGuardResult,
  type Rule11ViolationKind,
} from "../governance/nexoraRule11BoundaryContract.ts";
import {
  guardWarRoomCommitmentAction,
  traceNexoraRule13ActiveOnce,
} from "../governance/nexoraRule13CommitmentOwnershipRuntime.ts";
import type { Rule13CommitmentOwnershipGuardResult } from "../governance/nexoraRule13CommitmentOwnershipContract.ts";
import { WAR_ROOM_FOUNDATION_TAG } from "./warRoomWorkspaceContract.ts";

export type WarRoomForbiddenAction =
  | "generate_simulation"
  | "modify_timeline"
  | "own_forecasting";

export type WarRoomBoundaryAttempt = Readonly<{
  action: WarRoomForbiddenAction;
  source?: string | null;
}>;

const ACTION_TO_VIOLATION: Readonly<Record<WarRoomForbiddenAction, Rule11ViolationKind>> =
  Object.freeze({
    generate_simulation: "own_simulation_generation",
    modify_timeline: "modify_timeline_history",
    own_forecasting: "capability_boundary_crossing",
  });

const ACTION_TO_RULE13: Readonly<
  Record<WarRoomForbiddenAction, "generate_simulation" | "rewrite_history" | "own_forecasting">
> = Object.freeze({
  generate_simulation: "generate_simulation",
  modify_timeline: "rewrite_history",
  own_forecasting: "own_forecasting",
});

const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logWarRoomBoundaryOnce(
  key: string,
  detail: Readonly<Record<string, unknown>>
): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_11_BOUNDARY_TAG, detail);
}

export function guardWarRoomForbiddenAction(
  attempt: WarRoomBoundaryAttempt
): Rule11BoundaryGuardResult {
  const violationKind = ACTION_TO_VIOLATION[attempt.action];
  const result = guardNexoraRule11Boundary({
    sourceWorkspace: "war_room",
    violationKind,
    capability: attempt.action === "own_forecasting" ? "future_simulation" : null,
    intent: attempt.action === "own_forecasting" ? "own" : null,
    source: attempt.source ?? null,
  });

  if (!result.allowed) {
    logWarRoomBoundaryOnce(`${attempt.action}:${attempt.source ?? "unknown"}`, {
      action: "war_room_boundary_blocked",
      warRoomAction: attempt.action,
      violationKind,
      source: attempt.source ?? null,
    });
  }

  return result;
}

export function guardWarRoomCommitmentOwnershipBoundary(
  attempt: WarRoomBoundaryAttempt
): Rule13CommitmentOwnershipGuardResult {
  const rule13Action = ACTION_TO_RULE13[attempt.action];
  const result = guardWarRoomCommitmentAction({
    action: rule13Action,
    source: attempt.source ?? null,
  });

  if (!result.allowed) {
    logWarRoomBoundaryOnce(`rule13:${attempt.action}:${attempt.source ?? "unknown"}`, {
      action: "war_room_rule13_blocked",
      warRoomAction: attempt.action,
      violationKind: "violationKind" in result ? result.violationKind : null,
      source: attempt.source ?? null,
    });
  }

  return result;
}

export function guardWarRoomSimulationBoundary(
  source?: string | null
): Rule11BoundaryGuardResult {
  const rule11 = guardWarRoomForbiddenAction({
    action: "generate_simulation",
    source: source ?? "simulation_boundary",
  });
  if (!rule11.allowed) return rule11;

  return guardExecutiveWorkspaceCapability({
    workspace: "war_room",
    capability: "future_simulation",
    intent: "own",
    source: source ?? null,
  });
}

export function traceWarRoomFoundationBoundaryOnce(mountKey?: string | null): void {
  traceNexoraRule11ActiveOnce(mountKey ?? "war_room_workspace");
  traceNexoraRule13ActiveOnce(mountKey ?? "war_room_workspace");
  if (!isDev()) return;
  logWarRoomBoundaryOnce(`foundation:${mountKey ?? "default"}`, {
    action: "war_room_foundation_boundary_active",
    tag: WAR_ROOM_FOUNDATION_TAG,
    ownsCommitmentOnly: true,
    simulationOwnership: false,
    mountKey: mountKey ?? null,
  });
}

export function resetWarRoomBoundaryRuntimeForTests(): void {
  loggedGuardKeys.clear();
}
