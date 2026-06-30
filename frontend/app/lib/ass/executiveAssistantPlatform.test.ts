import assert from "node:assert/strict";
import test from "node:test";

import {
  ASS_ARCHITECTURE_STACK,
  ASS_CAPABILITY_KEYS,
  ASS_CONVERSATION_SCOPE_KEYS,
  ASS_EXTENSION_POINT_KEYS,
  ASS_FUTURE_DEPENDENCY_RULES,
  ASS_INTEGRATION_KEYS,
  ASS_PLATFORM_CONTRACT_VERSION,
  ASS_PLATFORM_MUST_NOT_OWN,
  ASS_PLATFORM_MUST_OWN,
  ASS_PLATFORM_PRINCIPLES,
  ASS_POSITION_STATEMENT,
  ASS_PUBLIC_API_REGISTRY,
  ASS_RELEASE_METADATA,
  ASS_UPSTREAM_PLATFORM_KEYS,
} from "./executiveAssistantPlatformContracts.ts";
import {
  ExecutiveAssistantPlatform,
  buildExecutiveAssistantPlatformFoundation,
  getExecutiveAssistantPlatformManifest,
  getExecutiveAssistantPlatformState,
  isExecutiveAssistantPlatformInitialized,
  resetExecutiveAssistantPlatformFoundationForTests,
  validateExecutiveAssistantPlatform,
} from "./executiveAssistantPlatformExports.ts";
import {
  getExecutiveAssistantPlatformIdentity,
  getExecutiveAssistantPlatformRegistry,
  isExecutiveAssistantCapabilityKey,
  isExecutiveAssistantConversationScopeKey,
  isExecutiveAssistantExtensionPointKey,
  isExecutiveAssistantIntegrationKey,
  isExecutiveAssistantPlatformIdentityImmutable,
} from "./executiveAssistantPlatformRegistry.ts";
import {
  getExecutiveAssistantPlatformBoundaries,
  getExecutiveAssistantPlatformPositionStatement,
  validateExecutiveAssistantDependencyIntegrity,
  validateExecutiveAssistantExtensionCompatibility,
  validateExecutiveAssistantManifestConsistency,
  validateExecutiveAssistantPlatformBoundaries,
} from "./executiveAssistantPlatformValidation.ts";
import {
  getExecutiveAssistantPlatformVersionMetadata,
  isExecutiveAssistantVersionConsistent,
} from "./executiveAssistantPlatformExports.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveAssistantPlatformFoundationForTests();
});

test("exports ASS/1 identity and contract vocabulary", () => {
  const identity = getExecutiveAssistantPlatformIdentity();
  assert.equal(identity.layerId, "ASS");
  assert.equal(identity.appId, "APP");
  assert.equal(identity.platformId, "executive-assistant-platform");
  assert.equal(identity.version, "ASS/1");
  assert.equal(identity.mvpStatus, "active");
  assert.equal(identity.releaseStage, "mvp-foundation");
  assert.equal(ASS_CAPABILITY_KEYS.length, 8);
  assert.equal(ASS_CONVERSATION_SCOPE_KEYS.length, 6);
  assert.equal(ASS_INTEGRATION_KEYS.length, 5);
  assert.equal(ASS_EXTENSION_POINT_KEYS.length, 6);
  assert.equal(ASS_UPSTREAM_PLATFORM_KEYS.length, 5);
});

test("platform identity is immutable", () => {
  assert.equal(isExecutiveAssistantPlatformIdentityImmutable(), true);
  assert.throws(() => {
    (getExecutiveAssistantPlatformIdentity() as { version: string }).version = "ASS/99";
  });
});

test("creates Executive Assistant platform foundation correctly", () => {
  assert.equal(isExecutiveAssistantPlatformInitialized(), false);
  const init = buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isExecutiveAssistantPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "ASS/1");
  assert.equal(init.data?.supportedCapabilities.length, 8);
  assert.equal(init.data?.supportedIntegrations.length, 5);
});

test("seeds registries with capabilities integrations scopes extensions and manifest", () => {
  buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
  const registry = getExecutiveAssistantPlatformRegistry();
  assert.equal(registry.capabilities.length, ASS_CAPABILITY_KEYS.length);
  assert.equal(registry.integrations.length, ASS_INTEGRATION_KEYS.length);
  assert.equal(registry.conversationScopes.length, ASS_CONVERSATION_SCOPE_KEYS.length);
  assert.equal(registry.extensions.length, ASS_EXTENSION_POINT_KEYS.length);
  assert.equal(registry.manifests.length, 1);
  for (const capability of registry.capabilities) {
    assert.equal(capability.metadataOnly, true);
  }
  for (const scope of registry.conversationScopes) {
    assert.equal(scope.architectureOnly, true);
  }
});

test("defines platform boundaries with no overlap", () => {
  const boundaries = getExecutiveAssistantPlatformBoundaries();
  assert.equal(boundaries.owns.length, ASS_PLATFORM_MUST_OWN.length);
  assert.equal(boundaries.doesNotOwn.length, ASS_PLATFORM_MUST_NOT_OWN.length);
  assert.equal(validateExecutiveAssistantPlatformBoundaries().length, 0);
  assert.ok(boundaries.doesNotOwn.includes("ai_reasoning"));
  assert.ok(boundaries.doesNotOwn.includes("llm_orchestration"));
  assert.ok(boundaries.owns.includes("conversation_architecture"));
});

