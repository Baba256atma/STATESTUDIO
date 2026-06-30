import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import { resetExecutiveAssistantConversationStateLayerForTests } from "./executiveAssistantConversationStateExports.ts";
import {
  ASS_COORDINATION_PLATFORM_KEYS,
  ASS_COORDINATION_ROUTE_KEYS,
  ASS_ROUTE_CATEGORY_KEYS,
  ASS_ROUTE_CONFIDENCE_LEVEL_KEYS,
  ASS_ROUTE_DECISION_PLACEHOLDER_KEYS,
  ASS_ROUTE_INTENT_PLACEHOLDER_KEYS,
  ASS_ROUTE_TARGET_PLACEHOLDER_KEYS,
  ASS_ROUTING_DEPENDENCY,
  ASS_ROUTING_MUST_NOT_OWN,
  ASS_ROUTING_PRINCIPLES,
  ASS_ROUTING_PUBLIC_API_REGISTRY,
  ASS_ROUTING_REGISTRY_KEYS,
  ASS_ROUTING_VERSION,
  ASS_SCOPE_ROUTING_KEYS,
} from "./executiveAssistantRoutingContracts.ts";
import {
  ExecutiveAssistantRoutingPlatform,
  buildExecutiveAssistantRoutingArchitecture,
  getExecutiveAssistantCoordinationTargets,
  getExecutiveAssistantRoutingManifest,
  getExecutiveAssistantRoutingRegistry,
  resetExecutiveAssistantRoutingLayerForTests,
  validateExecutiveAssistantRoutingArchitecture,
} from "./executiveAssistantRoutingExports.ts";
import {
  isExecutiveAssistantCoordinationRouteImmutable,
  isExecutiveAssistantRoutingIdentityImmutable,
  registerExecutiveAssistantRouteBinding,
} from "./executiveAssistantRoutingRegistry.ts";
import {
  validateConfidenceMetadataDeclarativeOnly,
  validateCoordinationRoutesMetadataOnly,
  validateDecisionMetadataPlaceholderOnly,
  validateExecutiveAssistantRoutingManifestRecord,
  validateFrozenImmutableRoutingRecords,
  validateNoRoutingRuntimeOwnership,
  validateRouteRegistryCompleteness,
  validateRouteTargetValidity,
} from "./executiveAssistantRoutingValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantRoutingLayerForTests();
  resetExecutiveAssistantConversationStateLayerForTests();
  resetExecutiveAssistantConversationLayerForTests();
  resetExecutiveAssistantPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllAssLayersForTests();
});

