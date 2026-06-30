import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import { resetExecutiveAssistantConversationStateLayerForTests } from "./executiveAssistantConversationStateExports.ts";
import { resetExecutiveAssistantRoutingLayerForTests } from "./executiveAssistantRoutingExports.ts";
import { resetExecutiveAssistantIntentLayerForTests } from "./executiveAssistantIntentExports.ts";
import { resetExecutiveAssistantResponseLayerForTests } from "./executiveAssistantResponseExports.ts";
import { ASS_EXECUTIVE_INTENT_CATEGORY_KEYS, ASS_INTENT_ROUTE_BINDING_KEYS } from "./executiveAssistantIntentContracts.ts";
import {
  ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS,
  ASS_CLARIFICATION_CATEGORY_KEYS,
  ASS_CLARIFICATION_DEPENDENCY,
  ASS_CLARIFICATION_INTENT_BINDING_KEYS,
  ASS_CLARIFICATION_MUST_NOT_OWN,
  ASS_CLARIFICATION_PRINCIPLES,
  ASS_CLARIFICATION_PUBLIC_API_REGISTRY,
  ASS_CLARIFICATION_REGISTRY_KEYS,
  ASS_CLARIFICATION_RESPONSE_BINDING_KEYS,
  ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS,
  ASS_CLARIFICATION_VERSION,
  ASS_MISSING_CONTEXT_METADATA_KEYS,
  ASS_QUESTION_TYPE_METADATA_KEYS,
  ASS_CLARIFICATION_PRIORITY_METADATA_KEYS,
} from "./executiveAssistantClarificationContracts.ts";
import {
  ExecutiveAssistantClarificationPlatform,
  buildExecutiveAssistantClarificationArchitecture,
  getExecutiveAssistantClarificationBindingModel,
  getExecutiveAssistantClarificationManifest,
  getExecutiveAssistantClarificationRegistry,
  resetExecutiveAssistantClarificationLayerForTests,
  validateExecutiveAssistantClarificationArchitecture,
} from "./executiveAssistantClarificationExports.ts";
import {
  isExecutiveAssistantClarificationIdentityImmutable,
  registerExecutiveAssistantClarificationBindingSnapshot,
} from "./executiveAssistantClarificationRegistry.ts";
import {
  ASS_RESPONSE_CATEGORY_KEYS,
  ASS_RESPONSE_INTENT_BINDING_KEYS,
} from "./executiveAssistantResponseContracts.ts";
import {
  validateAmbiguityResolutionMetadataPlaceholderOnly,
  validateClarificationCategoriesValid,
  validateClarificationIntentBindingsReferenceAss5,
  validateClarificationPriorityDeclarativeOnly,
  validateClarificationRegistryCompleteness,
  validateClarificationResponseBindingsReferenceAss6,
  validateExecutiveAssistantClarificationManifestRecord,
  validateFrozenImmutableClarificationRecords,
  validateMissingContextMetadataPlaceholderOnly,
  validateNoClarificationRuntimeOwnership,
  validateQuestionTypeMetadataDeclarativeOnly,
  validateTriggerPlaceholdersOnly,
} from "./executiveAssistantClarificationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantClarificationLayerForTests();
  resetExecutiveAssistantResponseLayerForTests();
  resetExecutiveAssistantIntentLayerForTests();
  resetExecutiveAssistantRoutingLayerForTests();
  resetExecutiveAssistantConversationStateLayerForTests();
  resetExecutiveAssistantConversationLayerForTests();
  resetExecutiveAssistantPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllAssLayersForTests();
});

