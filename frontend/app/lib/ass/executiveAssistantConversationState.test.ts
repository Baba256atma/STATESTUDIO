import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import {
  ASS_COMPLETION_STATE_KEYS,
  ASS_CONVERSATION_STATE_DEPENDENCY,
  ASS_CONVERSATION_STATE_MUST_NOT_OWN,
  ASS_CONVERSATION_STATE_PRINCIPLES,
  ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY,
  ASS_CONVERSATION_STATE_REGISTRY_KEYS,
  ASS_CONVERSATION_STATE_VERSION,
  ASS_DECLARATIVE_TRANSITIONS,
  ASS_FAILURE_METADATA_CODES,
  ASS_INTERACTION_STATE_KEYS,
  ASS_LIFECYCLE_STATE_KEYS,
  ASS_PAUSE_RESUME_STATE_KEYS,
  ASS_SESSION_STATE_KEYS,
  ASS_TURN_STATE_KEYS,
  ASS_WAITING_STATE_KEYS,
} from "./executiveAssistantConversationStateContracts.ts";
import {
  ExecutiveAssistantConversationStatePlatform,
  buildExecutiveAssistantConversationStateArchitecture,
  getExecutiveAssistantConversationStateManifest,
  getExecutiveAssistantConversationStateRegistry,
  getExecutiveAssistantTransitionMatrix,
  resetExecutiveAssistantConversationStateLayerForTests,
  validateExecutiveAssistantConversationStateArchitecture,
} from "./executiveAssistantConversationStateExports.ts";
import {
  isExecutiveAssistantStateDefinitionImmutable,
  isExecutiveAssistantTransitionContractImmutable,
  registerExecutiveAssistantStateSnapshot,
} from "./executiveAssistantConversationStateRegistry.ts";
import {
  validateAllConversationStatesRegistered,
  validateExecutiveAssistantConversationStateManifestRecord,
  validateFrozenImmutableRecords,
  validateLifecycleCompleteness,
  validateNoIllegalTransitions,
  validateNoStateRuntimeOwnership,
  validateTransitionGraphValidity,
} from "./executiveAssistantConversationStateValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantConversationStateLayerForTests();
  resetExecutiveAssistantConversationLayerForTests();
  resetExecutiveAssistantPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllAssLayersForTests();
});

