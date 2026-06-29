/**
 * APP-4:4 — Executive Memory retrieval domain types.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryId, ExecutiveMemoryProviderId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryReferenceType } from "./executiveMemoryReference.ts";
import type { ExecutiveMemoryLifecycleState, ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type {
  EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS,
  EXECUTIVE_MEMORY_QUERY_SORT_FIELDS,
  EXECUTIVE_MEMORY_RETRIEVAL_QUERY_TYPES,
} from "./executiveMemoryRetrievalConstants.ts";

export type ExecutiveMemoryQuerySortField = (typeof EXECUTIVE_MEMORY_QUERY_SORT_FIELDS)[number];
export type ExecutiveMemoryQuerySortDirection = (typeof EXECUTIVE_MEMORY_QUERY_SORT_DIRECTIONS)[number];
export type ExecutiveMemoryRetrievalQueryType =
  (typeof EXECUTIVE_MEMORY_RETRIEVAL_QUERY_TYPES)[keyof typeof EXECUTIVE_MEMORY_RETRIEVAL_QUERY_TYPES];

export type ExecutiveMemoryQuery = Readonly<{
  id?: ExecutiveMemoryId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  providerId?: ExecutiveMemoryProviderId;
  category?: ExecutiveMemoryCategory;
  goalId?: string;
  intentId?: string;
  scenarioId?: string;
  decisionId?: string;
  referenceIds?: readonly string[];
  referenceTypes?: readonly ExecutiveMemoryReferenceType[];
  tags?: readonly string[];
  lifecycleState?: ExecutiveMemoryLifecycleState;
  schemaVersion?: string;
  contractVersion?: string;
  createdBefore?: string;
  createdAfter?: string;
  updatedBefore?: string;
  updatedAfter?: string;
  sortBy?: ExecutiveMemoryQuerySortField;
  sortDirection?: ExecutiveMemoryQuerySortDirection;
  limit?: number;
  offset?: number;
  readOnly: true;
}>;

export type CreateExecutiveMemoryQueryInput = Readonly<Omit<ExecutiveMemoryQuery, "readOnly">>;

export type ExecutiveMemoryQueryPagination = Readonly<{
  limit: number;
  offset: number;
  readOnly: true;
}>;

export type ExecutiveMemoryQuerySort = Readonly<{
  sortBy: ExecutiveMemoryQuerySortField;
  sortDirection: ExecutiveMemoryQuerySortDirection;
  readOnly: true;
}>;

export type ExecutiveMemoryRetrievalError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryRetrievalStatistics = Readonly<{
  recordsScanned: number;
  recordsReturned: number;
  executionTimeMs: number;
  queryType: ExecutiveMemoryRetrievalQueryType;
  readOnly: true;
}>;

export type ExecutiveMemoryQueryResult = Readonly<{
  success: boolean;
  records: readonly ExecutiveMemoryStoredRecord[];
  totalMatched: number;
  statistics: ExecutiveMemoryRetrievalStatistics;
  error: ExecutiveMemoryRetrievalError | null;
  readOnly: true;
}>;

export type ExecutiveMemoryRetrievalResult<T> = Readonly<{
  success: boolean;
  data: T | null;
  statistics: ExecutiveMemoryRetrievalStatistics;
  error: ExecutiveMemoryRetrievalError | null;
  readOnly: true;
}>;

export type ExecutiveMemoryQueryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryQueryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveMemoryQueryValidationIssue[];
  query: ExecutiveMemoryQuery | null;
  readOnly: true;
}>;

export type ExecutiveMemoryRetrievalState = Readonly<{
  engineId: "executive-memory-retrieval-engine";
  contractVersion: string;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;
