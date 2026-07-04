import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { validateDomainReasoningFoundation } from "./domainReasoningIndex.ts";
import { DomainReasoningQueryLayer } from "./domainReasoningQueryIndex.ts";
import { DomainReasoningCertificationLayer } from "./domainReasoningCertificationIndex.ts";
import {
  DOMAIN_REASONING_COMPATIBILITY_MATRIX,
  DOMAIN_REASONING_EXTENSION_POLICY,
  DOMAIN_REASONING_PHASE_REGISTRY,
  DOMAIN_REASONING_PLATFORM_IDENTITY,
  DOMAIN_REASONING_PUBLIC_API_REGISTRY,
  DOMAIN_REASONING_RELEASE_METADATA,
  DomainReasoningPlatformFreeze,
  buildDomainReasoningPlatformFreezeManifest,
  getDomainReasoningPlatformFreezeState,
  isDomainReasoningCompatibilityMatrixValid,
  isDomainReasoningPlatformFreezeManifestValid,
  listDomainReasoningPlatformPhases,
  listDomainReasoningPlatformPublicApis,
  runDomainReasoningPlatformFreeze,
} from "./domainReasoningPlatformFreezeIndex.ts";

test("publishes reasoning platform identity", () => {
  assert.equal(DOMAIN_REASONING_PLATFORM_IDENTITY.platformId, "nexora-domain-reasoning-contract-platform");
  assert.equal(DOMAIN_REASONING_PLATFORM_IDENTITY.version, "DOM-6:4");
  assert.equal(DOMAIN_REASONING_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(DOMAIN_REASONING_PLATFORM_IDENTITY.reasoningExecution, false);
});

test("publishes reasoning phase registry", () => {
  assert.equal(DOMAIN_REASONING_PHASE_REGISTRY.length, 4);
  assert.equal(DOMAIN_REASONING_PHASE_REGISTRY[3].phaseId, "DOM-6:4");
  assert.equal(DOMAIN_REASONING_PHASE_REGISTRY.every((entry) => entry.metadataOnly), true);
});

test("publishes reasoning public API registry", () => {
  const apiNames = DOMAIN_REASONING_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);

  assert.equal(apiNames.includes("DomainReasoningPlatformFreeze"), true);
  assert.equal(new Set(apiNames).size, apiNames.length);
  assert.equal(DOMAIN_REASONING_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly), true);
});

test("publishes reasoning compatibility matrix", () => {
  assert.equal(DOMAIN_REASONING_COMPATIBILITY_MATRIX.length, 11);
  assert.equal(isDomainReasoningCompatibilityMatrixValid(), true);
  assert.equal(DOMAIN_REASONING_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "DOM-7"), true);
});

test("publishes reasoning extension policy", () => {
  assert.equal(DOMAIN_REASONING_EXTENSION_POLICY.allowsNewReasoningPackages, true);
  assert.equal(DOMAIN_REASONING_EXTENSION_POLICY.allowsReasoningEngine, false);
  assert.equal(DOMAIN_REASONING_EXTENSION_POLICY.allowsRuntimeInference, false);
  assert.equal(DOMAIN_REASONING_EXTENSION_POLICY.allowsRuntimeStateMutation, false);
});

test("publishes reasoning release metadata", () => {
  assert.equal(DOMAIN_REASONING_RELEASE_METADATA.releaseVersion, "DOM-6:4");
  assert.equal(DOMAIN_REASONING_RELEASE_METADATA.certificationDependency, "DOM-6:3");
  assert.equal(DOMAIN_REASONING_RELEASE_METADATA.immutable, true);
});

test("builds reasoning platform freeze manifest", () => {
  const manifest = buildDomainReasoningPlatformFreezeManifest();

  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.metadataOnly, true);
});

test("validates reasoning platform freeze manifest", () => {
  assert.equal(isDomainReasoningPlatformFreezeManifestValid(buildDomainReasoningPlatformFreezeManifest()), true);
});

test("uses deterministic freeze fingerprint", () => {
  const first = buildDomainReasoningPlatformFreezeManifest();
  const second = buildDomainReasoningPlatformFreezeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("runs reasoning platform freeze with PASS", () => {
  assert.equal(runDomainReasoningPlatformFreeze().status, "PASS");
});

test("returns reasoning platform freeze state", () => {
  const state = getDomainReasoningPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.checks.every((check) => check.passed), true);
});

test("exports public reasoning freeze APIs", () => {
  assert.equal(typeof DomainReasoningPlatformFreeze.buildDomainReasoningPlatformFreezeManifest, "function");
  assert.equal(typeof DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze, "function");
  assert.equal(Object.isFrozen(DomainReasoningPlatformFreeze), true);
  assert.equal(listDomainReasoningPlatformPhases().length, 4);
  assert.equal(listDomainReasoningPlatformPublicApis().length > 0, true);
});

test("keeps DOM-6:1 compatibility", () => {
  assert.equal(validateDomainReasoningFoundation().valid, true);
});

test("keeps DOM-6:2 compatibility", () => {
  assert.equal(typeof DomainReasoningQueryLayer.queryDomainReasoningPackages, "function");
  assert.equal(typeof DomainReasoningQueryLayer.diffDomainReasoningSnapshots, "function");
});

test("keeps DOM-6:3 compatibility", () => {
  assert.equal(DomainReasoningCertificationLayer.runDomainReasoningRegression().failed, 0);
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(DomainRegulationCertificationLayer.runDomainRegulationRegression().failed, 0);
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
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

test("does not expose reasoning execution behavior", () => {
  const apiNames = DOMAIN_REASONING_PUBLIC_API_REGISTRY.map((entry) => entry.apiName).join(" ");

  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("infer"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
});