test("exports ASS/3 conversation state vocabulary", () => {
  assert.equal(ASS_CONVERSATION_STATE_VERSION, "ASS/3");
  assert.equal(ASS_CONVERSATION_STATE_DEPENDENCY, "ASS/2");
  assert.equal(ASS_LIFECYCLE_STATE_KEYS.length, 9);
  assert.equal(ASS_SESSION_STATE_KEYS.length, 7);
  assert.equal(ASS_TURN_STATE_KEYS.length, 6);
  assert.equal(ASS_INTERACTION_STATE_KEYS.length, 5);
  assert.equal(ASS_WAITING_STATE_KEYS.length, 4);
  assert.equal(ASS_COMPLETION_STATE_KEYS.length, 4);
  assert.equal(ASS_PAUSE_RESUME_STATE_KEYS.length, 5);
  assert.equal(ASS_CONVERSATION_STATE_REGISTRY_KEYS.length, 10);
  assert.equal(ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable conversation state registries", () => {
  const result = buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantConversationStateRegistry();
  assert.equal(registry.lifecycleStateCount, ASS_LIFECYCLE_STATE_KEYS.length);
  assert.equal(registry.sessionStateCount, ASS_SESSION_STATE_KEYS.length);
  assert.equal(registry.turnStateCount, ASS_TURN_STATE_KEYS.length);
  assert.equal(registry.interactionStateCount, ASS_INTERACTION_STATE_KEYS.length);
  assert.equal(registry.waitingStateCount, ASS_WAITING_STATE_KEYS.length);
  assert.equal(registry.completionStateCount, ASS_COMPLETION_STATE_KEYS.length);
  assert.equal(registry.pauseResumeStateCount, ASS_PAUSE_RESUME_STATE_KEYS.length);
  assert.equal(registry.failureMetadataCount, ASS_FAILURE_METADATA_CODES.length);
  assert.equal(registry.transitionCount, ASS_DECLARATIVE_TRANSITIONS.length);
  assert.equal(registry.snapshotCount, 1);
  for (const state of registry.lifecycleStateRegistry) {
    assert.equal(isExecutiveAssistantStateDefinitionImmutable(state), true);
  }
});

test("validates conversation state architecture after build", () => {
  buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  const validation = validateExecutiveAssistantConversationStateArchitecture();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantConversationStateRegistry();
  assert.equal(validateAllConversationStatesRegistered(registry).valid, true);
  assert.equal(validateTransitionGraphValidity(registry).valid, true);
  assert.equal(validateNoIllegalTransitions(registry).valid, true);
  assert.equal(validateLifecycleCompleteness(registry).valid, true);
  assert.equal(validateFrozenImmutableRecords(registry).valid, true);
  assert.equal(validateNoStateRuntimeOwnership().valid, true);
});

test("generates deterministic state manifest and transition matrix", () => {
  buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  const manifest = getExecutiveAssistantConversationStateManifest();
  assert.equal(manifest.version, "ASS/3");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/1"));
  assert.ok(manifest.compatibility.includes("ASS/2"));
  assert.ok(manifest.compatibility.includes("ASS/3"));
  assert.equal(validateExecutiveAssistantConversationStateManifestRecord(manifest).valid, true);
  const matrix = getExecutiveAssistantTransitionMatrix();
  assert.equal(matrix.length, ASS_DECLARATIVE_TRANSITIONS.length);
  assert.equal(matrix[0].readOnly, true);
  buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  assert.equal(JSON.stringify(manifest), JSON.stringify(getExecutiveAssistantConversationStateManifest()));
  assert.equal(JSON.stringify(matrix), JSON.stringify(getExecutiveAssistantTransitionMatrix()));
});

test("defines failure metadata and pause resume states without runtime execution", () => {
  buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  const registry = getExecutiveAssistantConversationStateRegistry();
  const failure = registry.failureMetadataRegistry.find((entry) => entry.failureCode === "validation_failed");
  assert.ok(failure);
  assert.equal(Object.isFrozen(failure), true);
  assert.equal(failure?.recoverable, true);
  const pauseState = registry.pauseResumeStateRegistry.find((entry) => entry.stateKey === "paused");
  assert.ok(pauseState);
  const snapshot = registry.stateSnapshotRegistry[0];
  assert.equal(snapshot.pauseResumeStateKey, "none");
  assert.equal(snapshot.failureMetadataRef, null);
  for (const transition of registry.transitionContractRegistry) {
    assert.equal(isExecutiveAssistantTransitionContractImmutable(transition), true);
    assert.equal(transition.declarativeOnly, true);
  }
});

test("supports additive snapshot registration", () => {
  buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  const before = getExecutiveAssistantConversationStateRegistry().snapshotCount;
  const registered = registerExecutiveAssistantStateSnapshot(
    Object.freeze({
      snapshotId: "ass-state-snapshot-additive-001",
      conversationIdRef: "ass-conversation-additive-001",
      lifecycleStateKey: "active",
      sessionStateKey: "active",
      turnStateKey: "active",
      interactionStateKey: "processing",
      waitingStateKey: "awaiting_response",
      completionStateKey: null,
      pauseResumeStateKey: null,
      failureMetadataRef: null,
      recordedAt: FIXED_TIME,
      readOnly: true as const,
    })
  );
  assert.equal(registered, true);
  assert.equal(getExecutiveAssistantConversationStateRegistry().snapshotCount, before + 1);
  assert.equal(validateExecutiveAssistantConversationStateArchitecture().valid, true);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
  assert.equal(
    typeof ExecutiveAssistantConversationStatePlatform.buildExecutiveAssistantConversationStateArchitecture,
    "function"
  );
  assert.equal(ExecutiveAssistantConversationStatePlatform.version, "ASS/3");
  assert.ok(ASS_CONVERSATION_STATE_PRINCIPLES.includes("declarative_transitions_no_execution"));
  assert.ok(ASS_CONVERSATION_STATE_MUST_NOT_OWN.includes("state_machine_execution"));
  assert.ok(ASS_CONVERSATION_STATE_MUST_NOT_OWN.includes("memory_mutation"));
});

test("requires ASS/1 and ASS/2 without modifying prior ASS files", async () => {
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
  ];
  for (const file of priorAssFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantConversationStateArchitecture(FIXED_TIME);
    validateExecutiveAssistantConversationStateArchitecture();
    getExecutiveAssistantConversationStateManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement runtime chat LLM async or websocket transport", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantConversationStateContracts.ts",
    "executiveAssistantConversationStateTypes.ts",
    "executiveAssistantConversationStateRegistry.ts",
    "executiveAssistantConversationStateValidation.ts",
    "executiveAssistantConversationStateManifest.ts",
    "executiveAssistantConversationStateExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("setTimeout("), false, `${file} must not use timers`);
    assert.equal(source.includes("WebSocket"), false, `${file} must not use websockets`);
    assert.equal(source.includes("setInterval("), false, `${file} must not use timers`);
  }
});
