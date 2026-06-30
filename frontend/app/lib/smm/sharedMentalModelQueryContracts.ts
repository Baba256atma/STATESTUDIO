/**
 * SMM-6 — Query & Read Model Platform contracts and constants.
 */

export const SMM_QUERY_CONTRACT_VERSION = "SMM/6" as const;
export const SMM_QUERY_PLATFORM_ID = "smm-query-read-model-platform" as const;
export const SMM_QUERY_PLATFORM_NAME = "Shared Mental Model Query & Read Model Platform" as const;
export const SMM_QUERY_SYNC_DEPENDENCY = "SMM/5" as const;
export const SMM_QUERY_SNAPSHOT_DEPENDENCY = "SMM/4" as const;
export const SMM_QUERY_IDENTITY_DEPENDENCY = "SMM/3" as const;
export const SMM_QUERY_DOMAIN_DEPENDENCY = "SMM/2" as const;
export const SMM_QUERY_FOUNDATION_DEPENDENCY = "SMM/1" as const;

export const SMM_QUERY_TAGS = Object.freeze([
  "[SMM_6]",
  "[QUERY_READ_MODEL]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SMM_QUERY_SCOPE_KEYS = Object.freeze([
  "workspace",
  "organization",
  "executive",
  "scenario",
  "model",
  "snapshot",
  "version",
  "synchronization",
  "artifact",
] as const);

export const SMM_QUERY_TYPE_KEYS = Object.freeze([
  "list",
  "detail",
  "summary",
  "reference",
  "lineage",
] as const);

export const SMM_QUERY_PROJECTION_TYPE_KEYS = Object.freeze([
  "identity",
  "metadata",
  "reference",
  "summary",
  "full",
] as const);

export const SMM_QUERY_REGISTRY_KEYS = Object.freeze([
  "query_registry",
  "query_scope_registry",
  "filter_registry",
  "sort_registry",
  "pagination_registry",
  "projection_registry",
  "read_model_registry",
  "manifest_registry",
] as const);

export const SMM_QUERY_PUBLIC_API_REGISTRY = Object.freeze([
  "buildSharedMentalModelQueryPlatform",
  "validateSharedMentalModelQueries",
  "getSharedMentalModelQueryRegistry",
  "getSharedMentalModelReadModelRegistry",
  "getSharedMentalModelQueryManifest",
] as const);

export const SMM_QUERY_COMPATIBLE_VERSIONS = Object.freeze(["SMM/1", "SMM/2", "SMM/3", "SMM/4", "SMM/5"] as const);

export const SMM_QUERY_PRINCIPLES = Object.freeze([
  "query_contracts_immutable_after_registration",
  "read_models_are_metadata_projections_only",
  "no_runtime_database_queries_no_semantic_ranking",
  "deterministic_query_contracts_metadata_only",
  "future_engines_assistants_dashboards_consume_query_contracts_unchanged",
  "reference_based_registries",
] as const);

export const SMM_QUERY_MANDATORY_FIELDS = Object.freeze([
  "queryId",
  "queryScope",
  "queryType",
  "filterMetadata",
  "sortMetadata",
  "paginationMetadata",
  "projectionMetadata",
  "versionCompatibilityMetadata",
  "createdAt",
  "createdMetadata",
  "extensionMetadata",
  "readOnly",
] as const);

export const SMM_READ_MODEL_MANDATORY_FIELDS = Object.freeze([
  "readModelId",
  "sourceRegistryReference",
  "projectionType",
  "scopeMetadata",
  "fieldMetadata",
  "compatibilityMetadata",
  "createdAt",
  "createdMetadata",
  "extensionMetadata",
  "readOnly",
] as const);

export const SMM_QUERY_DEFAULT_LIMITS = Object.freeze({
  maxQueries: 4096,
  maxQueryScopes: 2048,
  maxFilters: 8192,
  maxSorts: 2048,
  maxPaginations: 2048,
  maxProjections: 4096,
  maxReadModels: 4096,
  maxManifests: 4096,
} as const);

export const SMM_QUERY_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "semantic_search",
  "similarity_algorithms",
  "alignment_calculations",
  "conflict_detection",
  "recommendations",
  "runtime_database_queries",
  "event_processing",
  "semantic_ranking",
] as const);
