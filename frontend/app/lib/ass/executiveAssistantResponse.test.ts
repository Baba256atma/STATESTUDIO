import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import { resetExecutiveAssistantConversationStateLayerForTests } from "./executiveAssistantConversationStateExports.ts";
import { resetExecutiveAssistantRoutingLayerForTests } from "./executiveAssistantRoutingExports.ts";
import { resetExecutiveAssistantIntentLayerForTests } from "./executiveAssistantIntentExports.ts";
import { ASS_EXECUTIVE_INTENT_CATEGORY_KEYS, ASS_INTENT_ROUTE_BINDING_KEYS } from "./executiveAssistantIntentContracts.ts";
import {
  ASS_ACTION_SUGGESTION_METADATA_KEYS,
  ASS_EXPLANATION_METADATA_KEYS,
  ASS_FOLLOW_UP_METADATA_KEYS,
  ASS_RESPONSE_CATEGORY_KEYS,
  ASS_RESPONSE_DEPENDENCY,
  ASS_RESPONSE_INTENT_BINDING_KEYS,
  ASS_RESPONSE_MUST_NOT_OWN,
  ASS_RESPONSE_PRINCIPLES,
  ASS_RESPONSE_PUBLIC_API_REGISTRY,
  ASS_RESPONSE_REGISTRY_KEYS,
  ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS,
  ASS_RESPONSE_VERSION,
  ASS_TONE_STYLE_METADATA_KEYS,
} from "./executiveAssistantResponseContracts.ts";
import {
  ExecutiveAssistantResponsePlatform,
  buildExecutiveAssistantResponseContractArchitecture,
  getExecutiveAssistantResponseIntentBindingModel,
  getExecutiveAssistantResponseManifest,
  getExecutiveAssistantResponseRegistry,
  resetExecutiveAssistantResponseLayerForTests,
  validateExecutiveAssistantResponseContractArchitecture,
} from "./executiveAssistantResponseExports.ts";
import {
  isExecutiveAssistantResponseIdentityImmutable,
  registerExecutiveAssistantResponseBindingSnapshot,
} from "./executiveAssistantResponseRegistry.ts";
import {
  validateActionSuggestionMetadataPlaceholderOnly,
  validateExecutiveAssistantResponseManifestRecord,
  validateExplanationMetadataPlaceholderOnly,
  validateFollowUpMetadataPlaceholderOnly,
  validateFrozenImmutableResponseRecords,
  validateNoResponseRuntimeOwnership,
  validateResponseCategoriesValid,
  validateResponseIntentBindingsReferenceAss5,
  validateResponseRegistryCompleteness,
  validateStructurePlaceholdersOnly,
  validateToneStyleMetadataDeclarativeOnly,
} from "./executiveAssistantResponseValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
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

