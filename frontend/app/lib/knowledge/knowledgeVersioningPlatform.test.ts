import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
  KNOWLEDGE_VERSIONING_FUTURE_PHASE_KEYS,
  KNOWLEDGE_VERSIONING_MUST_NOT_OWN,
  KNOWLEDGE_VERSIONING_PRINCIPLES,
  KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY,
  VERSIONED_ASSET_KEYS,
  VERSIONED_ASSET_LABELS,
} from "./knowledgeVersioningCatalog.ts";
import {
  KNOWLEDGE_VERSIONING_PUBLIC_API_RULES,
  KNOWLEDGE_VERSIONING_SELF_MANIFEST,
  KnowledgeVersioningContract,
  getKnowledgeVersioningManifest,
  resolveKnowledgeVersionExample,
  resolveVersionedKnowledgeAssetExample,
  validateKnowledgeVersioningPlatform,
} from "./knowledgeVersioningContracts.ts";
import {
  KnowledgeVersioningPlatformFacade,
  buildKnowledgeVersioningPlatform,
  getKnowledgeVersioningPlatform,
  isKnowledgeVersioningPlatformInitialized,
  registerKnowledgeVersion,
  registerKnowledgeVersionCompatibility,
  registerVersionedKnowledgeAsset,
  resetKnowledgeVersioningPlatformForTests,
} from "./knowledgeVersioningPlatform.ts";
import {
  hasDuplicateAssetIds,
  hasDuplicateAssetNames,
  hasDuplicateReleaseIds,
  hasDuplicateVersionIds,
  validateAssetNameFormat,
  validateDependencyReference,
  validateKnowledgeVersioningNamespaceFormat,
  validateKnowledgeVersioningVersionFormat,
  validatePlatformReference,
} from "./knowledgeVersioningValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeVersioningPlatformForTests();
});

test("exports KNL/11 knowledge versioning contract vocabulary", () => {
  assert.equal(KNOWLEDGE_VERSIONING_CONTRACT_VERSION, "KNL/11");
  assert.equal(VERSIONED_ASSET_KEYS.length, 10);
});

test("initializes knowledge versioning platform with KNL/1 through KNL/10 dependencies", () => {
  assert.equal(isKnowledgeVersioningPlatformInitialized(), false);
  const init = buildKnowledgeVersioningPlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgeVersioningPlatformInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.policyDependency, "KNL/7");
  assert.equal(init.data?.bestPracticeDependency, "KNL/8");
  assert.equal(init.data?.retrievalDependency, "KNL/9");
  assert.equal(init.data?.validationDependency, "KNL/10");
  assert.equal(init.data?.contractVersion, "KNL/11");
});

test("seeds versioning catalog with 10 KNL versions assets and compatibilities", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const platform = getKnowledgeVersioningPlatform(FIXED_TIME);
  assert.equal(platform.registry.versions.length, 10);
  assert.equal(platform.registry.assets.length, 10);
  assert.equal(platform.registry.compatibilities.length, 10);
  assert.equal(platform.registry.releases.length, 10);
  assert.equal(platform.registry.dependencies.length, 10);
  assert.equal(platform.registry.namespaces.length, 4);
  assert.equal(platform.registry.statuses.length, 4);
  for (const assetKey of VERSIONED_ASSET_KEYS) {
    assert.ok(platform.registry.versions.some((entry) => entry.assetKey === assetKey));
    assert.ok(platform.registry.assets.some((entry) => entry.assetId === `versioned-asset-${assetKey}`));
    assert.ok(platform.registry.releases.some((entry) => entry.releaseId === `version-release-${assetKey}`));
  }
});

test("registers custom version asset and compatibility", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const version = registerKnowledgeVersion(
    Object.freeze({
      versionId: "knowledge-version-custom-001",
      assetKey: "knl_foundation",
      versionLabel: "KNL/1",
      platformId: "knowledge-platform",
      scopeKey: "contract",
      status: "active",
      label: "Custom Foundation Version",
      description: "Custom version metadata.",
    }),
    FIXED_TIME
  );
  assert.equal(version.success, true);
  const asset = registerVersionedKnowledgeAsset(
    Object.freeze({
      assetId: "versioned-asset-custom-001",
      assetKey: "knl_foundation",
      assetName: "custom_foundation_asset",
      platformId: "knowledge-platform",
      versionLabel: "KNL/1",
      scopeKey: "catalog",
      status: "active",
      label: "Custom Foundation Asset",
      description: "Custom asset metadata.",
      lineageDescription: "Custom lineage metadata.",
      changeDescription: "Custom change descriptor metadata.",
    }),
    FIXED_TIME
  );
  assert.equal(asset.success, true);
  const compatibility = registerKnowledgeVersionCompatibility(
    Object.freeze({
      compatibilityId: "version-compatibility-custom-001",
      assetKey: "knl_foundation",
      versionLabel: "KNL/1",
      compatibleWithVersion: "KNL/1",
      platformId: "knowledge-platform",
      label: "Custom Compatibility",
      description: "Custom compatibility metadata.",
    }),
    FIXED_TIME
  );
  assert.equal(compatibility.success, true);
});

