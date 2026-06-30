import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import {
  ASS_CONVERSATION_CONTRACT_VERSION,
  ASS_CONVERSATION_FOUNDATION_DEPENDENCY,
  ASS_CONVERSATION_MUST_NOT_OWN,
  ASS_CONVERSATION_PRINCIPLES,
  ASS_CONVERSATION_PUBLIC_API_REGISTRY,
  ASS_CONVERSATION_REGISTRY_KEYS,
  ASS_MESSAGE_KIND_KEYS,
  ASS_PARTICIPANT_ROLE_KEYS,
  ASS_SESSION_MANDATORY_FIELDS,
  ASS_TURN_MANDATORY_FIELDS,
} from "./executiveAssistantConversationContracts.ts";
import {
  ExecutiveAssistantConversationPlatform,
  buildExecutiveAssistantConversationContracts,
  getExecutiveAssistantConversationManifest,
  getExecutiveAssistantConversationRegistry,
  resetExecutiveAssistantConversationLayerForTests,
  validateExecutiveAssistantConversationContracts,
} from "./executiveAssistantConversationExports.ts";
import {
  createStableConversationId,
  createStableMessageId,
  createStableScopeBindingId,
  createStableSessionId,
  createStableTurnId,
  isExecutiveAssistantConversationIdentityImmutable,
  isExecutiveAssistantMessageContractImmutable,
  isExecutiveAssistantMessageKindKey,
  isExecutiveAssistantParticipantRoleKey,
  isExecutiveAssistantTurnContractImmutable,
  registerExecutiveAssistantConversationIdentity,
  registerExecutiveAssistantMessageContract,
  registerExecutiveAssistantScopeBinding,
  registerExecutiveAssistantSessionContract,
  registerExecutiveAssistantTurnContract,
} from "./executiveAssistantConversationRegistry.ts";
import {
  validateConversationContractsComplete,
  validateConversationScopes,
  validateExecutiveAssistantConversationManifestRecord,
  validateMessageTurnImmutability,
  validateNoRuntimeOwnership,
  validateParticipantRoles,
} from "./executiveAssistantConversationValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantConversationLayerForTests();
  resetExecutiveAssistantPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllAssLayersForTests();
});

test("exports ASS/2 conversation contract vocabulary", () => {
  assert.equal(ASS_CONVERSATION_CONTRACT_VERSION, "ASS/2");
  assert.equal(ASS_CONVERSATION_FOUNDATION_DEPENDENCY, "ASS/1");
  assert.equal(ASS_PARTICIPANT_ROLE_KEYS.length, 4);
  assert.equal(ASS_MESSAGE_KIND_KEYS.length, 3);
  assert.equal(ASS_CONVERSATION_REGISTRY_KEYS.length, 6);
  assert.equal(ASS_CONVERSATION_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable conversation registries", () => {
  const result = buildExecutiveAssistantConversationContracts(FIXED_TIME);
  assert.equal(result.success, true);
  const registry = getExecutiveAssistantConversationRegistry();
  assert.equal(registry.roleCount, ASS_PARTICIPANT_ROLE_KEYS.length);
  assert.equal(registry.identityCount, 1);
  assert.equal(registry.sessionCount, 1);
  assert.equal(registry.turnCount, 1);
  assert.equal(registry.messageCount, 2);
  assert.equal(registry.scopeBindingCount, 1);
  for (const role of registry.participantRoleRegistry) {
    assert.equal(role.readOnly, true);
    assert.equal(Object.isFrozen(role), true);
  }
});

test("validates conversation contracts after build", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  const validation = validateExecutiveAssistantConversationContracts();
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  const registry = getExecutiveAssistantConversationRegistry();
  assert.equal(validateConversationContractsComplete(registry).valid, true);
  assert.equal(validateParticipantRoles(registry).valid, true);
  assert.equal(validateConversationScopes(registry).valid, true);
  assert.equal(validateMessageTurnImmutability(registry).valid, true);
  assert.equal(validateNoRuntimeOwnership().valid, true);
});

test("generates deterministic conversation manifest", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  const manifest = getExecutiveAssistantConversationManifest();
  assert.equal(manifest.version, "ASS/2");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("ASS/1"));
  assert.ok(manifest.compatibility.includes("ASS/2"));
  assert.equal(manifest.registryKeys.length, ASS_CONVERSATION_REGISTRY_KEYS.length);
  assert.equal(validateExecutiveAssistantConversationManifestRecord(manifest).valid, true);
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  const manifestAgain = getExecutiveAssistantConversationManifest();
  assert.equal(JSON.stringify(manifest), JSON.stringify(manifestAgain));
});

