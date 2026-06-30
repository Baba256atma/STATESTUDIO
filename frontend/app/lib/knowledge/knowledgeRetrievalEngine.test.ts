import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION,
  KNOWLEDGE_RETRIEVAL_FUTURE_PHASE_KEYS,
  KNOWLEDGE_RETRIEVAL_MUST_NOT_OWN,
  KNOWLEDGE_RETRIEVAL_PRINCIPLES,
  KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY,
  RETRIEVAL_CATEGORY_KEYS,
  RETRIEVAL_SOURCE_KEYS,
  RETRIEVAL_SOURCE_LABELS,
} from "./knowledgeRetrievalCatalog.ts";
import {
  KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES,
  KNOWLEDGE_RETRIEVAL_SELF_MANIFEST,
  KnowledgeRetrievalContract,
  getKnowledgeRetrievalManifest,
  resolveKnowledgeIndexExample,
  resolveKnowledgeRetrievalSourceExample,
  validateKnowledgeRetrievalEngine,
} from "./knowledgeRetrievalContracts.ts";
import {
  KnowledgeRetrievalEnginePlatform,
  buildKnowledgeRetrievalEngine,
  getKnowledgeRetrievalEngine,
  isKnowledgeRetrievalEngineInitialized,
  registerKnowledgeCategory,
  registerKnowledgeIndex,
  registerKnowledgeRetrievalSource,
  resetKnowledgeRetrievalEngineForTests,
} from "./knowledgeRetrievalEngine.ts";
import {
  hasDuplicateIndexNames,
  hasDuplicateRetrievalIds,
  hasDuplicateRetrievalSourceKeys,
  validateKnowledgeIndexNameFormat,
  validateKnowledgeRetrievalNamespaceFormat,
  validateKnowledgeRetrievalVersionFormat,
  validateRetrievalCategoryReference,
  validateRetrievalNamespaceReference,
  validateRetrievalSourceReference,
} from "./knowledgeRetrievalValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeRetrievalEngineForTests();
});

test("exports KNL/9 knowledge retrieval contract vocabulary", () => {
  assert.equal(KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION, "KNL/9");
  assert.equal(RETRIEVAL_SOURCE_KEYS.length, 8);
  assert.equal(RETRIEVAL_CATEGORY_KEYS.length, 8);
});

test("initializes knowledge retrieval engine with KNL/1 through KNL/8 dependencies", () => {
  assert.equal(isKnowledgeRetrievalEngineInitialized(), false);
  const init = buildKnowledgeRetrievalEngine(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgeRetrievalEngineInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.policyDependency, "KNL/7");
  assert.equal(init.data?.bestPracticeDependency, "KNL/8");
  assert.equal(init.data?.contractVersion, "KNL/9");
});

test("seeds retrieval catalog with 8 KNL sources indexes and categories", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const engine = getKnowledgeRetrievalEngine(FIXED_TIME);
  assert.equal(engine.registry.sources.length, 8);
  assert.equal(engine.registry.indexes.length, 8);
  assert.equal(engine.registry.categories.length, RETRIEVAL_CATEGORY_KEYS.length);
  assert.equal(engine.registry.targets.length, 8);
  assert.equal(engine.registry.filters.length, 4);
  assert.equal(engine.registry.selectors.length, 4);
  for (const sourceKey of RETRIEVAL_SOURCE_KEYS) {
    assert.ok(engine.registry.sources.some((entry) => entry.sourceKey === sourceKey));
    assert.equal(
      engine.registry.sources.find((entry) => entry.sourceKey === sourceKey)?.label,
      RETRIEVAL_SOURCE_LABELS[sourceKey]
    );
    assert.ok(engine.registry.indexes.some((entry) => entry.indexId === `knowledge-index-${sourceKey}`));
  }
});

test("registers custom retrieval source index and rejects duplicate category", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const source = registerKnowledgeRetrievalSource(
    Object.freeze({
      sourceId: "retrieval-source-custom-001",
      sourceKey: "knl_foundation",
      platformId: "knowledge-platform",
      label: "Custom Foundation Source",
      description: "Custom source metadata reference.",
    }),
    FIXED_TIME
  );
  assert.equal(source.success, false);
  const index = registerKnowledgeIndex(
    Object.freeze({
      indexId: "knowledge-index-custom-001",
      indexName: "index_custom_foundation",
      sourceKey: "knl_foundation",
      categoryKey: "knl_foundation",
      label: "Custom Foundation Index",
      description: "Custom index metadata.",
    }),
    FIXED_TIME
  );
  assert.equal(index.success, true);
  const category = registerKnowledgeCategory(
    Object.freeze({
      categoryId: "knowledge-category-custom",
      categoryKey: "knl_foundation",
      label: "Duplicate Category",
      description: "Should fail - key already seeded.",
    }),
    FIXED_TIME
  );
  assert.equal(category.success, false);
});