test("declares ASS position after SMM in Nexora architecture", () => {
  const assIndex = ASS_ARCHITECTURE_STACK.indexOf("ASS");
  const smmIndex = ASS_ARCHITECTURE_STACK.indexOf("SMM");
  const llmIndex = ASS_ARCHITECTURE_STACK.indexOf("LLM");
  const idnIndex = ASS_ARCHITECTURE_STACK.indexOf("IDN");
  assert.ok(assIndex > smmIndex);
  assert.ok(assIndex > llmIndex);
  assert.ok(assIndex < idnIndex);
  const position = getExecutiveAssistantPlatformPositionStatement();
  assert.ok(position.assistantIs.includes("orchestration_layer_over_certified_platforms"));
  assert.ok(ASS_POSITION_STATEMENT.assistantIsNot.includes("an_intelligence_layer"));
});

test("validates capability integration and extension registry keys", () => {
  assert.equal(isExecutiveAssistantCapabilityKey("llm_coordination"), true);
  assert.equal(isExecutiveAssistantIntegrationKey("SMM"), true);
  assert.equal(isExecutiveAssistantConversationScopeKey("executive"), true);
  assert.equal(isExecutiveAssistantExtensionPointKey("conversation_engine"), true);
  assert.equal(isExecutiveAssistantCapabilityKey("invalid"), false);
});

test("validates dependency integrity and extension compatibility", () => {
  buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
  assert.equal(validateExecutiveAssistantDependencyIntegrity().valid, true);
  assert.equal(validateExecutiveAssistantExtensionCompatibility().valid, true);
  const manifest = getExecutiveAssistantPlatformManifest();
  assert.equal(validateExecutiveAssistantManifestConsistency(manifest).valid, true);
});

test("maintains version consistency", () => {
  const metadata = getExecutiveAssistantPlatformVersionMetadata();
  assert.equal(metadata.contractVersion, "ASS/1");
  assert.equal(isExecutiveAssistantVersionConsistent(), true);
  assert.equal(metadata.pattern.test("ASS/1"), true);
  assert.equal(metadata.pattern.test("ASS/99"), true);
  assert.equal(metadata.pattern.test("SMM/1"), false);
});

test("validates platform contracts after foundation initialization", () => {
  buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
  const validation = validateExecutiveAssistantPlatform();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("generates platform manifest", () => {
  buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
  const manifest = getExecutiveAssistantPlatformManifest();
  assert.equal(manifest.platformId, "executive-assistant-platform");
  assert.equal(manifest.version, "ASS/1");
  assert.equal(manifest.capabilityKeys.length, 8);
  assert.ok(manifest.upstreamPlatforms.includes("LLM"));
  assert.ok(manifest.upstreamPlatforms.includes("SMM"));
  assert.equal(manifest.lifecycle, "build");
});

test("exposes stable public exports and manifest", () => {
  buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantPlatform.buildExecutiveAssistantPlatformFoundation, "function");
  assert.equal(ExecutiveAssistantPlatform.version, "ASS/1");
  assert.equal(ASS_PUBLIC_API_REGISTRY.length, 5);
  assert.ok(ASS_PLATFORM_PRINCIPLES.includes("orchestration_layer_not_intelligence_layer"));
  assert.equal(ASS_RELEASE_METADATA.freezeState, "open");
  assert.equal(ASS_FUTURE_DEPENDENCY_RULES.length, 8);
});

test("declares upstream consumption without importing certified platforms", async () => {
  const { readFile } = await import("node:fs/promises");
  const assFiles = [
    "executiveAssistantPlatformContracts.ts",
    "executiveAssistantPlatformRegistry.ts",
    "executiveAssistantPlatformExports.ts",
    "executiveAssistantPlatformValidation.ts",
  ];
  for (const file of assFiles) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("LlmPlatform"), false, `${file} must not import LLM platform`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
  }
});

test("does not implement chat runtime reasoning or tool execution", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantPlatformContracts.ts",
    "executiveAssistantPlatformRegistry.ts",
    "executiveAssistantPlatformExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("executeTool("), false, `${file} must not execute tools`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
  }
});

test("preserves certified Nexora platform files unchanged", async () => {
  const { readFile } = await import("node:fs/promises");
  const certifiedSamples = [
    "../smm/smmPlatformContracts.ts",
    "../smm/sharedMentalModelPlatformFreeze.ts",
    "../llm/llmPlatformFreeze.ts",
  ];
  for (const file of certifiedSamples) {
    const before = await readFile(new URL(file, import.meta.url), "utf8");
    buildExecutiveAssistantPlatformFoundation(FIXED_TIME);
    validateExecutiveAssistantPlatform();
    getExecutiveAssistantPlatformState(FIXED_TIME);
    const after = await readFile(new URL(file, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});
