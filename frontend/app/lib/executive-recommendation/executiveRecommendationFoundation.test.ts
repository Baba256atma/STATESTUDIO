import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { EXECUTIVE_INBOX_PLATFORM_ID } from "../executive-inbox/executiveInboxConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY,
  EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY,
  EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY,
  EXECUTIVE_RECOMMENDATION_FUTURE_PHASE_KEYS,
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
  EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY,
  EXECUTIVE_RECOMMENDATION_RELEASE_METADATA,
  EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
} from "./executiveRecommendationConstants.ts";
import {
  EXECUTIVE_RECOMMENDATION_FREEZE_RULES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST,
  EXECUTIVE_RECOMMENDATION_PUBLIC_API_RULES,
  ExecutiveRecommendationPlatformContract,
  buildExecutiveRecommendationFoundation,
  createExecutiveRecommendationFoundation,
  getExecutiveRecommendationContractVersionMetadata,
  getExecutiveRecommendationFutureCompatibility,
  getExecutiveRecommendationManifest,
  registerExecutiveRecommendationCandidate,
  registerExecutiveRecommendationSession,
  resolveExecutiveRecommendationCandidateExample,
  resolveExecutiveRecommendationContextExample,
  resolveExecutiveRecommendationRequestExample,
  resolveExecutiveRecommendationSessionExample,
  resolveExecutiveRecommendationSourceProviderExample,
  validateExecutiveRecommendationDependencies,
  validateExecutiveRecommendationFoundation,
} from "./executiveRecommendationContracts.ts";
import {
  ExecutiveRecommendationFoundation,
  isExecutiveRecommendationPlatformInitialized,
} from "./executiveRecommendationFoundation.ts";
import { getExecutiveRecommendationRegistry, registerMetadataExtension } from "./executiveRecommendationRegistry.ts";
import {
  resetExecutiveRecommendationPlatformForTests,
  runExecutiveRecommendationFoundation,
} from "./executiveRecommendationRunner.ts";
import {
  hasDuplicateIds,
  isExecutiveRecommendationDomain,
  isReservedExecutiveRecommendationSessionId,
  validateExecutiveRecommendationCandidateContractShape,
  validateExecutiveRecommendationContextContractShape,
  validateExecutiveRecommendationRequestContractShape,
  validateExecutiveRecommendationSessionContractShape,
  validateExecutiveRecommendationSourceProviderContractShape,
  validatePlatformIdentity,
  validateSessionIdentity,
  validateWorkspaceIsolation,
} from "./executiveRecommendationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveRecommendationPlatformForTests();
});

test("exports APP-12 identity and contract vocabulary", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.appId, "APP-12");
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.title, "Executive Recommendation");
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.platformId, "executive-recommendation-platform");
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY.version, EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION);
  assert.equal(EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS.length, 10);
});

test("validates recommendation domain enum guards", () => {
  assert.equal(isExecutiveRecommendationDomain("strategic"), true);
  assert.equal(isExecutiveRecommendationDomain("mixed"), true);
  assert.equal(isExecutiveRecommendationDomain("invalid"), false);
});

test("validates recommendation contract example shapes", () => {
  assert.equal(
    validateExecutiveRecommendationSourceProviderContractShape(
      resolveExecutiveRecommendationSourceProviderExample(FIXED_TIME)
    ).valid,
    true
  );
  assert.equal(
    validateExecutiveRecommendationRequestContractShape(resolveExecutiveRecommendationRequestExample(FIXED_TIME))
      .valid,
    true
  );
  assert.equal(
    validateExecutiveRecommendationCandidateContractShape(resolveExecutiveRecommendationCandidateExample(FIXED_TIME))
      .valid,
    true
  );
  assert.equal(
    validateExecutiveRecommendationContextContractShape(resolveExecutiveRecommendationContextExample(FIXED_TIME))
      .valid,
    true
  );
  assert.equal(
    validateExecutiveRecommendationSessionContractShape(resolveExecutiveRecommendationSessionExample(FIXED_TIME))
      .valid,
    true
  );
  assert.equal(resolveExecutiveRecommendationSourceProviderExample(FIXED_TIME).consumerOnly, true);
  assert.equal(resolveExecutiveRecommendationRequestExample(FIXED_TIME).version, "APP-12/1");
});

test("creates executive recommendation foundation correctly", () => {
  assert.equal(isExecutiveRecommendationPlatformInitialized(), false);
  const init = createExecutiveRecommendationFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isExecutiveRecommendationPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-12/1");
  assert.equal(init.data?.supportedDomains.length, 10);
});

