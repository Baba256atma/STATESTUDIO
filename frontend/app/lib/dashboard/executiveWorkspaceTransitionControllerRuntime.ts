/**
 * MRP:8:3 — Executive Workspace Transition Controller runtime.
 *
 * Coordinates workspace handoffs. Enforces single active workspace.
 * Never executes or renders — delegates lifecycle transitions only.
 */

import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import {
  commitWorkspaceLifecycleOpen,
  getActiveWorkspaceLifecycleState,
  getWorkspaceLifecycleState,
  initializeExecutiveWorkspaceLifecycle,
  pauseActiveWorkspaceLifecycle,
  prepareWorkspaceLifecycleOpen,
  resumeActiveWorkspaceLifecycle,
  validateWorkspaceLifecycleOpen,
} from "./executiveWorkspaceLifecycleRuntime.ts";
import {
  buildExecutiveWorkspaceTransitionStatus,
  isSingleActiveExecutiveWorkspace,
  resetExecutiveWorkspaceTransitionControllerForTests,
  validateExecutiveWorkspaceTransitionTarget,
  warnWorkspaceTransitionBrake,
  type ExecutiveWorkspaceTransitionResult,
  type ExecutiveWorkspaceTransitionState,
  type ExecutiveWorkspaceTransitionStatus,
} from "./executiveWorkspaceTransitionControllerContract.ts";

let controllerState: ExecutiveWorkspaceTransitionState = "idle";
let transitionTargetId: ExecutiveWorkspaceId | null = null;
let transitionSourceId: ExecutiveWorkspaceId | null = null;
let lastTransitionTimestamp: number | null = null;

export function resetExecutiveWorkspaceTransitionControllerRuntimeForTests(): void {
  controllerState = "idle";
  transitionTargetId = null;
  transitionSourceId = null;
  lastTransitionTimestamp = null;
  resetExecutiveWorkspaceTransitionControllerForTests();
}

export function getExecutiveWorkspaceTransitionStatus(): ExecutiveWorkspaceTransitionStatus {
  initializeExecutiveWorkspaceLifecycle();
  const active = getActiveWorkspaceLifecycleState();
  return buildExecutiveWorkspaceTransitionStatus({
    controllerState,
    targetWorkspaceId: transitionTargetId,
    sourceWorkspaceId: transitionSourceId,
    activeWorkspaceId: active?.workspaceId ?? null,
    lastTransitionTimestamp,
  });
}

function isTransitionInProgress(): boolean {
  return (
    controllerState === "requested" ||
    controllerState === "validating" ||
    controllerState === "transitioning" ||
    controllerState === "completed"
  );
}

function failTransition(reason: string): ExecutiveWorkspaceTransitionResult {
  const previousId = transitionSourceId;
  controllerState = "failed";
  const status = getExecutiveWorkspaceTransitionStatus();
  controllerState = "idle";
  transitionTargetId = null;
  transitionSourceId = null;
  return Object.freeze({
    approved: false,
    targetWorkspaceId: null,
    previousWorkspaceId: previousId,
    status,
    reason,
  });
}

function enforceSingleActiveWorkspace(): boolean {
  initializeExecutiveWorkspaceLifecycle();
  const active = getActiveWorkspaceLifecycleState();
  const activeIds: ExecutiveWorkspaceId[] = [];
  for (const id of ["focus", "analyze", "compare", "scenario", "war_room"] as ExecutiveWorkspaceId[]) {
    const state = getWorkspaceLifecycleState(id);
    if (state?.currentState === "active") {
      activeIds.push(id);
    }
  }
  if (activeIds.length > 1) {
    warnWorkspaceTransitionBrake("Multiple active workspaces.", { activeIds });
    return false;
  }
  if (active && activeIds.length === 1 && activeIds[0] !== active.workspaceId) {
    warnWorkspaceTransitionBrake("Multiple active workspaces.", {
      tracked: active.workspaceId,
      detected: activeIds,
    });
    return false;
  }
  return true;
}

export function requestExecutiveWorkspaceTransition(input: {
  targetWorkspaceId: ExecutiveWorkspaceId;
  source: "object_panel" | "assistant_bridge" | "dashboard_direct";
}): ExecutiveWorkspaceTransitionResult {
  if (isTransitionInProgress()) {
    warnWorkspaceTransitionBrake("Concurrent transition detected.", {
      state: controllerState,
      target: transitionTargetId,
    });
    return failTransition("concurrent_transition_detected");
  }

  controllerState = "requested";
  transitionTargetId = input.targetWorkspaceId;
  transitionSourceId = getActiveWorkspaceLifecycleState()?.workspaceId ?? null;

  controllerState = "validating";
  const targetValidation = validateExecutiveWorkspaceTransitionTarget(input.targetWorkspaceId);
  if (!targetValidation.valid) {
    warnWorkspaceTransitionBrake("Transition validation failed.", {
      target: input.targetWorkspaceId,
      reason: targetValidation.reason,
    });
    return failTransition(targetValidation.reason);
  }

  if (isSingleActiveExecutiveWorkspace(input.targetWorkspaceId)) {
    const lifecycleValidation = validateWorkspaceLifecycleOpen(input.targetWorkspaceId);
    if (!lifecycleValidation.valid) {
      warnWorkspaceTransitionBrake("Invalid lifecycle state.", {
        target: input.targetWorkspaceId,
        reason: lifecycleValidation.reason,
      });
      return failTransition(lifecycleValidation.reason);
    }
  }

  controllerState = "transitioning";

  const prepare = prepareWorkspaceLifecycleOpen(input.targetWorkspaceId);
  if (!prepare.accepted) {
    warnWorkspaceTransitionBrake("Transition validation failed.", {
      target: input.targetWorkspaceId,
      reason: prepare.reason,
    });
    return failTransition(prepare.reason);
  }

  if (!enforceSingleActiveWorkspace()) {
    return failTransition("multiple_active_workspaces");
  }

  controllerState = "completed";
  lastTransitionTimestamp = Date.now();

  const status = getExecutiveWorkspaceTransitionStatus();

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[WorkspaceTransition][Approved]", {
      from: transitionSourceId,
      to: input.targetWorkspaceId,
      source: input.source,
    });
  }

  return Object.freeze({
    approved: true,
    targetWorkspaceId: input.targetWorkspaceId,
    previousWorkspaceId: transitionSourceId,
    status,
    reason: "transition_approved",
  });
}

