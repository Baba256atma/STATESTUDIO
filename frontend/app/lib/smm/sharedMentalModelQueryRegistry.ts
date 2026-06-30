/**
 * SMM-6 — Query, filter, sort, pagination, projection, read model, and manifest registries.
 */

import { buildSharedMentalModelSynchronizationPlatform } from "./sharedMentalModelSynchronizationExports.ts";
import {
  SMM_QUERY_CONTRACT_VERSION,
  SMM_QUERY_DEFAULT_LIMITS,
} from "./sharedMentalModelQueryContracts.ts";
import type {
  SharedMentalModelQueryFilterRecord,
  SharedMentalModelQueryInput,
  SharedMentalModelQueryManifestRecord,
  SharedMentalModelQueryPaginationRecord,
  SharedMentalModelQueryProjectionRecord,
  SharedMentalModelQueryRecord,
  SharedMentalModelQueryRegistrationResult,
  SharedMentalModelQueryRegistryBundle,
  SharedMentalModelQueryScopeRecord,
  SharedMentalModelQuerySortRecord,
  SharedMentalModelReadModelInput,
  SharedMentalModelReadModelRecord,
} from "./sharedMentalModelQueryTypes.ts";

const queryRegistry = new Map<string, SharedMentalModelQueryRecord>();
const queryScopeRegistry = new Map<string, SharedMentalModelQueryScopeRecord>();
const filterRegistry = new Map<string, SharedMentalModelQueryFilterRecord>();
const sortRegistry = new Map<string, SharedMentalModelQuerySortRecord>();
const paginationRegistry = new Map<string, SharedMentalModelQueryPaginationRecord>();
const projectionRegistry = new Map<string, SharedMentalModelQueryProjectionRecord>();
const readModelRegistry = new Map<string, SharedMentalModelReadModelRecord>();
const manifestRegistry = new Map<string, SharedMentalModelQueryManifestRecord>();