test("exports ASS/6 response contract vocabulary", () => {
  assert.equal(ASS_RESPONSE_VERSION, "ASS/6");
  assert.equal(ASS_RESPONSE_DEPENDENCY, "ASS/5");
  assert.equal(ASS_RESPONSE_CATEGORY_KEYS.length, 7);
  assert.equal(ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS.length, 5);
  assert.equal(ASS_TONE_STYLE_METADATA_KEYS.length, 5);
  assert.equal(ASS_EXPLANATION_METADATA_KEYS.length, 5);
  assert.equal(ASS_FOLLOW_UP_METADATA_KEYS.length, 5);
  assert.equal(ASS_ACTION_SUGGESTION_METADATA_KEYS.length, 5);
  assert.equal(ASS_RESPONSE_INTENT_BINDING_KEYS.length, 7);
  assert.equal(ASS_RESPONSE_REGISTRY_KEYS.length, 10);
  assert.equal(ASS_RESPONSE_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable response contract registries", () => {
  const result = buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantResponseRegistry();
  assert.equal(registry.responseCategoryCount, ASS_RESPONSE_CATEGORY_KEYS.length);
  assert.equal(registry.structurePlaceholderCount, ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS.length);
  assert.equal(registry.toneStyleMetadataCount, ASS_TONE_STYLE_METADATA_KEYS.length);
  assert.equal(registry.explanationMetadataCount, ASS_EXPLANATION_METADATA_KEYS.length);
  assert.equal(registry.followUpMetadataCount, ASS_FOLLOW_UP_METADATA_KEYS.length);
  assert.equal(registry.actionSuggestionMetadataCount, ASS_ACTION_SUGGESTION_METADATA_KEYS.length);
  assert.equal(registry.responseIntentBindingCount, ASS_RESPONSE_INTENT_BINDING_KEYS.length);
  assert.equal(registry.responseValidationContractCount, 8);
  assert.ok(registry.responseIdentityCount >= 7);
  assert.equal(registry.responseBindingSnapshotCount, 1);
});

test("validates response contract architecture after build", () => {
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  const validation = validateExecutiveAssistantResponseContractArchitecture();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantResponseRegistry();
  assert.equal(validateResponseRegistryCompleteness(registry).valid, true);
  assert.equal(validateResponseCategoriesValid(registry).valid, true);
  assert.equal(validateStructurePlaceholdersOnly(registry).valid, true);
  assert.equal(validateToneStyleMetadataDeclarativeOnly(registry).valid, true);
  assert.equal(validateExplanationMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateFollowUpMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateActionSuggestionMetadataPlaceholderOnly(registry).valid, true);
  assert.equal(validateResponseIntentBindingsReferenceAss5(registry).valid, true);
  assert.equal(validateFrozenImmutableResponseRecords(registry).valid, true);
  assert.equal(validateNoResponseRuntimeOwnership().valid, true);
});

test("generates deterministic response manifest", () => {
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  const manifest = getExecutiveAssistantResponseManifest();
  assert.equal(manifest.version, "ASS/6");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/5"));
  assert.ok(manifest.compatibility.includes("ASS/6"));
  assert.equal(validateExecutiveAssistantResponseManifestRecord(manifest).valid, true);
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  assert.equal(JSON.stringify(manifest), JSON.stringify(getExecutiveAssistantResponseManifest()));
});

test("defines response-to-intent bindings referencing ASS/5 metadata only", () => {
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  const bindings = getExecutiveAssistantResponseIntentBindingModel();
  assert.equal(bindings.length, 7);
  for (const binding of bindings) {
    assert.ok((ASS_EXECUTIVE_INTENT_CATEGORY_KEYS as readonly string[]).includes(binding.intentCategoryKey as never));
    assert.ok((ASS_INTENT_ROUTE_BINDING_KEYS as readonly string[]).includes(binding.intentRouteBindingKey as never));
    assert.ok(binding.interpretationId.startsWith("ass-intent-interpretation-"));
    assert.equal(Object.isFrozen(binding), true);
  }
});

test("supports additive response binding snapshot registration", () => {
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  const before = getExecutiveAssistantResponseRegistry().responseBindingSnapshotCount;
  const registered = registerExecutiveAssistantResponseBindingSnapshot(
    Object.freeze({
      snapshotId: "ass-response-binding-snapshot-additive-001",
      responseId: "ass-response-identity-additive-001",
      conversationIdRef: "ass-conversation-additive-001",
      responseCategoryKey: "advisory",
      structureKey: "structure_bullet_list",
      toneStyleKey: "tone_direct",
      explanationKey: "explanation_reference_only",
      followUpKey: "follow_up_suggested",
      actionSuggestionKey: "action_suggested",
      intentBindingKey: "advisory_intent_binding",
      recordedAt: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.equal(registered, true);
  assert.equal(getExecutiveAssistantResponseRegistry().responseBindingSnapshotCount, before + 1);
  assert.equal(validateExecutiveAssistantResponseContractArchitecture().valid, true);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantResponsePlatform.buildExecutiveAssistantResponseContractArchitecture, "function");
  assert.equal(ExecutiveAssistantResponsePlatform.version, "ASS/6");
  assert.ok(ASS_RESPONSE_PRINCIPLES.includes("declarative_response_no_generation"));
  assert.ok(ASS_RESPONSE_MUST_NOT_OWN.includes("response_generation"));
  assert.ok(ASS_RESPONSE_MUST_NOT_OWN.includes("content_synthesis"));
});

test("requires ASS/1 through ASS/5 without modifying prior ASS files", async () => {
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
  ];
  for (const file of priorAssFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
    validateExecutiveAssistantResponseContractArchitecture();
    getExecutiveAssistantResponseManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement response generation LLM or chat runtime", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantResponseContracts.ts",
    "executiveAssistantResponseTypes.ts",
    "executiveAssistantResponseRegistry.ts",
    "executiveAssistantResponseValidation.ts",
    "executiveAssistantResponseManifest.ts",
    "executiveAssistantResponseExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("generateResponse("), false, `${file} must not generate responses`);
    assert.equal(source.includes("renderChat("), false, `${file} must not render chat`);
  }
});

test("response identity records are immutable and declarative", () => {
  buildExecutiveAssistantResponseContractArchitecture(FIXED_TIME);
  const identity = getExecutiveAssistantResponseRegistry().responseIdentityRegistry[0];
  assert.equal(isExecutiveAssistantResponseIdentityImmutable(identity), true);
  assert.throws(() => {
    (identity as { responseKey: string }).responseKey = "mutated";
  });
});
