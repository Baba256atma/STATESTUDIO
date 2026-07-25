import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryValidation } from "./assistantExecutiveMemoryValidation.ts";

const files = [
  "assistantExecutiveMemoryValidation.constants.ts",
  "assistantExecutiveMemoryValidation.gates.ts",
  "assistantExecutiveMemoryValidation.identity.ts",
  "assistantExecutiveMemoryValidation.results.ts",
  "assistantExecutiveMemoryValidation.rules.ts",
  "assistantExecutiveMemoryValidation.test.ts",
  "assistantExecutiveMemoryValidation.ts",
  "assistantExecutiveMemoryValidation.types.ts",
];

test("ASSISTANT-2:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:4 publishes canonical Validation identity", () => {
  const validation = AssistantExecutiveMemoryValidation;
  assert.equal(
    validation.identity.id,
    "ASSISTANT-2:4/ExecutiveMemoryValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.assistant.executive-memory.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.status, "Validation");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(
    validation.identity.sourceModel,
    "ASSISTANT-2:3/ExecutiveMemoryModel",
  );
});

test("ASSISTANT-2:4 publishes exactly 40 rules, 16 gates, and 8 categories", () => {
  const validation = AssistantExecutiveMemoryValidation;
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
});

test("ASSISTANT-2:4 identities and metadata are immutable", () => {
  const validation = AssistantExecutiveMemoryValidation;
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
        validationTarget === "ASSISTANT-2:3/ExecutiveMemoryModel",
    ),
    true,
  );
  assert.equal(validation.results.manifestEligibility, "Eligible");
  assert.equal(validation.results.validationStatus, "Passed");
});

test("ASSISTANT-2:4 consumes Model only and has no executable validation", () => {
  const validation = AssistantExecutiveMemoryValidation;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryValidation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryModel.ts",
    "./assistantExecutiveMemoryValidation.constants.ts",
    "./assistantExecutiveMemoryValidation.gates.ts",
    "./assistantExecutiveMemoryValidation.identity.ts",
    "./assistantExecutiveMemoryValidation.rules.ts",
    "./assistantExecutiveMemoryValidation.results.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryRegistry"), false);
  assert.equal(source.includes("assistantExecutiveMemoryFoundation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryManifest"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "ASSISTANT-2:3 Executive Memory Model",
  ]);
  assert.equal(
    validation.model.identity.id,
    "ASSISTANT-2:3/ExecutiveMemoryModel",
  );
  assert.equal(validation.executableValidation, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.memoryPersistence, false);
  assert.equal(validation.vectorDatabase, false);
  assert.equal(validation.retrieval, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.networking, false);
});