function result<T>(success: boolean, reason: string, record: T | null): SharedMentalModelQueryRegistrationResult<T> {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function createStableQueryId(scope: string, seed: string): string {
  return `smm-query-${scope}-${seed}`;
}

export function createStableReadModelId(scope: string, seed: string): string {
  return `smm-read-model-${scope}-${seed}`;
}

export function createStableQueryFilterId(queryId: string, filterKey: string): string {
  return `smm-query-filter-${queryId}-${filterKey}`;
}

export function createStableQuerySortId(queryId: string, sortField: string): string {
  return `smm-query-sort-${queryId}-${sortField}`;
}

export function createStableQueryPaginationId(queryId: string): string {
  return `smm-query-pagination-${queryId}`;
}

export function createStableQueryProjectionId(queryId: string, projectionType: string): string {
  return `smm-query-projection-${queryId}-${projectionType}`;
}

export function createStableQueryManifestId(queryId: string): string {
  return `smm-query-manifest-${queryId}`;
}

export function buildSharedMentalModelQueryRecord(
  input: SharedMentalModelQueryInput,
  timestamp: string
): SharedMentalModelQueryRecord {
  return Object.freeze({
    queryId: input.queryId,
    queryScope: input.queryScope,
    queryType: input.queryType,
    filterMetadata: Object.freeze(input.filterMetadata ?? {}),
    sortMetadata: Object.freeze(input.sortMetadata ?? {}),
    paginationMetadata: Object.freeze(input.paginationMetadata ?? {}),
    projectionMetadata: Object.freeze(input.projectionMetadata ?? {}),
    versionCompatibilityMetadata: Object.freeze({
      ...(input.versionCompatibilityMetadata ?? {}),
      contractVersion: SMM_QUERY_CONTRACT_VERSION,
    }),
    createdAt: timestamp,
    createdMetadata: Object.freeze(input.createdMetadata ?? {}),
    extensionMetadata: Object.freeze(input.extensionMetadata ?? {}),
    readOnly: true as const,
  });
}

export function buildSharedMentalModelReadModelRecord(
  input: SharedMentalModelReadModelInput,
  timestamp: string
): SharedMentalModelReadModelRecord {
  return Object.freeze({
    readModelId: input.readModelId,
    sourceRegistryReference: input.sourceRegistryReference,
    projectionType: input.projectionType,
    scopeMetadata: Object.freeze(input.scopeMetadata ?? {}),
    fieldMetadata: Object.freeze(input.fieldMetadata ?? {}),
    compatibilityMetadata: Object.freeze({
      ...(input.compatibilityMetadata ?? {}),
      contractVersion: SMM_QUERY_CONTRACT_VERSION,
    }),
    createdAt: timestamp,
    createdMetadata: Object.freeze(input.createdMetadata ?? {}),
    extensionMetadata: Object.freeze(input.extensionMetadata ?? {}),
    readOnly: true as const,
  });
}

export function isSharedMentalModelQueryImmutable(record: SharedMentalModelQueryRecord): boolean {
  return Object.isFrozen(record);
}

export function isSharedMentalModelReadModelImmutable(record: SharedMentalModelReadModelRecord): boolean {
  return Object.isFrozen(record);
}

export function resetSharedMentalModelQueryStoreForTests(): void {
  queryRegistry.clear();
  queryScopeRegistry.clear();
  filterRegistry.clear();
  sortRegistry.clear();
  paginationRegistry.clear();
  projectionRegistry.clear();
  readModelRegistry.clear();
  manifestRegistry.clear();
}

export function getSharedMentalModelQueryRegistryBundle(): SharedMentalModelQueryRegistryBundle {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  const queries = sortByKey([...queryRegistry.values()], (entry) => entry.queryId);
  const queryScopes = sortByKey([...queryScopeRegistry.values()], (entry) => entry.queryScopeId);
  const filters = sortByKey([...filterRegistry.values()], (entry) => entry.filterId);
  const sorts = sortByKey([...sortRegistry.values()], (entry) => entry.sortId);
  const paginations = sortByKey([...paginationRegistry.values()], (entry) => entry.paginationId);
  const projections = sortByKey([...projectionRegistry.values()], (entry) => entry.projectionId);
  const readModels = sortByKey([...readModelRegistry.values()], (entry) => entry.readModelId);
  const manifests = sortByKey([...manifestRegistry.values()], (entry) => entry.manifestId);

  return Object.freeze({
    queryRegistry: queries,
    queryCount: queries.length,
    queryScopeRegistry: queryScopes,
    queryScopeCount: queryScopes.length,
    filterRegistry: filters,
    filterCount: filters.length,
    sortRegistry: sorts,
    sortCount: sorts.length,
    paginationRegistry: paginations,
    paginationCount: paginations.length,
    projectionRegistry: projections,
    projectionCount: projections.length,
    readModelRegistry: readModels,
    readModelCount: readModels.length,
    manifestRegistry: manifests,
    manifestCount: manifests.length,
    readOnly: true as const,
  });
}

export function getSharedMentalModelQueryRegistry(): readonly SharedMentalModelQueryRecord[] {
  return getSharedMentalModelQueryRegistryBundle().queryRegistry;
}

export function getSharedMentalModelReadModelRegistry(): readonly SharedMentalModelReadModelRecord[] {
  return getSharedMentalModelQueryRegistryBundle().readModelRegistry;
}

export function registerSharedMentalModelQuery(
  input: SharedMentalModelQueryInput,
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQueryRecord> {
  if (queryRegistry.has(input.queryId)) {
    return result(false, "Duplicate query ID.", null);
  }
  if (queryRegistry.size >= SMM_QUERY_DEFAULT_LIMITS.maxQueries) {
    return result(false, "Query registry limit reached.", null);
  }
  const record = buildSharedMentalModelQueryRecord(input, timestamp);
  queryRegistry.set(record.queryId, record);
  return result(true, "Query registered.", record);
}

export function registerSharedMentalModelQueryScope(
  queryScopeId: string,
  queryId: string,
  queryScope: SharedMentalModelQueryScopeRecord["queryScope"],
  scopeRef: string,
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQueryScopeRecord> {
  if (queryScopeRegistry.has(queryScopeId)) {
    return result(false, "Duplicate query scope ID.", null);
  }
  const record = Object.freeze({
    queryScopeId,
    queryId,
    queryScope,
    scopeRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  queryScopeRegistry.set(queryScopeId, record);
  return result(true, "Query scope registered.", record);
}

export function registerSharedMentalModelQueryFilter(
  filterId: string,
  queryId: string,
  filterKey: string,
  filterValue: string,
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQueryFilterRecord> {
  if (filterRegistry.has(filterId)) {
    return result(false, "Duplicate filter ID.", null);
  }
  const record = Object.freeze({
    filterId,
    queryId,
    filterKey,
    filterValue,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  filterRegistry.set(filterId, record);
  return result(true, "Query filter registered.", record);
}

export function registerSharedMentalModelQuerySort(
  sortId: string,
  queryId: string,
  sortField: string,
  sortDirection: SharedMentalModelQuerySortRecord["sortDirection"],
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQuerySortRecord> {
  if (sortRegistry.has(sortId)) {
    return result(false, "Duplicate sort ID.", null);
  }
  const record = Object.freeze({
    sortId,
    queryId,
    sortField,
    sortDirection,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  sortRegistry.set(sortId, record);
  return result(true, "Query sort registered.", record);
}

export function registerSharedMentalModelQueryPagination(
  paginationId: string,
  queryId: string,
  pageSize: number,
  pageOffset: number,
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQueryPaginationRecord> {
  if (paginationRegistry.has(paginationId)) {
    return result(false, "Duplicate pagination ID.", null);
  }
  const record = Object.freeze({
    paginationId,
    queryId,
    pageSize,
    pageOffset,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  paginationRegistry.set(paginationId, record);
  return result(true, "Query pagination registered.", record);
}

export function registerSharedMentalModelQueryProjection(
  projectionId: string,
  queryId: string,
  projectionType: SharedMentalModelQueryProjectionRecord["projectionType"],
  fieldKeys: readonly string[],
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQueryProjectionRecord> {
  if (projectionRegistry.has(projectionId)) {
    return result(false, "Duplicate projection ID.", null);
  }
  const record = Object.freeze({
    projectionId,
    queryId,
    projectionType,
    fieldKeys: Object.freeze([...fieldKeys]),
    registeredAt: timestamp,
    readOnly: true as const,
  });
  projectionRegistry.set(projectionId, record);
  return result(true, "Query projection registered.", record);
}

export function registerSharedMentalModelReadModel(
  input: SharedMentalModelReadModelInput,
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelReadModelRecord> {
  if (readModelRegistry.has(input.readModelId)) {
    return result(false, "Duplicate read model ID.", null);
  }
  const record = buildSharedMentalModelReadModelRecord(input, timestamp);
  readModelRegistry.set(record.readModelId, record);
  return result(true, "Read model registered.", record);
}

export function registerSharedMentalModelQueryManifest(
  manifestId: string,
  queryId: string,
  readModelId: string,
  scopeKey: SharedMentalModelQueryManifestRecord["scopeKey"],
  payloadRef: string,
  timestamp: string
): SharedMentalModelQueryRegistrationResult<SharedMentalModelQueryManifestRecord> {
  if (manifestRegistry.has(manifestId)) {
    return result(false, "Duplicate query manifest ID.", null);
  }
  const record = Object.freeze({
    manifestId,
    queryId,
    readModelId,
    scopeKey,
    payloadRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  manifestRegistry.set(manifestId, record);
  return result(true, "Query manifest registered.", record);
}

export function ensureSharedMentalModelQueryDependenciesReady(timestamp: string): boolean {
  const sync = buildSharedMentalModelSynchronizationPlatform(timestamp);
  return sync.success;
}

export function lookupSharedMentalModelQuery(queryId: string): SharedMentalModelQueryRecord | null {
  return queryRegistry.get(queryId) ?? null;
}

export function lookupSharedMentalModelReadModel(readModelId: string): SharedMentalModelReadModelRecord | null {
  return readModelRegistry.get(readModelId) ?? null;
}
