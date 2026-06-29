/**
 * APP-6:3 — Decision History builder.
 * Constructs read-only decision histories from immutable events.
 */

import {
  calculateHistoryBounds,
  extractDecisionReferences,
  orderDecisionEventsForHistory,
} from "./decisionHistoryAggregator.ts";
import {
  createDecisionHistoryId,
  DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
  type BuildDecisionHistoryInput,
  type DecisionHistory,
  type DecisionValidationResult,
} from "./decisionHistoryTypes.ts";
import {
  validateDecisionHistory,
  validateDecisionHistoryEvents,
  validateDecisionHistoryShape,
} from "./decisionHistoryValidation.ts";

export function buildDecisionHistory(input: BuildDecisionHistoryInput): DecisionHistory {
  const orderedEvents = orderDecisionEventsForHistory(input.events);
  const validationResult = validateDecisionHistoryEvents(input.events);
  const bounds = calculateHistoryBounds(orderedEvents);
  const references = extractDecisionReferences(orderedEvents);

  const decisionId = orderedEvents[0]?.decisionId ?? input.events[0]?.decisionId ?? "unknown-decision";
  const workspaceId = orderedEvents[0]?.workspaceId ?? input.events[0]?.workspaceId ?? "unknown-workspace";
  const historyId = createDecisionHistoryId(decisionId, workspaceId);

  return Object.freeze({
    decisionId,
    workspaceId,
    historyId,
    historyVersion: DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
    eventCount: orderedEvents.length,
    firstEvent: bounds.firstEvent,
    latestEvent: bounds.latestEvent,
    events: Object.freeze([...input.events]),
    orderedEvents,
    currentLifecycle: bounds.currentLifecycle,
    currentVersion: bounds.currentVersion,
    createdAt: bounds.createdAt,
    updatedAt: bounds.updatedAt,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    references,
    validationResult,
    readOnly: true as const,
  });
}

export function freezeDecisionHistory(history: DecisionHistory): DecisionHistory {
  return Object.freeze({
    ...history,
    events: Object.freeze([...history.events]),
    orderedEvents: Object.freeze([...history.orderedEvents]),
    references: Object.freeze([...history.references]),
    metadata: Object.freeze({ ...history.metadata }),
    validationResult: Object.freeze({
      ...history.validationResult,
      issues: Object.freeze([...history.validationResult.issues]),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });
}

export { validateDecisionHistory };

export function validateDecisionHistoryIntegrity(history: DecisionHistory): DecisionValidationResult {
  const shapeValidation = validateDecisionHistoryShape(history);
  const fullValidation = validateDecisionHistory(history);
  const issues = [...shapeValidation.issues, ...fullValidation.issues];
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const DecisionHistoryBuilder = Object.freeze({
  buildDecisionHistory,
  freezeDecisionHistory,
  validateDecisionHistory,
  validateDecisionHistoryIntegrity,
});
