import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantIntentDialogueFoundation } from "./assistantIntentDialogueFoundation.ts";

const files = [
  "assistantIntentDialogueFoundation.boundaries.ts",
  "assistantIntentDialogueFoundation.capabilities.ts",
  "assistantIntentDialogueFoundation.constants.ts",
  "assistantIntentDialogueFoundation.contracts.ts",
  "assistantIntentDialogueFoundation.identity.ts",
  "assistantIntentDialogueFoundation.test.ts",
  "assistantIntentDialogueFoundation.ts",
  "assistantIntentDialogueFoundation.types.ts",
];

test("ASSISTANT-3:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantIntentDialogueFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-3:1/IntentDialogueUnderstandingFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.intent-dialogue.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceExecutiveMemory,
    "ASSISTANT-2:9/ExecutiveMemoryPublicIndex",
  );
});

test("ASSISTANT-3:1 declares contracts, capabilities, categories, and concepts", () => {
  const foundation = AssistantIntentDialogueFoundation;
  assert.equal(foundation.contracts.length, 9);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.intentCategories.length, 12);
  assert.equal(foundation.dialogueConcepts.length, 8);
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
    foundation.intentCategories.every(({ conceptualOnly }) => conceptualOnly),
    true,
  );
  assert.equal(
    foundation.dialogueConcepts.every(({ descriptiveOnly }) => descriptiveOnly),
    true,
  );
});

test("ASSISTANT-3:1 metadata is immutable and identities are unique", () => {
  const foundation = AssistantIntentDialogueFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.intentCategories,
    ...foundation.dialogueConcepts,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("ASSISTANT-3:1 consumes Public Index only and has no prohibited behavior", () => {
  const foundation = AssistantIntentDialogueFoundation;
  const source = readFileSync(
    new URL("./assistantIntentDialogueFoundation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryPublicIndex.ts",
    "./assistantIntentDialogueFoundation.boundaries.ts",
    "./assistantIntentDialogueFoundation.capabilities.ts",
    "./assistantIntentDialogueFoundation.constants.ts",
    "./assistantIntentDialogueFoundation.contracts.ts",
    "./assistantIntentDialogueFoundation.identity.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryFreeze"), false);
  assert.equal(source.includes("assistantExecutiveMemoryPlatform"), false);
  assert.equal(
    source.includes("assistantExecutiveMemoryCertification"),
    false,
  );
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-2:9 Executive Memory Public Index",
  ]);
  assert.equal(
    foundation.executiveMemoryPublicIndex.id,
    "ASSISTANT-2:9/ExecutiveMemoryPublicIndex",
  );
  assert.equal(foundation.boundaries.length, 33);
  assert.equal(
    foundation.boundaries.every(({ permitted }) => !permitted),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.intentClassification, false);
  assert.equal(foundation.nlp, false);
  assert.equal(foundation.naturalLanguageParsing, false);
  assert.equal(foundation.dialogueExecution, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
});
