/**
 * APP-6:6 — Decision Query registry.
 * Ephemeral query cache and optional query attributes — no persistence.
 */

import { getDecisionStateRegistry, getRegisteredDecisionState } from "./decisionStateRegistry.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import {
  DECISION_QUERY_ENGINE_CONTRACT_VERSION,
  DECISION_QUERY_ENGINE_LIMITS,
  type DecisionQueryAttributes,
  type DecisionQueryRegistrySnapshot,
  type DecisionQueryResponse,
  type DecisionQueryResult,
  queryFailure,
  querySuccess,
} from "./decisionQueryTypes.ts";
import type { DecisionId } from "./decisionTimelineTypes.ts";

const queryRegistry = new Map<string, DecisionQueryResult>();
const queryAttributesRegistry = new Map<DecisionId, DecisionQueryAttributes>();

export function resetDecisionQueryRegistryForTests(): void {
  queryRegistry.clear();
  queryAttributesRegistry.clear();
}

export function registerDecisionQueryAttributes(
  decisionId: DecisionId,
  attributes: Omit<DecisionQueryAttributes, "readOnly">
): DecisionQueryAttributes {
  const entry = Object.freeze({
    category: attributes.category,
    tags: attributes.tags ? Object.freeze([...attributes.tags]) : undefined,
    readOnly: true as const,
  });
  queryAttributesRegistry.set(decisionId, entry);
  return entry;
}

export function getDecisionQueryAttributes(decisionId: DecisionId): DecisionQueryAttributes | null {
  return queryAttributesRegistry.get(decisionId) ?? null;
}

export function getDecisionQueryAttributesRegistry(): ReadonlyMap<string, DecisionQueryAttributes> {
  return queryAttributesRegistry;
}

export function collectQueryableDecisionStates(): readonly DecisionState[] {
  const registry = getDecisionStateRegistry();
  const states: DecisionState[] = [];

  for (const decisionId of registry.decisionIds) {
    const state = getRegisteredDecisionState(decisionId);
    if (state) {
      states.push(state);
    }
  }

  return Object.freeze(states);
}

export function registerDecisionQueryResult(result: DecisionQueryResult): DecisionQueryResponse {
  if (queryRegistry.size >= DECISION_QUERY_ENGINE_LIMITS.maxRegisteredQueries) {
    return queryFailure("Decision query registry is full.");
  }
  queryRegistry.set(result.queryId, result);
  return querySuccess("Decision query registered.", result);
}

export function getRegisteredDecisionQuery(queryId: string): DecisionQueryResult | null {
  return queryRegistry.get(queryId) ?? null;
}

export function getDecisionQueryRegistry(): DecisionQueryRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_QUERY_ENGINE_CONTRACT_VERSION,
    registeredQueryCount: queryRegistry.size,
    queryIds: Object.freeze([...queryRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionQueryRegistry = Object.freeze({
  resetDecisionQueryRegistryForTests,
  registerDecisionQueryAttributes,
  getDecisionQueryAttributes,
  getDecisionQueryAttributesRegistry,
  collectQueryableDecisionStates,
  registerDecisionQueryResult,
  getRegisteredDecisionQuery,
  getDecisionQueryRegistry,
});
