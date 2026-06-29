/**
 * APP-4:4 — Executive Memory query contracts and builder.
 */

import type {
  CreateExecutiveMemoryQueryInput,
  ExecutiveMemoryQuery,
  ExecutiveMemoryQueryPagination,
  ExecutiveMemoryQuerySort,
} from "./executiveMemoryRetrievalTypes.ts";
import {
  EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS,
  EXECUTIVE_MEMORY_QUERY_SORT_FIELDS,
  EXECUTIVE_MEMORY_RETRIEVAL_LIMITS,
} from "./executiveMemoryRetrievalConstants.ts";

export function createExecutiveMemoryQuery(input: CreateExecutiveMemoryQueryInput = {}): ExecutiveMemoryQuery {
  return Object.freeze({
    ...input,
    referenceIds: input.referenceIds ? Object.freeze([...input.referenceIds]) : undefined,
    referenceTypes: input.referenceTypes ? Object.freeze([...input.referenceTypes]) : undefined,
    tags: input.tags ? Object.freeze([...input.tags]) : undefined,
    readOnly: true as const,
  });
}

export function createExecutiveMemoryQueryPagination(
  limit: number = EXECUTIVE_MEMORY_RETRIEVAL_LIMITS.defaultLimit,
  offset: number = 0
): ExecutiveMemoryQueryPagination {
  return Object.freeze({ limit, offset, readOnly: true as const });
}

export function createExecutiveMemoryQuerySort(
  sortBy: ExecutiveMemoryQuerySort["sortBy"] = "id",
  sortDirection: ExecutiveMemoryQuerySort["sortDirection"] = "asc"
): ExecutiveMemoryQuerySort {
  return Object.freeze({ sortBy, sortDirection, readOnly: true as const });
}

export const ExecutiveMemoryQueryBuilder = Object.freeze({
  createExecutiveMemoryQuery,
  createExecutiveMemoryQueryPagination,
  createExecutiveMemoryQuerySort,
  sortFields: EXECUTIVE_MEMORY_QUERY_SORT_FIELDS,
  sortDirections: EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS,
  limits: EXECUTIVE_MEMORY_RETRIEVAL_LIMITS,
});
