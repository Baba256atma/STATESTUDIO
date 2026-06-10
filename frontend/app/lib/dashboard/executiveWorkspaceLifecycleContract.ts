/**
 * MRP:8:2 — Executive Workspace Lifecycle + Dashboard Workspace State Contract.
 *
 * Registry describes. Lifecycle manages. Dashboard executes. Workspace renders. Assistant observes.
 * Lifecycle owns transition state only — never execution or UI.
 */

import type { DashboardMode } from "./dashboardModeRuntimeContract.ts";
import {
  getExecutiveWorkspaceEntry,
  listExecutiveWorkspaceIds,
  resolveExecutiveWorkspaceByDashboardMode,
  resolveExecutiveWorkspaceByObjectPanelAction,
  type ExecutiveWorkspaceAvailabilityState,
  type ExecutiveWorkspaceCatalogEntry,
  type ExecutiveWorkspaceId,
} from "./executiveWorkspaceRegistryContract.ts";

export type ExecutiveWorkspaceLifecycleState =
  | "registered"
  | "available"
  | "opening"
  | "active"
  | "paused"
  | "completed"
  | "closed"
  | "deprecated"
  | "future";

export type DashboardWorkspaceStateView = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  currentState: ExecutiveWorkspaceLifecycleState;
  previousState: ExecutiveWorkspaceLifecycleState | null;
  activationTimestamp: number | null;
  lastTransitionTimestamp: number;
  availabilityState: ExecutiveWorkspaceAvailabilityState;
  lifecycleStatus: ExecutiveWorkspaceLifecycleState;
  source: "workspace_lifecycle_manager";
}>;

export type LifecycleTransitionResult = Readonly<{
  accepted: boolean;
  state: DashboardWorkspaceStateView | null;
  reason: string;
}>;

export type WorkspaceLifecycleOpenValidationResult = Readonly<{
  valid: boolean;
  workspaceId: ExecutiveWorkspaceId | null;
  state: DashboardWorkspaceStateView | null;
  reason: string;
}>;

const ALLOWED_TRANSITIONS: ReadonlySet<string> = new Set([
  "registered|available",
  "available|opening",
  "opening|active",
  "active|paused",
  "paused|active",
  "active|completed",
  "completed|closed",
  "closed|available",
]);

const loggedBrakes = new Set<string>();

export function warnWorkspaceLifecycleBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WorkspaceLifecycle][Brake]", { message, ...detail });
}

export function resetExecutiveWorkspaceLifecycleForTests(): void {
  loggedBrakes.clear();
}

export function isAllowedLifecycleTransition(
  from: ExecutiveWorkspaceLifecycleState,
  to: ExecutiveWorkspaceLifecycleState
): boolean {
  return ALLOWED_TRANSITIONS.has(`${from}|${to}`);
}

export function mapRegistryAvailabilityToInitialLifecycle(
  entry: ExecutiveWorkspaceCatalogEntry
): ExecutiveWorkspaceLifecycleState {
  switch (entry.availability) {
    case "future":
      return "future";
    case "deprecated":
      return "deprecated";
    case "disabled":
      return "registered";
    default:
      return entry.id === "overview" ? "available" : "available";
  }
}

export function buildDashboardWorkspaceStateView(input: {
  workspaceId: ExecutiveWorkspaceId;
  currentState: ExecutiveWorkspaceLifecycleState;
  previousState?: ExecutiveWorkspaceLifecycleState | null;
  activationTimestamp?: number | null;
  lastTransitionTimestamp?: number;
  availabilityState: ExecutiveWorkspaceAvailabilityState;
}): DashboardWorkspaceStateView {
  return Object.freeze({
    workspaceId: input.workspaceId,
    currentState: input.currentState,
    previousState: input.previousState ?? null,
    activationTimestamp: input.activationTimestamp ?? null,
    lastTransitionTimestamp: input.lastTransitionTimestamp ?? Date.now(),
    availabilityState: input.availabilityState,
    lifecycleStatus: input.currentState,
    source: "workspace_lifecycle_manager",
  });
}

export function validateLifecycleTransition(
  from: ExecutiveWorkspaceLifecycleState,
  to: ExecutiveWorkspaceLifecycleState
): { valid: boolean; reason: string } {
  if (from === to) {
    return Object.freeze({ valid: true, reason: "no_op_transition" });
  }
  if (to === "deprecated" || from === "deprecated") {
    warnWorkspaceLifecycleBrake("Invalid transition.", { from, to });
    return Object.freeze({ valid: false, reason: "invalid_transition" });
  }
  if (from === "closed" && to === "active") {
    warnWorkspaceLifecycleBrake("Invalid transition.", { from, to });
    return Object.freeze({ valid: false, reason: "invalid_transition" });
  }
  if (from === "future" && to === "active") {
    warnWorkspaceLifecycleBrake("Invalid transition.", { from, to });
    return Object.freeze({ valid: false, reason: "invalid_transition" });
  }
  if (from === "opening" && to === "registered") {
    warnWorkspaceLifecycleBrake("Invalid transition.", { from, to });
    return Object.freeze({ valid: false, reason: "invalid_transition" });
  }
  if (!isAllowedLifecycleTransition(from, to)) {
    warnWorkspaceLifecycleBrake("Invalid transition.", { from, to });
    return Object.freeze({ valid: false, reason: "invalid_transition" });
  }
  return Object.freeze({ valid: true, reason: "transition_allowed" });
}

export function resolveWorkspaceIdFromDashboardMode(
  mode: DashboardMode
): ExecutiveWorkspaceId | null {
  return resolveExecutiveWorkspaceByDashboardMode(mode)?.id ?? null;
}

export function resolveWorkspaceIdFromObjectPanelAction(
  action: string
): ExecutiveWorkspaceId | null {
  return resolveExecutiveWorkspaceByObjectPanelAction(
    action.trim().toLowerCase() as import("../object-panel/objectPanelActionRouterContract.ts").ObjectPanelDashboardAction
  )?.id ?? null;
}

export function getLifecycleTransitionMatrix(): Readonly<Record<string, readonly string[]>> {
  const matrix: Record<string, string[]> = {};
  for (const key of ALLOWED_TRANSITIONS) {
    const [from, to] = key.split("|");
    if (!matrix[from]) matrix[from] = [];
    matrix[from].push(to);
  }
  return Object.freeze(
    Object.fromEntries(Object.entries(matrix).map(([k, v]) => [k, Object.freeze(v)]))
  );
}
