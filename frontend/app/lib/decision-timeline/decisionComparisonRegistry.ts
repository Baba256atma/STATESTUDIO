/**
 * APP-6:7 — Decision Comparison registry.
 * Ephemeral comparison cache — no persistence.
 */

import {
  DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
  DECISION_COMPARISON_ENGINE_LIMITS,
  type DecisionComparison,
  type DecisionComparisonRegistrySnapshot,
  type DecisionComparisonResponse,
  comparisonFailure,
  comparisonSuccess,
} from "./decisionComparisonTypes.ts";

const comparisonRegistry = new Map<string, DecisionComparison>();

export function resetDecisionComparisonRegistryForTests(): void {
  comparisonRegistry.clear();
}

export function registerDecisionComparison(comparison: DecisionComparison): DecisionComparisonResponse {
  if (comparisonRegistry.has(comparison.comparisonId)) {
    return comparisonFailure(`Comparison already registered: ${comparison.comparisonId}.`);
  }
  if (comparisonRegistry.size >= DECISION_COMPARISON_ENGINE_LIMITS.maxRegisteredComparisons) {
    return comparisonFailure("Decision comparison registry is full.");
  }
  comparisonRegistry.set(comparison.comparisonId, comparison);
  return comparisonSuccess("Decision comparison registered.", comparison);
}

export function getRegisteredDecisionComparison(comparisonId: string): DecisionComparison | null {
  return comparisonRegistry.get(comparisonId) ?? null;
}

export function getDecisionComparisonRegistry(): DecisionComparisonRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
    registeredComparisonCount: comparisonRegistry.size,
    comparisonIds: Object.freeze([...comparisonRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionComparisonRegistry = Object.freeze({
  resetDecisionComparisonRegistryForTests,
  registerDecisionComparison,
  getRegisteredDecisionComparison,
  getDecisionComparisonRegistry,
});
