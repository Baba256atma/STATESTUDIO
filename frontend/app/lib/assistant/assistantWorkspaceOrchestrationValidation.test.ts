import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationValidation } from "./assistantWorkspaceOrchestrationValidation.ts";

const files = [
  "assistantWorkspaceOrchestrationValidation.constants.ts",
  "assistantWorkspaceOrchestrationValidation.gates.ts",
  "assistantWorkspaceOrchestrationValidation.identity.ts",
  "assistantWorkspaceOrchestrationValidation.results.ts",
  "assistantWorkspaceOrchestrationValidation.rules.ts",
  "assistantWorkspaceOrchestrationValidation.test.ts",
  "assistantWorkspaceOrchestrationValidation.ts",
  "assistantWorkspaceOrchestrationValidation.types.ts",
];

test("ASSISTANT-5:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:4 publishes canonical Validation identity", () => {
  const validation = AssistantWorkspaceOrchestrationValidation;
  assert.equal(
    validation.identity.id,
    "ASSISTANT-5:4/WorkspaceOrchestrationValidation",
  );
  assert.equal(
    validation.identity.namespace,
    "nexora.assistant.workspace-orchestration.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.status, "Validation");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(
    validation.identity.sourceModel,
    "ASSISTANT-5:3/WorkspaceOrchestrationModel",
  );
});

test("ASSISTANT-5:4 publishes exactly 40 rules, 16 gates, and 8 categories", () => {
  const validation = AssistantWorkspaceOrchestrationValidation;
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

test("ASSISTANT-5:4 identities and metadata are immutable", () => {
  const validation = AssistantWorkspaceOrchestrationValidation;
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
        validationTarget === "ASSISTANT-5:3/WorkspaceOrchestrationModel",
    ),
    true,
  );
  assert.equal(validation.results.manifestEligibility, "Eligible");
  assert.equal(validation.results.validationStatus, "Passed");
});

test("ASSISTANT-5:4 consumes Model only and has no executable validation", () => {
  const validation = AssistantWorkspaceOrchestrationValidation;
  const source = readFileSync(
    new URL(
      "./assistantWorkspaceOrchestrationValidation.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationModel.ts",
    "./assistantWorkspaceOrchestrationValidation.constants.ts",
    "./assistantWorkspaceOrchestrationValidation.gates.ts",
    "./assistantWorkspaceOrchestrationValidation.identity.ts",
    "./assistantWorkspaceOrchestrationValidation.rules.ts",
    "./assistantWorkspaceOrchestrationValidation.results.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationManifest"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "ASSISTANT-5:3 Workspace Orchestration Model",
  ]);
  assert.equal(
    validation.model.identity.id,
    "ASSISTANT-5:3/WorkspaceOrchestrationModel",
  );
  assert.equal(validation.executableValidation, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.workspaceExecution, false);
  assert.equal(validation.workspaceRouting, false);
  assert.equal(validation.workspaceSwitching, false);
  assert.equal(validation.orchestrationEngine, false);
  assert.equal(validation.scheduling, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.networking, false);
});
