import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationPlatform } from "./assistantConversationPlatform.ts";

const files = [
  "assistantConversationPlatform.capabilities.ts",
  "assistantConversationPlatform.compatibility.ts",
  "assistantConversationPlatform.constants.ts",
  "assistantConversationPlatform.guarantees.ts",
  "assistantConversationPlatform.identity.ts",
  "assistantConversationPlatform.test.ts",
  "assistantConversationPlatform.ts",
  "assistantConversationPlatform.types.ts",
];

test("ASSISTANT-1:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:6 publishes canonical Platform identity", () => {
  const platform = AssistantConversationPlatform;
  assert.equal(platform.identity.id, "ASSISTANT-1:6/ConversationPlatform");
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.conversation.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.status, "Platform");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
});

test("ASSISTANT-1:6 publishes exact immutable declarations", () => {
  const platform = AssistantConversationPlatform;
  assert.equal(platform.capabilities.length, 12);
  assert.equal(platform.guarantees.length, 18);
  assert.equal(platform.compatibility.length, 12);
  assert.equal(platform.capabilities.every(Object.isFrozen), true);
  assert.equal(platform.guarantees.every(Object.isFrozen), true);
  assert.equal(platform.compatibility.every(Object.isFrozen), true);
});

test("ASSISTANT-1:6 preserves canonical Manifest composition", () => {
  const platform = AssistantConversationPlatform;
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(
    platform.composition.model,
    platform.manifest.inventory.modelInventory,
  );
  assert.equal(
    platform.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.equal(Object.isFrozen(platform), true);
});

test("ASSISTANT-1:6 consumes Manifest only and has no runtime", () => {
  const platform = AssistantConversationPlatform;
  const source = readFileSync(
    new URL("./assistantConversationPlatform.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationValidation"), false);
  assert.equal(source.includes("assistantConversationModel"), false);
  assert.equal(source.includes("assistantConversationCertification"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-1:5 Conversation Manifest",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableLogic, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
});
