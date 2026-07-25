import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveGuidanceModel } from "./assistantExecutiveGuidanceModel.ts";

const files = [
  "assistantExecutiveGuidanceModel.constants.ts",
  "assistantExecutiveGuidanceModel.identity.ts",
  "assistantExecutiveGuidanceModel.lifecycle.ts",
  "assistantExecutiveGuidanceModel.metadata.ts",
  "assistantExecutiveGuidanceModel.relationships.ts",
  "assistantExecutiveGuidanceModel.test.ts",
  "assistantExecutiveGuidanceModel.ts",
  "assistantExecutiveGuidanceModel.types.ts",
];

test("ASSISTANT-4:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-4:3 publishes canonical Model identity", () => {
  const model = AssistantExecutiveGuidanceModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-4:3/ExecutiveGuidanceModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.executive-guidance.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-4:2/ExecutiveGuidanceRegistry",
  );
});

test("ASSISTANT-4:3 publishes complete domain structures", () => {
  const model = AssistantExecutiveGuidanceModel;
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
      "Guidance Prepared",
      "Guidance Reviewed",
      "Guidance Confirmed",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-4:3 identities and metadata are immutable and ordered", () => {
  const model = AssistantExecutiveGuidanceModel;
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
      `ASSISTANT-4:3/DomainModel/${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(
      ({ registryReference }) =>
        registryReference === "ASSISTANT-4:2/ExecutiveGuidanceRegistry",
    ),
    true,
  );
});

test("ASSISTANT-4:3 consumes Registry only and has no prohibited behavior", () => {
  const model = AssistantExecutiveGuidanceModel;
  const source = readFileSync(
    new URL("./assistantExecutiveGuidanceModel.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveGuidanceRegistry.ts",
    "./assistantExecutiveGuidanceModel.constants.ts",
    "./assistantExecutiveGuidanceModel.identity.ts",
    "./assistantExecutiveGuidanceModel.lifecycle.ts",
    "./assistantExecutiveGuidanceModel.metadata.ts",
    "./assistantExecutiveGuidanceModel.relationships.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveGuidanceFoundation"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceValidation"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-4:2 Executive Guidance Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-4:2/ExecutiveGuidanceRegistry",
  );
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.recommendationGeneration, false);
  assert.equal(model.coachingGeneration, false);
  assert.equal(model.decisionGeneration, false);
  assert.equal(model.actionPlanning, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
