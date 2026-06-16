/**
 * MRP:4E:1 — Scenario workspace Rule #11 boundary runtime.
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
import { SCENARIO_FOUNDATION_TAG } from "./scenarioWorkspaceContract.ts";

export type ScenarioForbiddenAction =
  | "execute_action"
  | "modify_timeline"
  | "open_war_room_automatically";

export type ScenarioHandoffBoundaryAction =
  | "handoff_to_war_room"
  | "execute_commit_package";

export type ScenarioBoundaryAttempt = Readonly<{
  action: ScenarioForbiddenAction;
  source?: string | null;
}>;

export type ScenarioHandoffBoundaryAttempt = Readonly<{
  action: ScenarioHandoffBoundaryAction;
  source?: string | null;
}>;

const ACTION_TO_VIOLATION: Readonly<Record<ScenarioForbiddenAction, Rule11ViolationKind>> =
  Object.freeze({
    execute_action: "execute_decisions",
    modify_timeline: "modify_timeline_history",
    open_war_room_automatically: "commit_actions",
  });

const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logScenarioBoundaryOnce(
  key: string,
  detail: Readonly<Record<string, unknown>>
): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_11_BOUNDARY_TAG, detail);
}

export function guardScenarioForbiddenAction(
  attempt: ScenarioBoundaryAttempt
): Rule11BoundaryGuardResult {
  const violationKind = ACTION_TO_VIOLATION[attempt.action];
  const result = guardNexoraRule11Boundary({
    sourceWorkspace: "scenario",
    violationKind,
    source: attempt.source ?? null,
  });

  if (!result.allowed) {
    logScenarioBoundaryOnce(`${attempt.action}:${attempt.source ?? "unknown"}`, {
      action: "scenario_boundary_blocked",
      scenarioAction: attempt.action,
      violationKind,
      source: attempt.source ?? null,
    });
  }

  return result;
}

export function guardScenarioHandoffBoundary(
  attempt: ScenarioHandoffBoundaryAttempt
): Rule11BoundaryGuardResult {
  if (attempt.action === "execute_commit_package") {
    return guardScenarioForbiddenAction({
      action: "execute_action",
      source: attempt.source ?? "execute_commit_package",
    });
  }

  const autoOpen = guardScenarioForbiddenAction({
    action: "open_war_room_automatically",
    source: attempt.source ?? "handoff_to_war_room",
  });
  if (autoOpen.allowed) {
    return guardNexoraRule11Boundary({
      sourceWorkspace: "scenario",
      violationKind: "commit_actions",
      source: attempt.source ?? null,
    });
  }

  const execution = guardScenarioForbiddenAction({
    action: "execute_action",
    source: attempt.source ?? "handoff_to_war_room",
  });
  if (execution.allowed) {
    return guardNexoraRule11Boundary({
      sourceWorkspace: "scenario",
      violationKind: "execute_decisions",
      source: attempt.source ?? null,
    });
  }

  const capability = guardExecutiveWorkspaceCapability({
    workspace: "scenario",
    capability: "future_simulation",
    intent: "own",
    source: attempt.source ?? null,
  });
  if (!capability.allowed) {
    return capability;
  }

  logScenarioBoundaryOnce(`handoff:${attempt.source ?? "unknown"}`, {
    action: "scenario_handoff_allowed",
    preparesOnly: true,
    warRoomAutoOpen: false,
    executionFromScenario: false,
  });

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_11_BOUNDARY_TAG,
  });
}

export function traceScenarioFoundationBoundaryOnce(mountKey?: string | null): void {
  traceNexoraRule11ActiveOnce(mountKey ?? "scenario_workspace");
  if (!isDev()) return;
  logScenarioBoundaryOnce(`foundation:${mountKey ?? "default"}`, {
    action: "scenario_foundation_boundary_active",
    tag: SCENARIO_FOUNDATION_TAG,
    exploresFuturesOnly: true,
    mountKey: mountKey ?? null,
  });
}

export function resetScenarioBoundaryRuntimeForTests(): void {
  loggedGuardKeys.clear();
}