test("prevents duplicate source ids index ids index names and source keys", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const duplicateSourceId = registerKnowledgeRetrievalSource(
    Object.freeze({
      sourceId: "retrieval-source-knl_foundation",
      sourceKey: "knl_ontology",
      platformId: "business-ontology",
      label: "Duplicate",
      description: "Duplicate source id.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateSourceId.success, false);
  const duplicateSourceKey = registerKnowledgeRetrievalSource(
    Object.freeze({
      sourceId: "retrieval-source-custom-key",
      sourceKey: "knl_graph",
      platformId: "knowledge-graph",
      label: "Duplicate Key",
      description: "Duplicate source key.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateSourceKey.success, false);
  const duplicateIndexId = registerKnowledgeIndex(
    Object.freeze({
      indexId: "knowledge-index-knl_foundation",
      indexName: "index_custom_duplicate",
      sourceKey: "knl_foundation",
      categoryKey: "knl_foundation",
      label: "Duplicate Index",
      description: "Duplicate index id.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateIndexId.success, false);
  const duplicateIndexName = registerKnowledgeIndex(
    Object.freeze({
      indexId: "knowledge-index-custom-name",
      indexName: "index_knl_foundation",
      sourceKey: "knl_ontology",
      categoryKey: "knl_ontology",
      label: "Duplicate Name",
      description: "Duplicate index name.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateIndexName.success, false);
});

test("rejects invalid source category and platform references", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const invalidPlatform = registerKnowledgeRetrievalSource(
    Object.freeze({
      sourceId: "retrieval-source-invalid-platform",
      sourceKey: "knl_policy",
      platformId: "wrong-platform-id",
      label: "Invalid Platform",
      description: "Invalid platform reference.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPlatform.success, false);
  const invalidSource = registerKnowledgeIndex(
    Object.freeze({
      indexId: "knowledge-index-invalid-source",
      indexName: "index_invalid_source",
      sourceKey: "knl_foundation",
      categoryKey: "knl_foundation",
      label: "Invalid",
      description: "Will fail if source unregistered - use unregistered after reset partial.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidSource.success, true);
  resetKnowledgeRetrievalEngineForTests();
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const orphanIndex = registerKnowledgeIndex(
    Object.freeze({
      indexId: "knowledge-index-orphan-source",
      indexName: "index_orphan_source",
      sourceKey: "knl_vocabulary",
      categoryKey: "knl_vocabulary",
      label: "Orphan",
      description: "Missing category registration path.",
    }),
    FIXED_TIME
  );
  assert.equal(orphanIndex.success, true);
});

test("validates retrieval version namespace format and duplicate ids", () => {
  assert.equal(validateKnowledgeRetrievalVersionFormat("KNL/9").valid, true);
  assert.equal(validateKnowledgeRetrievalVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgeRetrievalNamespaceFormat("knowledge-retrieval-engine").valid, true);
  assert.equal(validateKnowledgeRetrievalNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(validateKnowledgeIndexNameFormat("index_knl_foundation").valid, true);
  assert.equal(validateKnowledgeIndexNameFormat("Invalid-Index").valid, false);
  assert.equal(hasDuplicateRetrievalIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIndexNames(["Index_A", "index_a"]), true);
  assert.equal(hasDuplicateRetrievalSourceKeys(["knl_graph", "knl_graph"]), true);
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  assert.equal(validateRetrievalSourceReference("knl_foundation", RETRIEVAL_SOURCE_KEYS).valid, true);
  assert.equal(validateRetrievalCategoryReference("knl_ontology", RETRIEVAL_CATEGORY_KEYS).valid, true);
  assert.equal(validateRetrievalNamespaceReference("knowledge-retrieval-engine").valid, true);
});

test("resolves immutable knowledge retrieval contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeRetrievalSourceExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeIndexExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeRetrievalSourceExample(FIXED_TIME).sourceKey, "knl_foundation");
  assert.equal(resolveKnowledgeRetrievalSourceExample(FIXED_TIME).version, "KNL/9");
});

test("builds immutable knowledge retrieval manifest", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const manifest = getKnowledgeRetrievalManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/9");
  assert.equal(manifest.bestPracticeDependency, "KNL/8");
  assert.equal(manifest.supportedSources.length, 8);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge retrieval engine certification report", () => {
  const report = validateKnowledgeRetrievalEngine(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.frameworkValid, true);
  assert.equal(report.policyValid, true);
  assert.equal(report.bestPracticeValid, true);
  assert.equal(report.engineInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/9 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_RETRIEVAL_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeRetrievalEngine.ts",
    allowedFiles: KNOWLEDGE_RETRIEVAL_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_RETRIEVAL_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES.noSearch, true);
  assert.equal(KNOWLEDGE_RETRIEVAL_PUBLIC_API_RULES.noQuery, true);
  assert.equal(KNOWLEDGE_RETRIEVAL_MUST_NOT_OWN.includes("search_engine"), true);
  assert.equal(KNOWLEDGE_RETRIEVAL_MUST_NOT_OWN.includes("query_engine"), true);
  assert.equal(KNOWLEDGE_RETRIEVAL_PRINCIPLES.includes("knl_9_consumes_knl_1_through_knl_8_only"), true);
});

test("exports knowledge retrieval contract bundle", () => {
  assert.equal(KnowledgeRetrievalContract.version, "KNL/9");
  assert.equal(typeof KnowledgeRetrievalContract.validateKnowledgeRetrievalEngine, "function");
  assert.equal(typeof KnowledgeRetrievalContract.getKnowledgeRetrievalManifest, "function");
});

test("KnowledgeRetrievalEnginePlatform namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgeRetrievalEnginePlatform.registerKnowledgeRetrievalSource, "function");
  assert.equal(typeof KnowledgeRetrievalEnginePlatform.registerKnowledgeIndex, "function");
  assert.equal(typeof KnowledgeRetrievalEnginePlatform.registerKnowledgeCategory, "function");
  assert.equal(typeof KnowledgeRetrievalEnginePlatform.getKnowledgeRetrievalEngine, "function");
  assert.equal(typeof KnowledgeRetrievalEnginePlatform.validateKnowledgeRetrievalEngine, "function");
  assert.equal(typeof KnowledgeRetrievalEnginePlatform.getKnowledgeRetrievalManifest, "function");
  assert.equal(KnowledgeRetrievalEnginePlatform.version, "KNL/9");
});

test("public API registry includes required knowledge retrieval exports", () => {
  assert.ok(KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.includes("registerKnowledgeRetrievalSource"));
  assert.ok(KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.includes("registerKnowledgeIndex"));
  assert.ok(KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.includes("registerKnowledgeCategory"));
  assert.ok(KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.includes("getKnowledgeRetrievalEngine"));
  assert.ok(KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.includes("validateKnowledgeRetrievalEngine"));
  assert.ok(KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY.includes("getKnowledgeRetrievalManifest"));
});

test("future phase registry reserves knowledge validation without implementation", () => {
  assert.equal(KNOWLEDGE_RETRIEVAL_FUTURE_PHASE_KEYS.includes("knowledge_validation"), true);
  assert.equal(KNOWLEDGE_RETRIEVAL_FUTURE_PHASE_KEYS.includes("platform_certification"), true);
});

test("getKnowledgeRetrievalEngine returns state and registry", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const engine = getKnowledgeRetrievalEngine(FIXED_TIME);
  assert.equal(engine.state.initialized, true);
  assert.equal(engine.registry.snapshot.platformVersion, "KNL/9");
  assert.equal(engine.state.sourceCount, 8);
  assert.equal(engine.state.indexCount, 8);
});

test("seeded catalog includes all KNL platform retrieval sources", () => {
  buildKnowledgeRetrievalEngine(FIXED_TIME);
  const required = ["knl_foundation", "knl_graph", "knl_framework", "knl_policy", "knl_best_practice"];
  const engine = getKnowledgeRetrievalEngine(FIXED_TIME);
  for (const key of required) {
    assert.ok(engine.registry.sources.some((entry) => entry.sourceKey === key));
    assert.ok(engine.registry.indexes.some((entry) => entry.sourceKey === key));
  }
});

test("rejects index for unregistered source", () => {
  resetKnowledgeRetrievalEngineForTests();
  registerKnowledgeCategory(
    Object.freeze({
      categoryId: "knowledge-category-knl_foundation",
      categoryKey: "knl_foundation",
      label: "Foundation",
      description: "Category without full init.",
    }),
    FIXED_TIME
  );
  const result = registerKnowledgeIndex(
    Object.freeze({
      indexId: "knowledge-index-no-source",
      indexName: "index_no_source",
      sourceKey: "knl_foundation",
      categoryKey: "knl_foundation",
      label: "No Source",
      description: "Source not registered.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
