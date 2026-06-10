/**
 * MRP:8:2 — Executive Workspace Lifecycle Manager runtime.
 *
 * Tracks lifecycle state. Validates transitions. Never executes or renders workspaces.
 */

import { initializeExecutiveWorkspaceRegistry } from "./executiveWorkspaceRegistryRuntime.ts";
import {
  getExecutiveWorkspaceEntry,
  listExecutiveWorkspaceIds,
  type ExecutiveWorkspaceId,
} from "./executiveWorkspaceRegistryContract.ts";
import {
  buildDashboardWorkspaceStateView,
  mapRegistryAvailabilityToInitialLifecycle,
  resetExecutiveWorkspaceLifecycleForTests,
  validateLifecycleTransition,
  warnWorkspaceLifecycleBrake,
  type DashboardWorkspaceStateView,
  type ExecutiveWorkspaceLifecycleState,
  type LifecycleTransitionResult,
  type WorkspaceLifecycleOpenValidationResult,
} from "./executiveWorkspaceLifecycleContract.ts";

let lifecycleInitialized = false;
const workspaceStates = new Map<ExecutiveWorkspaceId, DashboardWorkspaceStateView>();
let activeWorkspaceId: ExecutiveWorkspaceId | null = null;

export function resetExecutiveWorkspaceLifecycleRuntimeForTests(): void {
  lifecycleInitialized = false;
  workspaceStates.clear();
  activeWorkspaceId = null;
  resetExecutiveWorkspaceLifecycleForTests();
}

export function initializeExecutiveWorkspaceLifecycle(): Readonly<{
  workspaceCount: number;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
}> {
  if (lifecycleInitialized) {
    return Object.freeze({
      workspaceCount: workspaceStates.size,
      activeWorkspaceId,
    });
  }

  initializeExecutiveWorkspaceRegistry();
  lifecycleInitialized = true;

  for (const id of listExecutiveWorkspaceIds()) {
    const entry = getExecutiveWorkspaceEntry(id);
    const initialState = mapRegistryAvailabilityToInitialLifecycle(entry);
    workspaceStates.set(
      id,
      buildDashboardWorkspaceStateView({
        workspaceId: id,
        currentState: initialState,
        availabilityState: entry.availability,
      })
    );
  }

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[WorkspaceLifecycle][Init]", {
      workspaceCount: workspaceStates.size,
    });
  }

  return Object.freeze({
    workspaceCount: workspaceStates.size,
    activeWorkspaceId,
  });
}

export function getWorkspaceLifecycleState(
  workspaceId: ExecutiveWorkspaceId
): DashboardWorkspaceStateView | null {
  initializeExecutiveWorkspaceLifecycle();
  return workspaceStates.get(workspaceId) ?? null;
}

export function getActiveWorkspaceLifecycleState(): DashboardWorkspaceStateView | null {
  initializeExecutiveWorkspaceLifecycle();
  return activeWorkspaceId ? workspaceStates.get(activeWorkspaceId) ?? null : null;
}

function applyTransition(
  workspaceId: ExecutiveWorkspaceId,
  to: ExecutiveWorkspaceLifecycleState
): LifecycleTransitionResult {
  initializeExecutiveWorkspaceLifecycle();
  const current = workspaceStates.get(workspaceId);
  if (!current) {
    warnWorkspaceLifecycleBrake("Unknown workspace.", { workspaceId });
    return Object.freeze({ accepted: false, state: null, reason: "unknown_workspace" });
  }

  const validation = validateLifecycleTransition(current.currentState, to);
  if (!validation.valid) {
    return Object.freeze({ accepted: false, state: current, reason: validation.reason });
  }

  if (current.currentState === to) {
    return Object.freeze({ accepted: true, state: current, reason: "no_op_transition" });
  }

  const now = Date.now();
  const next = buildDashboardWorkspaceStateView({
    workspaceId,
    currentState: to,
    previousState: current.currentState,
    activationTimestamp:
      to === "active" ? now : to === "opening" ? now : current.activationTimestamp,
    lastTransitionTimestamp: now,
    availabilityState: current.availabilityState,
  });

  workspaceStates.set(workspaceId, next);

  if (to === "active") {
    if (activeWorkspaceId && activeWorkspaceId !== workspaceId) {
      warnWorkspaceLifecycleBrake("Duplicate active workspace.", {
        previous: activeWorkspaceId,
        next: workspaceId,
      });
      return Object.freeze({
        accepted: false,
        state: current,
        reason: "duplicate_active_workspace",
      });
    }
    activeWorkspaceId = workspaceId;
  } else if (activeWorkspaceId === workspaceId && (to === "completed" || to === "closed" || to === "paused")) {
    if (to !== "paused") {
      activeWorkspaceId = null;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[WorkspaceLifecycle][Transition]", {
      workspaceId,
      from: current.currentState,
      to,
    });
  }

  return Object.freeze({ accepted: true, state: next, reason: "transition_applied" });
}

function settleActiveWorkspaceForSwitch(nextWorkspaceId: ExecutiveWorkspaceId): void {
  const previousActiveId = activeWorkspaceId;
  if (!previousActiveId || previousActiveId === nextWorkspaceId) return;
  const active = workspaceStates.get(previousActiveId);
  if (!active) return;
  if (active.currentState === "active" || active.currentState === "paused") {
    applyTransition(previousActiveId, "completed");
    applyTransition(previousActiveId, "closed");
  }
}

