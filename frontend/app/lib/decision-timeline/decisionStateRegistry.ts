/**
 * APP-6:5 — Decision State registry.
 * Ephemeral derived state cache — no persistence.
 */

import {
  DECISION_STATE_ENGINE_CONTRACT_VERSION,
  DECISION_STATE_ENGINE_LIMITS,
  type DecisionState,
  type DecisionStateRegistrySnapshot,
  type DecisionStateResult,
  stateFailure,
  stateSuccess,
} from "./decisionStateTypes.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

const stateRegistry = new Map<DecisionId, DecisionState>();

export function resetDecisionStateRegistryForTests(): void {
  stateRegistry.clear();
}

export function registerDecisionState(state: DecisionState): DecisionStateResult<DecisionState> {
  if (stateRegistry.size >= DECISION_STATE_ENGINE_LIMITS.maxRegisteredStates) {
    return stateFailure("Decision state registry is full.");
  }

  stateRegistry.set(state.decisionId, state);
  return stateSuccess("Decision state registered.", state);
}

export function getRegisteredDecisionState(decisionId: DecisionId): DecisionState | null {
  return stateRegistry.get(decisionId) ?? null;
}

export function getDecisionStateRegistry(): DecisionStateRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_STATE_ENGINE_CONTRACT_VERSION,
    registeredStateCount: stateRegistry.size,
    decisionIds: Object.freeze([...stateRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionStateRegistry = Object.freeze({
  registerDecisionState,
  getRegisteredDecisionState,
  getDecisionStateRegistry,
  resetDecisionStateRegistryForTests,
});
