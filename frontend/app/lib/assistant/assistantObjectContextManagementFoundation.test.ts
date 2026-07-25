import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantObjectContextManagementFoundation } from "./assistantObjectContextManagementFoundation.ts";

const files = [
  "assistantObjectContextManagementFoundation.boundaries.ts",
  "assistantObjectContextManagementFoundation.capabilities.ts",
  "assistantObjectContextManagementFoundation.constants.ts",
  "assistantObjectContextManagementFoundation.contracts.ts",
  "assistantObjectContextManagementFoundation.identity.ts",
  "assistantObjectContextManagementFoundation.test.ts",
  "assistantObjectContextManagementFoundation.ts",
  "assistantObjectContextManagementFoundation.types.ts",
];

test("ASSISTANT-6:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-6:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantObjectContextManagementFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-6:1/ObjectContextManagementFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.object-context-management.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceWorkspaceOrchestration,
    "ASSISTANT-5:9/WorkspaceOrchestrationPublicIndex",
  );
});

test("ASSISTANT-6:1 declares contracts, capabilities, categories, and concepts", () => {
  const foundation = AssistantObjectContextManagementFoundation;
  assert.equal(foundation.contracts.length, 9);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.objectCategories.length, 12);
  assert.equal(foundation.contextCategories.length, 10);
  assert.equal(foundation.objectConcepts.length, 8);
  assert.equal(foundation.responsibilities.length, 12);
  assert.equal(
    foundation.contracts.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    foundation.capabilities.every(({ implemented }) => !implemented),
    true,
  );
  assert.equal(
    foundation.objectCategories.every(({ conceptualOnly }) => conceptualOnly),
    true,
  );
  assert.equal(
    foundation.contextCategories.every(({ conceptualOnly }) => conceptualOnly),
    true,
  );
  assert.equal(
    foundation.objectConcepts.every(({ descriptiveOnly }) => descriptiveOnly),
    true,
  );
});

test("ASSISTANT-6:1 metadata is immutable and identities are unique", () => {
  const foundation = AssistantObjectContextManagementFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.objectCategories,
    ...foundation.contextCategories,
    ...foundation.objectConcepts,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("ASSISTANT-6:1 consumes Public Index only and has no prohibited behavior", () => {
  const foundation = AssistantObjectContextManagementFoundation;
  const source = readFileSync(
    new URL(
      "./assistantObjectContextManagementFoundation.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationPublicIndex.ts",
    "./assistantObjectContextManagementFoundation.boundaries.ts",
    "./assistantObjectContextManagementFoundation.capabilities.ts",
    "./assistantObjectContextManagementFoundation.constants.ts",
    "./assistantObjectContextManagementFoundation.contracts.ts",
    "./assistantObjectContextManagementFoundation.identity.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationFreeze"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationCertification"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-5:9 Workspace Orchestration Public Index",
  ]);
  assert.equal(
    foundation.workspaceOrchestrationPublicIndex.id,
    "ASSISTANT-5:9/WorkspaceOrchestrationPublicIndex",
  );
  assert.equal(foundation.boundaries.length, 26);
  assert.equal(
    foundation.boundaries.every(({ permitted }) => !permitted),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.objectCreation, false);
  assert.equal(foundation.objectPersistence, false);
  assert.equal(foundation.contextPersistence, false);
  assert.equal(foundation.contextSynchronization, false);
  assert.equal(foundation.objectSynchronization, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
});
