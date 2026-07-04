import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import {
  createDomainKpiRegistry,
  validateDomainKpiFoundation,
} from "./domainKpiIndex.ts";
import {
  buildDomainKpiSnapshot,
  queryDomainKpiPackages,
} from "./domainKpiQueryIndex.ts";
import {
  buildDomainKpiExportBundle,
  runDomainKpiCertification,
} from "./domainKpiCertificationIndex.ts";
import {
  DOMAIN_KPI_EXTENSION_POLICY,
  DOMAIN_KPI_PHASE_REGISTRY,
  DOMAIN_KPI_PLATFORM_IDENTITY,
  DOMAIN_KPI_PUBLIC_API_REGISTRY,
  DOMAIN_KPI_RELEASE_METADATA,
  DomainKpiPlatformFreeze,
  buildDomainKpiPlatformFreezeManifest,
  getDomainKpiPlatformCompatibilityMatrix,
  getDomainKpiPlatformFreezeState,
  isDomainKpiCompatibilityMatrixValid,
  isDomainKpiPlatformFreezeManifestValid,
  listDomainKpiPlatformPhases,
  listDomainKpiPlatformPublicApis,
  runDomainKpiPlatformFreeze,
} from "./domainKpiPlatformFreezeIndex.ts";

test("publishes platform identity", () => {
  assert.equal(DOMAIN_KPI_PLATFORM_IDENTITY.platformId, "nexora-domain-kpi-contract-platform");
  assert.equal(DOMAIN_KPI_PLATFORM_IDENTITY.version, "DOM-4:4");
  assert.equal(DOMAIN_KPI_PLATFORM_IDENTITY.releaseStage, "frozen");
  assert.equal(DOMAIN_KPI_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(DOMAIN_KPI_PLATFORM_IDENTITY.runtimeBehavior, false);
});

test("publishes phase registry", () => {
  assert.deepEqual(DOMAIN_KPI_PHASE_REGISTRY.map((entry) => entry.phaseId), [
    "DOM-4:1",
    "DOM-4:2",
    "DOM-4:3",
    "DOM-4:4",
  ]);
  assert.equal(DOMAIN_KPI_PHASE_REGISTRY.at(-1)?.status, "frozen");
  assert.equal(listDomainKpiPlatformPhases().length, 4);
});

test("publishes public API registry", () => {
  const apiNames = DOMAIN_KPI_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);

  assert.equal(apiNames.includes("DomainKpiFoundation"), true);
  assert.equal(apiNames.includes("DomainKpiQueryLayer"), true);
  assert.equal(apiNames.includes("DomainKpiCertificationLayer"), true);
  assert.equal(apiNames.includes("DomainKpiPlatformFreeze"), true);
  assert.equal(listDomainKpiPlatformPublicApis().length, DOMAIN_KPI_PUBLIC_API_REGISTRY.length);
});

test("publishes compatibility matrix", () => {
  const matrix = getDomainKpiPlatformCompatibilityMatrix();

  assert.deepEqual(matrix.map((entry) => entry.targetLayer), [
    "DOM-1",
    "DOM-2",
    "DOM-3",
    "KNL",
    "APP",
    "LAY",
    "ASS",
    "DS",
    "INT",
    "DOM-5",
    "DOM-6",
    "DOM-7",
  ]);
  assert.equal(isDomainKpiCompatibilityMatrixValid(matrix), true);
});

test("publishes extension policy", () => {
  assert.equal(DOMAIN_KPI_EXTENSION_POLICY.policy, "metadata-extension-only");
  assert.equal(DOMAIN_KPI_EXTENSION_POLICY.allowsKpiCalculationEngine, false);
  assert.equal(DOMAIN_KPI_EXTENSION_POLICY.allowsRuntimeMetricEvaluation, false);
  assert.equal(DOMAIN_KPI_EXTENSION_POLICY.allowsRuntimeInference, false);
  assert.equal(DOMAIN_KPI_EXTENSION_POLICY.allowsAiLogic, false);
  assert.equal(DOMAIN_KPI_EXTENSION_POLICY.allowsSemanticMatching, false);
});

test("publishes release metadata", () => {
  assert.equal(DOMAIN_KPI_RELEASE_METADATA.releaseVersion, "DOM-4:4");
  assert.equal(DOMAIN_KPI_RELEASE_METADATA.certificationDependency, "DOM-4:3");
  assert.equal(DOMAIN_KPI_RELEASE_METADATA.regressionDependency, "DOM-4 regression");
  assert.equal(DOMAIN_KPI_RELEASE_METADATA.immutable, true);
});

test("generates freeze manifest", () => {
  const manifest = buildDomainKpiPlatformFreezeManifest();

  assert.equal(manifest.platformIdentity.version, "DOM-4:4");
  assert.equal(manifest.phaseRegistry.length, 4);
  assert.equal(manifest.compatibilityMatrix.length, 12);
  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.immutable, true);
});

test("validates freeze manifest", () => {
  assert.equal(isDomainKpiPlatformFreezeManifestValid(buildDomainKpiPlatformFreezeManifest()), true);
});

test("uses deterministic freeze fingerprint", () => {
  const first = buildDomainKpiPlatformFreezeManifest();
  const second = buildDomainKpiPlatformFreezeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("runs platform freeze with PASS", () => {
  const result = runDomainKpiPlatformFreeze();

  assert.equal(result.status, "PASS");
  assert.equal(result.checks.every((entry) => entry.passed), true);
  assert.equal(result.certificationStatus, "PASS");
  assert.equal(result.regression.failed, 0);
});

test("returns freeze state", () => {
  const run = runDomainKpiPlatformFreeze();
  const state = getDomainKpiPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.manifest.fingerprint, run.manifest.fingerprint);
});

test("exports public freeze facade", () => {
  assert.equal(typeof DomainKpiPlatformFreeze.buildDomainKpiPlatformFreezeManifest, "function");
  assert.equal(typeof DomainKpiPlatformFreeze.isDomainKpiPlatformFreezeManifestValid, "function");
  assert.equal(typeof DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze, "function");
  assert.equal(typeof DomainKpiPlatformFreeze.getDomainKpiPlatformFreezeState, "function");
  assert.equal(Object.isFrozen(DomainKpiPlatformFreeze), true);
});

test("keeps DOM-4:1 compatibility", () => {
  const registry = createDomainKpiRegistry();

  assert.equal(validateDomainKpiFoundation().valid, true);
  assert.equal(registry.contractVersion, "DOM-4:1");
});

test("keeps DOM-4:2 compatibility", () => {
  const registry = createDomainKpiRegistry();

  assert.equal(queryDomainKpiPackages(registry).length, 0);
  assert.equal(buildDomainKpiSnapshot(registry).packageCount, 0);
});

test("keeps DOM-4:3 compatibility", () => {
  const registry = createDomainKpiRegistry();
  const bundle = buildDomainKpiExportBundle(registry);
  const certification = runDomainKpiCertification(registry);

  assert.equal(bundle.metadata.contractVersion, "DOM-4:3");
  assert.equal(["PASS", "FAIL"].includes(certification.status), true);
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});
