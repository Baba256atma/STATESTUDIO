import assert from "node:assert/strict";
import test from "node:test";

import { validateDomainFoundation } from "./domainFoundationIndex.ts";
import { DomainVocabularyPlatformFreeze } from "./domainVocabularyPlatformFreezeIndex.ts";
import { DomainOntologyPlatformFreeze } from "./domainOntologyPlatformFreezeIndex.ts";
import { DomainKpiPlatformFreeze } from "./domainKpiPlatformFreezeIndex.ts";
import { DomainRegulationCertificationLayer } from "./domainRegulationCertificationIndex.ts";
import { DomainReasoningPlatformFreeze } from "./domainReasoningPlatformFreezeIndex.ts";
import { validateDomainRecommendationFoundation } from "./domainRecommendationIndex.ts";
import { DomainRecommendationQueryLayer } from "./domainRecommendationQueryIndex.ts";
import { DomainRecommendationCertificationLayer } from "./domainRecommendationCertificationIndex.ts";
import {
  DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX,
  DOMAIN_RECOMMENDATION_EXTENSION_POLICY,
  DOMAIN_RECOMMENDATION_PHASE_REGISTRY,
  DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY,
  DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY,
  DOMAIN_RECOMMENDATION_RELEASE_METADATA,
  DomainRecommendationPlatformFreeze,
  buildDomainRecommendationPlatformFreezeManifest,
  getDomainRecommendationPlatformFreezeState,
  isDomainRecommendationCompatibilityMatrixValid,
  isDomainRecommendationPlatformFreezeManifestValid,
  listDomainRecommendationPlatformPhases,
  listDomainRecommendationPlatformPublicApis,
  runDomainRecommendationPlatformFreeze,
} from "./domainRecommendationPlatformFreezeIndex.ts";

test("publishes recommendation platform identity", () => {
  assert.equal(DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY.platformId, "nexora-domain-recommendation-contract-platform");
  assert.equal(DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY.version, "DOM-7:4");
  assert.equal(DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY.metadataOnly, true);
  assert.equal(DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY.recommendationGeneration, false);
});

test("publishes recommendation phase registry", () => {
  assert.equal(DOMAIN_RECOMMENDATION_PHASE_REGISTRY.length, 4);
  assert.equal(DOMAIN_RECOMMENDATION_PHASE_REGISTRY[3].phaseId, "DOM-7:4");
  assert.equal(DOMAIN_RECOMMENDATION_PHASE_REGISTRY.every((entry) => entry.metadataOnly), true);
});

test("publishes recommendation public API registry", () => {
  const apiNames = DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);

  assert.equal(apiNames.includes("DomainRecommendationPlatformFreeze"), true);
  assert.equal(new Set(apiNames).size, apiNames.length);
  assert.equal(DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly), true);
});

test("publishes recommendation compatibility matrix", () => {
  assert.equal(DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX.length, 12);
  assert.equal(isDomainRecommendationCompatibilityMatrixValid(), true);
  assert.equal(DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "DOM-6"), true);
  assert.equal(DOMAIN_RECOMMENDATION_COMPATIBILITY_MATRIX.some((entry) => entry.targetLayer === "DOM Platform Certification"), true);
});

test("publishes recommendation extension policy", () => {
  assert.equal(DOMAIN_RECOMMENDATION_EXTENSION_POLICY.allowsNewRecommendationPackages, true);
  assert.equal(DOMAIN_RECOMMENDATION_EXTENSION_POLICY.allowsRecommendationEngine, false);
  assert.equal(DOMAIN_RECOMMENDATION_EXTENSION_POLICY.allowsRuntimeInference, false);
  assert.equal(DOMAIN_RECOMMENDATION_EXTENSION_POLICY.allowsRuntimeStateMutation, false);
});

test("publishes recommendation release metadata", () => {
  assert.equal(DOMAIN_RECOMMENDATION_RELEASE_METADATA.releaseVersion, "DOM-7:4");
  assert.equal(DOMAIN_RECOMMENDATION_RELEASE_METADATA.certificationDependency, "DOM-7:3");
  assert.equal(DOMAIN_RECOMMENDATION_RELEASE_METADATA.immutable, true);
});

test("builds recommendation platform freeze manifest", () => {
  const manifest = buildDomainRecommendationPlatformFreezeManifest();

  assert.equal(manifest.certificationStatus, "PASS");
  assert.equal(manifest.regressionStatus, "PASS");
  assert.equal(manifest.metadataOnly, true);
});

test("validates recommendation platform freeze manifest", () => {
  assert.equal(isDomainRecommendationPlatformFreezeManifestValid(buildDomainRecommendationPlatformFreezeManifest()), true);
});

test("uses deterministic recommendation freeze fingerprint", () => {
  const first = buildDomainRecommendationPlatformFreezeManifest();
  const second = buildDomainRecommendationPlatformFreezeManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("runs recommendation platform freeze with PASS", () => {
  assert.equal(runDomainRecommendationPlatformFreeze().status, "PASS");
});

test("returns recommendation platform freeze state", () => {
  const state = getDomainRecommendationPlatformFreezeState();

  assert.equal(state.status, "PASS");
  assert.equal(state.checks.every((check) => check.passed), true);
});

test("exports public recommendation freeze APIs", () => {
  assert.equal(typeof DomainRecommendationPlatformFreeze.buildDomainRecommendationPlatformFreezeManifest, "function");
  assert.equal(typeof DomainRecommendationPlatformFreeze.runDomainRecommendationPlatformFreeze, "function");
  assert.equal(Object.isFrozen(DomainRecommendationPlatformFreeze), true);
  assert.equal(listDomainRecommendationPlatformPhases().length, 4);
  assert.equal(listDomainRecommendationPlatformPublicApis().length > 0, true);
});

test("keeps DOM-7:1 compatibility", () => {
  assert.equal(validateDomainRecommendationFoundation().valid, true);
});

test("keeps DOM-7:2 compatibility", () => {
  assert.equal(typeof DomainRecommendationQueryLayer.queryDomainRecommendationPackages, "function");
  assert.equal(typeof DomainRecommendationQueryLayer.diffDomainRecommendationSnapshots, "function");
});

test("keeps DOM-7:3 compatibility", () => {
  assert.equal(DomainRecommendationCertificationLayer.runDomainRecommendationRegression().failed, 0);
});

test("keeps DOM-6 compatibility", () => {
  assert.equal(DomainReasoningPlatformFreeze.runDomainReasoningPlatformFreeze().status, "PASS");
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

test("does not expose recommendation generation behavior", () => {
  const apiNames = DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY.map((entry) => entry.apiName).join(" ");

  assert.equal(apiNames.includes("generate"), false);
  assert.equal(apiNames.includes("execute"), false);
  assert.equal(apiNames.includes("infer"), false);
  assert.equal(apiNames.includes("score"), false);
  assert.equal(apiNames.includes("rank"), false);
});
