/**
 * APP-1:4 — Executive Time State Engine.
 * Canonical lifecycle metadata — read-only camera/context consumption.
 */

import { getExecutiveTimeCameraPosition } from "./executiveTimeCameraEngine.ts";
import { resolveCurrentContext } from "./executiveTimeContextEngine.ts";
import {
  getExecutiveTimeStateRegistrySnapshot,
  listEntityStates,
  registerState,
  validateState,
} from "./executiveTimeStateRegistry.ts";
import {
  canTransition,
  isEditable,
  isKnownEntity,
  isKnownState,
  isTerminal,
  normalizeState,
  resolveDefaultState,
  resolveEditableState,
  resolveLifecycleOrder,
  resolveState,
  resolveTerminalState,
  resolveTerminalStates,
  validateExecutiveTimeStateTransition,
} from "./executiveTimeStateResolver.ts";
import type {
  ExecutiveTimeEntityStateDefinition,
  ExecutiveTimeEntityType,
  ExecutiveTimeStateTemporalSnapshot,
  ExecutiveTimeStateTransitionContract,
  ExecutiveTimeStateValidationResult,
} from "./executiveTimeStateTypes.ts";
import { EXECUTIVE_TIME_STATE_ENGINE_VERSION } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeWorkspaceId } from "./executiveTimeTypes.ts";
import {
  applyApprovedTransition,
  ExecutiveTimeStateMutationContract,
  getExecutiveTimeEntityCurrentState,
  resetExecutiveTimeEntityStateStoreForTests,
} from "./executiveTimeStateMutation.ts";

export {
  applyApprovedTransition,
  ExecutiveTimeStateMutationContract,
  getExecutiveTimeEntityCurrentState,
  resetExecutiveTimeEntityStateStoreForTests,
};
export type { ExecutiveTimeApprovedTransitionInput, ExecutiveTimeStateMutationResult } from "./executiveTimeTransitionAuthorityTypes.ts";

export function resolveExecutiveTimeStateTemporalSnapshot(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
}): ExecutiveTimeStateTemporalSnapshot {
  const workspaceId = input.workspaceId.trim();
  const context = resolveCurrentContext({ workspaceId });
  const camera = getExecutiveTimeCameraPosition(workspaceId);
  return Object.freeze({
    workspaceId,
    currentContextId: context.id,
    cameraMode: camera?.mode ?? "manual",
    cameraContext: camera?.currentContext ?? context.id,
    readOnly: true,
    engineVersion: EXECUTIVE_TIME_STATE_ENGINE_VERSION,
  });
}

export function resolveStateWithTemporalContext(input: {
  workspaceId: ExecutiveTimeWorkspaceId;
  entityType: ExecutiveTimeEntityType;
  stateId: string;
}): Readonly<{
  state: ExecutiveTimeEntityStateDefinition | null;
  temporal: ExecutiveTimeStateTemporalSnapshot;
}> {
  return Object.freeze({
    state: resolveState(input.entityType, input.stateId),
    temporal: resolveExecutiveTimeStateTemporalSnapshot({ workspaceId: input.workspaceId }),
  });
}

export const ExecutiveTimeStateEngine = Object.freeze({
  resolveExecutiveTimeStateTemporalSnapshot,
  resolveStateWithTemporalContext,
  resolveDefaultState,
  resolveState,
  normalizeState,
  resolveTerminalState,
  resolveTerminalStates,
  resolveEditableState,
  resolveLifecycleOrder,
  isTerminal,
  isEditable,
  canTransition,
  isKnownState,
  isKnownEntity,
  validateState,
  validateExecutiveTimeStateTransition,
  registerState,
  listEntityStates,
  getExecutiveTimeStateRegistrySnapshot,
  applyApprovedTransition,
  ExecutiveTimeStateMutationContract,
  getExecutiveTimeEntityCurrentState,
});

export type { ExecutiveTimeStateTransitionContract };
