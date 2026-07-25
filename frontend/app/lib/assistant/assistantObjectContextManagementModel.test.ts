import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantObjectContextManagementModel } from "./assistantObjectContextManagementModel.ts";

const files = [
  "assistantObjectContextManagementModel.constants.ts",
  "assistantObjectContextManagementModel.identity.ts",
  "assistantObjectContextManagementModel.lifecycle.ts",
  "assistantObjectContextManagementModel.metadata.ts",
  "assistantObjectContextManagementModel.relationships.ts",
  "assistantObjectContextManagementModel.test.ts",
  "assistantObjectContextManagementModel.ts",
  "assistantObjectContextManagementModel.types.ts",
];

test("ASSISTANT-6:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-6:3 publishes canonical Model identity", () => {
  const model = AssistantObjectContextManagementModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-6:3/ObjectContextManagementModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.object-context-management.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-6:2/ObjectContextManagementRegistry",
  );
});

test("ASSISTANT-6:3 publishes complete domain structures", () => {
  const model = AssistantObjectContextManagementModel;
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
      "Context Established",
      "Objects Referenced",
      "Relationships Established",
      "Context Verified",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-6:3 identities and metadata are immutable and ordered", () => {
  const model = AssistantObjectContextManagementModel;
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
      `ASSISTANT-6:3/DomainModel/${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(
      ({ registryReference }) =>
        registryReference ===
          "ASSISTANT-6:2/ObjectContextManagementRegistry",
    ),
    true,
  );
});

test("ASSISTANT-6:3 consumes Registry only and has no prohibited behavior", () => {
  const model = AssistantObjectContextManagementModel;
  const source = readFileSync(
    new URL("./assistantObjectContextManagementModel.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantObjectContextManagementRegistry.ts",
    "./assistantObjectContextManagementModel.constants.ts",
    "./assistantObjectContextManagementModel.identity.ts",
    "./assistantObjectContextManagementModel.lifecycle.ts",
    "./assistantObjectContextManagementModel.metadata.ts",
    "./assistantObjectContextManagementModel.relationships.ts",
  ]);
  assert.equal(
    source.includes("assistantObjectContextManagementFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementValidation"),
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
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-6:2 Object & Context Management Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-6:2/ObjectContextManagementRegistry",
  );
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.objectCreation, false);
  assert.equal(model.objectPersistence, false);
  assert.equal(model.contextPersistence, false);
  assert.equal(model.contextSynchronization, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
