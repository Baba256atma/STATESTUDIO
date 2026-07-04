import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import {
  createDomainOntologyRegistry,
  validateDomainOntologyFoundation,
} from "./domainOntologyIndex.ts";
import {
  buildDomainOntologySnapshot,
  queryDomainOntologies,
} from "./domainOntologyQueryIndex.ts";
import {
  buildDomainOntologyExportBundle,
  runDomainOntologyCertification,
} from "./domainOntologyCertificationIndex.ts";
import {
  DOMAIN_ONTOLOGY_EXTENSION_POLICY,
  DOMAIN_ONTOLOGY_PHASE_REGISTRY,
  DOMAIN_ONTOLOGY_PLATFORM_IDENTITY,
  DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY,
  DOMAIN_ONTOLOGY_RELEASE_METADATA,
  DomainOntologyPlatformFreeze,
  buildDomainOntologyPlatformFreezeManifest,
  getDomainOntologyPlatformCompatibilityMatrix,
  getDomainOntologyPlatformFreezeState,
  isDomainOntologyCompatibilityMatrixValid,
  isDomainOntologyPlatformFreezeManifestValid,
  listDomainOntologyPlatformPhases,
  listDomainOntologyPlatformPublicApis,
  runDomainOntologyPlatformFreeze,
} from "./domainOntologyPlatformFreezeIndex.ts";

test("publishes platform identity", () => {
  assert.equal(DOMAIN_ONTOLOGY_PLATFORM_IDENTITY.platformId, "nexora-domain-ontology-platform");
  assert.equal(DOMAIN_ONTOLOGY_PLATFORM_IDENTITY.version, "DOM-3:4");
  assert.equal(DOMAIN_ONTOLOGY_PLATFORM_IDENTITY.releaseStage, "frozen");
  assert.equal(DOMAIN_ONTOLOGY_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(DOMAIN_ONTOLOGY_PLATFORM_IDENTITY.runtimeBehavior, false);
});

test("publishes phase registry", () => {
  assert.deepEqual(DOMAIN_ONTOLOGY_PHASE_REGISTRY.map((entry) => entry.phaseId), [
    "DOM-3:1",
    "DOM-3:2",
    "DOM-3:3",
    "DOM-3:4",
  ]);
  assert.equal(DOMAIN_ONTOLOGY_PHASE_REGISTRY.at(-1)?.status, "frozen");
  assert.equal(listDomainOntologyPlatformPhases().length, 4);
});

test("publishes public API registry", () => {
  const apiNames = DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);

  assert.equal(apiNames.includes("DomainOntologyFoundation"), true);
  assert.equal(apiNames.includes("DomainOntologyQueryLayer"), true);
  assert.equal(apiNames.includes("DomainOntologyCertificationLayer"), true);
  assert.equal(apiNames.includes("DomainOntologyPlatformFreeze"), true);
  assert.equal(listDomainOntologyPlatformPublicApis().length, DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY.length);
});

test("publishes compatibility matrix", () => {
  const matrix = getDomainOntologyPlatformCompatibilityMatrix();

  assert.deepEqual(matrix.map((entry) => entry.targetLayer), [
    "DOM-1",
    "DOM-2",
    "KNL",
    "APP",
    "LAY",
    "ASS",
    "DOM-4",
    "DOM-5",
    "DOM-6",
  ]);
  assert.equal(isDomainOntologyCompatibilityMatrixValid(matrix), true);
});

test("publishes extension policy", () => {
  assert.equal(DOMAIN_ONTOLOGY_EXTENSION_POLICY.policy, "metadata-extension-only");
  assert.equal(DOMAIN_ONTOLOGY_EXTENSION_POLICY.allowsRuntimeInference, false);
  assert.equal(DOMAIN_ONTOLOGY_EXTENSION_POLICY.allowsRuntimeGraphReasoning, false);
  assert.equal(DOMAIN_ONTOLOGY_EXTENSION_POLICY.allowsAiLogic, false);
  assert.equal(DOMAIN_ONTOLOGY_EXTENSION_POLICY.allowsFuzzyMatching, false);
});

test("publishes release metadata", () => {
  assert.equal(DOMAIN_ONTOLOGY_RELEASE_METADATA.releaseVersion, "DOM-3:4");
  assert.equal(DOMAIN_ONTOLOGY_RELEASE_METADATA.certificationDependency, "DOM-3:3");
  assert.equal(DOMAIN_ONTOLOGY_RELEASE_METADATA.regressionDependency, "DOM-3 regression");
  assert.equal(DOMAIN_ONTOLOGY_RELEASE_METADATA.immutable, true);
});

test("generates freeze manifest", () => {
  const manifest = buildDomainOntologyPlatformFreezeManifest();

  assert.equal(manifest.platformIdentity.version, "DOM-3:4");
  assert.equal(manifest.phaseRegistry.length, 4);
  assert.equal(manifest.compatibilityMatrix.length, 9);
  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.immutable, true);
});

test("validates freeze manifest", () => {
  assert.equal(isDomainOntologyPlatformFreezeManifestValid(buildDomainOntologyPlatformFreezeManifest()), true);
});

test("uses deterministic freeze fingerprint", () => {
  const first = buildDomainOntologyPlatformFreezeManifest();
  const second = buildDomainOntologyPlatformFreezeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("runs platform freeze with PASS", () => {
  const result = runDomainOntologyPlatformFreeze();

  assert.equal(result.status, "PASS");
  assert.equal(result.checks.every((entry) => entry.passed), true);
  assert.equal(result.certificationStatus, "PASS");
  assert.equal(result.regression.failed, 0);
});

test("returns freeze state", () => {
  const run = runDomainOntologyPlatformFreeze();
  const state = getDomainOntologyPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.manifest.fingerprint, run.manifest.fingerprint);
});

test("exports public freeze facade", () => {
  assert.equal(typeof DomainOntologyPlatformFreeze.buildDomainOntologyPlatformFreezeManifest, "function");
  assert.equal(typeof DomainOntologyPlatformFreeze.isDomainOntologyPlatformFreezeManifestValid, "function");
  assert.equal(typeof DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze, "function");
  assert.equal(typeof DomainOntologyPlatformFreeze.getDomainOntologyPlatformFreezeState, "function");
  assert.equal(Object.isFrozen(DomainOntologyPlatformFreeze), true);
});

test("keeps DOM-3:1 compatibility", () => {
  const registry = createDomainOntologyRegistry();

  assert.equal(validateDomainOntologyFoundation().valid, true);
  assert.equal(registry.contractVersion, "DOM-3:1");
});

test("keeps DOM-3:2 compatibility", () => {
  const registry = createDomainOntologyRegistry();

  assert.equal(queryDomainOntologies(registry).length, 0);
  assert.equal(buildDomainOntologySnapshot(registry).ontologyCount, 0);
});

test("keeps DOM-3:3 compatibility", () => {
  const registry = createDomainOntologyRegistry();
  const bundle = buildDomainOntologyExportBundle(registry);
  const certification = runDomainOntologyCertification(registry);

  assert.equal(bundle.metadata.contractVersion, "DOM-3:3");
  assert.equal(["PASS", "FAIL"].includes(certification.status), true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
