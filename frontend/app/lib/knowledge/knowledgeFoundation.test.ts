import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_CAPABILITY_KEYS,
  KNOWLEDGE_DOMAIN_KEYS,
  KNOWLEDGE_EXTENSION_POINT_KEYS,
  KNOWLEDGE_FUTURE_PHASE_KEYS,
  KNOWLEDGE_MUST_NOT_OWN,
  KNOWLEDGE_NAMESPACE_KEYS,
  KNOWLEDGE_PLATFORM_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_PRINCIPLES,
  KNOWLEDGE_PUBLIC_API_REGISTRY,
  KNOWLEDGE_RELEASE_METADATA,
} from "./knowledgeConstants.ts";
import {
  KNOWLEDGE_FREEZE_RULES,
  KNOWLEDGE_PLATFORM_IDENTITY,
  KNOWLEDGE_PLATFORM_SELF_MANIFEST,
  KNOWLEDGE_PUBLIC_API_RULES,
  KnowledgePlatformContract,
  getKnowledgeManifest,
  resolveKnowledgeCapabilityExample,
  resolveKnowledgeDomainExample,
  resolveKnowledgeEntityExample,
  resolveKnowledgeExtensionPointExample,
  resolveKnowledgeNamespaceExample,
  resolveKnowledgePackageExample,
  resolveKnowledgeProviderExample,
  resolveKnowledgeRegistrationExample,
  resolveKnowledgeSourceExample,
  validateKnowledgeFoundation,
} from "./knowledgeContracts.ts";
import {
  KnowledgeFoundation,
  buildKnowledgeFoundation,
  createKnowledgeFoundation,
  getKnowledgeFoundationVersionMetadata,
  getKnowledgePlatformState,
  getKnowledgeRegistry,
  isKnowledgePlatformInitialized,
  registerKnowledgeCapability,
  registerKnowledgeDomain,
  registerKnowledgeProvider,
  resetKnowledgeFoundationForTests,
} from "./knowledgeFoundation.ts";
import {
  hasDuplicateKnowledgeIds,
  validateKnowledgeDomainRegistration,
  validateKnowledgeProviderRegistration,
  validateKnowledgeRegistrationRecord,
  validateKnowledgeVersionFormat,
  validatePlatformIdentity,
} from "./knowledgeValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeFoundationForTests();
});

test("exports KNL identity and contract vocabulary", () => {
  assert.equal(KNOWLEDGE_PLATFORM_IDENTITY.layerId, "KNL");
  assert.equal(KNOWLEDGE_PLATFORM_IDENTITY.appId, "KNL");
  assert.equal(KNOWLEDGE_PLATFORM_IDENTITY.platformId, "knowledge-platform");
  assert.equal(KNOWLEDGE_PLATFORM_IDENTITY.version, KNOWLEDGE_PLATFORM_CONTRACT_VERSION);
  assert.equal(KNOWLEDGE_DOMAIN_KEYS.length, 5);
  assert.equal(KNOWLEDGE_CAPABILITY_KEYS.length, 8);
});

test("creates knowledge platform foundation correctly", () => {
  assert.equal(isKnowledgePlatformInitialized(), false);
  const init = createKnowledgeFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgePlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "KNL/1");
  assert.equal(init.data?.supportedDomains.length, 5);
  assert.equal(init.data?.supportedCapabilities.length, 8);
});

test("buildKnowledgeFoundation seeds registry defaults", () => {
  buildKnowledgeFoundation(FIXED_TIME);
  const registry = getKnowledgeRegistry();
  assert.equal(registry.domains.length, KNOWLEDGE_DOMAIN_KEYS.length);
  assert.equal(registry.capabilities.length, KNOWLEDGE_CAPABILITY_KEYS.length);
  assert.equal(registry.namespaces.length, KNOWLEDGE_NAMESPACE_KEYS.length);
  assert.equal(registry.extensionPoints.length, KNOWLEDGE_EXTENSION_POINT_KEYS.length);
});

