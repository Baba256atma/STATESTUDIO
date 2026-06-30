/**
 * SMM-6 — Query & Read Model Platform metadata validation.
 */

import {
  SMM_QUERY_COMPATIBLE_VERSIONS,
  SMM_QUERY_CONTRACT_VERSION,
  SMM_QUERY_MANDATORY_FIELDS,
  SMM_QUERY_PROJECTION_TYPE_KEYS,
  SMM_QUERY_REGISTRY_KEYS,
  SMM_QUERY_SCOPE_KEYS,
  SMM_QUERY_TYPE_KEYS,
  SMM_READ_MODEL_MANDATORY_FIELDS,
} from "./sharedMentalModelQueryContracts.ts";
import type {
  SharedMentalModelQueryPlatformManifest,
  SharedMentalModelQueryRecord,
  SharedMentalModelQueryRegistryBundle,
  SharedMentalModelQueryValidationIssue,
  SharedMentalModelQueryValidationReport,
  SharedMentalModelReadModelRecord,
} from "./sharedMentalModelQueryTypes.ts";

function issue(code: string, message: string, field?: string): SharedMentalModelQueryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: SharedMentalModelQueryValidationIssue[]): SharedMentalModelQueryValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateSharedMentalModelQueryRecord(
  record: SharedMentalModelQueryRecord
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  for (const field of SMM_QUERY_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.queryId.trim()) {
    issues.push(issue("missing_query_id", "Query ID is required.", "queryId"));
  }
  return report(issues);
}

export function validateSharedMentalModelReadModelRecord(
  record: SharedMentalModelReadModelRecord
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  for (const field of SMM_READ_MODEL_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!record.readModelId.trim()) {
    issues.push(issue("missing_read_model_id", "Read model ID is required.", "readModelId"));
  }
  if (!record.sourceRegistryReference.trim()) {
    issues.push(issue("missing_source_registry", "Source registry reference is required.", "sourceRegistryReference"));
  }
  return report(issues);
}

export function validateDuplicateQueryIds(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const queryIds = registry.queryRegistry.map((entry) => entry.queryId);
  if (queryIds.length !== new Set(queryIds).size) {
    return report([issue("duplicate_query_id", "Duplicate query IDs detected.")]);
  }
  const readModelIds = registry.readModelRegistry.map((entry) => entry.readModelId);
  if (readModelIds.length !== new Set(readModelIds).size) {
    return report([issue("duplicate_read_model_id", "Duplicate read model IDs detected.")]);
  }
  return report([]);
}

export function validateInvalidQueryScopes(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const scopeKeys = new Set(SMM_QUERY_SCOPE_KEYS);

  for (const query of registry.queryRegistry) {
    if (!scopeKeys.has(query.queryScope)) {
      issues.push(issue("invalid_query_scope", `Query ${query.queryId} has invalid scope.`));
    }
  }

  for (const scope of registry.queryScopeRegistry) {
    if (!scopeKeys.has(scope.queryScope)) {
      issues.push(issue("invalid_query_scope", `Query scope ${scope.queryScopeId} has invalid scope.`));
    }
  }
  return report(issues);
}

export function validateInvalidFilterMetadata(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const queryIds = new Set(registry.queryRegistry.map((entry) => entry.queryId));

  for (const filter of registry.filterRegistry) {
    if (!queryIds.has(filter.queryId)) {
      issues.push(issue("invalid_filter_metadata", `Filter ${filter.filterId} references unknown query.`));
    }
    if (!filter.filterKey.trim()) {
      issues.push(issue("invalid_filter_metadata", `Filter ${filter.filterId} has empty filter key.`));
    }
  }

  for (const query of registry.queryRegistry) {
    const filters = registry.filterRegistry.filter((entry) => entry.queryId === query.queryId);
    if (filters.length === 0 && Object.keys(query.filterMetadata).length === 0) {
      issues.push(issue("invalid_filter_metadata", `Query ${query.queryId} has no filter metadata.`));
    }
  }
  return report(issues);
}

export function validateInvalidSortMetadata(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const queryIds = new Set(registry.queryRegistry.map((entry) => entry.queryId));

  for (const sort of registry.sortRegistry) {
    if (!queryIds.has(sort.queryId)) {
      issues.push(issue("invalid_sort_metadata", `Sort ${sort.sortId} references unknown query.`));
    }
    if (!sort.sortField.trim()) {
      issues.push(issue("invalid_sort_metadata", `Sort ${sort.sortId} has empty sort field.`));
    }
    if (sort.sortDirection !== "asc" && sort.sortDirection !== "desc") {
      issues.push(issue("invalid_sort_metadata", `Sort ${sort.sortId} has invalid sort direction.`));
    }
  }
  return report(issues);
}

