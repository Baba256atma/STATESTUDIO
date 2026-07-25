import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationFoundation } from "./assistantWorkspaceOrchestrationFoundation.ts";

const files = [
  "assistantWorkspaceOrchestrationFoundation.boundaries.ts",
  "assistantWorkspaceOrchestrationFoundation.capabilities.ts",
  "assistantWorkspaceOrchestrationFoundation.constants.ts",
  "assistantWorkspaceOrchestrationFoundation.contracts.ts",
  "assistantWorkspaceOrchestrationFoundation.identity.ts",
  "assistantWorkspaceOrchestrationFoundation.test.ts",
  "assistantWorkspaceOrchestrationFoundation.ts",
  "assistantWorkspaceOrchestrationFoundation.types.ts",
];

test("ASSISTANT-5:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantWorkspaceOrchestrationFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-5:1/WorkspaceOrchestrationFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.workspace-orchestration.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceExecutiveGuidance,
    "ASSISTANT-4:9/ExecutiveGuidancePublicIndex",
  );
});

test("ASSISTANT-5:1 declares contracts, capabilities, categories, and concepts", () => {
  const foundation = AssistantWorkspaceOrchestrationFoundation;
  assert.equal(foundation.contracts.length, 9);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.workspaceCategories.length, 12);
  assert.equal(foundation.workspaceConcepts.length, 8);
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
    foundation.workspaceCategories.every(
      ({ conceptualOnly }) => conceptualOnly,
    ),
    true,
  );
  assert.equal(
    foundation.workspaceConcepts.every(
      ({ descriptiveOnly }) => descriptiveOnly,
    ),
    true,
  );
});

test("ASSISTANT-5:1 metadata is immutable and identities are unique", () => {
  const foundation = AssistantWorkspaceOrchestrationFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.workspaceCategories,
    ...foundation.workspaceConcepts,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("ASSISTANT-5:1 consumes Public Index only and has no prohibited behavior", () => {
  const foundation = AssistantWorkspaceOrchestrationFoundation;
  const source = readFileSync(
    new URL("./assistantWorkspaceOrchestrationFoundation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveGuidancePublicIndex.ts",
    "./assistantWorkspaceOrchestrationFoundation.boundaries.ts",
    "./assistantWorkspaceOrchestrationFoundation.capabilities.ts",
    "./assistantWorkspaceOrchestrationFoundation.constants.ts",
    "./assistantWorkspaceOrchestrationFoundation.contracts.ts",
    "./assistantWorkspaceOrchestrationFoundation.identity.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveGuidanceFreeze"), false);
  assert.equal(source.includes("assistantExecutiveGuidancePlatform"), false);
  assert.equal(
    source.includes("assistantExecutiveGuidanceCertification"),
    false,
  );
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-4:9 Executive Guidance Public Index",
  ]);
  assert.equal(
    foundation.executiveGuidancePublicIndex.id,
    "ASSISTANT-4:9/ExecutiveGuidancePublicIndex",
  );
  assert.equal(foundation.boundaries.length, 27);
  assert.equal(
    foundation.boundaries.every(({ permitted }) => !permitted),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.workspaceExecution, false);
  assert.equal(foundation.workspaceSwitching, false);
  assert.equal(foundation.workspaceRouting, false);
  assert.equal(foundation.scheduling, false);
  assert.equal(foundation.orchestrationEngine, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
});
