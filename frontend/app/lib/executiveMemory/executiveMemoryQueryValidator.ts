/**
 * APP-4:4 — Executive Memory query validator.
 */

import { isExecutiveMemoryCategory } from "./executiveMemoryValidation.ts";
import { isExecutiveMemoryReferenceType } from "./executiveMemoryRecordValidation.ts";
import { createExecutiveMemoryQuery } from "./executiveMemoryQuery.ts";
import {
  EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS,
  EXECUTIVE_MEMORY_QUERY_SORT_FIELDS,
  EXECUTIVE_MEMORY_RETRIEVAL_LIMITS,
} from "./executiveMemoryRetrievalConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_LIFECYCLE_KEYS } from "./executiveMemoryStorageConstants.ts";
import type {
  CreateExecutiveMemoryQueryInput,
  ExecutiveMemoryQuery,
  ExecutiveMemoryQueryValidationIssue,
  ExecutiveMemoryQueryValidationResult,
} from "./executiveMemoryRetrievalTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveMemoryQueryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(
  issues: ExecutiveMemoryQueryValidationIssue[],
  query: ExecutiveMemoryQuery | null
): ExecutiveMemoryQueryValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    query,
    readOnly: true as const,
  });
}

function isNonEmptyIdentifier(value: string | undefined, field: string, issues: ExecutiveMemoryQueryValidationIssue[]): boolean {
  if (value === undefined) return true;
  if (value.trim().length === 0) {
    issues.push(issue("malformed_identifier", "Identifier must not be empty.", field));
    return false;
  }
  return true;
}

function isIsoTimestamp(value: string | undefined, field: string, issues: ExecutiveMemoryQueryValidationIssue[]): boolean {
  if (value === undefined) return true;
  if (!Number.isFinite(Date.parse(value))) {
    issues.push(issue("invalid_query", "Timestamp filter must be a valid ISO date.", field));
    return false;
  }
  return true;
}

function isLifecycleState(value: string): value is (typeof EXECUTIVE_MEMORY_STORAGE_LIFECYCLE_KEYS)[number] {
  return (EXECUTIVE_MEMORY_STORAGE_LIFECYCLE_KEYS as readonly string[]).includes(value);
}

export function validateExecutiveMemoryQuery(
  input: CreateExecutiveMemoryQueryInput | ExecutiveMemoryQuery
): ExecutiveMemoryQueryValidationResult {
  const issues: ExecutiveMemoryQueryValidationIssue[] = [];
  const query = createExecutiveMemoryQuery(input);

  isNonEmptyIdentifier(query.id, "id", issues);
  isNonEmptyIdentifier(query.workspaceId, "workspaceId", issues);
  isNonEmptyIdentifier(query.providerId, "providerId", issues);
  isNonEmptyIdentifier(query.goalId, "goalId", issues);
  isNonEmptyIdentifier(query.intentId, "intentId", issues);
  isNonEmptyIdentifier(query.scenarioId, "scenarioId", issues);
  isNonEmptyIdentifier(query.decisionId, "decisionId", issues);
  isNonEmptyIdentifier(query.schemaVersion, "schemaVersion", issues);
  isNonEmptyIdentifier(query.contractVersion, "contractVersion", issues);

  if (query.category !== undefined && !isExecutiveMemoryCategory(query.category)) {
    issues.push(issue("query_validation_failure", "Category filter is invalid.", "category"));
  }

  if (query.lifecycleState !== undefined && !isLifecycleState(query.lifecycleState)) {
    issues.push(issue("query_validation_failure", "Lifecycle state filter is invalid.", "lifecycleState"));
  }

  if (query.referenceTypes) {
    for (const referenceType of query.referenceTypes) {
      if (!isExecutiveMemoryReferenceType(referenceType)) {
        issues.push(
          issue("query_validation_failure", `Unsupported reference type: ${referenceType}.`, "referenceTypes")
        );
      }
    }
  }

  if (query.referenceIds) {
    for (const referenceId of query.referenceIds) {
      if (referenceId.trim().length === 0) {
        issues.push(issue("malformed_identifier", "Reference id must not be empty.", "referenceIds"));
      }
    }
  }

  if (query.tags) {
    for (const tag of query.tags) {
      if (tag.trim().length === 0) {
        issues.push(issue("malformed_identifier", "Tag filter must not be empty.", "tags"));
      }
    }
  }

  if (query.sortBy !== undefined && !(EXECUTIVE_MEMORY_QUERY_SORT_FIELDS as readonly string[]).includes(query.sortBy)) {
    issues.push(issue("invalid_sort", "Sort field is invalid.", "sortBy"));
  }

  if (
    query.sortDirection !== undefined &&
    !(EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS as readonly string[]).includes(query.sortDirection)
  ) {
    issues.push(issue("invalid_sort", "Sort direction is invalid.", "sortDirection"));
  }

  if (query.limit !== undefined) {
    if (!Number.isInteger(query.limit) || query.limit < 0 || query.limit > EXECUTIVE_MEMORY_RETRIEVAL_LIMITS.maxLimit) {
      issues.push(issue("invalid_pagination", "Limit must be a non-negative integer within bounds.", "limit"));
    }
  }

  if (query.offset !== undefined) {
    if (!Number.isInteger(query.offset) || query.offset < 0 || query.offset > EXECUTIVE_MEMORY_RETRIEVAL_LIMITS.maxOffset) {
      issues.push(issue("invalid_pagination", "Offset must be a non-negative integer within bounds.", "offset"));
    }
  }

  isIsoTimestamp(query.createdBefore, "createdBefore", issues);
  isIsoTimestamp(query.createdAfter, "createdAfter", issues);
  isIsoTimestamp(query.updatedBefore, "updatedBefore", issues);
  isIsoTimestamp(query.updatedAfter, "updatedAfter", issues);

  if (
    query.createdBefore &&
    query.createdAfter &&
    Date.parse(query.createdAfter) > Date.parse(query.createdBefore)
  ) {
    issues.push(issue("invalid_query", "createdAfter must be before createdBefore.", "createdAfter"));
  }

  if (
    query.updatedBefore &&
    query.updatedAfter &&
    Date.parse(query.updatedAfter) > Date.parse(query.updatedBefore)
  ) {
    issues.push(issue("invalid_query", "updatedAfter must be before updatedBefore.", "updatedAfter"));
  }

  return result(issues, issues.length === 0 ? query : null);
}

export const ExecutiveMemoryQueryValidator = Object.freeze({
  validateExecutiveMemoryQuery,
});
