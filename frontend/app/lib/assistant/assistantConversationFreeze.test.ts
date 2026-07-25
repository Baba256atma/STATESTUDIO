import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationFreeze } from "./assistantConversationFreeze.ts";

const files = [
  "assistantConversationFreeze.baselines.ts",
  "assistantConversationFreeze.compatibility.ts",
  "assistantConversationFreeze.constants.ts",
  "assistantConversationFreeze.identity.ts",
  "assistantConversationFreeze.lock.ts",
  "assistantConversationFreeze.test.ts",
  "assistantConversationFreeze.ts",
  "assistantConversationFreeze.types.ts",
];

test("ASSISTANT-1:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantConversationFreeze;
  assert.equal(freeze.identity.id, "ASSISTANT-1:8/ConversationFreeze");
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.conversation.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-1:8 publishes permanent lock identifier", () => {
  const freeze = AssistantConversationFreeze;
  assert.equal(freeze.lock.lockIdentifier, "ASSISTANT-1-CONVERSATION-LOCKED");
  assert.equal(freeze.identity.lockIdentifier, "ASSISTANT-1-CONVERSATION-LOCKED");
  assert.equal(freeze.constants.lockIdentifier, "ASSISTANT-1-CONVERSATION-LOCKED");
  assert.equal(freeze.metadata.lockIdentifier, "ASSISTANT-1-CONVERSATION-LOCKED");
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-1:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantConversationFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.compatibility.length, 8);
  assert.equal(freeze.architecturalLocks.length, 12);
  assert.equal(freeze.architectureRegistry.length, 7);
  assert.equal(freeze.constants.baselineCount, 8);
  assert.equal(freeze.constants.compatibilityCount, 8);
  assert.equal(freeze.constants.lockCount, 12);
  assert.equal(freeze.constants.registryEntryCount, 7);
  assert.equal(freeze.metadata.baselineCount, 8);
  assert.equal(freeze.metadata.compatibilityCount, 8);
  assert.equal(freeze.metadata.lockCount, 12);
  assert.equal(freeze.metadata.registryEntryCount, 7);
});

test("ASSISTANT-1:8 identities and metadata are immutable", () => {
  const freeze = AssistantConversationFreeze;
  assert.equal(
    new Set(freeze.baselines.map(({ baselineId }) => baselineId)).size,
    8,
  );
  assert.equal(
    new Set(freeze.compatibility.map(({ id }) => id)).size,
    8,
  );
  assert.equal(
    new Set(freeze.architecturalLocks.map(({ lockId }) => lockId)).size,
    12,
  );
  assert.equal(
    new Set(freeze.architectureRegistry.map(({ entryId }) => entryId)).size,
    7,
  );
  assert.equal(freeze.baselines.every(Object.isFrozen), true);
  assert.equal(freeze.compatibility.every(Object.isFrozen), true);
  assert.equal(freeze.architecturalLocks.every(Object.isFrozen), true);
  assert.equal(freeze.architectureRegistry.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.lock), true);
  assert.equal(Object.isFrozen(freeze.metadata), true);
});

test("ASSISTANT-1:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantConversationFreeze;
  const source = readFileSync(
    new URL("./assistantConversationFreeze.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationPlatform"), false);
  assert.equal(source.includes("assistantConversationManifest"), false);
  assert.equal(source.includes("assistantConversationValidation"), false);
  assert.equal(source.includes("assistantConversationModel"), false);
  assert.equal(source.includes("assistantConversationRegistry"), false);
  assert.equal(source.includes("assistantConversationFoundation"), false);
  assert.equal(source.includes("assistantConversationPublicIndex"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-1:7 Conversation Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-1:7/ConversationCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-1:7/ConversationCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-1:8 export integrity remains metadata-only", () => {
  const freeze = AssistantConversationFreeze;
  assert.deepEqual(freeze.publicApiSurface, ["AssistantConversationFreeze"]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-1:9 — Conversation Public Index",
  );
});
