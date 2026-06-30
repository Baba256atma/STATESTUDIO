import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import { resetExecutiveAssistantConversationStateLayerForTests } from "./executiveAssistantConversationStateExports.ts";
import { resetExecutiveAssistantRoutingLayerForTests } from "./executiveAssistantRoutingExports.ts";
import {
  ASS_AMBIGUITY_METADATA_KEYS,
  ASS_CLARIFICATION_METADATA_KEYS,
  ASS_EXECUTIVE_INTENT_CATEGORY_KEYS,
  ASS_INTENT_CONFIDENCE_LEVEL_KEYS,
  ASS_INTENT_DEPENDENCY,
  ASS_INTENT_MUST_NOT_OWN,
  ASS_INTENT_PRINCIPLES,
  ASS_INTENT_PUBLIC_API_REGISTRY,
  ASS_INTENT_REGISTRY_KEYS,
  ASS_INTENT_ROUTE_BINDING_KEYS,
  ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS,
  ASS_INTENT_VERSION,
} from "./executiveAssistantIntentContracts.ts";
import {
  ExecutiveAssistantIntentPlatform,
  buildExecutiveAssistantIntentInterpretationContracts,
  getExecutiveAssistantIntentManifest,
  getExecutiveAssistantIntentRegistry,
  getExecutiveAssistantIntentRouteBindingModel,
  resetExecutiveAssistantIntentLayerForTests,
  validateExecutiveAssistantIntentInterpretationContracts,
} from "./executiveAssistantIntentExports.ts";
import {
  isExecutiveAssistantIntentInterpretationImmutable,
  registerExecutiveAssistantIntentBindingSnapshot,
} from "./executiveAssistantIntentRegistry.ts";
import {
  ASS_COORDINATION_ROUTE_KEYS,
  ASS_ROUTE_INTENT_PLACEHOLDER_KEYS,
  ASS_SCOPE_ROUTING_KEYS,
} from "./executiveAssistantRoutingContracts.ts";
import {
  validateAmbiguityMetadataDeclarativeOnly,
  validateClarificationMetadataPlaceholderOnly,
  validateExecutiveAssistantIntentManifestRecord,
  validateFrozenImmutableIntentRecords,
  validateIntentCategoriesValid,
  validateIntentConfidenceDeclarativeOnly,
  validateIntentRegistryCompleteness,
  validateIntentRouteBindingsReferenceAss4,
  validateNoIntentRuntimeOwnership,
  validateSignalPlaceholdersOnly,
} from "./executiveAssistantIntentValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantIntentLayerForTests();
  resetExecutiveAssistantRoutingLayerForTests();
  resetExecutiveAssistantConversationStateLayerForTests();
  resetExecutiveAssistantConversationLayerForTests();
  resetExecutiveAssistantPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllAssLayersForTests();
});

