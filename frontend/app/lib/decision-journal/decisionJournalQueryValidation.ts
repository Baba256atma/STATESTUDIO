/**
 * APP-8:3 — Decision Journal Query validation.
 */

import { validateDecisionJournal } from "./decisionJournalContracts.ts";
import { isDecisionJournalEngineInitialized } from "./decisionJournalEngine.ts";
import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import {
  isDecisionJournalConfidence,
  isDecisionJournalSource,
  isDecisionJournalStatus,
  validateWorkspaceIsolation,
} from "./decisionJournalValidation.ts";
import {
  DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
  DEFAULT_DECISION_JOURNAL_QUERY_DIRECTION,
  type DecisionJournalQueryFilters,
  type DecisionJournalQueryInput,
  type DecisionJournalQueryResult,
  type DecisionJournalValidationIssue,
  type DecisionJournalValidationResult,
} from "./decisionJournalQueryTypes.ts";

function issue(code: string, message: string, field?: string): DecisionJournalValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionJournalValidationIssue[]): DecisionJournalValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForQuery(timestamp: string): DecisionJournalValidationResult {
  const foundation = validateDecisionJournal(timestamp);
  return result(foundation.valid ? [] : foundation.issues);
}

export function validateJournalEngineAvailabilityForQuery(): DecisionJournalValidationResult {
  if (!isDecisionJournalEngineInitialized()) {
    return result([issue("engine_not_initialized", "APP-8:2 Decision Journal Engine is not initialized.")]);
  }
  return result([]);
}

export function validateDecisionJournalQueryInput(input: DecisionJournalQueryInput): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  const filters = input.filters;

  if (!filters.workspaceId?.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }

  if (filters.status !== undefined && !isDecisionJournalStatus(filters.status)) {
    issues.push(issue("invalid_enum", "Invalid status.", "status"));
  }
  if (filters.source !== undefined && !isDecisionJournalSource(filters.source)) {
    issues.push(issue("invalid_enum", "Invalid source.", "source"));
  }
  if (filters.confidence !== undefined && !isDecisionJournalConfidence(filters.confidence)) {
    issues.push(issue("invalid_enum", "Invalid confidence.", "confidence"));
  }

  if (filters.direction !== undefined && filters.direction !== "asc" && filters.direction !== "desc") {
    issues.push(issue("invalid_enum", "Invalid direction.", "direction"));
  }

  if (filters.updatedAtFrom && filters.updatedAtTo && filters.updatedAtFrom > filters.updatedAtTo) {
    issues.push(issue("invalid_range", "updatedAtFrom must be before or equal to updatedAtTo.", "updatedAtFrom"));
  }
  if (filters.createdAtFrom && filters.createdAtTo && filters.createdAtFrom > filters.createdAtTo) {
    issues.push(issue("invalid_range", "createdAtFrom must be before or equal to createdAtTo.", "createdAtFrom"));
  }

  return result(issues);
}

export function validateDecisionJournalQueryResult(resultValue: DecisionJournalQueryResult): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];

  if (resultValue.contractVersion !== DECISION_JOURNAL_QUERY_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid contract version.", "contractVersion"));
  }
  if (resultValue.readOnly !== true) {
    issues.push(issue("contract_violation", "Query result must be read-only.", "readOnly"));
  }
  if (resultValue.totalEntries !== resultValue.entries.length) {
    issues.push(issue("invalid_field", "totalEntries must match entries length.", "totalEntries"));
  }
  if (resultValue.ordering.primary !== "updatedAt") {
    issues.push(issue("invalid_field", "Invalid ordering primary field.", "ordering"));
  }
  if (resultValue.ordering.direction !== "asc" && resultValue.ordering.direction !== "desc") {
    issues.push(issue("invalid_field", "Invalid ordering direction.", "ordering"));
  }

  return result(issues);
}

export function validateWorkspaceIsolationForQueryResult(
  entries: readonly DecisionJournalEngineEntry[],
  workspaceId: string
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationIssue[] = [];
  for (const entry of entries) {
    const isolation = validateWorkspaceIsolation(workspaceId, entry.workspaceId);
    if (!isolation.valid) {
      issues.push(...isolation.issues);
      break;
    }
  }
  return result(issues);
}

export function resolveQueryDirection(filters: DecisionJournalQueryFilters): "asc" | "desc" {
  return filters.direction ?? DEFAULT_DECISION_JOURNAL_QUERY_DIRECTION;
}

export function assertNoMutationApisInQuerySource(source: string): boolean {
  return (
    !source.includes("createDecisionJournalEntry(") &&
    !source.includes("updateDecisionJournalMetadata(") &&
    !source.includes("archiveDecisionJournalEntry(") &&
    !source.includes("registerDecisionJournalEntry(")
  );
}

export const DecisionJournalQueryValidation = Object.freeze({
  validateFoundationCompatibilityForQuery,
  validateJournalEngineAvailabilityForQuery,
  validateDecisionJournalQueryInput,
  validateDecisionJournalQueryResult,
  validateWorkspaceIsolationForQueryResult,
  resolveQueryDirection,
  assertNoMutationApisInQuerySource,
});