test("prevents duplicate version ids asset ids asset names and release records", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const duplicateVersionId = registerKnowledgeVersion(
    Object.freeze({
      versionId: "knowledge-version-knl_foundation",
      assetKey: "knl_ontology",
      versionLabel: "KNL/2",
      platformId: "business-ontology",
      scopeKey: "platform",
      status: "active",
      label: "Duplicate",
      description: "Duplicate version id.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateVersionId.success, false);
  const duplicateAssetId = registerVersionedKnowledgeAsset(
    Object.freeze({
      assetId: "versioned-asset-knl_foundation",
      assetKey: "knl_ontology",
      assetName: "knl_ontology_custom",
      platformId: "business-ontology",
      versionLabel: "KNL/2",
      scopeKey: "registry",
      status: "active",
      label: "Duplicate Asset",
      description: "Duplicate asset id.",
      lineageDescription: "Lineage.",
      changeDescription: "Change.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateAssetId.success, false);
  const duplicateAssetName = registerVersionedKnowledgeAsset(
    Object.freeze({
      assetId: "versioned-asset-duplicate-name",
      assetKey: "knl_ontology",
      assetName: "knl_foundation",
      platformId: "business-ontology",
      versionLabel: "KNL/2",
      scopeKey: "registry",
      status: "active",
      label: "Duplicate Name",
      description: "Duplicate asset name.",
      lineageDescription: "Lineage.",
      changeDescription: "Change.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateAssetName.success, false);
  assert.equal(hasDuplicateReleaseIds(["version-release-knl_foundation", "version-release-knl_foundation"]), true);
});

test("rejects invalid platform dependency and compatibility references", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const invalidPlatform = registerKnowledgeVersion(
    Object.freeze({
      versionId: "knowledge-version-invalid-platform",
      assetKey: "knl_graph",
      versionLabel: "KNL/4",
      platformId: "wrong-platform-id",
      scopeKey: "platform",
      status: "active",
      label: "Invalid Platform",
      description: "Invalid platform reference.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPlatform.success, false);
  const invalidDependency = registerKnowledgeVersion(
    Object.freeze({
      versionId: "knowledge-version-invalid-dependency",
      assetKey: "knl_graph",
      versionLabel: "KNL/99",
      platformId: "knowledge-graph",
      scopeKey: "platform",
      status: "active",
      label: "Invalid Dependency",
      description: "Invalid version label.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidDependency.success, false);
  const invalidCompatibility = registerKnowledgeVersionCompatibility(
    Object.freeze({
      compatibilityId: "version-compatibility-invalid",
      assetKey: "knl_foundation",
      versionLabel: "KNL/1",
      compatibleWithVersion: "KNL/99",
      platformId: "knowledge-platform",
      label: "Invalid Compatibility",
      description: "Unregistered compatible version.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidCompatibility.success, false);
});

test("validates versioning version namespace format and duplicate ids", () => {
  assert.equal(validateKnowledgeVersioningVersionFormat("KNL/11").valid, true);
  assert.equal(validateKnowledgeVersioningVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgeVersioningNamespaceFormat("knowledge-versioning-platform").valid, true);
  assert.equal(validateKnowledgeVersioningNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(validateAssetNameFormat("knl_foundation").valid, true);
  assert.equal(validateAssetNameFormat("Invalid-Name").valid, false);
  assert.equal(hasDuplicateVersionIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateAssetIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateAssetNames(["Asset", "asset"]), true);
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  assert.equal(validatePlatformReference("knl_foundation", "knowledge-platform").valid, true);
  assert.equal(validateDependencyReference("knl_graph", "KNL/4").valid, true);
});

test("resolves immutable knowledge versioning contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeVersionExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveVersionedKnowledgeAssetExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeVersionExample(FIXED_TIME).assetKey, "knl_foundation");
  assert.equal(resolveKnowledgeVersionExample(FIXED_TIME).version, "KNL/11");
});

test("builds immutable knowledge versioning manifest", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const manifest = getKnowledgeVersioningManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/11");
  assert.equal(manifest.validationDependency, "KNL/10");
  assert.equal(manifest.supportedAssets.length, 10);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge versioning platform certification report", () => {
  const report = validateKnowledgeVersioningPlatform(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.frameworkValid, true);
  assert.equal(report.policyValid, true);
  assert.equal(report.bestPracticeValid, true);
  assert.equal(report.retrievalValid, true);
  assert.equal(report.validationValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/11 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_VERSIONING_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeVersioningPlatform.ts",
    allowedFiles: KNOWLEDGE_VERSIONING_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_VERSIONING_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_VERSIONING_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_VERSIONING_PUBLIC_API_RULES.noMigration, true);
  assert.equal(KNOWLEDGE_VERSIONING_PUBLIC_API_RULES.noMutation, true);
  assert.equal(KNOWLEDGE_VERSIONING_MUST_NOT_OWN.includes("migration_engine"), true);
  assert.equal(KNOWLEDGE_VERSIONING_MUST_NOT_OWN.includes("runtime_version_resolver"), true);
  assert.equal(KNOWLEDGE_VERSIONING_PRINCIPLES.includes("knl_11_consumes_knl_1_through_knl_10_only"), true);
});

test("exports knowledge versioning contract bundle", () => {
  assert.equal(KnowledgeVersioningContract.version, "KNL/11");
  assert.equal(typeof KnowledgeVersioningContract.validateKnowledgeVersioningPlatform, "function");
  assert.equal(typeof KnowledgeVersioningContract.getKnowledgeVersioningManifest, "function");
});

test("KnowledgeVersioningPlatformFacade namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgeVersioningPlatformFacade.registerKnowledgeVersion, "function");
  assert.equal(typeof KnowledgeVersioningPlatformFacade.registerVersionedKnowledgeAsset, "function");
  assert.equal(typeof KnowledgeVersioningPlatformFacade.registerKnowledgeVersionCompatibility, "function");
  assert.equal(typeof KnowledgeVersioningPlatformFacade.getKnowledgeVersioningPlatform, "function");
  assert.equal(typeof KnowledgeVersioningPlatformFacade.validateKnowledgeVersioningPlatform, "function");
  assert.equal(typeof KnowledgeVersioningPlatformFacade.getKnowledgeVersioningManifest, "function");
  assert.equal(KnowledgeVersioningPlatformFacade.version, "KNL/11");
});

test("public API registry includes required knowledge versioning exports", () => {
  assert.ok(KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.includes("registerKnowledgeVersion"));
  assert.ok(KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.includes("registerVersionedKnowledgeAsset"));
  assert.ok(KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.includes("registerKnowledgeVersionCompatibility"));
  assert.ok(KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.includes("getKnowledgeVersioningPlatform"));
  assert.ok(KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.includes("validateKnowledgeVersioningPlatform"));
  assert.ok(KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY.includes("getKnowledgeVersioningManifest"));
});

test("future phase registry reserves knowledge learning bridge without implementation", () => {
  assert.equal(KNOWLEDGE_VERSIONING_FUTURE_PHASE_KEYS.includes("knowledge_learning_bridge"), true);
  assert.equal(KNOWLEDGE_VERSIONING_FUTURE_PHASE_KEYS.includes("platform_certification"), true);
});

test("getKnowledgeVersioningPlatform returns state and registry", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const platform = getKnowledgeVersioningPlatform(FIXED_TIME);
  assert.equal(platform.state.initialized, true);
  assert.equal(platform.registry.snapshot.platformVersion, "KNL/11");
  assert.equal(platform.state.versionCount, 10);
  assert.equal(platform.state.assetCount, 10);
});

test("seeded catalog includes required KNL versioned assets", () => {
  buildKnowledgeVersioningPlatform(FIXED_TIME);
  const required = ["knl_foundation", "knl_graph", "knl_framework", "knl_policy", "knl_validation"] as const;
  const platform = getKnowledgeVersioningPlatform(FIXED_TIME);
  for (const key of required) {
    assert.ok(platform.registry.assets.some((entry) => entry.assetKey === key));
    assert.equal(
      platform.registry.assets.find((entry) => entry.assetKey === key)?.label,
      `${VERSIONED_ASSET_LABELS[key]} Asset`
    );
  }
});

test("rejects compatibility for unregistered version label", () => {
  resetKnowledgeVersioningPlatformForTests();
  registerKnowledgeVersion(
    Object.freeze({
      versionId: "knowledge-version-orphan",
      assetKey: "knl_foundation",
      versionLabel: "KNL/1",
      platformId: "knowledge-platform",
      scopeKey: "platform",
      status: "active",
      label: "Orphan Version",
      description: "Only version without matching registered compatible.",
    }),
    FIXED_TIME
  );
  const result = registerKnowledgeVersionCompatibility(
    Object.freeze({
      compatibilityId: "version-compatibility-orphan",
      assetKey: "knl_foundation",
      versionLabel: "KNL/1",
      compatibleWithVersion: "KNL/2",
      platformId: "knowledge-platform",
      label: "Orphan Compatibility",
      description: "Compatible version not registered.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
