/**
 * SMM-6 — Query & Read Model Platform domain types.
 */

import type {
  SMM_QUERY_CONTRACT_VERSION,
  SMM_QUERY_PROJECTION_TYPE_KEYS,
  SMM_QUERY_REGISTRY_KEYS,
  SMM_QUERY_SCOPE_KEYS,
  SMM_QUERY_TYPE_KEYS,
} from "./sharedMentalModelQueryContracts.ts";

export type SharedMentalModelQueryScopeKey = (typeof SMM_QUERY_SCOPE_KEYS)[number];
export type SharedMentalModelQueryTypeKey = (typeof SMM_QUERY_TYPE_KEYS)[number];
export type SharedMentalModelQueryProjectionTypeKey = (typeof SMM_QUERY_PROJECTION_TYPE_KEYS)[number];
export type SharedMentalModelQueryRegistryKey = (typeof SMM_QUERY_REGISTRY_KEYS)[number];

export type SharedMentalModelQueryRecord = Readonly<{
  queryId: string;
  queryScope: SharedMentalModelQueryScopeKey;
  queryType: SharedMentalModelQueryTypeKey;
  filterMetadata: Readonly<Record<string, string>>;
  sortMetadata: Readonly<Record<string, string>>;
  paginationMetadata: Readonly<Record<string, string>>;
  projectionMetadata: Readonly<Record<string, string>>;
  versionCompatibilityMetadata: Readonly<Record<string, string>>;
  createdAt: string;
  createdMetadata: Readonly<Record<string, string>>;
  extensionMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type SharedMentalModelQueryScopeRecord = Readonly<{
  queryScopeId: string;
  queryId: string;
  queryScope: SharedMentalModelQueryScopeKey;
  scopeRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelQueryFilterRecord = Readonly<{
  filterId: string;
  queryId: string;
  filterKey: string;
  filterValue: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelQuerySortRecord = Readonly<{
  sortId: string;
  queryId: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelQueryPaginationRecord = Readonly<{
  paginationId: string;
  queryId: string;
  pageSize: number;
  pageOffset: number;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelQueryProjectionRecord = Readonly<{
  projectionId: string;
  queryId: string;
  projectionType: SharedMentalModelQueryProjectionTypeKey;
  fieldKeys: readonly string[];
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelReadModelRecord = Readonly<{
  readModelId: string;
  sourceRegistryReference: string;
  projectionType: SharedMentalModelQueryProjectionTypeKey;
  scopeMetadata: Readonly<Record<string, string>>;
  fieldMetadata: Readonly<Record<string, string>>;
  compatibilityMetadata: Readonly<Record<string, string>>;
  createdAt: string;
  createdMetadata: Readonly<Record<string, string>>;
  extensionMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type SharedMentalModelQueryManifestRecord = Readonly<{
  manifestId: string;
  queryId: string;
  readModelId: string;
  scopeKey: SharedMentalModelQueryScopeKey;
  payloadRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelQueryRegistryBundle = Readonly<{
  queryRegistry: readonly SharedMentalModelQueryRecord[];
  queryCount: number;
  queryScopeRegistry: readonly SharedMentalModelQueryScopeRecord[];
  queryScopeCount: number;
  filterRegistry: readonly SharedMentalModelQueryFilterRecord[];
  filterCount: number;
  sortRegistry: readonly SharedMentalModelQuerySortRecord[];
  sortCount: number;
  paginationRegistry: readonly SharedMentalModelQueryPaginationRecord[];
  paginationCount: number;
  projectionRegistry: readonly SharedMentalModelQueryProjectionRecord[];
  projectionCount: number;
  readModelRegistry: readonly SharedMentalModelReadModelRecord[];
  readModelCount: number;
  manifestRegistry: readonly SharedMentalModelQueryManifestRecord[];
  manifestCount: number;
  readOnly: true;
}>;

export type SharedMentalModelQueryPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./sharedMentalModelQueryContracts.ts").SMM_QUERY_PLATFORM_ID;
  version: typeof SMM_QUERY_CONTRACT_VERSION;
  title: typeof import("./sharedMentalModelQueryContracts.ts").SMM_QUERY_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  queryCount: number;
  readModelCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type SharedMentalModelQueryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SharedMentalModelQueryValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SharedMentalModelQueryValidationIssue[];
  readOnly: true;
}>;

export type SharedMentalModelQueryLayerState = Readonly<{
  contractVersion: typeof SMM_QUERY_CONTRACT_VERSION;
  syncDependency: typeof import("./sharedMentalModelQueryContracts.ts").SMM_QUERY_SYNC_DEPENDENCY;
  initialized: boolean;
  registry: SharedMentalModelQueryRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelQueryBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: SharedMentalModelQueryLayerState | null;
  readOnly: true;
}>;

export type SharedMentalModelQueryInput = Readonly<{
  queryId: string;
  queryScope: SharedMentalModelQueryScopeKey;
  queryType: SharedMentalModelQueryTypeKey;
  filterMetadata?: Readonly<Record<string, string>>;
  sortMetadata?: Readonly<Record<string, string>>;
  paginationMetadata?: Readonly<Record<string, string>>;
  projectionMetadata?: Readonly<Record<string, string>>;
  versionCompatibilityMetadata?: Readonly<Record<string, string>>;
  createdMetadata?: Readonly<Record<string, string>>;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelReadModelInput = Readonly<{
  readModelId: string;
  sourceRegistryReference: string;
  projectionType: SharedMentalModelQueryProjectionTypeKey;
  scopeMetadata?: Readonly<Record<string, string>>;
  fieldMetadata?: Readonly<Record<string, string>>;
  compatibilityMetadata?: Readonly<Record<string, string>>;
  createdMetadata?: Readonly<Record<string, string>>;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelQueryRegistrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  record: T | null;
  readOnly: true;
}>;
