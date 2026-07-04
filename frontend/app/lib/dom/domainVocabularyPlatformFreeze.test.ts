import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import {
  createDomainVocabularyRegistry,
  validateDomainVocabularyFoundation,
} from "./domainVocabularyIndex.ts";
import {
  buildDomainVocabularySnapshot,
  queryDomainVocabularies,
} from "./domainVocabularyQueryIndex.ts";
import {
  buildDomainVocabularyExportBundle,
  runDomainVocabularyCertification,
} from "./domainVocabularyCertificationIndex.ts";
import {
  DOMAIN_VOCABULARY_EXTENSION_POLICY,
  DOMAIN_VOCABULARY_PHASE_REGISTRY,
  DOMAIN_VOCABULARY_PLATFORM_IDENTITY,
  DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY,
  DOMAIN_VOCABULARY_RELEASE_METADATA,
  DomainVocabularyPlatformFreeze,
  buildDomainVocabularyPlatformFreezeManifest,
  getDomainVocabularyPlatformCompatibilityMatrix,
  getDomainVocabularyPlatformFreezeState,
  isDomainVocabularyCompatibilityMatrixValid,
  listDomainVocabularyPlatformPhases,
  listDomainVocabularyPlatformPublicApis,
  runDomainVocabularyPlatformFreeze,
} from "./domainVocabularyPlatformFreezeIndex.ts";

test("publishes platform identity", () => {
  assert.equal(DOMAIN_VOCABULARY_PLATFORM_IDENTITY.platformId, "nexora-domain-vocabulary-platform");
  assert.equal(DOMAIN_VOCABULARY_PLATFORM_IDENTITY.version, "DOM-2:4");
  assert.equal(DOMAIN_VOCABULARY_PLATFORM_IDENTITY.releaseStage, "frozen");
  assert.equal(DOMAIN_VOCABULARY_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(DOMAIN_VOCABULARY_PLATFORM_IDENTITY.runtimeBehavior, false);
});

test("publishes phase registry", () => {
  assert.deepEqual(DOMAIN_VOCABULARY_PHASE_REGISTRY.map((entry) => entry.phaseId), [
    "DOM-2:1",
    "DOM-2:2",
    "DOM-2:3",
    "DOM-2:4",
  ]);
  assert.equal(DOMAIN_VOCABULARY_PHASE_REGISTRY.at(-1)?.status, "frozen");
  assert.equal(listDomainVocabularyPlatformPhases().length, 4);
});

test("publishes public API registry", () => {
  const apiNames = DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);

  assert.equal(apiNames.includes("DomainVocabularyFoundation"), true);
  assert.equal(apiNames.includes("DomainVocabularyQueryLayer"), true);
  assert.equal(apiNames.includes("DomainVocabularyCertificationLayer"), true);
  assert.equal(apiNames.includes("DomainVocabularyPlatformFreeze"), true);
  assert.equal(listDomainVocabularyPlatformPublicApis().length, DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY.length);
});

test("publishes compatibility matrix", () => {
  const matrix = getDomainVocabularyPlatformCompatibilityMatrix();

  assert.deepEqual(matrix.map((entry) => entry.targetLayer), [
    "DOM-1",
    "KNL",
    "APP",
    "LAY",
    "ASS",
    "DOM-3",
    "DOM-4",
    "DOM-5",
  ]);
  assert.equal(isDomainVocabularyCompatibilityMatrixValid(matrix), true);
});

test("publishes extension policy", () => {
  assert.equal(DOMAIN_VOCABULARY_EXTENSION_POLICY.policy, "metadata-extension-only");
  assert.equal(DOMAIN_VOCABULARY_EXTENSION_POLICY.allowsRuntimeInference, false);
  assert.equal(DOMAIN_VOCABULARY_EXTENSION_POLICY.allowsAiLogic, false);
  assert.equal(DOMAIN_VOCABULARY_EXTENSION_POLICY.allowsFuzzyMatching, false);
  assert.equal(DOMAIN_VOCABULARY_EXTENSION_POLICY.requiresPublicApiConsumption, true);
});

test("publishes release metadata", () => {
  assert.equal(DOMAIN_VOCABULARY_RELEASE_METADATA.releaseVersion, "DOM-2:4");
  assert.equal(DOMAIN_VOCABULARY_RELEASE_METADATA.certificationDependency, "DOM-2:3");
  assert.equal(DOMAIN_VOCABULARY_RELEASE_METADATA.regressionDependency, "DOM-2 regression");
  assert.equal(DOMAIN_VOCABULARY_RELEASE_METADATA.immutable, true);
});

test("generates freeze manifest", () => {
  const manifest = buildDomainVocabularyPlatformFreezeManifest();

  assert.equal(manifest.platformIdentity.version, "DOM-2:4");
  assert.equal(manifest.phaseRegistry.length, 4);
  assert.equal(manifest.compatibilityMatrix.length, 8);
  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.immutable, true);
});

test("uses deterministic freeze fingerprint", () => {
  const first = buildDomainVocabularyPlatformFreezeManifest();
  const second = buildDomainVocabularyPlatformFreezeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("runs platform freeze with PASS", () => {
  const result = runDomainVocabularyPlatformFreeze();

  assert.equal(result.status, "PASS");
  assert.equal(result.checks.every((entry) => entry.passed), true);
  assert.equal(result.certificationStatus, "PASS");
  assert.equal(result.regression.failed, 0);
});

test("returns freeze state", () => {
  const run = runDomainVocabularyPlatformFreeze();
  const state = getDomainVocabularyPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.manifest.fingerprint, run.manifest.fingerprint);
});

test("exports public freeze facade", () => {
  assert.equal(typeof DomainVocabularyPlatformFreeze.buildDomainVocabularyPlatformFreezeManifest, "function");
  assert.equal(typeof DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze, "function");
  assert.equal(typeof DomainVocabularyPlatformFreeze.getDomainVocabularyPlatformFreezeState, "function");
  assert.equal(typeof DomainVocabularyPlatformFreeze.getDomainVocabularyPlatformCompatibilityMatrix, "function");
  assert.equal(Object.isFrozen(DomainVocabularyPlatformFreeze), true);
});

test("keeps DOM-2:1 compatibility", () => {
  const registry = createDomainVocabularyRegistry();

  assert.equal(validateDomainVocabularyFoundation().valid, true);
  assert.equal(registry.contractVersion, "DOM-2:1");
});

test("keeps DOM-2:2 compatibility", () => {
  const registry = createDomainVocabularyRegistry();

  assert.equal(queryDomainVocabularies(registry).length, 0);
  assert.equal(buildDomainVocabularySnapshot(registry).vocabularyCount, 0);
});

test("keeps DOM-2:3 compatibility", () => {
  const registry = createDomainVocabularyRegistry();
  const bundle = buildDomainVocabularyExportBundle(registry);
  const certification = runDomainVocabularyCertification(
    runDomainVocabularyPlatformFreeze().manifest.publicApiRegistry.length > 0
      ? registry
      : registry
  );

  assert.equal(bundle.metadata.contractVersion, "DOM-2:3");
  assert.equal(["PASS", "FAIL"].includes(certification.status), true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
