import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveActionPlanningCertification } from "./assistantExecutiveActionPlanningCertification.ts";

const files = [
  "assistantExecutiveActionPlanningCertification.constants.ts",
  "assistantExecutiveActionPlanningCertification.criteria.ts",
  "assistantExecutiveActionPlanningCertification.gates.ts",
  "assistantExecutiveActionPlanningCertification.identity.ts",
  "assistantExecutiveActionPlanningCertification.results.ts",
  "assistantExecutiveActionPlanningCertification.test.ts",
  "assistantExecutiveActionPlanningCertification.ts",
  "assistantExecutiveActionPlanningCertification.types.ts",
];

test("ASSISTANT-7:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:7 publishes canonical Certification identity", () => {
  const certification = AssistantExecutiveActionPlanningCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-7:7/ExecutiveActionPlanningCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.executive-action-planning.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-7:6/ExecutiveActionPlanningPlatform",
  );
});

test("ASSISTANT-7:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantExecutiveActionPlanningCertification;
  assert.equal(certification.criteria.length, 18);
  assert.equal(certification.gates.length, 16);
  assert.equal(certification.results.criteriaCount, 18);
  assert.equal(certification.results.gateCount, 16);
  assert.equal(certification.constants.criteriaCount, 18);
  assert.equal(certification.constants.gateCount, 16);
  assert.equal(certification.metadata.criteriaCount, 18);
  assert.equal(certification.metadata.gateCount, 16);
  assert.equal(certification.statistics.certificationCriteriaCount, 18);
  assert.equal(certification.statistics.certificationGateCount, 16);
  assert.equal(certification.statistics.certificationCategoryCount, 10);
  assert.equal(certification.statistics.certifiedMetadataCount, 8);
  assert.equal(certification.canonicalInventoryRuleSatisfied, true);
  assert.deepEqual(
    certification.gates.map(({ name }) => name),
    [
      "Identity Gate",
      "Namespace Gate",
      "Version Gate",
      "Foundation Gate",
      "Registry Gate",
      "Model Gate",
      "Validation Gate",
      "Manifest Gate",
      "Platform Gate",
      "Metadata Gate",
      "Dependency Gate",
      "Compatibility Gate",
      "Architecture Gate",
      "Consumer Readiness Gate",
      "Final Approval Gate",
      "ReadyForFreeze Gate",
    ],
  );
});

test("ASSISTANT-7:7 identities and metadata are immutable", () => {
  const certification = AssistantExecutiveActionPlanningCertification;
  assert.equal(
    new Set(certification.criteria.map(({ criterionId }) => criterionId))
      .size,
    18,
  );
  assert.equal(
    new Set(certification.gates.map(({ gateId }) => gateId)).size,
    16,
  );
  assert.equal(certification.criteria.every(Object.isFrozen), true);
  assert.equal(certification.gates.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(certification), true);
  assert.equal(Object.isFrozen(certification.results), true);
  assert.equal(Object.isFrozen(certification.metadata), true);
  assert.deepEqual(
    certification.criteria.map(({ order }) => order),
    certification.criteria.map((_, index) => index + 1),
  );
});

test("ASSISTANT-7:7 preserves Platform canonical identity", () => {
  const certification = AssistantExecutiveActionPlanningCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-7:6/ExecutiveActionPlanningPlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-7:6/ExecutiveActionPlanningPlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ validationTarget }) =>
        validationTarget ===
          "ASSISTANT-7:6/ExecutiveActionPlanningPlatform",
    ),
    true,
  );
});

test("ASSISTANT-7:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantExecutiveActionPlanningCertification;
  const source = readFileSync(
    new URL(
      "./assistantExecutiveActionPlanningCertification.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveActionPlanningPlatform.ts",
    "./assistantExecutiveActionPlanningCertification.constants.ts",
    "./assistantExecutiveActionPlanningCertification.criteria.ts",
    "./assistantExecutiveActionPlanningCertification.gates.ts",
    "./assistantExecutiveActionPlanningCertification.identity.ts",
    "./assistantExecutiveActionPlanningCertification.results.ts",
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningModel"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFreeze"),
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
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-7:6 Executive Action Planning Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.planningEngine, false);
  assert.equal(certification.taskExecution, false);
  assert.equal(certification.scheduling, false);
  assert.equal(certification.assignment, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-7:7 export integrity remains metadata-only", () => {
  const certification = AssistantExecutiveActionPlanningCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantExecutiveActionPlanningCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(
    certification.nextPhase,
    "ASSISTANT-7:8 — Executive Action Planning Freeze",
  );
});