test("registers knowledge domain provider and capability", () => {
  buildKnowledgeFoundation(FIXED_TIME);
  const domain = registerKnowledgeDomain(
    Object.freeze({
      domainId: "knowledge-domain-test-001",
      domainKey: "structural",
      label: "Test Domain",
      description: "Foundation test domain.",
    }),
    FIXED_TIME
  );
  assert.equal(domain.success, true);
  const provider = registerKnowledgeProvider(
    Object.freeze({
      providerId: "knowledge-provider-test-001",
      namespaceId: "knowledge-namespace-knowledge-foundation",
      label: "Test Provider",
      description: "Foundation test provider.",
    }),
    FIXED_TIME
  );
  assert.equal(provider.success, true);
  const capability = registerKnowledgeCapability(
    Object.freeze({
      capabilityId: "knowledge-capability-test-001",
      capabilityKey: "platform_identity",
      label: "Test Capability",
      description: "Foundation test capability.",
    }),
    FIXED_TIME
  );
  assert.equal(capability.success, true);
});

test("prevents duplicate knowledge registrations", () => {
  buildKnowledgeFoundation(FIXED_TIME);
  const input = Object.freeze({
    domainId: "knowledge-domain-structural",
    domainKey: "structural" as const,
    label: "Duplicate",
    description: "Duplicate domain registration.",
  });
  const first = registerKnowledgeDomain(input, FIXED_TIME);
  assert.equal(first.success, false);
  assert.match(first.reason, /already registered/);
});

test("validates knowledge version format and duplicate ids", () => {
  assert.equal(validateKnowledgeVersionFormat("KNL/1").valid, true);
  assert.equal(validateKnowledgeVersionFormat("APP-11/1").valid, false);
  assert.equal(hasDuplicateKnowledgeIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateKnowledgeIds(["a", "b"]), false);
});

test("validates platform identity and registration shapes", () => {
  assert.equal(validatePlatformIdentity(KNOWLEDGE_PLATFORM_IDENTITY).valid, true);
  assert.equal(
    validateKnowledgeDomainRegistration(
      Object.freeze({
        domainId: "knowledge-domain-valid",
        domainKey: "reference",
        label: "Valid",
        description: "Valid domain.",
      })
    ).valid,
    true
  );
  assert.equal(
    validateKnowledgeProviderRegistration(
      Object.freeze({
        providerId: "knowledge-provider-valid",
        namespaceId: "knowledge-namespace-knowledge-core",
        label: "Valid",
        description: "Valid provider.",
      })
    ).valid,
    true
  );
  assert.equal(
    validateKnowledgeRegistrationRecord(resolveKnowledgeRegistrationExample(FIXED_TIME)).valid,
    true
  );
});

test("resolves immutable knowledge contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeDomainExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgePackageExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeSourceExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeEntityExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeProviderExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeCapabilityExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeNamespaceExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeExtensionPointExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeDomainExample(FIXED_TIME).version, "KNL/1");
});

test("builds immutable knowledge platform manifest", () => {
  buildKnowledgeFoundation(FIXED_TIME);
  const manifest = getKnowledgeManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/1");
  assert.equal(manifest.layerId, "KNL");
  assert.equal(manifest.supportedDomains.length, 5);
  assert.equal(manifest.extensionPoints.length, KNOWLEDGE_EXTENSION_POINT_KEYS.length);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge foundation certification report", () => {
  const report = validateKnowledgeFoundation(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationInitialized, true);
  assert.equal(report.registryValid, true);
  assert.equal(report.identityValid, true);
});

test("validates KNL/1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_PLATFORM_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeFoundation.ts",
    allowedFiles: KNOWLEDGE_PLATFORM_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API freeze and boundary rules", () => {
  assert.equal(KNOWLEDGE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_PUBLIC_API_RULES.noRetrieval, true);
  assert.equal(KNOWLEDGE_PUBLIC_API_RULES.noOntology, true);
  assert.equal(KNOWLEDGE_PUBLIC_API_RULES.noMachineLearning, true);
  assert.equal(KNOWLEDGE_FREEZE_RULES.noRuntimeIntelligence, true);
  assert.equal(KNOWLEDGE_FREEZE_RULES.foundationOnly, true);
  assert.equal(KNOWLEDGE_MUST_NOT_OWN.includes("knowledge_graph"), true);
  assert.equal(KNOWLEDGE_MUST_NOT_OWN.includes("llm_reasoning"), true);
});