test("registers recommendation session and candidate", () => {
  createExecutiveRecommendationFoundation(FIXED_TIME);
  const session = registerExecutiveRecommendationSession(
    Object.freeze({
      sessionId: "executive-recommendation-ws-test-001",
      workspaceId: "ws-test-001",
      label: "Test Recommendation Session",
      description: "Foundation test session.",
      domains: Object.freeze(["strategic", "risk"] as const),
    }),
    FIXED_TIME
  );
  assert.equal(session.success, true);
  const candidate = registerExecutiveRecommendationCandidate(
    Object.freeze({
      candidateId: "recommendation-candidate-test-001",
      workspaceId: "ws-test-001",
      sessionId: "executive-recommendation-ws-test-001",
      domain: "strategic",
      sourceProviderId: "scenario-intelligence-provider",
      sourceReferenceId: "scenario-test-001",
      label: "Test Candidate",
      description: "Foundation test candidate.",
    }),
    FIXED_TIME
  );
  assert.equal(candidate.success, true);
});

test("validates certified dependencies including APP-11", () => {
  const report = validateExecutiveRecommendationDependencies();
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.dependencies.length, 13);
  assert.ok(report.dependencies.some((entry) => entry.appId === "APP-11"));
  assert.ok(report.dependencies.every((entry) => entry.consumerOnly));
});

test("builds immutable manifest", () => {
  createExecutiveRecommendationFoundation(FIXED_TIME);
  const manifest = getExecutiveRecommendationManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-12/1");
  assert.equal(manifest.supportedDomains.length, 10);
  assert.equal(manifest.sourceProviderRegistry.length, 13);
  assert.equal(manifest.futureEngineRegistry.length, 6);
  assert.equal(manifest.dependencyValidation.valid, true);
});

test("validates foundation report", () => {
  const report = validateExecutiveRecommendationFoundation(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.dependencyValid, true);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationFoundation.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("declares future engines as reserved only", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.generationEngineReady, false);
  assert.equal(EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.evaluationEngineReady, false);
  assert.equal(EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.explainabilityEngineReady, false);
  assert.equal(EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.governanceEngineReady, false);
  assert.equal(EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.optimizationEngineReady, false);
  assert.equal(EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.deliveryEngineReady, false);
  assert.ok(EXECUTIVE_RECOMMENDATION_FUTURE_PHASE_KEYS.includes("generation_engine"));
});

test("ExecutiveRecommendationFoundation namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationFoundation.buildExecutiveRecommendationFoundation, "function");
  assert.equal(typeof ExecutiveRecommendationFoundation.createExecutiveRecommendationFoundation, "function");
  assert.equal(typeof ExecutiveRecommendationFoundation.getExecutiveRecommendationPlatformState, "function");
  assert.equal(ExecutiveRecommendationFoundation.version, "APP-12/1");
});

test("ExecutiveRecommendationPlatformContract bundle exports", () => {
  assert.equal(typeof ExecutiveRecommendationPlatformContract.getExecutiveRecommendationManifest, "function");
  assert.equal(ExecutiveRecommendationPlatformContract.identity.appId, "APP-12");
  assert.equal(ExecutiveRecommendationPlatformContract.mustNotOwn.includes("recommendation_generation"), true);
});

test("runs executive recommendation foundation certification", () => {
  const result = runExecutiveRecommendationFoundation(FIXED_TIME);
  assert.equal(result.certified, true, result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", "));
  assert.equal(result.phase, "APP-12/1");
  assert.equal(result.failedCount, 0);
});

test("regression: APP-11 platform identity remains valid", () => {
  assert.equal(EXECUTIVE_INBOX_PLATFORM_ID, "executive-inbox-platform");
});

test("backward compatibility guarantees declared", () => {
  assert.ok(EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "backward-compatibility"));
  assert.equal(EXECUTIVE_RECOMMENDATION_FREEZE_RULES.breakingChangesForbidden, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_PUBLIC_API_RULES.noRecommendationGeneration, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("llm_reasoning"), true);
});

test("registry and extension metadata", () => {
  createExecutiveRecommendationFoundation(FIXED_TIME);
  const registry = getExecutiveRecommendationRegistry();
  assert.equal(registry.sourceProviderRegistry.length, 13);
  assert.equal(registry.consumerRegistry.length, 4);
  assert.equal(EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY.length, 4);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES.length >= 8, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES.length >= 10, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_RELEASE_METADATA.readOnly, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY.length, 4);
  assert.equal(getExecutiveRecommendationContractVersionMetadata().contractVersion, "APP-12/1");
  assert.equal(getExecutiveRecommendationFutureCompatibility().metadataOnly, true);
  assert.equal(validatePlatformIdentity(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateSessionIdentity("executive-recommendation-ws-001").valid, true);
  assert.equal(isReservedExecutiveRecommendationSessionId("executive-recommendation-system"), true);
  assert.equal(validateWorkspaceIsolation("ws-a", "ws-a").valid, true);
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(
    registerMetadataExtension(
      Object.freeze({
        extensionId: "recommendation-metadata-test",
        label: "Test Extension",
        description: "Test metadata extension.",
      })
    ).success,
    true
  );
  assert.equal(
    EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY.some((entry) => entry.appId === "APP-11"),
    true
  );
});
