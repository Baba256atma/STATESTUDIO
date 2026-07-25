import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationModel } from "./assistantWorkspaceOrchestrationModel.ts";

const files = [
  "assistantWorkspaceOrchestrationModel.constants.ts",
  "assistantWorkspaceOrchestrationModel.identity.ts",
  "assistantWorkspaceOrchestrationModel.lifecycle.ts",
  "assistantWorkspaceOrchestrationModel.metadata.ts",
  "assistantWorkspaceOrchestrationModel.relationships.ts",
  "assistantWorkspaceOrchestrationModel.test.ts",
  "assistantWorkspaceOrchestrationModel.ts",
  "assistantWorkspaceOrchestrationModel.types.ts",
];

test("ASSISTANT-5:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:3 publishes canonical Model identity", () => {
  const model = AssistantWorkspaceOrchestrationModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-5:3/WorkspaceOrchestrationModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.workspace-orchestration.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-5:2/WorkspaceOrchestrationRegistry",
  );
});

test("ASSISTANT-5:3 publishes complete domain structures", () => {
  const model = AssistantWorkspaceOrchestrationModel;
  assert.equal(model.domainModels.length, 20);
  assert.equal(model.relationships.length, 18);
  assert.equal(model.lifecycle.length, 8);
  assert.equal(model.constants.domainModelCount, 20);
  assert.equal(model.constants.relationshipCount, 18);
  assert.equal(model.constants.lifecycleCount, 8);
  assert.equal(model.statistics.domainModelCount, 20);
  assert.equal(model.statistics.relationshipCount, 18);
  assert.equal(model.statistics.lifecycleCount, 8);
  assert.equal(model.statistics.metadataCount, 11);
  assert.deepEqual(
    model.lifecycle.map(({ name }) => name),
    [
      "Declared",
      "Initialized",
      "Workspace Selected",
      "Workspace Coordinated",
      "Workspace Transitioned",
      "Workspace Confirmed",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-5:3 identities and metadata are immutable and ordered", () => {
  const model = AssistantWorkspaceOrchestrationModel;
  const records = [
    ...model.domainModels,
    ...model.relationships,
    ...model.lifecycle,
  ];
  assert.equal(
    new Set(records.map(({ identifier }) => identifier)).size,
    records.length,
  );
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(model), true);
  assert.deepEqual(
    model.domainModels.map(({ identifier }) => identifier),
    model.domainModels.map((_, index) =>
      `ASSISTANT-5:3/DomainModel/${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(
      ({ registryReference }) =>
        registryReference === "ASSISTANT-5:2/WorkspaceOrchestrationRegistry",
    ),
    true,
  );
});

test("ASSISTANT-5:3 consumes Registry only and has no prohibited behavior", () => {
  const model = AssistantWorkspaceOrchestrationModel;
  const source = readFileSync(
    new URL("./assistantWorkspaceOrchestrationModel.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationRegistry.ts",
    "./assistantWorkspaceOrchestrationModel.constants.ts",
    "./assistantWorkspaceOrchestrationModel.identity.ts",
    "./assistantWorkspaceOrchestrationModel.lifecycle.ts",
    "./assistantWorkspaceOrchestrationModel.metadata.ts",
    "./assistantWorkspaceOrchestrationModel.relationships.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationValidation"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-5:2 Workspace Orchestration Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-5:2/WorkspaceOrchestrationRegistry",
  );
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.workspaceExecution, false);
  assert.equal(model.workspaceRouting, false);
  assert.equal(model.workspaceSwitching, false);
  assert.equal(model.orchestrationEngine, false);
  assert.equal(model.scheduling, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
