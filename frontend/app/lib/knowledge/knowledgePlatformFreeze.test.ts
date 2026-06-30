import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  COMPATIBILITY_CONSUMER_KEYS,
  FREEZE_DEPENDENCY_KEYS,
  KNL_FROZEN_PHASE_KEYS,
  KNL_FROZEN_PHASE_TARGETS,
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_MUST_NOT_OWN,
  KNOWLEDGE_PLATFORM_FREEZE_PRINCIPLES,
  KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  KNOWLEDGE_PLATFORM_RELEASE_TAG,
  KNOWLEDGE_PLATFORM_RELEASE_VERSION,
} from "./knowledgePlatformFreezeCatalog.ts";
import { isCompatibilityMatrixComplete } from "./knowledgePlatformFreezeCompatibility.ts";
import {
  KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_RULES,
  KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST,
  KnowledgePlatformFreezeContract,
  getKnowledgePlatformCompatibilityMatrix,
  getKnowledgePlatformFreezeManifest,
  resolveFreezeManifestExample,
  validateKnowledgePlatformFreeze,
} from "./knowledgePlatformFreezeContracts.ts";
import { isFreezeManifestComplete } from "./knowledgePlatformFreezeManifest.ts";
import {
  KnowledgePlatformFreezeFacade,
  resetKnowledgePlatformFreezePlatformForTests,
  runKnowledgePlatformFreeze,
} from "./knowledgePlatformFreeze.ts";
import { isKnowledgePlatformFrozen, isKnowledgePlatformReleased } from "./knowledgePlatformFreezeRunner.ts";
import {
  validateFreezeDependencyChain,
  validateKnowledgePlatformFreezeNamespaceFormat,
  validateKnowledgePlatformFreezeVersionFormat,
  validateReleaseTagFormat,
} from "./knowledgePlatformFreezeValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgePlatformFreezePlatformForTests();
});

test("exports KNL/15 knowledge platform freeze contract vocabulary", () => {
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION, "KNL/15");
  assert.equal(KNL_FROZEN_PHASE_KEYS.length, 14);
  assert.equal(COMPATIBILITY_CONSUMER_KEYS.length, 7);
  assert.equal(KNOWLEDGE_PLATFORM_RELEASE_VERSION, "KNL-15-RELEASE-1");
});

test("runs knowledge platform freeze after KNL/14 certification", () => {
  assert.equal(isKnowledgePlatformFrozen(), false);
  const result = runKnowledgePlatformFreeze(FIXED_TIME);
  assert.equal(result.success, true, result.reason);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  assert.equal(result.phasesFrozen, 14);
  assert.equal(isKnowledgePlatformFrozen(), true);
  assert.equal(isKnowledgePlatformReleased(), true);
});

test("generates immutable freeze manifest with release metadata", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const manifest = resolveFreezeManifestExample(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 14);
  assert.equal(manifest.dependencyChain.length, 14);
  assert.equal(manifest.releaseMetadata.releaseVersion, KNOWLEDGE_PLATFORM_RELEASE_VERSION);
  assert.equal(manifest.releaseMetadata.releaseTag, KNOWLEDGE_PLATFORM_RELEASE_TAG);
  assert.equal(manifest.releaseMetadata.status, "released");
  assert.equal(manifest.platformIdentity.layerId, "KNL");
  assert.equal(isFreezeManifestComplete(manifest), true);
});

test("publishes compatibility matrix for all consumer layers", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const matrix = getKnowledgePlatformCompatibilityMatrix();
  assert.equal(Object.isFrozen(matrix), true);
  assert.equal(matrix.entries.length, 7);
  assert.equal(isCompatibilityMatrixComplete(matrix), true);
  for (const consumerKey of COMPATIBILITY_CONSUMER_KEYS) {
    assert.ok(matrix.entries.some((entry) => entry.consumerKey === consumerKey && entry.compatible === true));
  }
});

test("validates freeze version namespace release tag and dependency chain", () => {
  assert.equal(validateKnowledgePlatformFreezeVersionFormat("KNL/15").valid, true);
  assert.equal(validateKnowledgePlatformFreezeVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgePlatformFreezeNamespaceFormat("knowledge-platform-freeze").valid, true);
  assert.equal(validateReleaseTagFormat(KNOWLEDGE_PLATFORM_RELEASE_TAG).valid, true);
  assert.equal(validateFreezeDependencyChain([...FREEZE_DEPENDENCY_KEYS]).valid, true);
});

