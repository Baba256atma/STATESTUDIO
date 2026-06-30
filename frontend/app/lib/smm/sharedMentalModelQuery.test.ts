import assert from "node:assert/strict";
import test from "node:test";

import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import { resetSharedMentalModelDomainLayerForTests } from "./sharedMentalModelExports.ts";
import { resetSharedMentalModelIdentityLayerForTests } from "./sharedMentalModelIdentityExports.ts";
import { resetSharedMentalModelSnapshotLayerForTests } from "./sharedMentalModelSnapshotExports.ts";
import { resetSharedMentalModelSynchronizationLayerForTests } from "./sharedMentalModelSynchronizationExports.ts";
import { SMM_DOMAIN_CONTRACT_VERSION } from "./sharedMentalModelContracts.ts";
import { SMM_IDENTITY_CONTRACT_VERSION } from "./sharedMentalModelIdentityContracts.ts";
import { SMM_SNAPSHOT_CONTRACT_VERSION } from "./sharedMentalModelSnapshotContracts.ts";
import { SMM_SYNC_CONTRACT_VERSION } from "./sharedMentalModelSynchronizationContracts.ts";
import {
  SMM_QUERY_CONTRACT_VERSION,
  SMM_QUERY_PRINCIPLES,
  SMM_QUERY_PUBLIC_API_REGISTRY,
  SMM_QUERY_REGISTRY_KEYS,
  SMM_QUERY_SCOPE_KEYS,
  SMM_QUERY_SYNC_DEPENDENCY,
} from "./sharedMentalModelQueryContracts.ts";
import {
  SharedMentalModelQueryPlatform,
  buildSharedMentalModelQueryPlatform,
  getSharedMentalModelQueryManifest,
  getSharedMentalModelQueryRegistry,
  getSharedMentalModelReadModelRegistry,
  registerSharedMentalModelQuery,
  registerSharedMentalModelQueryFilter,
  registerSharedMentalModelQueryManifest,
  registerSharedMentalModelQueryPagination,
  registerSharedMentalModelQueryProjection,
  registerSharedMentalModelQueryScope,
  registerSharedMentalModelQuerySort,
  registerSharedMentalModelReadModel,
  resetSharedMentalModelQueryLayerForTests,
  validateSharedMentalModelQueries,
} from "./sharedMentalModelQueryExports.ts";
import {
  createStableQueryFilterId,
  createStableQueryId,
  createStableQueryManifestId,
  createStableQueryPaginationId,
  createStableQueryProjectionId,
  createStableQuerySortId,
  createStableReadModelId,
  isSharedMentalModelQueryImmutable,
  isSharedMentalModelReadModelImmutable,
} from "./sharedMentalModelQueryRegistry.ts";
import {
  validateDuplicateQueryIds,
  validateInvalidFilterMetadata,
  validateInvalidPaginationMetadata,
  validateInvalidProjectionReferences,
  validateInvalidQueryScopes,
  validateInvalidSortMetadata,
  validateQueryManifestConsistency,
  validateReadModelCompleteness,
} from "./sharedMentalModelQueryValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelQueryLayerForTests();
  resetSharedMentalModelSynchronizationLayerForTests();
  resetSharedMentalModelSnapshotLayerForTests();
  resetSharedMentalModelIdentityLayerForTests();
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

function seedQueryPlatform(timestamp: string = FIXED_TIME): { queryId: string; readModelId: string } {
  const queryId = createStableQueryId("model", "001");
  const readModelId = createStableReadModelId("model", "001");

  registerSharedMentalModelQuery(
    Object.freeze({
      queryId,
      queryScope: "model",
      queryType: "list",
      filterMetadata: Object.freeze({ status: "active" }),
      sortMetadata: Object.freeze({ field: "createdAt", direction: "desc" }),
      paginationMetadata: Object.freeze({ pageSize: "25", pageOffset: "0" }),
      projectionMetadata: Object.freeze({ projectionType: "summary" }),
      versionCompatibilityMetadata: Object.freeze({ contractVersion: "SMM/6" }),
      createdMetadata: Object.freeze({ actor: "test" }),
      extensionMetadata: Object.freeze({ label: "model list query" }),
    }),
    timestamp
  );

  registerSharedMentalModelQueryScope(`${queryId}-scope`, queryId, "model", "model-registry-ref", timestamp);
  registerSharedMentalModelQueryFilter(createStableQueryFilterId(queryId, "status"), queryId, "status", "active", timestamp);
  registerSharedMentalModelQuerySort(createStableQuerySortId(queryId, "createdAt"), queryId, "createdAt", "desc", timestamp);
  registerSharedMentalModelQueryPagination(createStableQueryPaginationId(queryId), queryId, 25, 0, timestamp);
  registerSharedMentalModelQueryProjection(
    createStableQueryProjectionId(queryId, "summary"),
    queryId,
    "summary",
    Object.freeze(["modelId", "modelVersion", "createdAt"]),
    timestamp
  );

  registerSharedMentalModelReadModel(
    Object.freeze({
      readModelId,
      sourceRegistryReference: "identity_registry",
      projectionType: "summary",
      scopeMetadata: Object.freeze({ scope: "model" }),
      fieldMetadata: Object.freeze({ modelId: "string", modelVersion: "string" }),
      compatibilityMetadata: Object.freeze({ contractVersion: "SMM/6" }),
      createdMetadata: Object.freeze({ actor: "test" }),
      extensionMetadata: Object.freeze({ label: "model summary read model" }),
    }),
    timestamp
  );

  registerSharedMentalModelQueryManifest(
    createStableQueryManifestId(queryId),
    queryId,
    readModelId,
    "model",
    "query-payload-ref-001",
    timestamp
  );

  return { queryId, readModelId };
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/6 query platform vocabulary", () => {
  assert.equal(SMM_QUERY_CONTRACT_VERSION, "SMM/6");
  assert.equal(SMM_QUERY_SYNC_DEPENDENCY, "SMM/5");
  assert.equal(SMM_QUERY_REGISTRY_KEYS.length, 8);
  assert.equal(SMM_QUERY_PUBLIC_API_REGISTRY.length, 5);
  assert.equal(SMM_QUERY_SCOPE_KEYS.length, 9);
});

