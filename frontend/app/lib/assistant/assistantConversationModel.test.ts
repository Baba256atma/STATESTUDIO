import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationModel } from "./assistantConversationModel.ts";

const files = [
  "assistantConversationModel.constants.ts",
  "assistantConversationModel.identity.ts",
  "assistantConversationModel.lifecycle.ts",
  "assistantConversationModel.metadata.ts",
  "assistantConversationModel.relationships.ts",
  "assistantConversationModel.test.ts",
  "assistantConversationModel.ts",
  "assistantConversationModel.types.ts",
];

test("ASSISTANT-1:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:3 publishes canonical Model identity", () => {
  const model = AssistantConversationModel;
  assert.equal(model.identity.id, "ASSISTANT-1:3/ConversationModel");
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.conversation.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
});

test("ASSISTANT-1:3 publishes complete domain structures", () => {
  const model = AssistantConversationModel;
  assert.equal(model.domainModels.length, 20);
  assert.equal(model.relationships.length, 12);
  assert.equal(model.lifecycle.length, 7);
  assert.deepEqual(
    model.lifecycle.map(({ name }) => name),
    ["Declared", "Initialized", "Active", "Clarifying", "Guiding",
      "Completed", "Archived"],
  );
});

test("ASSISTANT-1:3 identities and metadata are immutable", () => {
  const model = AssistantConversationModel;
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
});

test("ASSISTANT-1:3 consumes Registry only and has no runtime", () => {
  const model = AssistantConversationModel;
  const source = readFileSync(
    new URL("./assistantConversationModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationFoundation"), false);
  assert.equal(source.includes("assistantConversationValidation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-1:2 Conversation Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.executionLogic, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
});
