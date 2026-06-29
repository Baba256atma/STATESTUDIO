/**
 * APP-6:6 — Decision Query validation.
 * Validates query inputs and DecisionState compatibility.
 */

import { isDecisionEngineLifecycle } from "./decisionEventValidation.ts";
import {
  DECISION_QUERY_ENGINE_LIMITS,
  DECISION_QUERY_FILTER_KEYS,
  DECISION_QUERY_SORT_FIELDS,
  type DecisionQueryFilters,
  type DecisionQueryInput,
  type DecisionQueryResult,
  type DecisionQuerySort,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionQueryTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";
import { isDecisionCategory, isDecisionStatus } from "./decisionTimelineValidation.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function isValidIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function isValidSortField(value: string): value is DecisionQuerySort["field"] {
  return (DECISION_QUERY_SORT_FIELDS as readonly string[]).includes(value);
}

export function validateDecisionQueryFilters(filters: DecisionQueryFilters): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  for (const key of Object.keys(filters)) {
    if (!(DECISION_QUERY_FILTER_KEYS as readonly string[]).includes(key)) {
      issues.push(issue("unsupported_filter", `Unsupported filter key: ${key}.`, key));
    }
  }

  if (filters.lifecycle && !isDecisionEngineLifecycle(filters.lifecycle)) {
    issues.push(issue("invalid_filter", "Invalid lifecycle filter.", "lifecycle"));
  }
  if (filters.status && !isDecisionStatus(filters.status)) {
    issues.push(issue("invalid_filter", "Invalid status filter.", "status"));
  }
  if (filters.category && !isDecisionCategory(filters.category)) {
    issues.push(issue("invalid_filter", "Invalid category filter.", "category"));
  }
  if (filters.createdAfter && !isValidIsoDate(filters.createdAfter)) {
    issues.push(issue("invalid_filter", "createdAfter must be a valid ISO-8601 timestamp.", "createdAfter"));
  }
  if (filters.createdBefore && !isValidIsoDate(filters.createdBefore)) {
    issues.push(issue("invalid_filter", "createdBefore must be a valid ISO-8601 timestamp.", "createdBefore"));
  }
  if (
    filters.createdAfter &&
    filters.createdBefore &&
    Date.parse(filters.createdBefore) < Date.parse(filters.createdAfter)
  ) {
    issues.push(issue("invalid_filter", "createdBefore must be >= createdAfter.", "createdBefore"));
  }
  if (filters.terminal !== undefined && filters.active !== undefined && filters.terminal && filters.active) {
    issues.push(issue("invalid_filter", "terminal and active filters cannot both be true.", "terminal"));
  }
  if (filters.tags) {
    if (filters.tags.length > DECISION_QUERY_ENGINE_LIMITS.maxTagFilterCount) {
      issues.push(issue("invalid_filter", "tags filter exceeds maximum count.", "tags"));
    }
    for (const tag of filters.tags) {
      if (!tag.trim()) {
        issues.push(issue("invalid_filter", "tags must be non-empty strings.", "tags"));
      }
    }
  }

  return result(issues);
}

export function validateDecisionQuerySort(sort: DecisionQuerySort | undefined): DecisionValidationResult {
  if (!sort) {
    return result([]);
  }

  const issues: DecisionValidationIssue[] = [];
  if (!isValidSortField(sort.field)) {
    issues.push(issue("invalid_sort", "Invalid sort field.", "field"));
  }
  if (sort.direction !== "asc" && sort.direction !== "desc") {
    issues.push(issue("invalid_sort", "Sort direction must be asc or desc.", "direction"));
  }
  return result(issues);
}

export function validateDecisionQueryInput(input: DecisionQueryInput): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  issues.push(...validateDecisionQueryFilters(input.filters).issues);
  issues.push(...validateDecisionQuerySort(input.sort).issues);

  if (input.limit !== undefined) {
    if (!Number.isInteger(input.limit) || input.limit < 1) {
      issues.push(issue("invalid_limit", "limit must be a positive integer.", "limit"));
    }
    if (input.limit > DECISION_QUERY_ENGINE_LIMITS.maxResultCount) {
      issues.push(issue("invalid_limit", "limit exceeds maximum result count.", "limit"));
    }
  }

  return result(issues);
}

export function validateDecisionStateCompatibility(state: DecisionState): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (state.readOnly !== true) {
    issues.push(issue("state_incompatible", "DecisionState must be read-only.", "readOnly"));
  }
  if (state.stateVersion !== DECISION_STATE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("state_incompatible", "DecisionState version must be APP-6/5.", "stateVersion"));
  }
  if (state.lifecycleVersion !== DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("lifecycle_incompatible", "DecisionState lifecycleVersion is incompatible.", "lifecycleVersion"));
  }
  if (!state.decisionId.trim()) {
    issues.push(issue("missing_state", "DecisionState decisionId is required.", "decisionId"));
  }
  if (!state.workspaceId.trim()) {
    issues.push(issue("missing_state", "DecisionState workspaceId is required.", "workspaceId"));
  }

  return result(issues);
}

export function validateWorkspaceIsolationForQuery(
  states: readonly DecisionState[],
  filters: DecisionQueryFilters
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (filters.workspaceId) {
    for (const state of states) {
      if (state.workspaceId !== filters.workspaceId) {
        issues.push(
          issue(
            "workspace_isolation_violation",
            `Result state ${state.decisionId} is outside workspace ${filters.workspaceId}.`,
            "workspaceId"
          )
        );
      }
    }
  }

  if (filters.decisionId && filters.workspaceId) {
    const target = states.find((state) => state.decisionId === filters.decisionId);
    if (target && target.workspaceId !== filters.workspaceId) {
      issues.push(
        issue(
          "workspace_isolation_violation",
          "decisionId does not belong to the requested workspace.",
          "decisionId"
        )
      );
    }
  }

  return result(issues);
}

export function validateDecisionQueryResult(resultObject: DecisionQueryResult): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (resultObject.readOnly !== true) {
    issues.push(issue("contract_violation", "Query results must be read-only.", "readOnly"));
  }
  if (resultObject.states.length > DECISION_QUERY_ENGINE_LIMITS.maxResultCount) {
    issues.push(issue("result_limit", "Query result exceeds maximum state count.", "states"));
  }
  if (!Object.isFrozen(resultObject.states)) {
    issues.push(issue("immutability_violation", "Query result states must be frozen.", "states"));
  }

  return result(issues);
}

export function validateFoundationCompatibilityForQuery(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field)));
}

export function validateDecisionQuery(input: DecisionQueryInput): DecisionValidationResult {
  return validateDecisionQueryInput(input);
}

export const DecisionQueryValidation = Object.freeze({
  validateDecisionQueryFilters,
  validateDecisionQuerySort,
  validateDecisionQueryInput,
  validateDecisionStateCompatibility,
  validateWorkspaceIsolationForQuery,
  validateDecisionQueryResult,
  validateFoundationCompatibilityForQuery,
  validateDecisionQuery,
});
