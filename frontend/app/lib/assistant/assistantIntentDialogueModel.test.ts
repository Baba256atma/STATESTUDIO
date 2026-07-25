import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantIntentDialogueModel } from "./assistantIntentDialogueModel.ts";

const files = [
  "assistantIntentDialogueModel.constants.ts",
  "assistantIntentDialogueModel.identity.ts",
  "assistantIntentDialogueModel.lifecycle.ts",
  "assistantIntentDialogueModel.metadata.ts",
  "assistantIntentDialogueModel.relationships.ts",
  "assistantIntentDialogueModel.test.ts",
  "assistantIntentDialogueModel.ts",
  "assistantIntentDialogueModel.types.ts",
];

test("ASSISTANT-3:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:3 publishes canonical Model identity", () => {
  const model = AssistantIntentDialogueModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-3:3/IntentDialogueUnderstandingModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.intent-dialogue.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry",
  );
});

test("ASSISTANT-3:3 publishes complete domain structures", () => {
  const model = AssistantIntentDialogueModel;
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
      "Intent Identified",
      "Clarifying",
      "Context Established",
      "Intent Confirmed",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-3:3 identities and metadata are immutable and ordered", () => {
  const model = AssistantIntentDialogueModel;
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
      `ASSISTANT-3:3/DomainModel/${String(index + 1).padStart(2, "0")}`),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(
      ({ registryReference }) =>
        registryReference ===
          "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry",
    ),
    true,
  );
});

test("ASSISTANT-3:3 consumes Registry only and has no prohibited behavior", () => {
  const model = AssistantIntentDialogueModel;
  const source = readFileSync(
    new URL("./assistantIntentDialogueModel.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantIntentDialogueRegistry.ts",
    "./assistantIntentDialogueModel.constants.ts",
    "./assistantIntentDialogueModel.identity.ts",
    "./assistantIntentDialogueModel.lifecycle.ts",
    "./assistantIntentDialogueModel.metadata.ts",
    "./assistantIntentDialogueModel.relationships.ts",
  ]);
  assert.equal(source.includes("assistantIntentDialogueFoundation"), false);
  assert.equal(source.includes("assistantIntentDialogueValidation"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-3:2 Intent & Dialogue Understanding Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-3:2/IntentDialogueUnderstandingRegistry",
  );
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.intentClassification, false);
  assert.equal(model.nlp, false);
  assert.equal(model.naturalLanguageParsing, false);
  assert.equal(model.dialogueExecution, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
