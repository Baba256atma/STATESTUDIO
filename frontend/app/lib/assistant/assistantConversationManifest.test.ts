import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationManifest } from "./assistantConversationManifest.ts";

const files = [
  "assistantConversationManifest.constants.ts",
  "assistantConversationManifest.identity.ts",
  "assistantConversationManifest.inventory.ts",
  "assistantConversationManifest.metadata.ts",
  "assistantConversationManifest.summary.ts",
  "assistantConversationManifest.test.ts",
  "assistantConversationManifest.ts",
  "assistantConversationManifest.types.ts",
];

test("ASSISTANT-1:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:5 publishes canonical Manifest identity", () => {
  const manifest = AssistantConversationManifest;
  assert.equal(manifest.identity.id, "ASSISTANT-1:5/ConversationManifest");
  assert.equal(
    manifest.identity.namespace,
    "nexora.assistant.conversation.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.status, "Manifest");
  assert.equal(manifest.readinessStatus, "ReadyForPlatform");
});

test("ASSISTANT-1:5 preserves Validation-derived inventories", () => {
  const manifest = AssistantConversationManifest;
  assert.equal(
    manifest.inventory.modelInventory,
    manifest.validation.model.domainModels,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    manifest.validation.model.relationships,
  );
  assert.equal(
    manifest.inventory.validationInventory.rules,
    manifest.validation.rules,
  );
  assert.equal(manifest.inventory.reconstructedInventories, false);
  assert.equal(manifest.inventory.recalculatedMetadata, false);
});

test("ASSISTANT-1:5 inventory and compatibility metadata are complete", () => {
  const manifest = AssistantConversationManifest;
  assert.equal(manifest.summary.publishedInventoryCount, 9);
  assert.equal(manifest.summary.validationRuleCount, 40);
  assert.equal(manifest.summary.validationGateCount, 16);
  assert.equal(manifest.compatibility.platformCompatible, true);
  assert.equal(manifest.compatibility.certificationCompatible, true);
  assert.equal(manifest.compatibility.freezeCompatible, true);
  assert.equal(manifest.compatibility.publicIndexCompatible, true);
  assert.equal(Object.isFrozen(manifest.inventory), true);
});

test("ASSISTANT-1:5 consumes Validation only and has no runtime", () => {
  const manifest = AssistantConversationManifest;
  const source = readFileSync(
    new URL("./assistantConversationManifest.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationModel"), false);
  assert.equal(source.includes("assistantConversationRegistry"), false);
  assert.equal(source.includes("assistantConversationPlatform"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "ASSISTANT-1:4 Conversation Validation",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.executableLogic, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
});
