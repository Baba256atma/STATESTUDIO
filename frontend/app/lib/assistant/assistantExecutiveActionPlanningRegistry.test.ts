import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveActionPlanningRegistry } from "./assistantExecutiveActionPlanningRegistry.ts";

const files = [
  "assistantExecutiveActionPlanningRegistry.collections.ts",
  "assistantExecutiveActionPlanningRegistry.constants.ts",
  "assistantExecutiveActionPlanningRegistry.entries.ts",
  "assistantExecutiveActionPlanningRegistry.identity.ts",
  "assistantExecutiveActionPlanningRegistry.metadata.ts",
  "assistantExecutiveActionPlanningRegistry.test.ts",
  "assistantExecutiveActionPlanningRegistry.ts",
  "assistantExecutiveActionPlanningRegistry.types.ts",
];

test("ASSISTANT-7:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:2 publishes canonical Registry identity", () => {
  const registry = AssistantExecutiveActionPlanningRegistry;
  assert.equal(
    registry.identity.id,
    "ASSISTANT-7:2/ExecutiveActionPlanningRegistry",
  );
  assert.equal(
    registry.identity.namespace,
    "nexora.assistant.executive-action-planning.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(
    registry.identity.sourceFoundation,
    "ASSISTANT-7:1/ExecutiveActionPlanningFoundation",
  );
});

test("ASSISTANT-7:2 publishes exactly ten complete collections", () => {
  const registry = AssistantExecutiveActionPlanningRegistry;
  assert.equal(Object.keys(registry.collections).length, 10);
  assert.equal(registry.constants.collectionCount, 10);
  assert.equal(registry.statistics.collectionCount, 10);
  assert.equal(registry.statistics.categoryCount, 10);
  assert.equal(registry.statistics.metadataCount, 8);
  assert.equal(registry.entries.length, registry.constants.entryCount);
  assert.equal(registry.statistics.entryCount, registry.entries.length);
  assert.equal(registry.entries.length, 89);
  assert.deepEqual(Object.keys(registry.collections), [
    "actionPlanTypes",
    "plannedActionTypes",
    "actionStates",
    "actionPriorityLevels",
    "timeHorizonTypes",
    "dependencyTypes",
    "ownershipReferenceTypes",
    "planningPolicies",
    "planningLifecycleStates",
    "planningTags",
  ]);
  assert.equal(registry.canonicalInventoryRuleSatisfied, true);
});

test("ASSISTANT-7:2 entries are unique, stable, ordered, and immutable", () => {
  const registry = AssistantExecutiveActionPlanningRegistry;
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

test("ASSISTANT-7:2 consumes Foundation only and has no prohibited behavior", () => {
  const registry = AssistantExecutiveActionPlanningRegistry;
  const source = readFileSync(
    new URL(
      "./assistantExecutiveActionPlanningRegistry.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveActionPlanningRegistry.collections.ts",
    "./assistantExecutiveActionPlanningRegistry.constants.ts",
    "./assistantExecutiveActionPlanningRegistry.entries.ts",
    "./assistantExecutiveActionPlanningRegistry.identity.ts",
    "./assistantExecutiveActionPlanningRegistry.metadata.ts",
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningModel"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagement"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestration"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-7:1 Executive Action Planning Foundation",
  ]);
  assert.equal(
    registry.metadata.sourceFoundation.identity.id,
    "ASSISTANT-7:1/ExecutiveActionPlanningFoundation",
  );
  assert.equal(registry.runtime, false);
  assert.equal(registry.executionLogic, false);
  assert.equal(registry.planningEngine, false);
  assert.equal(registry.taskExecution, false);
  assert.equal(registry.scheduling, false);
  assert.equal(registry.assignment, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
});