export function commitExecutiveWorkspaceTransition(
  targetWorkspaceId: ExecutiveWorkspaceId
): ExecutiveWorkspaceTransitionResult {
  if (
    transitionTargetId &&
    transitionTargetId !== targetWorkspaceId &&
    isTransitionInProgress()
  ) {
    warnWorkspaceTransitionBrake("Concurrent transition detected.", {
      expected: transitionTargetId,
      received: targetWorkspaceId,
    });
    return failTransition("concurrent_transition_detected");
  }

  const canCommit =
    controllerState === "completed" ||
    controllerState === "idle" ||
    (controllerState === "transitioning" &&
      (!transitionTargetId || transitionTargetId === targetWorkspaceId));

  if (!canCommit) {
    warnWorkspaceTransitionBrake("Concurrent transition detected.", {
      state: controllerState,
      target: targetWorkspaceId,
    });
    return failTransition("concurrent_transition_detected");
  }

  const commit = commitWorkspaceLifecycleOpen(targetWorkspaceId);
  if (!commit.accepted) {
    warnWorkspaceTransitionBrake("Unauthorized activation.", {
      target: targetWorkspaceId,
      reason: commit.reason,
    });
    return failTransition(commit.reason);
  }

  if (!enforceSingleActiveWorkspace()) {
    return failTransition("multiple_active_workspaces");
  }

  const originForHistory = transitionSourceId;
  lastTransitionTimestamp = Date.now();
  transitionTargetId = null;
  transitionSourceId = null;
  controllerState = "idle";

  return Object.freeze({
    approved: true,
    targetWorkspaceId,
    previousWorkspaceId: originForHistory,
    status: getExecutiveWorkspaceTransitionStatus(),
    reason: "transition_committed",
  });
}

export function requestPassiveWorkspacePause(): ExecutiveWorkspaceTransitionResult {
  if (isTransitionInProgress()) {
    warnWorkspaceTransitionBrake("Concurrent transition detected.", { state: controllerState });
    return failTransition("concurrent_transition_detected");
  }

  controllerState = "transitioning";
  const paused = pauseActiveWorkspaceLifecycle();
  if (!paused.accepted) {
    controllerState = "idle";
    return Object.freeze({
      approved: false,
      targetWorkspaceId: null,
      previousWorkspaceId: null,
      status: getExecutiveWorkspaceTransitionStatus(),
      reason: paused.reason,
    });
  }

  lastTransitionTimestamp = Date.now();
  controllerState = "idle";

  return Object.freeze({
    approved: true,
    targetWorkspaceId: paused.state?.workspaceId ?? null,
    previousWorkspaceId: null,
    status: getExecutiveWorkspaceTransitionStatus(),
    reason: "passive_pause_applied",
  });
}

export function requestPassiveWorkspaceResume(): ExecutiveWorkspaceTransitionResult {
  if (isTransitionInProgress()) {
    warnWorkspaceTransitionBrake("Concurrent transition detected.", { state: controllerState });
    return failTransition("concurrent_transition_detected");
  }

  controllerState = "transitioning";
  const resumed = resumeActiveWorkspaceLifecycle();
  if (!resumed.accepted) {
    controllerState = "idle";
    return Object.freeze({
      approved: false,
      targetWorkspaceId: null,
      previousWorkspaceId: null,
      status: getExecutiveWorkspaceTransitionStatus(),
      reason: resumed.reason,
    });
  }

  if (!enforceSingleActiveWorkspace()) {
    return failTransition("multiple_active_workspaces");
  }

  lastTransitionTimestamp = Date.now();
  controllerState = "idle";

  return Object.freeze({
    approved: true,
    targetWorkspaceId: resumed.state?.workspaceId ?? null,
    previousWorkspaceId: null,
    status: getExecutiveWorkspaceTransitionStatus(),
    reason: "passive_resume_applied",
  });
}

export function assertTransitionControllerCannotExecute(mutationKind: string): void {
  warnWorkspaceTransitionBrake("Unauthorized activation.", { mutationKind });
}
