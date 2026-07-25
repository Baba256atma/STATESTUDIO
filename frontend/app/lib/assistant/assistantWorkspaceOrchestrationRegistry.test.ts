import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationRegistry } from "./assistantWorkspaceOrchestrationRegistry.ts";

const files = [
  "assistantWorkspaceOrchestrationRegistry.collections.ts",
  "assistantWorkspaceOrchestrationRegistry.constants.ts",
  "assistantWorkspaceOrchestrationRegistry.entries.ts",
  "assistantWorkspaceOrchestrationRegistry.identity.ts",
  "assistantWorkspaceOrchestrationRegistry.metadata.ts",
  "assistantWorkspaceOrchestrationRegistry.test.ts",
  "assistantWorkspaceOrchestrationRegistry.ts",
  "assistantWorkspaceOrchestrationRegistry.types.ts",
];

test("ASSISTANT-5:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:2 publishes canonical Registry identity", () => {
  const registry = AssistantWorkspaceOrchestrationRegistry;
  assert.equal(
    registry.identity.id,
    "ASSISTANT-5:2/WorkspaceOrchestrationRegistry",
  );
  assert.equal(
    registry.identity.namespace,
    "nexora.assistant.workspace-orchestration.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(
    registry.identity.sourceFoundation,
    "ASSISTANT-5:1/WorkspaceOrchestrationFoundation",
  );
});

test("ASSISTANT-5:2 publishes exactly ten complete collections", () => {
  const registry = AssistantWorkspaceOrchestrationRegistry;
  assert.equal(Object.keys(registry.collections).length, 10);
  assert.equal(registry.constants.collectionCount, 10);
  assert.equal(registry.statistics.collectionCount, 10);
  assert.equal(registry.statistics.categoryCount, 10);
  assert.equal(registry.statistics.metadataCount, 8);
  assert.equal(registry.entries.length, registry.constants.entryCount);
  assert.equal(registry.statistics.entryCount, registry.entries.length);
  assert.equal(registry.entries.length, 86);
  assert.deepEqual(Object.keys(registry.collections), [
    "workspaceTypes",
    "workspaceStates",
    "workspaceTransitionTypes",
    "workspaceSessionTypes",
    "workspacePriorities",
    "workspaceOutcomes",
    "workspaceCoordinationStrategies",
    "workspacePolicies",
    "workspaceLifecycleStates",
    "workspaceTags",
  ]);
});

test("ASSISTANT-5:2 entries are unique, stable, ordered, and immutable", () => {
  const registry = AssistantWorkspaceOrchestrationRegistry;
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

test("ASSISTANT-5:2 consumes Foundation only and has no prohibited behavior", () => {
  const registry = AssistantWorkspaceOrchestrationRegistry;
  const source = readFileSync(
    new URL("./assistantWorkspaceOrchestrationRegistry.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationRegistry.collections.ts",
    "./assistantWorkspaceOrchestrationRegistry.constants.ts",
    "./assistantWorkspaceOrchestrationRegistry.entries.ts",
    "./assistantWorkspaceOrchestrationRegistry.identity.ts",
    "./assistantWorkspaceOrchestrationRegistry.metadata.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationModel"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-5:1 Workspace Orchestration Foundation",
  ]);
  assert.equal(
    registry.metadata.sourceFoundation.identity.id,
    "ASSISTANT-5:1/WorkspaceOrchestrationFoundation",
  );
  assert.equal(registry.runtime, false);
  assert.equal(registry.executionLogic, false);
  assert.equal(registry.workspaceExecution, false);
  assert.equal(registry.workspaceRouting, false);
  assert.equal(registry.scheduling, false);
  assert.equal(registry.orchestrationEngine, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
});