test("exports ASS/4 routing architecture vocabulary", () => {
  assert.equal(ASS_ROUTING_VERSION, "ASS/4");
  assert.equal(ASS_ROUTING_DEPENDENCY, "ASS/3");
  assert.equal(ASS_ROUTE_CATEGORY_KEYS.length, 5);
  assert.equal(ASS_COORDINATION_ROUTE_KEYS.length, 3);
  assert.equal(ASS_SCOPE_ROUTING_KEYS.length, 3);
  assert.equal(ASS_ROUTE_INTENT_PLACEHOLDER_KEYS.length, 5);
  assert.equal(ASS_ROUTE_TARGET_PLACEHOLDER_KEYS.length, 7);
  assert.equal(ASS_ROUTE_DECISION_PLACEHOLDER_KEYS.length, 4);
  assert.equal(ASS_ROUTE_CONFIDENCE_LEVEL_KEYS.length, 5);
  assert.equal(ASS_ROUTING_REGISTRY_KEYS.length, 10);
  assert.equal(ASS_ROUTING_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable routing registries", () => {
  const result = buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantRoutingRegistry();
  assert.equal(registry.routeCategoryCount, ASS_ROUTE_CATEGORY_KEYS.length);
  assert.equal(registry.intentPlaceholderCount, ASS_ROUTE_INTENT_PLACEHOLDER_KEYS.length);
  assert.equal(registry.targetPlaceholderCount, ASS_ROUTE_TARGET_PLACEHOLDER_KEYS.length);
  assert.equal(registry.coordinationRouteCount, ASS_COORDINATION_ROUTE_KEYS.length);
  assert.equal(registry.scopeRoutingCount, ASS_SCOPE_ROUTING_KEYS.length);
  assert.equal(registry.routeDecisionMetadataCount, ASS_ROUTE_DECISION_PLACEHOLDER_KEYS.length);
  assert.equal(registry.routeConfidenceMetadataCount, ASS_ROUTE_CONFIDENCE_LEVEL_KEYS.length);
  assert.equal(registry.routeValidationContractCount, 6);
  assert.ok(registry.routingIdentityCount >= 4);
  assert.equal(registry.routeBindingCount, 1);
});

test("validates routing architecture after build", () => {
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  const validation = validateExecutiveAssistantRoutingArchitecture();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantRoutingRegistry();
  assert.equal(validateRouteRegistryCompleteness(registry).valid, true);
  assert.equal(validateRouteTargetValidity(registry).valid, true);
  assert.equal(validateCoordinationRoutesMetadataOnly(registry).valid, true);
  assert.equal(validateDecisionMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateConfidenceMetadataDeclarativeOnly(registry).valid, true);
  assert.equal(validateFrozenImmutableRoutingRecords(registry).valid, true);
  assert.equal(validateNoRoutingRuntimeOwnership().valid, true);
});

test("generates deterministic routing manifest", () => {
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  const manifest = getExecutiveAssistantRoutingManifest();
  assert.equal(manifest.version, "ASS/4");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/1"));
  assert.ok(manifest.compatibility.includes("ASS/2"));
  assert.ok(manifest.compatibility.includes("ASS/3"));
  assert.ok(manifest.compatibility.includes("ASS/4"));
  assert.equal(validateExecutiveAssistantRoutingManifestRecord(manifest).valid, true);
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  assert.equal(JSON.stringify(manifest), JSON.stringify(getExecutiveAssistantRoutingManifest()));
});

test("defines APP LLM SMM coordination routes as metadata only", () => {
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  const targets = getExecutiveAssistantCoordinationTargets();
  assert.equal(targets.length, 3);
  assert.deepEqual([...targets], [...ASS_COORDINATION_ROUTE_KEYS]);
  const registry = getExecutiveAssistantRoutingRegistry();
  for (const route of registry.coordinationRouteRegistry) {
    assert.equal(isExecutiveAssistantCoordinationRouteImmutable(route), true);
    assert.equal(route.declarativeOnly, true);
    assert.ok((ASS_COORDINATION_PLATFORM_KEYS as readonly string[]).includes(route.platformKey));
    assert.equal(Object.isFrozen(route.decisionMetadata), true);
    assert.equal(Object.isFrozen(route.confidenceMetadata), true);
    assert.equal(route.decisionMetadata.decisionPlaceholder, "decision_pending");
    assert.equal(route.confidenceMetadata.confidenceLevel, "confidence_unspecified");
  }
  for (const scope of registry.scopeRoutingMetadataRegistry) {
    assert.ok(["workspace", "scenario", "task"].includes(scope.scopeKey));
    assert.ok(scope.routingMetadataRef.startsWith("routing-metadata-ref-"));
  }
});

test("supports additive route binding registration", () => {
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  const before = getExecutiveAssistantRoutingRegistry().routeBindingCount;
  const registered = registerExecutiveAssistantRouteBinding(
    Object.freeze({
      bindingId: "ass-route-binding-additive-001",
      routeId: "ass-route-identity-ass-route-additive-001",
      conversationIdRef: "ass-conversation-additive-001",
      routeCategory: "scope_binding",
      coordinationRouteKey: null,
      scopeRoutingKey: "scenario_routing",
      decisionKey: "decision_deferred",
      confidenceKey: "confidence_declared",
      recordedAt: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.equal(registered, true);
  assert.equal(getExecutiveAssistantRoutingRegistry().routeBindingCount, before + 1);
  assert.equal(validateExecutiveAssistantRoutingArchitecture().valid, true);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantRoutingPlatform.buildExecutiveAssistantRoutingArchitecture, "function");
  assert.equal(ExecutiveAssistantRoutingPlatform.version, "ASS/4");
  assert.ok(ASS_ROUTING_PRINCIPLES.includes("declarative_routes_no_execution"));
  assert.ok(ASS_ROUTING_MUST_NOT_OWN.includes("runtime_router"));
  assert.ok(ASS_ROUTING_MUST_NOT_OWN.includes("route_execution"));
});

test("requires ASS/1 ASS/2 ASS/3 without modifying prior ASS files", async () => {
  const { readFile } = await import("node:fs/promises");
  const priorAssFiles = [
    "executiveAssistantPlatformContracts.ts",
    "executiveAssistantPlatformTypes.ts",
    "executiveAssistantPlatformRegistry.ts",
    "executiveAssistantPlatformValidation.ts",
    "executiveAssistantPlatformManifest.ts",
    "executiveAssistantPlatformExports.ts",
    "executiveAssistantPlatform.test.ts",
    "executiveAssistantConversationContracts.ts",
    "executiveAssistantConversationTypes.ts",
    "executiveAssistantConversationRegistry.ts",
    "executiveAssistantConversationValidation.ts",
    "executiveAssistantConversationManifest.ts",
    "executiveAssistantConversationExports.ts",
    "executiveAssistantConversation.test.ts",
    "executiveAssistantConversationStateContracts.ts",
    "executiveAssistantConversationStateTypes.ts",
    "executiveAssistantConversationStateRegistry.ts",
    "executiveAssistantConversationStateValidation.ts",
    "executiveAssistantConversationStateManifest.ts",
    "executiveAssistantConversationStateExports.ts",
    "executiveAssistantConversationState.test.ts",
  ];
  for (const file of priorAssFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
    validateExecutiveAssistantRoutingArchitecture();
    getExecutiveAssistantRoutingManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement runtime router LLM execution or memory mutation", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantRoutingContracts.ts",
    "executiveAssistantRoutingTypes.ts",
    "executiveAssistantRoutingRegistry.ts",
    "executiveAssistantRoutingValidation.ts",
    "executiveAssistantRoutingManifest.ts",
    "executiveAssistantRoutingExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("executeRoute("), false, `${file} must not execute routes`);
    assert.equal(source.includes("WebSocket"), false, `${file} must not use websockets`);
  }
});

test("routing identity records are immutable and declarative", () => {
  buildExecutiveAssistantRoutingArchitecture(FIXED_TIME);
  const identity = getExecutiveAssistantRoutingRegistry().routingIdentityRegistry[0];
  assert.equal(isExecutiveAssistantRoutingIdentityImmutable(identity), true);
  assert.throws(() => {
    (identity as { routeKey: string }).routeKey = "mutated";
  });
});
