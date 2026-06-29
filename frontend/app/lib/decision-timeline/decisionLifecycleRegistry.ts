/**
 * APP-6:4 — Decision Lifecycle registry.
 * Ephemeral derived lifecycle cache — no persistence.
 */

import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  DECISION_LIFECYCLE_ENGINE_LIMITS,
  type DecisionLifecycle,
  type DecisionLifecycleRegistrySnapshot,
  type DecisionLifecycleResult,
  lifecycleFailure,
  lifecycleSuccess,
} from "./decisionLifecycleTypes.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

const lifecycleRegistry = new Map<DecisionId, DecisionLifecycle>();

export function resetDecisionLifecycleRegistryForTests(): void {
  lifecycleRegistry.clear();
}

export function registerDecisionLifecycle(
  lifecycle: DecisionLifecycle
): DecisionLifecycleResult<DecisionLifecycle> {
  if (lifecycleRegistry.size >= DECISION_LIFECYCLE_ENGINE_LIMITS.maxRegisteredLifecycles) {
    return lifecycleFailure("Decision lifecycle registry is full.");
  }

  lifecycleRegistry.set(lifecycle.decisionId, lifecycle);
  return lifecycleSuccess("Decision lifecycle registered.", lifecycle);
}

export function getRegisteredDecisionLifecycle(decisionId: DecisionId): DecisionLifecycle | null {
  return lifecycleRegistry.get(decisionId) ?? null;
}

export function getDecisionLifecycleRegistry(): DecisionLifecycleRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    registeredLifecycleCount: lifecycleRegistry.size,
    decisionIds: Object.freeze([...lifecycleRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionLifecycleRegistry = Object.freeze({
  registerDecisionLifecycle,
  getRegisteredDecisionLifecycle,
  getDecisionLifecycleRegistry,
  resetDecisionLifecycleRegistryForTests,
});
