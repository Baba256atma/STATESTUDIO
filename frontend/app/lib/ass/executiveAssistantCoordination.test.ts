import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import { resetExecutiveAssistantConversationStateLayerForTests } from "./executiveAssistantConversationStateExports.ts";
import { resetExecutiveAssistantRoutingLayerForTests } from "./executiveAssistantRoutingExports.ts";
import { resetExecutiveAssistantIntentLayerForTests } from "./executiveAssistantIntentExports.ts";
import { resetExecutiveAssistantResponseLayerForTests } from "./executiveAssistantResponseExports.ts";
import { resetExecutiveAssistantClarificationLayerForTests } from "./executiveAssistantClarificationExports.ts";
import {
  ASS_CERTIFIED_PHASE_KEYS,
  ASS_COORDINATION_DEPENDENCY,
  ASS_COORDINATION_MUST_NOT_OWN,
  ASS_COORDINATION_PRINCIPLES,
  ASS_COORDINATION_PUBLIC_API_REGISTRY,
  ASS_COORDINATION_REGISTRY_KEYS,
  ASS_COORDINATION_VERSION,
  ASS_PHASE_REFERENCE_KEYS,
} from "./executiveAssistantCoordinationContracts.ts";
import {
  ExecutiveAssistantCoordinationPlatform,
  buildExecutiveAssistantCoordinationManifest,
  getExecutiveAssistantCompatibilityMatrix,
  getExecutiveAssistantCoordinationPlatformManifest,
  getExecutiveAssistantCoordinationRegistry,
  resetExecutiveAssistantCoordinationLayerForTests,
  validateExecutiveAssistantCoordinationManifest,
} from "./executiveAssistantCoordinationExports.ts";
import {
  isExecutiveAssistantCoordinationIdentityImmutable,
  registerExecutiveAssistantCertifiedPhaseExtension,
} from "./executiveAssistantCoordinationRegistry.ts";
import {
  validateCertifiedAssPhasesRegistered,
  validateCompatibilityMatrixComplete,
  validateCrossPhaseReferencesValid,
  validateDependencyOrderValid,
  validateExecutiveAssistantCoordinationManifestRecord,
  validateFrozenImmutableCoordinationRecords,
  validateNoCoordinationRuntimeOwnership,
} from "./executiveAssistantCoordinationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantCoordinationLayerForTests();
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

