import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryFoundation } from "./assistantExecutiveMemoryFoundation.ts";

const files = [
  "assistantExecutiveMemoryFoundation.boundaries.ts",
  "assistantExecutiveMemoryFoundation.capabilities.ts",
  "assistantExecutiveMemoryFoundation.constants.ts",
  "assistantExecutiveMemoryFoundation.contracts.ts",
  "assistantExecutiveMemoryFoundation.identity.ts",
  "assistantExecutiveMemoryFoundation.test.ts",
  "assistantExecutiveMemoryFoundation.ts",
  "assistantExecutiveMemoryFoundation.types.ts",
];

test("ASSISTANT-2:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantExecutiveMemoryFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-2:1/ExecutiveMemoryFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.executive-memory.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceConversation,
    "ASSISTANT-1:9/ConversationPublicIndex",
  );
});

test("ASSISTANT-2:1 declares contracts, capabilities, and scopes", () => {
  const foundation = AssistantExecutiveMemoryFoundation;
  assert.equal(foundation.contracts.length, 9);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.scopes.length, 8);
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
    foundation.scopes.every(({ conceptualOnly }) => conceptualOnly),
    true,
  );
});

test("ASSISTANT-2:1 metadata is immutable and identities are unique", () => {
  const foundation = AssistantExecutiveMemoryFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.scopes,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("ASSISTANT-2:1 consumes Public Index only and has no prohibited behavior", () => {
  const foundation = AssistantExecutiveMemoryFoundation;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryFoundation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantConversationPublicIndex.ts",
    "./assistantExecutiveMemoryFoundation.boundaries.ts",
    "./assistantExecutiveMemoryFoundation.capabilities.ts",
    "./assistantExecutiveMemoryFoundation.constants.ts",
    "./assistantExecutiveMemoryFoundation.contracts.ts",
    "./assistantExecutiveMemoryFoundation.identity.ts",
  ]);
  assert.equal(source.includes("assistantConversationFreeze"), false);
  assert.equal(source.includes("assistantConversationPlatform"), false);
  assert.equal(source.includes("assistantConversationCertification"), false);
  assert.equal(source.includes("executiveMemory/"), false);
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-1:9 Conversation Public Index",
  ]);
  assert.equal(
    foundation.conversationPublicIndex.id,
    "ASSISTANT-1:9/ConversationPublicIndex",
  );
  assert.equal(foundation.boundaries.length, 30);
  assert.equal(
    foundation.boundaries.every(({ permitted }) => !permitted),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.memoryStorage, false);
  assert.equal(foundation.vectorDatabase, false);
  assert.equal(foundation.embeddings, false);
  assert.equal(foundation.retrieval, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
});