test("exports ASS/7 clarification architecture vocabulary", () => {
  assert.equal(ASS_CLARIFICATION_VERSION, "ASS/7");
  assert.equal(ASS_CLARIFICATION_DEPENDENCY, "ASS/6");
  assert.equal(ASS_CLARIFICATION_CATEGORY_KEYS.length, 7);
  assert.equal(ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS.length, 6);
  assert.equal(ASS_QUESTION_TYPE_METADATA_KEYS.length, 5);
  assert.equal(ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS.length, 5);
  assert.equal(ASS_MISSING_CONTEXT_METADATA_KEYS.length, 5);
  assert.equal(ASS_CLARIFICATION_PRIORITY_METADATA_KEYS.length, 5);
  assert.equal(ASS_CLARIFICATION_INTENT_BINDING_KEYS.length, 7);
  assert.equal(ASS_CLARIFICATION_RESPONSE_BINDING_KEYS.length, 7);
  assert.equal(ASS_CLARIFICATION_REGISTRY_KEYS.length, 10);
  assert.equal(ASS_CLARIFICATION_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable clarification registries", () => {
  const result = buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantClarificationRegistry();
  assert.equal(registry.clarificationCategoryCount, ASS_CLARIFICATION_CATEGORY_KEYS.length);
  assert.equal(registry.triggerPlaceholderCount, ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS.length);
  assert.equal(registry.questionTypeMetadataCount, ASS_QUESTION_TYPE_METADATA_KEYS.length);
  assert.equal(registry.ambiguityResolutionMetadataCount, ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS.length);
  assert.equal(registry.missingContextMetadataCount, ASS_MISSING_CONTEXT_METADATA_KEYS.length);
  assert.equal(registry.clarificationPriorityMetadataCount, ASS_CLARIFICATION_PRIORITY_METADATA_KEYS.length);
  assert.equal(registry.clarificationIntentBindingCount, ASS_CLARIFICATION_INTENT_BINDING_KEYS.length);
  assert.equal(registry.clarificationResponseBindingCount, ASS_CLARIFICATION_RESPONSE_BINDING_KEYS.length);
  assert.ok(registry.clarificationIdentityCount >= 7);
  assert.equal(registry.clarificationBindingSnapshotCount, 1);
});

test("validates clarification architecture after build", () => {
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  const validation = validateExecutiveAssistantClarificationArchitecture();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantClarificationRegistry();
  assert.equal(validateClarificationRegistryCompleteness(registry).valid, true);
  assert.equal(validateClarificationCategoriesValid(registry).valid, true);
  assert.equal(validateTriggerPlaceholdersOnly(registry).valid, true);
  assert.equal(validateQuestionTypeMetadataDeclarativeOnly(registry).valid, true);
  assert.equal(validateAmbiguityResolutionMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateMissingContextMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateClarificationPriorityDeclarativeOnly(registry).valid, true);
  assert.equal(validateClarificationIntentBindingsReferenceAss5(registry).valid, true);
  assert.equal(validateClarificationResponseBindingsReferenceAss6(registry).valid, true);
  assert.equal(validateFrozenImmutableClarificationRecords(registry).valid, true);
  assert.equal(validateNoClarificationRuntimeOwnership().valid, true);
});

test("generates deterministic clarification manifest", () => {
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  const manifest = getExecutiveAssistantClarificationManifest();
  assert.equal(manifest.version, "ASS/7");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/6"));
  assert.ok(manifest.compatibility.includes("ASS/7"));
  assert.equal(validateExecutiveAssistantClarificationManifestRecord(manifest).valid, true);
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  assert.equal(JSON.stringify(manifest), JSON.stringify(getExecutiveAssistantClarificationManifest()));
});

test("defines clarification bindings referencing ASS/5 and ASS/6 metadata only", () => {
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  const model = getExecutiveAssistantClarificationBindingModel();
  assert.equal(model.intentBindings.length, 7);
  assert.equal(model.responseBindings.length, 7);
  for (const binding of model.intentBindings) {
    assert.ok((ASS_EXECUTIVE_INTENT_CATEGORY_KEYS as readonly string[]).includes(binding.intentCategoryKey as never));
    assert.ok((ASS_INTENT_ROUTE_BINDING_KEYS as readonly string[]).includes(binding.intentRouteBindingKey as never));
    assert.equal(Object.isFrozen(binding), true);
  }
  for (const binding of model.responseBindings) {
    assert.ok((ASS_RESPONSE_CATEGORY_KEYS as readonly string[]).includes(binding.responseCategoryKey as never));
    assert.ok((ASS_RESPONSE_INTENT_BINDING_KEYS as readonly string[]).includes(binding.responseIntentBindingKey as never));
    assert.equal(Object.isFrozen(binding), true);
  }
});

test("supports additive clarification binding snapshot registration", () => {
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  const before = getExecutiveAssistantClarificationRegistry().clarificationBindingSnapshotCount;
  const registered = registerExecutiveAssistantClarificationBindingSnapshot(
    Object.freeze({
      snapshotId: "ass-clarification-binding-snapshot-additive-001",
      clarificationId: "ass-clarification-identity-additive-001",
      conversationIdRef: "ass-conversation-additive-001",
      clarificationCategoryKey: "missing_context",
      triggerKey: "trigger_context_missing",
      questionTypeKey: "question_type_closed",
      resolutionKey: "resolution_not_required",
      missingContextKey: "context_missing",
      priorityKey: "priority_high",
      intentBindingKey: "missing_context_intent_binding",
      responseBindingKey: "missing_context_response_binding",
      recordedAt: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.equal(registered, true);
  assert.equal(getExecutiveAssistantClarificationRegistry().clarificationBindingSnapshotCount, before + 1);
  assert.equal(validateExecutiveAssistantClarificationArchitecture().valid, true);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantClarificationPlatform.buildExecutiveAssistantClarificationArchitecture, "function");
  assert.equal(ExecutiveAssistantClarificationPlatform.version, "ASS/7");
  assert.ok(ASS_CLARIFICATION_PRINCIPLES.includes("declarative_clarification_no_question_generation"));
  assert.ok(ASS_CLARIFICATION_MUST_NOT_OWN.includes("question_generation"));
  assert.ok(ASS_CLARIFICATION_MUST_NOT_OWN.includes("clarification_renderer"));
});

test("requires ASS/1 through ASS/6 without modifying prior ASS files", async () => {
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
    "executiveAssistantIntentContracts.ts",
    "executiveAssistantIntentTypes.ts",
    "executiveAssistantIntentRegistry.ts",
    "executiveAssistantIntentValidation.ts",
    "executiveAssistantIntentManifest.ts",
    "executiveAssistantIntentExports.ts",
    "executiveAssistantIntent.test.ts",
    "executiveAssistantResponseContracts.ts",
    "executiveAssistantResponseTypes.ts",
    "executiveAssistantResponseRegistry.ts",
    "executiveAssistantResponseValidation.ts",
    "executiveAssistantResponseManifest.ts",
    "executiveAssistantResponseExports.ts",
    "executiveAssistantResponse.test.ts",
  ];
  for (const file of priorAssFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
    validateExecutiveAssistantClarificationArchitecture();
    getExecutiveAssistantClarificationManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement question generation LLM or chat runtime", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantClarificationContracts.ts",
    "executiveAssistantClarificationTypes.ts",
    "executiveAssistantClarificationRegistry.ts",
    "executiveAssistantClarificationValidation.ts",
    "executiveAssistantClarificationManifest.ts",
    "executiveAssistantClarificationExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("generateQuestion("), false, `${file} must not generate questions`);
    assert.equal(source.includes("generateResponse("), false, `${file} must not generate responses`);
  }
});

test("clarification identity records are immutable and declarative", () => {
  buildExecutiveAssistantClarificationArchitecture(FIXED_TIME);
  const identity = getExecutiveAssistantClarificationRegistry().clarificationIdentityRegistry[0];
  assert.equal(isExecutiveAssistantClarificationIdentityImmutable(identity), true);
  assert.throws(() => {
    (identity as { clarificationKey: string }).clarificationKey = "mutated";
  });
});