test("builds query platform through SMM-5 dependency chain", () => {
  const result = buildSharedMentalModelQueryPlatform(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.data?.contractVersion, "SMM/6");
  assert.equal(result.data?.syncDependency, "SMM/5");
});

test("registers immutable query contracts with full metadata", () => {
  buildSharedMentalModelQueryPlatform(FIXED_TIME);
  const { queryId } = seedQueryPlatform();
  const queries = getSharedMentalModelQueryRegistry();
  const query = queries.find((entry) => entry.queryId === queryId)!;
  assert.ok(query);
  assert.equal(isSharedMentalModelQueryImmutable(query), true);
  assert.equal(query.queryScope, "model");
  assert.equal(query.queryType, "list");
});

test("registers read models as metadata projections only", () => {
  buildSharedMentalModelQueryPlatform(FIXED_TIME);
  const { readModelId } = seedQueryPlatform();
  const readModels = getSharedMentalModelReadModelRegistry();
  const readModel = readModels.find((entry) => entry.readModelId === readModelId)!;
  assert.ok(readModel);
  assert.equal(isSharedMentalModelReadModelImmutable(readModel), true);
  assert.equal(readModel.projectionType, "summary");
  assert.equal(readModel.sourceRegistryReference, "identity_registry");
});

test("validates query scopes filters sorts pagination and projections", () => {
  buildSharedMentalModelQueryPlatform(FIXED_TIME);
  seedQueryPlatform();
  const registry = SharedMentalModelQueryPlatform.getSharedMentalModelQueryLayerState(FIXED_TIME).registry;
  assert.equal(validateDuplicateQueryIds(registry).valid, true);
  assert.equal(validateInvalidQueryScopes(registry).valid, true);
  assert.equal(validateInvalidFilterMetadata(registry).valid, true);
  assert.equal(validateInvalidSortMetadata(registry).valid, true);
  assert.equal(validateInvalidPaginationMetadata(registry).valid, true);
  assert.equal(validateInvalidProjectionReferences(registry).valid, true);
  assert.equal(validateReadModelCompleteness(registry).valid, true);
  assert.equal(validateQueryManifestConsistency(registry).valid, true);
});

test("rejects duplicate query registration", () => {
  buildSharedMentalModelQueryPlatform(FIXED_TIME);
  const queryId = createStableQueryId("snapshot", "dup");
  const input = Object.freeze({
    queryId,
    queryScope: "snapshot" as const,
    queryType: "detail" as const,
    filterMetadata: Object.freeze({ id: "snap-1" }),
    projectionMetadata: Object.freeze({ projectionType: "metadata" }),
  });
  registerSharedMentalModelQuery(input, FIXED_TIME);
  const duplicate = registerSharedMentalModelQuery(input, FIXED_TIME);
  assert.equal(duplicate.success, false);
});

test("validates platform and generates manifest", () => {
  buildSharedMentalModelQueryPlatform(FIXED_TIME);
  seedQueryPlatform();
  const validation = validateSharedMentalModelQueries();
  assert.equal(validation.valid, true);
  const manifest = getSharedMentalModelQueryManifest();
  assert.equal(manifest.version, "SMM/6");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes(SMM_SYNC_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_SNAPSHOT_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_IDENTITY_CONTRACT_VERSION));
  assert.ok(manifest.compatibility.includes(SMM_DOMAIN_CONTRACT_VERSION));
});

test("exposes stable public exports", () => {
  buildSharedMentalModelQueryPlatform(FIXED_TIME);
  assert.equal(typeof SharedMentalModelQueryPlatform.buildSharedMentalModelQueryPlatform, "function");
  assert.equal(SharedMentalModelQueryPlatform.version, "SMM/6");
  assert.ok(SMM_QUERY_PRINCIPLES.includes("no_runtime_database_queries_no_semantic_ranking"));
});

test("preserves SMM-1 through SMM-5 unchanged", async () => {
  const { readFile } = await import("node:fs/promises");
  const certifiedFiles = [
    "smmPlatformContracts.ts",
    "smmPlatformExports.ts",
    "sharedMentalModelContracts.ts",
    "sharedMentalModelExports.ts",
    "sharedMentalModelRegistry.ts",
    "sharedMentalModelIdentityContracts.ts",
    "sharedMentalModelIdentityExports.ts",
    "sharedMentalModelIdentityStore.ts",
    "sharedMentalModelSnapshotContracts.ts",
    "sharedMentalModelSnapshotExports.ts",
    "sharedMentalModelSnapshotRegistry.ts",
    "sharedMentalModelSynchronizationContracts.ts",
    "sharedMentalModelSynchronizationExports.ts",
    "sharedMentalModelSynchronizationRegistry.ts",
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildSharedMentalModelQueryPlatform(FIXED_TIME);
    seedQueryPlatform();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement semantic search runtime queries or alignment", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelQueryContracts.ts",
    "sharedMentalModelQueryRegistry.ts",
    "sharedMentalModelQueryValidation.ts",
    "sharedMentalModelQueryExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("semanticSearch("), false, `${file} must not implement semantic search`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
    assert.equal(source.includes("align("), false, `${file} must not implement alignment`);
    assert.equal(source.includes("SELECT "), false, `${file} must not implement database queries`);
  }
});
