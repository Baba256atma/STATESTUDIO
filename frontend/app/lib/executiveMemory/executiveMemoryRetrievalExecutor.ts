/**
 * APP-4:4 — Executive Memory retrieval executor.
 * Deterministic query execution against APP-4:3 storage reads only.
 */

import { createExecutiveMemoryQuery } from "./executiveMemoryQuery.ts";
import { validateExecutiveMemoryQuery } from "./executiveMemoryQueryValidator.ts";
import { executiveMemoryRetrievalErrorFromCode } from "./executiveMemoryRetrievalErrors.ts";
import { createExecutiveMemoryRetrievalStatistics } from "./executiveMemoryRetrievalStatistics.ts";
import { getExecutiveMemories, getExecutiveMemoryById } from "./executiveMemoryStorageEngine.ts";
import type { ExecutiveMemoryListQuery, ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import type {
  ExecutiveMemoryQuery,
  ExecutiveMemoryQueryResult,
  ExecutiveMemoryQuerySortField,
  ExecutiveMemoryRetrievalQueryType,
  ExecutiveMemoryRetrievalResult,
} from "./executiveMemoryRetrievalTypes.ts";

function compareValues(left: string, right: string): number {
  return left.localeCompare(right);
}

function sortRecords(
  records: ExecutiveMemoryStoredRecord[],
  sortBy: ExecutiveMemoryQuerySortField,
  sortDirection: "asc" | "desc"
): ExecutiveMemoryStoredRecord[] {
  return [...records].sort((left, right) => {
    const leftValue =
      sortBy === "id" ? left.record.id : sortBy === "createdAt" ? left.record.createdAt : left.record.updatedAt;
    const rightValue =
      sortBy === "id" ? right.record.id : sortBy === "createdAt" ? right.record.createdAt : right.record.updatedAt;
    const comparison = compareValues(leftValue, rightValue);
    return sortDirection === "asc" ? comparison : -comparison;
  });
}

function paginateRecords(
  records: readonly ExecutiveMemoryStoredRecord[],
  limit?: number,
  offset?: number
): readonly ExecutiveMemoryStoredRecord[] {
  const start = offset ?? 0;
  if (limit === undefined) {
    return Object.freeze(records.slice(start));
  }
  return Object.freeze(records.slice(start, start + limit));
}

function matchesReferenceIds(record: ExecutiveMemoryStoredRecord, referenceIds: readonly string[]): boolean {
  const candidates = new Set<string>();
  for (const reference of record.record.references) {
    candidates.add(reference.referenceId);
    candidates.add(reference.targetId);
  }
  for (const reference of record.record.metadata.references) {
    candidates.add(reference.referenceId);
    candidates.add(reference.targetId);
  }
  return referenceIds.every((referenceId) => candidates.has(referenceId));
}

function matchesReferenceTypes(record: ExecutiveMemoryStoredRecord, referenceTypes: readonly string[]): boolean {
  const types = new Set<string>();
  for (const reference of record.record.references) {
    types.add(reference.referenceType);
  }
  for (const reference of record.record.metadata.references) {
    types.add(reference.referenceType);
  }
  return referenceTypes.some((referenceType) => types.has(referenceType));
}

function matchesTags(record: ExecutiveMemoryStoredRecord, tags: readonly string[]): boolean {
  const tagValues = new Set<string>();
  for (const tag of record.record.tags) {
    tagValues.add(tag.tagId);
    tagValues.add(tag.label);
  }
  for (const tag of record.record.metadata.tags) {
    tagValues.add(tag.tagId);
    tagValues.add(tag.label);
  }
  return tags.every((tag) => tagValues.has(tag));
}

function matchesTimestamp(value: string, before?: string, after?: string): boolean {
  const parsed = Date.parse(value);
  if (before && parsed > Date.parse(before)) return false;
  if (after && parsed < Date.parse(after)) return false;
  return true;
}

function matchesQuery(record: ExecutiveMemoryStoredRecord, query: ExecutiveMemoryQuery): boolean {
  if (query.id && record.record.id !== query.id) return false;
  if (query.workspaceId && record.record.workspaceId !== query.workspaceId) return false;
  if (query.providerId && record.record.providerId !== query.providerId) return false;
  if (query.category && record.record.category !== query.category) return false;
  if (query.goalId && record.record.goal?.goalId !== query.goalId) return false;
  if (query.intentId && record.record.intent?.intentId !== query.intentId) return false;
  if (query.scenarioId && record.record.scenario?.scenarioId !== query.scenarioId) return false;
  if (query.decisionId && record.record.decision?.decisionId !== query.decisionId) return false;
  if (query.referenceIds && !matchesReferenceIds(record, query.referenceIds)) return false;
  if (query.referenceTypes && !matchesReferenceTypes(record, query.referenceTypes)) return false;
  if (query.tags && !matchesTags(record, query.tags)) return false;
  if (query.lifecycleState && record.lifecycle !== query.lifecycleState) return false;
  if (query.schemaVersion && record.record.schemaVersion !== query.schemaVersion) return false;
  if (query.contractVersion && record.record.contractVersion !== query.contractVersion) return false;
  if (!matchesTimestamp(record.record.createdAt, query.createdBefore, query.createdAfter)) return false;
  if (!matchesTimestamp(record.record.updatedAt, query.updatedBefore, query.updatedAfter)) return false;
  return true;
}

function toStorageListQuery(query: ExecutiveMemoryQuery): ExecutiveMemoryListQuery {
  return Object.freeze({
    workspaceId: query.workspaceId,
    providerId: query.providerId,
    category: query.category,
    lifecycle: query.lifecycleState,
  });
}

function buildFailureResult(
  queryType: ExecutiveMemoryRetrievalQueryType,
  startedAt: number,
  message: string,
  field?: string
): ExecutiveMemoryQueryResult {
  return Object.freeze({
    success: false,
    records: Object.freeze([]),
    totalMatched: 0,
    statistics: createExecutiveMemoryRetrievalStatistics({
      recordsScanned: 0,
      recordsReturned: 0,
      executionTimeMs: Math.max(0, Date.now() - startedAt),
      queryType,
    }),
    error: executiveMemoryRetrievalErrorFromCode("queryValidationFailure", message, field),
    readOnly: true as const,
  });
}

export function executeExecutiveMemoryQuery(
  queryInput: ExecutiveMemoryQuery,
  queryType: ExecutiveMemoryRetrievalQueryType = "find"
): ExecutiveMemoryQueryResult {
  const startedAt = Date.now();
  const validation = validateExecutiveMemoryQuery(queryInput);
  if (!validation.valid || !validation.query) {
    return buildFailureResult(
      queryType,
      startedAt,
      validation.issues.map((entry) => entry.message).join("; ")
    );
  }

  const query = validation.query;
  const candidates = [...getExecutiveMemories(toStorageListQuery(query))];
  const matched = candidates.filter((record) => matchesQuery(record, query));
  const sorted = sortRecords(matched, query.sortBy ?? "id", query.sortDirection ?? "asc");
  const paged = paginateRecords(sorted, query.limit, query.offset);

  return Object.freeze({
    success: true,
    records: paged,
    totalMatched: matched.length,
    statistics: createExecutiveMemoryRetrievalStatistics({
      recordsScanned: candidates.length,
      recordsReturned: paged.length,
      executionTimeMs: Math.max(0, Date.now() - startedAt),
      queryType,
    }),
    error: null,
    readOnly: true as const,
  });
}

export function retrieveExecutiveMemoryById(
  recordId: ExecutiveMemoryId
): ExecutiveMemoryRetrievalResult<ExecutiveMemoryStoredRecord> {
  const startedAt = Date.now();
  const validation = validateExecutiveMemoryQuery(createExecutiveMemoryQuery({ id: recordId }));
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      data: null,
      statistics: createExecutiveMemoryRetrievalStatistics({
        recordsScanned: 0,
        recordsReturned: 0,
        executionTimeMs: Math.max(0, Date.now() - startedAt),
        queryType: "by_id",
      }),
      error: executiveMemoryRetrievalErrorFromCode(
        "malformedIdentifier",
        validation.issues.map((entry) => entry.message).join("; "),
        "id"
      ),
      readOnly: true as const,
    });
  }

  const stored = getExecutiveMemoryById(recordId);
  return Object.freeze({
    success: true,
    data: stored,
    statistics: createExecutiveMemoryRetrievalStatistics({
      recordsScanned: stored ? 1 : 0,
      recordsReturned: stored ? 1 : 0,
      executionTimeMs: Math.max(0, Date.now() - startedAt),
      queryType: "by_id",
    }),
    error: null,
    readOnly: true as const,
  });
}

export function countExecutiveMemoryMatches(queryInput: ExecutiveMemoryQuery): ExecutiveMemoryRetrievalResult<number> {
  const result = executeExecutiveMemoryQuery(queryInput, "count");
  if (!result.success) {
    return Object.freeze({
      success: false,
      data: null,
      statistics: result.statistics,
      error: result.error,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    data: result.totalMatched,
    statistics: result.statistics,
    error: null,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryRetrievalExecutor = Object.freeze({
  executeExecutiveMemoryQuery,
  retrieveExecutiveMemoryById,
  countExecutiveMemoryMatches,
});
