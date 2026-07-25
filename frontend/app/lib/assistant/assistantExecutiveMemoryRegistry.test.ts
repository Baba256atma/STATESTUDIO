import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryRegistry } from "./assistantExecutiveMemoryRegistry.ts";

const files = [
  "assistantExecutiveMemoryRegistry.collections.ts",
  "assistantExecutiveMemoryRegistry.constants.ts",
  "assistantExecutiveMemoryRegistry.entries.ts",
  "assistantExecutiveMemoryRegistry.identity.ts",
  "assistantExecutiveMemoryRegistry.metadata.ts",
  "assistantExecutiveMemoryRegistry.test.ts",
  "assistantExecutiveMemoryRegistry.ts",
  "assistantExecutiveMemoryRegistry.types.ts",
];

test("ASSISTANT-2:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:2 publishes canonical Registry identity", () => {
  const registry = AssistantExecutiveMemoryRegistry;
  assert.equal(
    registry.identity.id,
    "ASSISTANT-2:2/ExecutiveMemoryRegistry",
  );
  assert.equal(
    registry.identity.namespace,
    "nexora.assistant.executive-memory.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(
    registry.identity.sourceFoundation,
    "ASSISTANT-2:1/ExecutiveMemoryFoundation",
  );
});

test("ASSISTANT-2:2 publishes exactly ten complete collections", () => {
  const registry = AssistantExecutiveMemoryRegistry;
  assert.equal(Object.keys(registry.collections).length, 10);
  assert.equal(registry.constants.collectionCount, 10);
  assert.equal(registry.statistics.collectionCount, 10);
  assert.equal(registry.statistics.categoryCount, 10);
  assert.equal(registry.statistics.metadataCount, 8);
  assert.equal(registry.entries.length, registry.constants.entryCount);
  assert.equal(registry.statistics.entryCount, registry.entries.length);
  assert.deepEqual(Object.keys(registry.collections), [
    "memoryTypes",
    "memoryScopes",
    "memoryStates",
    "memoryContextTypes",
    "memoryReferenceTypes",
    "memoryLifecycleStates",
    "memoryPolicies",
    "memoryPriorities",
    "memoryOutcomes",
    "memoryTags",
  ]);
});

test("ASSISTANT-2:2 entries are unique, stable, ordered, and immutable", () => {
  const registry = AssistantExecutiveMemoryRegistry;
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

test("ASSISTANT-2:2 consumes Foundation only and has no prohibited behavior", () => {
  const registry = AssistantExecutiveMemoryRegistry;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryRegistry.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryRegistry.collections.ts",
    "./assistantExecutiveMemoryRegistry.constants.ts",
    "./assistantExecutiveMemoryRegistry.entries.ts",
    "./assistantExecutiveMemoryRegistry.identity.ts",
    "./assistantExecutiveMemoryRegistry.metadata.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryModel"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.equal(source.includes("executiveMemory/"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-2:1 Executive Memory Foundation",
  ]);
  assert.equal(
    registry.metadata.sourceFoundation.identity.id,
    "ASSISTANT-2:1/ExecutiveMemoryFoundation",
  );
  assert.equal(registry.runtime, false);
  assert.equal(registry.executionLogic, false);
  assert.equal(registry.memoryPersistence, false);
  assert.equal(registry.vectorDatabase, false);
  assert.equal(registry.embeddings, false);
  assert.equal(registry.retrieval, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
});