test("exports ASS/8 coordination manifest vocabulary", () => {
  assert.equal(ASS_COORDINATION_VERSION, "ASS/8");
  assert.equal(ASS_COORDINATION_DEPENDENCY, "ASS/7");
  assert.equal(ASS_CERTIFIED_PHASE_KEYS.length, 7);
  assert.equal(ASS_PHASE_REFERENCE_KEYS.length, 6);
  assert.equal(ASS_COORDINATION_REGISTRY_KEYS.length, 10);
  assert.equal(ASS_COORDINATION_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable coordination registries", () => {
  const result = buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantCoordinationRegistry();
  assert.equal(registry.certifiedPhaseCount, 7);
  assert.equal(registry.conversationContractReferenceCount, 1);
  assert.equal(registry.stateArchitectureReferenceCount, 1);
  assert.equal(registry.routingArchitectureReferenceCount, 1);
  assert.equal(registry.intentContractReferenceCount, 1);
  assert.equal(registry.responseContractReferenceCount, 1);
  assert.equal(registry.clarificationContractReferenceCount, 1);
  assert.equal(registry.compatibilityEntryCount, 28);
  assert.equal(registry.coordinationIdentityCount, 1);
  assert.equal(registry.platformCoordinationManifestCount, 1);
});

test("validates coordination manifest after build", () => {
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  const validation = validateExecutiveAssistantCoordinationManifest();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantCoordinationRegistry();
  assert.equal(validateCertifiedAssPhasesRegistered(registry).valid, true);
  assert.equal(validateDependencyOrderValid(registry).valid, true);
  assert.equal(validateCrossPhaseReferencesValid(registry).valid, true);
  assert.equal(validateCompatibilityMatrixComplete(registry).valid, true);
  assert.equal(validateFrozenImmutableCoordinationRecords(registry).valid, true);
  assert.equal(validateNoCoordinationRuntimeOwnership().valid, true);
});

test("generates deterministic platform coordination manifest", () => {
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  const manifest = getExecutiveAssistantCoordinationPlatformManifest();
  assert.equal(manifest.version, "ASS/8");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/7"));
  assert.ok(manifest.compatibility.includes("ASS/8"));
  assert.equal(validateExecutiveAssistantCoordinationManifestRecord(manifest).valid, true);
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  assert.equal(JSON.stringify(manifest), JSON.stringify(getExecutiveAssistantCoordinationPlatformManifest()));
});

test("defines complete cross-phase compatibility matrix", () => {
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  const matrix = getExecutiveAssistantCompatibilityMatrix();
  assert.equal(matrix.length, 28);
  for (const entry of matrix) {
    assert.equal(entry.compatible, true);
    assert.equal(Object.isFrozen(entry), true);
  }
  const ass1ToAss7 = matrix.find((entry) => entry.fromPhaseKey === "ASS/1" && entry.toPhaseKey === "ASS/7");
  assert.ok(ass1ToAss7);
});

test("supports additive certified phase extension", () => {
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  const before = getExecutiveAssistantCoordinationRegistry().certifiedPhaseCount;
  const registered = registerExecutiveAssistantCertifiedPhaseExtension(
    "ASS/8-ext",
    "Future Extension Phase",
    "buildFutureExtension",
    "ASS/7",
    FIXED_TIME
  );
  assert.equal(registered, true);
  assert.equal(getExecutiveAssistantCoordinationRegistry().certifiedPhaseCount, before + 1);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantCoordinationPlatform.buildExecutiveAssistantCoordinationManifest, "function");
  assert.equal(ExecutiveAssistantCoordinationPlatform.version, "ASS/8");
  assert.ok(ASS_COORDINATION_PRINCIPLES.includes("coordination_metadata_aggregation_only"));
  assert.ok(ASS_COORDINATION_MUST_NOT_OWN.includes("runtime_coordination"));
  assert.ok(ASS_COORDINATION_MUST_NOT_OWN.includes("assistant_execution"));
});

test("requires ASS/1 through ASS/7 without modifying prior ASS files", async () => {
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
    "executiveAssistantClarificationContracts.ts",
    "executiveAssistantClarificationTypes.ts",
    "executiveAssistantClarificationRegistry.ts",
    "executiveAssistantClarificationValidation.ts",
    "executiveAssistantClarificationManifest.ts",
    "executiveAssistantClarificationExports.ts",
    "executiveAssistantClarification.test.ts",
  ];
  for (const file of priorAssFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
    validateExecutiveAssistantCoordinationManifest();
    getExecutiveAssistantCoordinationPlatformManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement runtime coordination assistant execution or chat runtime", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantCoordinationContracts.ts",
    "executiveAssistantCoordinationTypes.ts",
    "executiveAssistantCoordinationRegistry.ts",
    "executiveAssistantCoordinationValidation.ts",
    "executiveAssistantCoordinationManifest.ts",
    "executiveAssistantCoordinationExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("executeAssistant("), false, `${file} must not execute assistant`);
    assert.equal(source.includes("coordinateRuntime("), false, `${file} must not coordinate runtime`);
  }
});

test("coordination identity records are immutable and declarative", () => {
  buildExecutiveAssistantCoordinationManifest(FIXED_TIME);
  const identity = getExecutiveAssistantCoordinationRegistry().assistantCoordinationIdentityRegistry[0];
  assert.equal(isExecutiveAssistantCoordinationIdentityImmutable(identity), true);
  assert.equal(identity.certifiedPhaseCount, 7);
  assert.throws(() => {
    (identity as { coordinationKey: string }).coordinationKey = "mutated";
  });
});
