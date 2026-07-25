import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationFoundation } from "./assistantConversationFoundation.ts";

const files = [
  "assistantConversationFoundation.boundaries.ts",
  "assistantConversationFoundation.capabilities.ts",
  "assistantConversationFoundation.constants.ts",
  "assistantConversationFoundation.contracts.ts",
  "assistantConversationFoundation.identity.ts",
  "assistantConversationFoundation.test.ts",
  "assistantConversationFoundation.ts",
  "assistantConversationFoundation.types.ts",
];

test("ASSISTANT-1:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantConversationFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-1:1/ConversationFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.conversation.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
});

test("ASSISTANT-1:1 declares complete contracts and capabilities", () => {
  const foundation = AssistantConversationFoundation;
  assert.equal(foundation.contracts.length, 8);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.responsibilities.length, 12);
  assert.equal(
    foundation.contracts.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    foundation.capabilities.every(({ implemented }) => !implemented),
    true,
  );
});

test("ASSISTANT-1:1 metadata is immutable and identities are unique", () => {
  const foundation = AssistantConversationFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("ASSISTANT-1:1 has no prohibited dependencies or behavior", () => {
  const foundation = AssistantConversationFoundation;
  const source = readFileSync(
    new URL("./assistantConversationFoundation.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(
    imports.every((value) =>
      value.includes("./assistantConversationFoundation.")),
    true,
  );
  assert.equal(foundation.upstreamDependencies.length, 0);
  assert.equal(foundation.boundaries.length, 28);
  assert.equal(foundation.boundaries.every(({ permitted }) => !permitted), true);
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
});
