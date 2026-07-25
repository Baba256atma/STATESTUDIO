import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationValidation } from "./assistantConversationValidation.ts";

const files = [
  "assistantConversationValidation.constants.ts",
  "assistantConversationValidation.gates.ts",
  "assistantConversationValidation.identity.ts",
  "assistantConversationValidation.results.ts",
  "assistantConversationValidation.rules.ts",
  "assistantConversationValidation.test.ts",
  "assistantConversationValidation.ts",
  "assistantConversationValidation.types.ts",
];

test("ASSISTANT-1:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:4 publishes canonical Validation identity", () => {
  const validation = AssistantConversationValidation;
  assert.equal(
    validation.identity.id,
    "ASSISTANT-1:4/ConversationValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.assistant.conversation.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.status, "Validation");
  assert.equal(validation.readiness, "ReadyForManifest");
});

test("ASSISTANT-1:4 publishes exactly 40 rules and 16 gates", () => {
  const validation = AssistantConversationValidation;
  assert.equal(validation.rules.length, 40);
  assert.equal(validation.gates.length, 16);
  assert.equal(validation.categories.length, 8);
  assert.equal(validation.results.ruleCount, 40);
  assert.equal(validation.results.gateCount, 16);
});

test("ASSISTANT-1:4 identities and metadata are immutable", () => {
  const validation = AssistantConversationValidation;
  assert.equal(
    new Set(validation.rules.map(({ ruleId }) => ruleId)).size,
    40,
  );
  assert.equal(
    new Set(validation.gates.map(({ gateId }) => gateId)).size,
    16,
  );
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(validation.gates.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(validation), true);
});

test("ASSISTANT-1:4 consumes Model only and has no execution", () => {
  const validation = AssistantConversationValidation;
  const source = readFileSync(
    new URL("./assistantConversationValidation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationRegistry"), false);
  assert.equal(source.includes("assistantConversationManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "ASSISTANT-1:3 Conversation Model",
  ]);
  assert.equal(validation.executableValidation, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.networking, false);
});
