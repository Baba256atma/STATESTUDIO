import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveGuidanceValidation } from "./assistantExecutiveGuidanceValidation.ts";

const files = [
  "assistantExecutiveGuidanceValidation.constants.ts",
  "assistantExecutiveGuidanceValidation.gates.ts",
  "assistantExecutiveGuidanceValidation.identity.ts",
  "assistantExecutiveGuidanceValidation.results.ts",
  "assistantExecutiveGuidanceValidation.rules.ts",
  "assistantExecutiveGuidanceValidation.test.ts",
  "assistantExecutiveGuidanceValidation.ts",
  "assistantExecutiveGuidanceValidation.types.ts",
];

test("ASSISTANT-4:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-4:4 publishes canonical Validation identity", () => {
  const validation = AssistantExecutiveGuidanceValidation;
  assert.equal(
    validation.identity.id,
    "ASSISTANT-4:4/ExecutiveGuidanceValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.assistant.executive-guidance.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.status, "Validation");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(
    validation.identity.sourceModel,
    "ASSISTANT-4:3/ExecutiveGuidanceModel",
  );
});

test("ASSISTANT-4:4 publishes exactly 40 rules, 16 gates, and 8 categories", () => {
  const validation = AssistantExecutiveGuidanceValidation;
  assert.equal(validation.rules.length, 40);
  assert.equal(validation.gates.length, 16);
  assert.equal(validation.categories.length, 8);
  assert.equal(validation.results.ruleCount, 40);
  assert.equal(validation.results.gateCount, 16);
  assert.equal(validation.constants.ruleCount, 40);
  assert.equal(validation.constants.gateCount, 16);
  assert.equal(validation.statistics.validationRuleCount, 40);
  assert.equal(validation.statistics.validationGateCount, 16);
  assert.equal(validation.statistics.validationCategoryCount, 8);
  assert.equal(validation.statistics.validationMetadataCount, 7);
  assert.deepEqual([...validation.categories], [
    "Identity Validation",
    "Registry Validation",
    "Model Validation",
    "Relationship Validation",
    "Lifecycle Validation",
    "Metadata Validation",
    "Boundary Validation",
    "Export Validation",
  ]);
  assert.deepEqual(
    validation.gates.map(({ name }) => name),
    [
      "Identity Gate",
      "Namespace Gate",
      "Version Gate",
      "Registry Gate",
      "Model Gate",
      "Relationship Gate",
      "Lifecycle Gate",
      "Metadata Gate",
      "Boundary Gate",
      "Export Gate",
      "Dependency Gate",
      "Architecture Gate",
      "Metadata Integrity Gate",
      "Consumer Readiness Gate",
      "Final Validation Gate",
      "ReadyForManifest Gate",
    ],
  );
});

test("ASSISTANT-4:4 identities and metadata are immutable", () => {
  const validation = AssistantExecutiveGuidanceValidation;
  assert.equal(
    new Set(validation.rules.map(({ ruleId }) => ruleId)).size,
    40,
  );
  assert.equal(
    new Set(validation.gates.map(({ gateId }) => gateId)).size,
    16,
  );
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(validation.gates.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(validation), true);
  assert.equal(Object.isFrozen(validation.results), true);
  assert.equal(
    validation.rules.every(
      ({ validationTarget }) =>
        validationTarget === "ASSISTANT-4:3/ExecutiveGuidanceModel",
    ),
    true,
  );
  assert.equal(validation.results.manifestEligibility, "Eligible");
  assert.equal(validation.results.validationStatus, "Passed");
});

test("ASSISTANT-4:4 consumes Model only and has no executable validation", () => {
  const validation = AssistantExecutiveGuidanceValidation;
  const source = readFileSync(
    new URL("./assistantExecutiveGuidanceValidation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveGuidanceModel.ts",
    "./assistantExecutiveGuidanceValidation.constants.ts",
    "./assistantExecutiveGuidanceValidation.gates.ts",
    "./assistantExecutiveGuidanceValidation.identity.ts",
    "./assistantExecutiveGuidanceValidation.rules.ts",
    "./assistantExecutiveGuidanceValidation.results.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveGuidanceRegistry"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceFoundation"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceManifest"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "ASSISTANT-4:3 Executive Guidance Model",
  ]);
  assert.equal(
    validation.model.identity.id,
    "ASSISTANT-4:3/ExecutiveGuidanceModel",
  );
  assert.equal(validation.executableValidation, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.recommendationGeneration, false);
  assert.equal(validation.coachingGeneration, false);
  assert.equal(validation.decisionGeneration, false);
  assert.equal(validation.actionPlanning, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.networking, false);
});
