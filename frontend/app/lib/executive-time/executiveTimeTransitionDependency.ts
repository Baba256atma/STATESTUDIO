/**
 * APP-1:5 — Executive Time Transition Dependency validation.
 * Metadata-only dependency checks — no execution.
 */

import { resolveExecutiveTimeStateTemporalSnapshot } from "./executiveTimeStateEngine.ts";
import { getExecutiveTimeCameraPosition } from "./executiveTimeCameraEngine.ts";
import { getExecutiveTimeEntityCurrentState } from "./executiveTimeStateMutation.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export type ExecutiveTimeTransitionDependencyKind =
  | "state_dependency"
  | "entity_dependency"
  | "approval_dependency"
  | "context_dependency"
  | "camera_dependency"
  | "workspace_dependency";

export type ExecutiveTimeTransitionDependencySpec = Readonly<{
  kind: ExecutiveTimeTransitionDependencyKind;
  satisfied: boolean;
  message: string;
}>;

export type ExecutiveTimeTransitionDependencyResult = Readonly<{
  valid: boolean;
  status: "satisfied" | "blocked" | "partial";
  dependencies: readonly ExecutiveTimeTransitionDependencySpec[];
  blockingIssues: readonly string[];
}>;

export function validateTransitionDependencies(input: {
  workspaceId: string;
  entityId: string;
  entityType: ExecutiveTimeEntityType;
  currentState: string;
  targetState: string;
  requiredDependencies?: readonly string[];
}): ExecutiveTimeTransitionDependencyResult {
  const workspaceId = input.workspaceId.trim();
  const dependencies: ExecutiveTimeTransitionDependencySpec[] = [];
  const blockingIssues: string[] = [];

  const storedState = getExecutiveTimeEntityCurrentState({
    workspaceId,
    entityType: input.entityType,
    entityId: input.entityId,
    fallbackState: input.currentState,
  });
  const stateOk = storedState === input.currentState || storedState === null;
  dependencies.push(Object.freeze({
    kind: "state_dependency",
    satisfied: stateOk,
    message: stateOk ? "Current state dependency satisfied." : "Stored state does not match declared current state.",
  }));
  if (!stateOk) blockingIssues.push("State dependency mismatch.");

  dependencies.push(Object.freeze({
    kind: "entity_dependency",
    satisfied: Boolean(input.entityId.trim()),
    message: input.entityId.trim() ? "Entity dependency satisfied." : "Entity id is required.",
  }));
  if (!input.entityId.trim()) blockingIssues.push("Entity dependency missing.");

  const temporal = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });
  dependencies.push(Object.freeze({
    kind: "context_dependency",
    satisfied: Boolean(temporal.currentContextId),
    message: temporal.currentContextId ? `Context ${temporal.currentContextId} available.` : "Context unavailable.",
  }));

  const camera = getExecutiveTimeCameraPosition(workspaceId);
  dependencies.push(Object.freeze({
    kind: "camera_dependency",
    satisfied: Boolean(camera?.currentContext),
    message: camera?.currentContext ? `Camera context ${camera.currentContext} available.` : "Camera position unavailable.",
  }));

  dependencies.push(Object.freeze({
    kind: "workspace_dependency",
    satisfied: Boolean(workspaceId),
    message: workspaceId ? "Workspace dependency satisfied." : "Workspace id required.",
  }));

  for (const required of input.requiredDependencies ?? []) {
    dependencies.push(Object.freeze({
      kind: "entity_dependency",
      satisfied: false,
      message: `External dependency "${required}" not resolved (metadata-only).`,
    }));
    blockingIssues.push(`Unresolved dependency: ${required}.`);
  }

  const unsatisfied = dependencies.filter((entry) => !entry.satisfied);
  const status = unsatisfied.length === 0 ? "satisfied" : blockingIssues.length > 0 ? "blocked" : "partial";

  return Object.freeze({
    valid: blockingIssues.length === 0,
    status,
    dependencies: Object.freeze(dependencies),
    blockingIssues: Object.freeze(blockingIssues),
  });
}
