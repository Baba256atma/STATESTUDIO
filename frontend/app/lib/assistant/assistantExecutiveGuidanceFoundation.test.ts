import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveGuidanceFoundation } from "./assistantExecutiveGuidanceFoundation.ts";

const files = [
  "assistantExecutiveGuidanceFoundation.boundaries.ts",
  "assistantExecutiveGuidanceFoundation.capabilities.ts",
  "assistantExecutiveGuidanceFoundation.constants.ts",
  "assistantExecutiveGuidanceFoundation.contracts.ts",
  "assistantExecutiveGuidanceFoundation.identity.ts",
  "assistantExecutiveGuidanceFoundation.test.ts",
  "assistantExecutiveGuidanceFoundation.ts",
  "assistantExecutiveGuidanceFoundation.types.ts",
];

test("ASSISTANT-4:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-4:1 publishes canonical Foundation identity", () => {
  const foundation = AssistantExecutiveGuidanceFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-4:1/ExecutiveGuidanceFoundation",
  );
  assert.equal(
    foundation.identity.namespace,
    "nexora.assistant.executive-guidance.foundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceIntentDialogue,
    "ASSISTANT-3:9/IntentDialogueUnderstandingPublicIndex",
  );
});

test("ASSISTANT-4:1 declares contracts, capabilities, categories, and concepts", () => {
  const foundation = AssistantExecutiveGuidanceFoundation;
  assert.equal(foundation.contracts.length, 9);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.guidanceCategories.length, 12);
  assert.equal(foundation.guidanceConcepts.length, 8);
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
    foundation.guidanceCategories.every(({ conceptualOnly }) => conceptualOnly),
    true,
  );
  assert.equal(
    foundation.guidanceConcepts.every(({ descriptiveOnly }) => descriptiveOnly),
    true,
  );
});

test("ASSISTANT-4:1 metadata is immutable and identities are unique", () => {
  const foundation = AssistantExecutiveGuidanceFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.guidanceCategories,
    ...foundation.guidanceConcepts,
    ...foundation.boundaries,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("ASSISTANT-4:1 consumes Public Index only and has no prohibited behavior", () => {
  const foundation = AssistantExecutiveGuidanceFoundation;
  const source = readFileSync(
    new URL("./assistantExecutiveGuidanceFoundation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantIntentDialoguePublicIndex.ts",
    "./assistantExecutiveGuidanceFoundation.boundaries.ts",
    "./assistantExecutiveGuidanceFoundation.capabilities.ts",
    "./assistantExecutiveGuidanceFoundation.constants.ts",
    "./assistantExecutiveGuidanceFoundation.contracts.ts",
    "./assistantExecutiveGuidanceFoundation.identity.ts",
  ]);
  assert.equal(source.includes("assistantIntentDialogueFreeze"), false);
  assert.equal(source.includes("assistantIntentDialoguePlatform"), false);
  assert.equal(
    source.includes("assistantIntentDialogueCertification"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-3:9 Intent & Dialogue Understanding Public Index",
  ]);
  assert.equal(
    foundation.intentDialoguePublicIndex.id,
    "ASSISTANT-3:9/IntentDialogueUnderstandingPublicIndex",
  );
  assert.equal(foundation.boundaries.length, 33);
  assert.equal(
    foundation.boundaries.every(({ permitted }) => !permitted),
    true,
  );
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.recommendationGeneration, false);
  assert.equal(foundation.coachingGeneration, false);
  assert.equal(foundation.decisionGeneration, false);
  assert.equal(foundation.scenarioGeneration, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.stateMutation, false);
});
