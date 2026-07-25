import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationRegistry } from "./assistantConversationRegistry.ts";

const files = [
  "assistantConversationRegistry.collections.ts",
  "assistantConversationRegistry.constants.ts",
  "assistantConversationRegistry.entries.ts",
  "assistantConversationRegistry.identity.ts",
  "assistantConversationRegistry.metadata.ts",
  "assistantConversationRegistry.test.ts",
  "assistantConversationRegistry.ts",
  "assistantConversationRegistry.types.ts",
];

test("ASSISTANT-1:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:2 publishes canonical Registry identity", () => {
  const registry = AssistantConversationRegistry;
  assert.equal(registry.identity.id, "ASSISTANT-1:2/ConversationRegistry");
  assert.equal(
    registry.identity.namespace,
    "nexora.assistant.conversation.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
});

test("ASSISTANT-1:2 publishes eight complete collections", () => {
  const registry = AssistantConversationRegistry;
  assert.equal(Object.keys(registry.collections).length, 8);
  assert.equal(registry.entries.length, 72);
  assert.equal(registry.constants.collectionCount, 8);
  assert.equal(registry.constants.entryCount, 72);
});

test("ASSISTANT-1:2 entries are unique, stable, and immutable", () => {
  const entries = AssistantConversationRegistry.entries;
  assert.equal(
    new Set(entries.map(({ identifier }) => identifier)).size,
    entries.length,
  );
  assert.equal(entries.every(Object.isFrozen), true);
  assert.equal(entries.every(({ version }) => version === "1.0.0"), true);
  assert.equal(Object.isFrozen(AssistantConversationRegistry.collections), true);
});

test("ASSISTANT-1:2 consumes Foundation only and has no runtime", () => {
  const registry = AssistantConversationRegistry;
  const source = readFileSync(
    new URL("./assistantConversationRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationModel"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-1:1 Conversation Foundation",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.executionLogic, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
});