test("defines immutable message and turn contracts with placeholder metadata", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  const registry = getExecutiveAssistantConversationRegistry();
  const turn = registry.turnContractRegistry[0];
  assert.equal(turn.turnStatus, "placeholder");
  assert.equal(turn.intentMetadata.intentPlaceholder, "pending");
  assert.equal(turn.responseMetadata.responsePlaceholder, "pending");
  assert.equal(turn.routingMetadata.routingPlaceholder, "pending");
  assert.equal(Object.isFrozen(turn.intentMetadata), true);
  assert.equal(Object.isFrozen(turn.responseMetadata), true);
  assert.equal(Object.isFrozen(turn.routingMetadata), true);
  assert.equal(isExecutiveAssistantTurnContractImmutable(turn), true);
  for (const message of registry.messageContractRegistry) {
    assert.equal(isExecutiveAssistantMessageContractImmutable(message), true);
    assert.equal(Object.isFrozen(message), true);
  }
  for (const field of ASS_TURN_MANDATORY_FIELDS) {
    assert.ok(field in turn);
  }
  for (const message of registry.messageContractRegistry) {
    for (const field of ["messageId", "sessionId", "turnId", "messageKind", "participantRole", "contentRef", "createdAt", "readOnly"]) {
      assert.ok(field in message);
    }
  }
  for (const session of registry.sessionContractRegistry) {
    for (const field of ASS_SESSION_MANDATORY_FIELDS) {
      assert.ok(field in session);
    }
  }
});

test("validates participant roles and scope keys", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  assert.equal(isExecutiveAssistantParticipantRoleKey("executive"), true);
  assert.equal(isExecutiveAssistantParticipantRoleKey("observer"), true);
  assert.equal(isExecutiveAssistantParticipantRoleKey("invalid"), false);
  assert.equal(isExecutiveAssistantMessageKindKey("user_input"), true);
  assert.equal(isExecutiveAssistantMessageKindKey("invalid"), false);
});

test("supports additive registration without mutating existing contracts", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  const before = getExecutiveAssistantConversationRegistry();
  const conversationId = createStableConversationId("additive-001");
  const bindingId = createStableScopeBindingId(conversationId);
  const sessionId = createStableSessionId(conversationId);
  const turnId = createStableTurnId(sessionId, 0);
  assert.equal(
    registerExecutiveAssistantConversationIdentity({ conversationId, scopeKey: "workspace" }, FIXED_TIME).success,
    true
  );
  assert.equal(
    registerExecutiveAssistantScopeBinding(bindingId, conversationId, "workspace", "scope-ref-001", FIXED_TIME).success,
    true
  );
  assert.equal(
    registerExecutiveAssistantSessionContract(sessionId, conversationId, "active", bindingId, FIXED_TIME).success,
    true
  );
  assert.equal(
    registerExecutiveAssistantTurnContract(
      turnId,
      sessionId,
      0,
      "pending",
      Object.freeze({ intentPlaceholder: "registered" }),
      Object.freeze({ responsePlaceholder: "registered" }),
      Object.freeze({ routingPlaceholder: "registered" }),
      FIXED_TIME
    ).success,
    true
  );
  assert.equal(
    registerExecutiveAssistantMessageContract(
      createStableMessageId(turnId, "user_input"),
      sessionId,
      turnId,
      "user_input",
      "executive",
      "content-ref-additive",
      FIXED_TIME
    ).success,
    true
  );
  const after = getExecutiveAssistantConversationRegistry();
  assert.equal(after.identityCount, before.identityCount + 1);
  assert.equal(after.sessionCount, before.sessionCount + 1);
  assert.equal(validateExecutiveAssistantConversationContracts().valid, true);
});

test("exposes stable public exports and facade", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  assert.equal(typeof ExecutiveAssistantConversationPlatform.buildExecutiveAssistantConversationContracts, "function");
  assert.equal(ExecutiveAssistantConversationPlatform.version, "ASS/2");
  assert.ok(ASS_CONVERSATION_PRINCIPLES.includes("intent_response_routing_placeholders_only"));
  assert.ok(ASS_CONVERSATION_MUST_NOT_OWN.includes("chat_runtime"));
  assert.ok(ASS_CONVERSATION_MUST_NOT_OWN.includes("memory_mutation"));
});

test("requires ASS/1 foundation without modifying ASS/1 files", async () => {
  const { readFile } = await import("node:fs/promises");
  const ass1Files = [
    "executiveAssistantPlatformContracts.ts",
    "executiveAssistantPlatformTypes.ts",
    "executiveAssistantPlatformRegistry.ts",
    "executiveAssistantPlatformValidation.ts",
    "executiveAssistantPlatformManifest.ts",
    "executiveAssistantPlatformExports.ts",
    "executiveAssistantPlatform.test.ts",
  ];
  for (const file of ass1Files) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildExecutiveAssistantConversationContracts(FIXED_TIME);
    validateExecutiveAssistantConversationContracts();
    getExecutiveAssistantConversationManifest();
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement chat runtime LLM execution or memory mutation", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantConversationContracts.ts",
    "executiveAssistantConversationTypes.ts",
    "executiveAssistantConversationRegistry.ts",
    "executiveAssistantConversationValidation.ts",
    "executiveAssistantConversationManifest.ts",
    "executiveAssistantConversationExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("LlmPlatform"), false, `${file} must not import LLM platform`);
    assert.equal(/\bfetch\s*\(/.test(source), false, `${file} must not call providers`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("executeTool("), false, `${file} must not execute tools`);
  }
});

test("conversation identity records are immutable", () => {
  buildExecutiveAssistantConversationContracts(FIXED_TIME);
  const identity = getExecutiveAssistantConversationRegistry().conversationIdentityRegistry[0];
  assert.equal(isExecutiveAssistantConversationIdentityImmutable(identity), true);
  assert.throws(() => {
    (identity as { conversationId: string }).conversationId = "mutated";
  });
});
