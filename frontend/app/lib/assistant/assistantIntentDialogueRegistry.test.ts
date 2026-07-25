import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantIntentDialogueRegistry } from "./assistantIntentDialogueRegistry.ts";

const files = [
  "assistantIntentDialogueRegistry.collections.ts",
  "assistantIntentDialogueRegistry.constants.ts",
  "assistantIntentDialogueRegistry.entries.ts",
  "assistantIntentDialogueRegistry.identity.ts",
  "assistantIntentDialogueRegistry.metadata.ts",
  "assistantIntentDialogueRegistry.test.ts",
  "assistantIntentDialogueRegistry.ts",
  "assistantIntentDialogueRegistry.types.ts",
];

test("ASSISTANT-3:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:2 publishes canonical Registry identity", () => {
  const registry = AssistantIntentDialogueRegistry;
  assert.equal(
    registry.identity.id,
    "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry",
  );
  assert.equal(
    registry.identity.namespace,
    "nexora.assistant.intent-dialogue.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(
    registry.identity.sourceFoundation,
    "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation",
  );
});

test("ASSISTANT-3:2 publishes exactly ten complete collections", () => {
  const registry = AssistantIntentDialogueRegistry;
  assert.equal(Object.keys(registry.collections).length, 10);
  assert.equal(registry.constants.collectionCount, 10);
  assert.equal(registry.statistics.collectionCount, 10);
  assert.equal(registry.statistics.categoryCount, 10);
  assert.equal(registry.statistics.metadataCount, 8);
  assert.equal(registry.entries.length, registry.constants.entryCount);
  assert.equal(registry.statistics.entryCount, registry.entries.length);
  assert.equal(registry.entries.length, 84);
  assert.deepEqual(Object.keys(registry.collections), [
    "executiveIntentTypes",
    "dialogueTypes",
    "dialogueStates",
    "dialogueTurnTypes",
    "executiveIntentPriorities",
    "executiveIntentOutcomes",
    "clarificationTypes",
    "dialoguePolicies",
    "dialogueLifecycleStates",
    "dialogueTags",
  ]);
});

test("ASSISTANT-3:2 entries are unique, stable, ordered, and immutable", () => {
  const registry = AssistantIntentDialogueRegistry;
  const entries = registry.entries;
  assert.equal(
    new Set(entries.map(({ identifier }) => identifier)).size,
    entries.length,
  );
  assert.equal(entries.every(Object.isFrozen), true);
  assert.equal(entries.every(({ version }) => version === "1.0.0"), true);
  assert.equal(Object.isFrozen(registry.collections), true);
  for (const collection of Object.values(registry.collections)) {
    assert.deepEqual(
      collection.map(({ order }) => order),
      collection.map((_, index) => index + 1),
    );
  }
});

test("ASSISTANT-3:2 consumes Foundation only and has no prohibited behavior", () => {
  const registry = AssistantIntentDialogueRegistry;
  const source = readFileSync(
    new URL("./assistantIntentDialogueRegistry.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantIntentDialogueRegistry.collections.ts",
    "./assistantIntentDialogueRegistry.constants.ts",
    "./assistantIntentDialogueRegistry.entries.ts",
    "./assistantIntentDialogueRegistry.identity.ts",
    "./assistantIntentDialogueRegistry.metadata.ts",
  ]);
  assert.equal(source.includes("assistantIntentDialogueModel"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-3:1 Intent & Dialogue Understanding Foundation",
  ]);
  assert.equal(
    registry.metadata.sourceFoundation.identity.id,
    "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation",
  );
  assert.equal(registry.runtime, false);
  assert.equal(registry.executionLogic, false);
  assert.equal(registry.intentClassification, false);
  assert.equal(registry.nlp, false);
  assert.equal(registry.naturalLanguageParsing, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
});
