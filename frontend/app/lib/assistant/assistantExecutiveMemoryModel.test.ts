import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryModel } from "./assistantExecutiveMemoryModel.ts";

const files = [
  "assistantExecutiveMemoryModel.constants.ts",
  "assistantExecutiveMemoryModel.identity.ts",
  "assistantExecutiveMemoryModel.lifecycle.ts",
  "assistantExecutiveMemoryModel.metadata.ts",
  "assistantExecutiveMemoryModel.relationships.ts",
  "assistantExecutiveMemoryModel.test.ts",
  "assistantExecutiveMemoryModel.ts",
  "assistantExecutiveMemoryModel.types.ts",
];

test("ASSISTANT-2:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:3 publishes canonical Model identity", () => {
  const model = AssistantExecutiveMemoryModel;
  assert.equal(model.identity.id, "ASSISTANT-2:3/ExecutiveMemoryModel");
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.executive-memory.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-2:2/ExecutiveMemoryRegistry",
  );
});

test("ASSISTANT-2:3 publishes complete domain structures", () => {
  const model = AssistantExecutiveMemoryModel;
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
      "Active",
      "Referenced",
      "Reviewed",
      "Certified",
      "Frozen",
      "Archived",
    ],
  );
});

test("ASSISTANT-2:3 identities and metadata are immutable and ordered", () => {
  const model = AssistantExecutiveMemoryModel;
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
      `ASSISTANT-2:3/DomainModel/${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(
      ({ registryReference }) =>
        registryReference === "ASSISTANT-2:2/ExecutiveMemoryRegistry",
    ),
    true,
  );
});

test("ASSISTANT-2:3 consumes Registry only and has no prohibited behavior", () => {
  const model = AssistantExecutiveMemoryModel;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryModel.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryRegistry.ts",
    "./assistantExecutiveMemoryModel.constants.ts",
    "./assistantExecutiveMemoryModel.identity.ts",
    "./assistantExecutiveMemoryModel.lifecycle.ts",
    "./assistantExecutiveMemoryModel.metadata.ts",
    "./assistantExecutiveMemoryModel.relationships.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryFoundation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryValidation"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-2:2 Executive Memory Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-2:2/ExecutiveMemoryRegistry",
  );
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.memoryPersistence, false);
  assert.equal(model.vectorDatabase, false);
  assert.equal(model.embeddings, false);
  assert.equal(model.retrieval, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