test("builds immutable knowledge platform freeze public manifest", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const manifest = getKnowledgePlatformFreezeManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/15");
  assert.equal(manifest.certificationDependency, "KNL/14");
  assert.equal(manifest.frozenPhases.length, 14);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge platform freeze certification report", () => {
  const report = validateKnowledgePlatformFreeze(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.certificationValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.freezeValid, true);
  assert.equal(report.identityValid, true);
});

test("validates KNL/15 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgePlatformFreeze.ts",
    allowedFiles: KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_RULES.noRuntimeChanges, true);
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_RULES.noPlatformMutation, true);
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_MUST_NOT_OWN.includes("platform_mutation"), true);
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_MUST_NOT_OWN.includes("runtime_validation"), true);
  assert.equal(KNOWLEDGE_PLATFORM_FREEZE_PRINCIPLES.includes("knl_15_consumes_knl_1_through_knl_14_only"), true);
});

test("exports knowledge platform freeze contract bundle", () => {
  assert.equal(KnowledgePlatformFreezeContract.version, "KNL/15");
  assert.equal(typeof KnowledgePlatformFreezeContract.validateKnowledgePlatformFreeze, "function");
  assert.equal(typeof KnowledgePlatformFreezeContract.getKnowledgePlatformFreezeManifest, "function");
});

test("KnowledgePlatformFreezeFacade namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgePlatformFreezeFacade.runKnowledgePlatformFreeze, "function");
  assert.equal(typeof KnowledgePlatformFreezeFacade.getKnowledgePlatformFreezeManifest, "function");
  assert.equal(typeof KnowledgePlatformFreezeFacade.validateKnowledgePlatformFreeze, "function");
  assert.equal(typeof KnowledgePlatformFreezeFacade.getKnowledgePlatformCompatibilityMatrix, "function");
  assert.equal(KnowledgePlatformFreezeFacade.version, "KNL/15");
});

test("public API registry includes required freeze exports", () => {
  assert.ok(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.includes("runKnowledgePlatformFreeze"));
  assert.ok(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.includes("getKnowledgePlatformFreezeManifest"));
  assert.ok(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.includes("validateKnowledgePlatformFreeze"));
  assert.ok(KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.includes("getKnowledgePlatformCompatibilityMatrix"));
});

test("freeze manifest includes governance and certification summaries", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const manifest = resolveFreezeManifestExample(FIXED_TIME);
  assert.equal(manifest.governanceSummary.contractVersion, "KNL/13");
  assert.equal(manifest.certificationSummary.contractVersion, "KNL/14");
  assert.equal(manifest.certificationSummary.status, "passed");
  assert.equal(manifest.extensionPolicy.length, 4);
});

test("frozen platform registry covers all KNL phases", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const manifest = resolveFreezeManifestExample(FIXED_TIME);
  assert.equal(manifest.platformRegistry.entries.length, 14);
  for (const target of KNL_FROZEN_PHASE_TARGETS) {
    const entry = manifest.platformRegistry.entries.find((item) => item.phaseKey === target.key);
    assert.ok(entry);
    assert.equal(entry?.frozen, true);
    assert.equal(entry?.phaseId, target.phaseId);
  }
});

test("compatibility matrix includes APP LAY INT OPS and future layers", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const matrix = getKnowledgePlatformCompatibilityMatrix();
  const required = ["app", "lay", "int", "ops", "future_ml"] as const;
  for (const key of required) {
    const entry = matrix.entries.find((item) => item.consumerKey === key);
    assert.ok(entry);
    assert.equal(entry?.compatible, true);
    assert.equal(entry?.knlVersion, "KNL/15");
  }
});

test("dependency chain spans KNL/1 through KNL/14", () => {
  runKnowledgePlatformFreeze(FIXED_TIME);
  const manifest = resolveFreezeManifestExample(FIXED_TIME);
  assert.deepEqual(manifest.dependencyChain, FREEZE_DEPENDENCY_KEYS);
  assert.equal(manifest.dependencyChain[0], "KNL/1");
  assert.equal(manifest.dependencyChain[13], "KNL/14");
});

test("KNL platform is certified frozen and released", () => {
  const result = runKnowledgePlatformFreeze(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  const validation = validateKnowledgePlatformFreeze(FIXED_TIME);
  assert.equal(validation.valid, true);
});