export function validateWorkspaceLifecycleOpen(
  workspaceId: ExecutiveWorkspaceId
): WorkspaceLifecycleOpenValidationResult {
  initializeExecutiveWorkspaceLifecycle();
  const entry = getExecutiveWorkspaceEntry(workspaceId);
  const state = workspaceStates.get(workspaceId);

  if (!state) {
    warnWorkspaceLifecycleBrake("Unknown workspace.", { workspaceId });
    return Object.freeze({
      valid: false,
      workspaceId: null,
      state: null,
      reason: "unknown_workspace",
    });
  }

  if (entry.availability === "future") {
    warnWorkspaceLifecycleBrake("Lifecycle registry mismatch.", { workspaceId, availability: "future" });
    return Object.freeze({
      valid: false,
      workspaceId,
      state,
      reason: "lifecycle_registry_mismatch",
    });
  }

  if (state.currentState === "deprecated" || state.currentState === "future") {
    warnWorkspaceLifecycleBrake("Invalid transition.", {
      workspaceId,
      state: state.currentState,
    });
    return Object.freeze({
      valid: false,
      workspaceId,
      state,
      reason: "invalid_lifecycle_state",
    });
  }

  if (state.currentState === "closed") {
    return Object.freeze({
      valid: true,
      workspaceId,
      state,
      reason: "reopen_allowed",
    });
  }

  if (state.currentState === "active" && activeWorkspaceId === workspaceId) {
    return Object.freeze({
      valid: true,
      workspaceId,
      state,
      reason: "already_active",
    });
  }

  if (state.currentState === "paused" && activeWorkspaceId === workspaceId) {
    const resume = validateLifecycleTransition("paused", "active");
    return Object.freeze({
      valid: resume.valid,
      workspaceId,
      state,
      reason: resume.valid ? "resume_allowed" : resume.reason,
    });
  }

  const open = validateLifecycleTransition(state.currentState, "opening");
  if (!open.valid && state.currentState !== "available") {
    return Object.freeze({
      valid: false,
      workspaceId,
      state,
      reason: open.reason,
    });
  }

  return Object.freeze({
    valid: true,
    workspaceId,
    state,
    reason: "lifecycle_open_allowed",
  });
}

export function prepareWorkspaceLifecycleOpen(
  workspaceId: ExecutiveWorkspaceId
): LifecycleTransitionResult {
  const validation = validateWorkspaceLifecycleOpen(workspaceId);
  if (!validation.valid || !validation.state) {
    return Object.freeze({
      accepted: false,
      state: validation.state,
      reason: validation.reason,
    });
  }

  if (validation.reason === "already_active") {
    return Object.freeze({
      accepted: true,
      state: validation.state,
      reason: "already_active",
    });
  }

  if (validation.state.currentState === "paused") {
    return applyTransition(workspaceId, "active");
  }

  settleActiveWorkspaceForSwitch(workspaceId);

  if (validation.state.currentState === "available") {
    return applyTransition(workspaceId, "opening");
  }

  if (validation.state.currentState === "opening") {
    return Object.freeze({
      accepted: true,
      state: validation.state,
      reason: "already_opening",
    });
  }

  if (validation.state.currentState === "closed") {
    const reopened = applyTransition(workspaceId, "available");
    if (!reopened.accepted) {
      return reopened;
    }
    return applyTransition(workspaceId, "opening");
  }

  warnWorkspaceLifecycleBrake("Lifecycle mismatch.", {
    workspaceId,
    state: validation.state.currentState,
  });
  return Object.freeze({
    accepted: false,
    state: validation.state,
    reason: "lifecycle_mismatch",
  });
}

export function commitWorkspaceLifecycleOpen(
  workspaceId: ExecutiveWorkspaceId
): LifecycleTransitionResult {
  const state = workspaceStates.get(workspaceId);
  if (!state) {
    warnWorkspaceLifecycleBrake("Missing lifecycle contract.", { workspaceId });
    return Object.freeze({ accepted: false, state: null, reason: "missing_lifecycle_contract" });
  }

  if (state.currentState === "active") {
    return Object.freeze({ accepted: true, state, reason: "already_active" });
  }

  if (state.currentState === "opening") {
    return applyTransition(workspaceId, "active");
  }

  if (state.currentState === "paused") {
    return applyTransition(workspaceId, "active");
  }

  warnWorkspaceLifecycleBrake("Lifecycle mismatch.", {
    workspaceId,
    state: state.currentState,
  });
  return Object.freeze({ accepted: false, state, reason: "lifecycle_mismatch" });
}

export function pauseActiveWorkspaceLifecycle(): LifecycleTransitionResult {
  initializeExecutiveWorkspaceLifecycle();
  if (!activeWorkspaceId) {
    return Object.freeze({ accepted: false, state: null, reason: "no_active_workspace" });
  }
  const state = workspaceStates.get(activeWorkspaceId);
  if (!state || state.currentState !== "active") {
    return Object.freeze({ accepted: false, state: state ?? null, reason: "not_active" });
  }
  return applyTransition(activeWorkspaceId, "paused");
}

export function resumeActiveWorkspaceLifecycle(): LifecycleTransitionResult {
  initializeExecutiveWorkspaceLifecycle();
  if (!activeWorkspaceId) {
    return Object.freeze({ accepted: false, state: null, reason: "no_active_workspace" });
  }
  const state = workspaceStates.get(activeWorkspaceId);
  if (!state || state.currentState !== "paused") {
    return Object.freeze({ accepted: false, state: state ?? null, reason: "not_paused" });
  }
  return applyTransition(activeWorkspaceId, "active");
}

export function getWorkspaceLifecycleSnapshot(): DashboardWorkspaceStateView | null {
  return getActiveWorkspaceLifecycleState();
}

export function assertLifecycleCannotMutateDashboard(mutationKind: string): void {
  warnWorkspaceLifecycleBrake("State ownership violation.", { mutationKind });
}
