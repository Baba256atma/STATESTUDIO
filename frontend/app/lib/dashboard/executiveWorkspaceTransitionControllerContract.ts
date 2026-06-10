/**
 * MRP:8:3 — Executive Workspace Transition Controller contract.
 *
 * Registry describes. Lifecycle governs. Transition Controller coordinates.
 * Dashboard executes. Exactly one workspace is active.
 */

import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import {
  getExecutiveWorkspaceEntry,
  validateExecutiveWorkspaceOpenRequest,
} from "./executiveWorkspaceRegistryContract.ts";
import type { DashboardWorkspaceStateView } from "./executiveWorkspaceLifecycleContract.ts";

export type ExecutiveWorkspaceTransitionState =
  | "idle"
  | "requested"
  | "validating"
  | "transitioning"
  | "completed"
  | "failed";

export type ExecutiveWorkspaceTransitionRequest = Readonly<{
  targetWorkspaceId: ExecutiveWorkspaceId;
  source: "object_panel" | "assistant_bridge" | "dashboard_direct" | "passive_pause" | "passive_resume";
  timestamp: number;
}>;

export type ExecutiveWorkspaceTransitionStatus = Readonly<{
  controllerState: ExecutiveWorkspaceTransitionState;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  sourceWorkspaceId: ExecutiveWorkspaceId | null;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  lastTransitionTimestamp: number | null;
  source: "workspace_transition_controller";
}>;

export type ExecutiveWorkspaceTransitionResult = Readonly<{
  approved: boolean;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  previousWorkspaceId: ExecutiveWorkspaceId | null;
  status: ExecutiveWorkspaceTransitionStatus;
  reason: string;
}>;

/** Dedicated executive workspaces subject to single-active enforcement. */
export const SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS: readonly ExecutiveWorkspaceId[] = Object.freeze([
  "focus",
  "analyze",
  "compare",
  "scenario",
  "war_room",
]);

const loggedBrakes = new Set<string>();

export function warnWorkspaceTransitionBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WorkspaceTransition][Brake]", { message, ...detail });
}

export function resetExecutiveWorkspaceTransitionControllerForTests(): void {
  loggedBrakes.clear();
}

export function isSingleActiveExecutiveWorkspace(
  workspaceId: ExecutiveWorkspaceId
): boolean {
  return SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS.includes(workspaceId);
}

export function buildExecutiveWorkspaceTransitionStatus(input: {
  controllerState: ExecutiveWorkspaceTransitionState;
  targetWorkspaceId?: ExecutiveWorkspaceId | null;
  sourceWorkspaceId?: ExecutiveWorkspaceId | null;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  lastTransitionTimestamp?: number | null;
}): ExecutiveWorkspaceTransitionStatus {
  return Object.freeze({
    controllerState: input.controllerState,
    targetWorkspaceId: input.targetWorkspaceId ?? null,
    sourceWorkspaceId: input.sourceWorkspaceId ?? null,
    activeWorkspaceId: input.activeWorkspaceId ?? null,
    lastTransitionTimestamp: input.lastTransitionTimestamp ?? null,
    source: "workspace_transition_controller",
  });
}

export function validateExecutiveWorkspaceTransitionTarget(
  targetWorkspaceId: ExecutiveWorkspaceId
): { valid: boolean; reason: string } {
  const entry = getExecutiveWorkspaceEntry(targetWorkspaceId);
  if (!entry) {
    warnWorkspaceTransitionBrake("Missing workspace.", { targetWorkspaceId });
    return Object.freeze({ valid: false, reason: "missing_workspace" });
  }

  const registryValidation = validateExecutiveWorkspaceOpenRequest({
    workspaceId: targetWorkspaceId,
  });
  if (!registryValidation.valid) {
    warnWorkspaceTransitionBrake("Workspace registry mismatch.", {
      targetWorkspaceId,
      reason: registryValidation.reason,
    });
    return Object.freeze({ valid: false, reason: registryValidation.reason });
  }

  if (!isSingleActiveExecutiveWorkspace(targetWorkspaceId)) {
    return Object.freeze({ valid: true, reason: "non_enforced_workspace" });
  }

  return Object.freeze({ valid: true, reason: "transition_target_validated" });
}

export function detectMultipleActiveExecutiveWorkspaces(
  states: ReadonlyMap<ExecutiveWorkspaceId, DashboardWorkspaceStateView>,
  activeWorkspaceId: ExecutiveWorkspaceId | null
): readonly ExecutiveWorkspaceId[] {
  const activeIds: ExecutiveWorkspaceId[] = [];
  for (const id of SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS) {
    const state = states.get(id);
    if (state?.currentState === "active") {
      activeIds.push(id);
    }
  }
  if (activeIds.length > 1) {
    warnWorkspaceTransitionBrake("Multiple active workspaces.", { activeIds });
  }
  if (activeWorkspaceId && !activeIds.includes(activeWorkspaceId)) {
    warnWorkspaceTransitionBrake("Multiple active workspaces.", {
      tracked: activeWorkspaceId,
      detected: activeIds,
    });
  }
  return Object.freeze(activeIds);
}
