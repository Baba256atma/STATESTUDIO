import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveActionPlanningModel } from "./assistantExecutiveActionPlanningModel.ts";

const files = [
  "assistantExecutiveActionPlanningModel.constants.ts",
  "assistantExecutiveActionPlanningModel.identity.ts",
  "assistantExecutiveActionPlanningModel.lifecycle.ts",
  "assistantExecutiveActionPlanningModel.metadata.ts",
  "assistantExecutiveActionPlanningModel.relationships.ts",
  "assistantExecutiveActionPlanningModel.test.ts",
  "assistantExecutiveActionPlanningModel.ts",
  "assistantExecutiveActionPlanningModel.types.ts",
];

test("ASSISTANT-7:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:3 publishes canonical Model identity", () => {
  const model = AssistantExecutiveActionPlanningModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-7:3/ExecutiveActionPlanningModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.executive-action-planning.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-7:2/ExecutiveActionPlanningRegistry",
  );
});

test("ASSISTANT-7:3 publishes complete domain structures", () => {
  const model = AssistantExecutiveActionPlanningModel;
  assert.equal(model.domainModels.length, 20);
  assert.equal(model.relationships.length, 18);
  assert.equal(model.lifecycle.length, 9);
  assert.equal(model.constants.domainModelCount, 20);
  assert.equal(model.constants.relationshipCount, 18);
  assert.equal(model.constants.lifecycleCount, 9);
  assert.equal(model.statistics.domainModelCount, 20);
  assert.equal(model.statistics.relationshipCount, 18);
  assert.equal(model.statistics.lifecycleCount, 9);
  assert.equal(model.statistics.metadataCount, 11);
  assert.equal(model.canonicalInventoryRuleSatisfied, true);
  assert.deepEqual(
    model.lifecycle.map(({ name }) => name),
    [
      "Declared",
      "Objective Defined",
      "Actions Structured",
      "Dependencies Defined",
      "Plan Reviewed",
      "Plan Confirmed",
      "Ready",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-7:3 identities and metadata are immutable and ordered", () => {
  const model = AssistantExecutiveActionPlanningModel;
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
      `ASSISTANT-7:3/DomainModel/${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(
      ({ registryReference }) =>
        registryReference ===
          "ASSISTANT-7:2/ExecutiveActionPlanningRegistry",
    ),
    true,
  );
});

test("ASSISTANT-7:3 consumes Registry only and has no prohibited behavior", () => {
  const model = AssistantExecutiveActionPlanningModel;
  const source = readFileSync(
    new URL("./assistantExecutiveActionPlanningModel.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveActionPlanningRegistry.ts",
    "./assistantExecutiveActionPlanningModel.constants.ts",
    "./assistantExecutiveActionPlanningModel.identity.ts",
    "./assistantExecutiveActionPlanningModel.lifecycle.ts",
    "./assistantExecutiveActionPlanningModel.metadata.ts",
    "./assistantExecutiveActionPlanningModel.relationships.ts",
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningValidation"),
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
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-7:2 Executive Action Planning Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-7:2/ExecutiveActionPlanningRegistry",
  );
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.planningEngine, false);
  assert.equal(model.taskExecution, false);
  assert.equal(model.scheduling, false);
  assert.equal(model.assignment, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