test("exports knowledge platform contract bundle", () => {
  assert.equal(KnowledgePlatformContract.version, "KNL/1");
  assert.equal(typeof KnowledgePlatformContract.validateKnowledgeFoundation, "function");
  assert.equal(typeof KnowledgePlatformContract.getKnowledgeManifest, "function");
  assert.equal(KnowledgePlatformContract.releaseMetadata.readOnly, true);
});

test("KnowledgeFoundation namespace exposes public APIs", () => {
  assert.equal(typeof KnowledgeFoundation.buildKnowledgeFoundation, "function");
  assert.equal(typeof KnowledgeFoundation.registerKnowledgeDomain, "function");
  assert.equal(typeof KnowledgeFoundation.registerKnowledgeProvider, "function");
  assert.equal(typeof KnowledgeFoundation.registerKnowledgeCapability, "function");
  assert.equal(typeof KnowledgeFoundation.getKnowledgeRegistry, "function");
  assert.equal(KnowledgeFoundation.version, "KNL/1");
});

test("public API registry includes required foundation exports", () => {
  assert.ok(KNOWLEDGE_PUBLIC_API_REGISTRY.includes("registerKnowledgeDomain"));
  assert.ok(KNOWLEDGE_PUBLIC_API_REGISTRY.includes("registerKnowledgeProvider"));
  assert.ok(KNOWLEDGE_PUBLIC_API_REGISTRY.includes("registerKnowledgeCapability"));
  assert.ok(KNOWLEDGE_PUBLIC_API_REGISTRY.includes("getKnowledgeRegistry"));
  assert.ok(KNOWLEDGE_PUBLIC_API_REGISTRY.includes("validateKnowledgeFoundation"));
  assert.ok(KNOWLEDGE_PUBLIC_API_REGISTRY.includes("buildKnowledgeFoundation"));
});

test("future phase registry reserves KNL engines without implementation", () => {
  assert.equal(KNOWLEDGE_FUTURE_PHASE_KEYS.includes("business_ontology"), true);
  assert.equal(KNOWLEDGE_FUTURE_PHASE_KEYS.includes("knowledge_graph"), true);
  assert.equal(KNOWLEDGE_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
  assert.equal(KNOWLEDGE_PLATFORM_PRINCIPLES.includes("no_ml_llm_or_ai_inference"), true);
  assert.equal(KNOWLEDGE_RELEASE_METADATA.platformStatus, "build");
});

test("getKnowledgePlatformState reflects initialized foundation", () => {
  buildKnowledgeFoundation(FIXED_TIME);
  const state = getKnowledgePlatformState(FIXED_TIME);
  assert.equal(state.platformId, "knowledge-platform");
  assert.equal(state.initialized, true);
  assert.equal(state.timestamp, FIXED_TIME);
  assert.equal(state.domainCount, KNOWLEDGE_DOMAIN_KEYS.length);
});

test("contract version metadata declared", () => {
  const metadata = getKnowledgeFoundationVersionMetadata();
  assert.equal(metadata.contractVersion, "KNL/1");
  assert.equal(metadata.foundationVersion, "KNL/1");
  assert.equal(metadata.owner, "knowledge-platform-foundation");
});

test("registry snapshot reflects seeded defaults after foundation init", () => {
  buildKnowledgeFoundation(FIXED_TIME);
  const registry = getKnowledgeRegistry();
  assert.equal(registry.snapshot.domainCount, KNOWLEDGE_DOMAIN_KEYS.length);
  assert.equal(registry.snapshot.capabilityCount, KNOWLEDGE_CAPABILITY_KEYS.length);
  assert.equal(registry.snapshot.namespaceCount, KNOWLEDGE_NAMESPACE_KEYS.length);
});