test("exports ASS/5 intent interpretation vocabulary", () => {
  assert.equal(ASS_INTENT_VERSION, "ASS/5");
  assert.equal(ASS_INTENT_DEPENDENCY, "ASS/4");
  assert.equal(ASS_EXECUTIVE_INTENT_CATEGORY_KEYS.length, 7);
  assert.equal(ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS.length, 5);
  assert.equal(ASS_AMBIGUITY_METADATA_KEYS.length, 5);
  assert.equal(ASS_CLARIFICATION_METADATA_KEYS.length, 5);
  assert.equal(ASS_INTENT_CONFIDENCE_LEVEL_KEYS.length, 5);
  assert.equal(ASS_INTENT_ROUTE_BINDING_KEYS.length, 6);
  assert.equal(ASS_INTENT_REGISTRY_KEYS.length, 9);
  assert.equal(ASS_INTENT_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable intent interpretation registries", () => {
  const result = buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantIntentRegistry();
  assert.equal(registry.intentCategoryCount, ASS_EXECUTIVE_INTENT_CATEGORY_KEYS.length);
  assert.equal(registry.signalPlaceholderCount, ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS.length);
  assert.equal(registry.ambiguityMetadataCount, ASS_AMBIGUITY_METADATA_KEYS.length);
  assert.equal(registry.clarificationMetadataCount, ASS_CLARIFICATION_METADATA_KEYS.length);
  assert.equal(registry.intentConfidenceMetadataCount, ASS_INTENT_CONFIDENCE_LEVEL_KEYS.length);
  assert.equal(registry.intentRouteBindingCount, ASS_INTENT_ROUTE_BINDING_KEYS.length);
  assert.equal(registry.intentValidationContractCount, 7);
  assert.ok(registry.interpretationIdentityCount >= 7);
  assert.equal(registry.intentBindingSnapshotCount, 1);
});

test("validates intent interpretation contracts after build", () => {
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  const validation = validateExecutiveAssistantIntentInterpretationContracts();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantIntentRegistry();
  assert.equal(validateIntentRegistryCompleteness(registry).valid, true);
  assert.equal(validateIntentCategoriesValid(registry).valid, true);
  assert.equal(validateSignalPlaceholdersOnly(registry).valid, true);
  assert.equal(validateAmbiguityMetadataDeclarativeOnly(registry).valid, true);
  assert.equal(validateClarificationMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateIntentConfidenceDeclarativeOnly(registry).valid, true);
  assert.equal(validateIntentRouteBindingsReferenceAss4(registry).valid, true);
  assert.equal(validateFrozenImmutableIntentRecords(registry).valid, true);
  assert.equal(validateNoIntentRuntimeOwnership().valid, true);
});

test("generates deterministic intent manifest", () => {
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  const manifest = getExecutiveAssistantIntentManifest();
  assert.equal(manifest.version, "ASS/5");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/4"));
  assert.ok(manifest.compatibility.includes("ASS/5"));
  assert.equal(validateExecutiveAssistantIntentManifestRecord(manifest).valid, true);
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  assert.equal(JSON.stringify(manifest), JSON.stringify(getExecutiveAssistantIntentManifest()));
});

test("defines intent-to-route bindings referencing ASS/4 metadata only", () => {
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  const bindings = getExecutiveAssistantIntentRouteBindingModel();
  assert.equal(bindings.length, 6);
  for (const binding of bindings) {
    assert.ok((ASS_COORDINATION_ROUTE_KEYS as readonly string[]).includes(binding.coordinationRouteKey as never));
    assert.ok((ASS_SCOPE_ROUTING_KEYS as readonly string[]).includes(binding.scopeRoutingKey as never));
    assert.ok((ASS_ROUTE_INTENT_PLACEHOLDER_KEYS as readonly string[]).includes(binding.intentPlaceholderKey as never));
    assert.equal(Object.isFrozen(binding), true);
  }
});

test("supports additive intent binding snapshot registration", () => {
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  const before = getExecutiveAssistantIntentRegistry().intentBindingSnapshotCount;
  const registered = registerExecutiveAssistantIntentBindingSnapshot(
    Object.freeze({
      snapshotId: "ass-intent-binding-snapshot-additive-001",
      interpretationId: "ass-intent-interpretation-additive-001",
      conversationIdRef: "ass-conversation-additive-001",
      intentCategoryKey: "decision_support",
      signalKey: "signal_contextual",
      ambiguityKey: "ambiguity_low",
      clarificationKey: "clarification_not_required",
      confidenceKey: "confidence_declared",
      routeBindingKey: "app_intent_route_binding",
      recordedAt: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.equal(registered, true);
  assert.equal(getExecutiveAssistantIntentRegistry().intentBindingSnapshotCount, before + 1);
  assert.equal(validateExecutiveAssistantIntentInterpretationContracts().valid, true);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantIntentPlatform.buildExecutiveAssistantIntentInterpretationContracts, "function");
  assert.equal(ExecutiveAssistantIntentPlatform.version, "ASS/5");
  assert.ok(ASS_INTENT_PRINCIPLES.includes("declarative_intent_no_detection_runtime"));
  assert.ok(ASS_INTENT_MUST_NOT_OWN.includes("intent_classifier"));
  assert.ok(ASS_INTENT_MUST_NOT_OWN.includes("inference_engine"));
});

test("requires ASS/1 through ASS/4 without modifying prior ASS files", async () => {
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
    "executiveAssistantRoutingContracts.ts",
    "executiveAssistantRoutingTypes.ts",
    "executiveAssistantRoutingRegistry.ts",
    "executiveAssistantRoutingValidation.ts",
    "executiveAssistantRoutingManifest.ts",
    "executiveAssistantRoutingExports.ts",
    "executiveAssistantRouting.test.ts",
  ];
  for (const file of priorAssFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
    validateExecutiveAssistantIntentInterpretationContracts();
    getExecutiveAssistantIntentManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement classifier LLM inference or memory mutation", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantIntentContracts.ts",
    "executiveAssistantIntentTypes.ts",
    "executiveAssistantIntentRegistry.ts",
    "executiveAssistantIntentValidation.ts",
    "executiveAssistantIntentManifest.ts",
    "executiveAssistantIntentExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("classify("), false, `${file} must not classify intent`);
    assert.equal(source.includes("detectIntent("), false, `${file} must not detect intent`);
  }
});

test("intent interpretation identity records are immutable and declarative", () => {
  buildExecutiveAssistantIntentInterpretationContracts(FIXED_TIME);
  const identity = getExecutiveAssistantIntentRegistry().intentInterpretationIdentityRegistry[0];
  assert.equal(isExecutiveAssistantIntentInterpretationImmutable(identity), true);
  assert.throws(() => {
    (identity as { interpretationKey: string }).interpretationKey = "mutated";
  });
});
