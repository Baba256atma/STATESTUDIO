import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import { DomainRecommendationPlatformFreeze } from "./domainRecommendationPlatformFreezeIndex.ts";
import {
  DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX,
  DOMAIN_EXPERTISE_EXTENSION_POLICY,
  DOMAIN_EXPERTISE_PHASE_REGISTRY,
  DOMAIN_EXPERTISE_PLATFORM_IDENTITY,
  DOMAIN_EXPERTISE_PLATFORM_REGISTRY,
  DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY,
  DOMAIN_EXPERTISE_RELEASE_METADATA,
  DomainExpertisePlatformFreeze,
  buildDomainExpertisePlatformManifest,
  getDomainExpertisePlatformFreezeState,
  isDomainExpertisePlatformCompatibilityMatrixValid,
  isDomainExpertisePlatformManifestValid,
  listDomainExpertisePlatformPhases,
  listDomainExpertisePlatformPublicApis,
  listDomainExpertisePlatformRegistry,
  runDomainExpertisePlatformCertification,
  runDomainExpertisePlatformFreeze,
  runDomainExpertisePlatformRegression,
} from "./domainExpertisePlatformFreezeIndex.ts";

test("publishes domain expertise platform identity", () => {
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_IDENTITY.platformId, "nexora-domain-expertise-platform");
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_IDENTITY.version, "DOM-8");
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_IDENTITY.domainFunctionality, false);
});

test("publishes domain expertise platform registry", () => {
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_REGISTRY.length, 7);
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_REGISTRY[6].platformId, "DOM-7");
  assert.equal(DOMAIN_EXPERTISE_PLATFORM_REGISTRY.every((entry) => entry.metadataOnly && !entry.runtimeDependency), true);
});

test("publishes domain expertise phase registry", () => {
  assert.equal(DOMAIN_EXPERTISE_PHASE_REGISTRY.length, 8);
  assert.equal(DOMAIN_EXPERTISE_PHASE_REGISTRY[7].phaseId, "DOM-8");
  assert.equal(DOMAIN_EXPERTISE_PHASE_REGISTRY.every((entry) => entry.metadataOnly), true);
});

test("publishes domain expertise public API registry", () => {
  const apiKeys = DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.map((entry) => `${entry.sourcePlatform}:${entry.apiName}`);

  assert.equal(apiKeys.includes("DOM-8:DomainExpertisePlatformFreeze"), true);
  assert.equal(new Set(apiKeys).size, apiKeys.length);
  assert.equal(DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly), true);
});

test("publishes domain expertise compatibility matrix", () => {
  assert.equal(DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX.length, 14);
  assert.equal(isDomainExpertisePlatformCompatibilityMatrixValid(), true);
  assert.equal(DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "LAY"), true);
  assert.equal(DOMAIN_EXPERTISE_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "Future platform extensions"), true);
});

test("publishes domain expertise extension policy", () => {
  assert.equal(DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsNewDomainPlatforms, true);
  assert.equal(DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsDomainFunctionality, false);
  assert.equal(DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsReasoning, false);
  assert.equal(DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsRecommendations, false);
  assert.equal(DOMAIN_EXPERTISE_EXTENSION_POLICY.allowsRuntimeExecution, false);
});

test("publishes domain expertise release metadata", () => {
  assert.equal(DOMAIN_EXPERTISE_RELEASE_METADATA.releaseVersion, "DOM-8");
  assert.equal(DOMAIN_EXPERTISE_RELEASE_METADATA.certificationDependency, "DOM-1 through DOM-7");
  assert.equal(DOMAIN_EXPERTISE_RELEASE_METADATA.immutable, true);
});

test("builds domain expertise platform manifest", () => {
  const manifest = buildDomainExpertisePlatformManifest();

  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.metadataOnly, true);
});

test("validates domain expertise platform manifest", () => {
  assert.equal(isDomainExpertisePlatformManifestValid(buildDomainExpertisePlatformManifest()), true);
});

test("passes domain expertise platform certification", () => {
  const certification = runDomainExpertisePlatformCertification();

  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
  assert.equal(certification.diagnostics.every((diagnostic) => diagnostic.severity === "info"), true);
});

test("passes domain expertise platform regression", () => {
  const regression = runDomainExpertisePlatformRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.failed, 0);
  assert.equal(regression.entries.length, 8);
});

test("runs domain expertise platform freeze with PASS", () => {
  assert.equal(runDomainExpertisePlatformFreeze().status, "PASS");
});

test("returns immutable domain expertise platform freeze state", () => {
  const state = getDomainExpertisePlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.checks.every((check) => check.passed), true);
  assert.equal(Object.isFrozen(state), true);
});

test("uses deterministic domain expertise fingerprint", () => {
  const first = buildDomainExpertisePlatformManifest();
  const second = buildDomainExpertisePlatformManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public domain expertise freeze APIs", () => {
  assert.equal(typeof DomainExpertisePlatformFreeze.buildDomainExpertisePlatformManifest, "function");
  assert.equal(typeof DomainExpertisePlatformFreeze.runDomainExpertisePlatformCertification, "function");
  assert.equal(typeof DomainExpertisePlatformFreeze.runDomainExpertisePlatformFreeze, "function");
  assert.equal(Object.isFrozen(DomainExpertisePlatformFreeze), true);
  assert.equal(listDomainExpertisePlatformPhases().length, 8);
  assert.equal(listDomainExpertisePlatformRegistry().length, 7);
  assert.equal(listDomainExpertisePlatformPublicApis().length > 0, true);
});

test("keeps DOM-1 compatibility", () => {
  assert.equal(validateDomainFoundation().valid, true);
});

test("keeps DOM-2 compatibility", () => {
  assert.equal(DomainVocabularyPlatformFreeze.runDomainVocabularyPlatformFreeze().status, "PASS");
});

test("keeps DOM-3 compatibility", () => {
  assert.equal(DomainOntologyPlatformFreeze.runDomainOntologyPlatformFreeze().status, "PASS");
});

test("keeps DOM-4 compatibility", () => {
  assert.equal(DomainKpiPlatformFreeze.runDomainKpiPlatformFreeze().status, "PASS");
});

test("keeps DOM-5 compatibility", () => {
  assert.equal(DomainRegulationCertificationLayer.runDomainRegulationRegression().failed, 0);
});

test("keeps DOM-6 compatibility", () => {
  assert.equal(DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status, "PASS");
});

test("keeps DOM-7 compatibility", () => {
  assert.equal(DomainRecommendationPlatformFreeze.runDomainRecommendationPlatformFreeze().status, "PASS");
});

test("does not expose runtime domain behavior", () => {
  const apiNames = DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY.map((entry) => entry.apiName).join(" ");

  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("infer"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
  assert.equal(apiNames.includes("generate"), false);
});