export function validateInvalidPaginationMetadata(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const queryIds = new Set(registry.queryRegistry.map((entry) => entry.queryId));

  for (const pagination of registry.paginationRegistry) {
    if (!queryIds.has(pagination.queryId)) {
      issues.push(issue("invalid_pagination_metadata", `Pagination ${pagination.paginationId} references unknown query.`));
    }
    if (pagination.pageSize <= 0) {
      issues.push(issue("invalid_pagination_metadata", `Pagination ${pagination.paginationId} has invalid page size.`));
    }
    if (pagination.pageOffset < 0) {
      issues.push(issue("invalid_pagination_metadata", `Pagination ${pagination.paginationId} has invalid page offset.`));
    }
  }
  return report(issues);
}

export function validateInvalidProjectionReferences(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const queryIds = new Set(registry.queryRegistry.map((entry) => entry.queryId));
  const projectionTypes = new Set(SMM_QUERY_PROJECTION_TYPE_KEYS);
  const queryTypes = new Set(SMM_QUERY_TYPE_KEYS);

  for (const projection of registry.projectionRegistry) {
    if (!queryIds.has(projection.queryId)) {
      issues.push(issue("invalid_projection_reference", `Projection ${projection.projectionId} references unknown query.`));
    }
    if (!projectionTypes.has(projection.projectionType)) {
      issues.push(issue("invalid_projection_reference", `Projection ${projection.projectionId} has invalid projection type.`));
    }
    if (projection.fieldKeys.length === 0) {
      issues.push(issue("invalid_projection_reference", `Projection ${projection.projectionId} has no field keys.`));
    }
  }

  for (const query of registry.queryRegistry) {
    if (!queryTypes.has(query.queryType)) {
      issues.push(issue("invalid_projection_reference", `Query ${query.queryId} has invalid query type.`));
    }
    const projections = registry.projectionRegistry.filter((entry) => entry.queryId === query.queryId);
    if (projections.length === 0 && Object.keys(query.projectionMetadata).length === 0) {
      issues.push(issue("invalid_projection_reference", `Query ${query.queryId} has no projection metadata.`));
    }
  }
  return report(issues);
}

export function validateReadModelCompleteness(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const projectionTypes = new Set(SMM_QUERY_PROJECTION_TYPE_KEYS);

  for (const readModel of registry.readModelRegistry) {
    if (!projectionTypes.has(readModel.projectionType)) {
      issues.push(issue("read_model_incomplete", `Read model ${readModel.readModelId} has invalid projection type.`));
    }
    if (Object.keys(readModel.fieldMetadata).length === 0) {
      issues.push(issue("read_model_incomplete", `Read model ${readModel.readModelId} has no field metadata.`));
    }
    if (Object.keys(readModel.scopeMetadata).length === 0) {
      issues.push(issue("read_model_incomplete", `Read model ${readModel.readModelId} has no scope metadata.`));
    }
  }
  return report(issues);
}

export function validateQueryManifestConsistency(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  const queryById = new Map(registry.queryRegistry.map((entry) => [entry.queryId, entry]));
  const readModelById = new Map(registry.readModelRegistry.map((entry) => [entry.readModelId, entry]));

  for (const manifest of registry.manifestRegistry) {
    const query = queryById.get(manifest.queryId);
    if (!query) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} references unknown query.`));
      continue;
    }
    if (!readModelById.has(manifest.readModelId)) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} references unknown read model.`));
    }
    if (query.queryScope !== manifest.scopeKey) {
      issues.push(issue("manifest_consistency", `Manifest ${manifest.manifestId} scope mismatch.`));
    }
  }
  return report(issues);
}

export function validateQueryRegistryCompleteness(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  if (registry.queryCount === 0 && registry.readModelCount === 0) {
    issues.push(issue("empty_registry", "Query platform registry has no entries."));
  }
  return report(issues);
}

export function validateSharedMentalModelQueryRegistry(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  for (const validation of [
    validateDuplicateQueryIds(registry),
    validateInvalidQueryScopes(registry),
    validateInvalidFilterMetadata(registry),
    validateInvalidSortMetadata(registry),
    validateInvalidPaginationMetadata(registry),
    validateInvalidProjectionReferences(registry),
    validateReadModelCompleteness(registry),
    validateQueryManifestConsistency(registry),
    validateQueryRegistryCompleteness(registry),
  ]) {
    issues.push(...validation.issues);
  }
  for (const query of registry.queryRegistry) {
    issues.push(...validateSharedMentalModelQueryRecord(query).issues);
  }
  for (const readModel of registry.readModelRegistry) {
    issues.push(...validateSharedMentalModelReadModelRecord(readModel).issues);
  }
  return report(issues);
}

export function validateSharedMentalModelQueryPlatformManifest(
  manifest: SharedMentalModelQueryPlatformManifest
): SharedMentalModelQueryValidationReport {
  const issues: SharedMentalModelQueryValidationIssue[] = [];
  if (manifest.version !== SMM_QUERY_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be SMM/6."));
  }
  if (manifest.registryKeys.length !== SMM_QUERY_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of SMM_QUERY_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function getDefaultQueryCompatibility(): readonly string[] {
  return Object.freeze([...SMM_QUERY_COMPATIBLE_VERSIONS, SMM_QUERY_CONTRACT_VERSION]);
}
