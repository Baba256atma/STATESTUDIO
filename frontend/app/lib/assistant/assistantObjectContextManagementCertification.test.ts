import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantObjectContextManagementCertification } from "./assistantObjectContextManagementCertification.ts";

const files = [
  "assistantObjectContextManagementCertification.constants.ts",
  "assistantObjectContextManagementCertification.criteria.ts",
  "assistantObjectContextManagementCertification.gates.ts",
  "assistantObjectContextManagementCertification.identity.ts",
  "assistantObjectContextManagementCertification.results.ts",
  "assistantObjectContextManagementCertification.test.ts",
  "assistantObjectContextManagementCertification.ts",
  "assistantObjectContextManagementCertification.types.ts",
];

test("ASSISTANT-6:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-6:7 publishes canonical Certification identity", () => {
  const certification = AssistantObjectContextManagementCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-6:7/ObjectContextManagementCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.object-context-management.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-6:6/ObjectContextManagementPlatform",
  );
});

test("ASSISTANT-6:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantObjectContextManagementCertification;
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
  assert.equal(certification.statistics.certifiedMetadataCount, 7);
});

test("ASSISTANT-6:7 identities and metadata are immutable", () => {
  const certification = AssistantObjectContextManagementCertification;
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
});

test("ASSISTANT-6:7 preserves Platform canonical identity", () => {
  const certification = AssistantObjectContextManagementCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-6:6/ObjectContextManagementPlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-6:6/ObjectContextManagementPlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ validationTarget }) =>
        validationTarget ===
          "ASSISTANT-6:6/ObjectContextManagementPlatform",
    ),
    true,
  );
});

test("ASSISTANT-6:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantObjectContextManagementCertification;
  const source = readFileSync(
    new URL(
      "./assistantObjectContextManagementCertification.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantObjectContextManagementPlatform.ts",
    "./assistantObjectContextManagementCertification.constants.ts",
    "./assistantObjectContextManagementCertification.criteria.ts",
    "./assistantObjectContextManagementCertification.gates.ts",
    "./assistantObjectContextManagementCertification.identity.ts",
    "./assistantObjectContextManagementCertification.results.ts",
  ]);
  assert.equal(
    source.includes("assistantObjectContextManagementManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementModel"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementFreeze"),
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
    "ASSISTANT-6:6 Object & Context Management Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.objectCreation, false);
  assert.equal(certification.objectPersistence, false);
  assert.equal(certification.contextPersistence, false);
  assert.equal(certification.contextSynchronization, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-6:7 export integrity remains metadata-only", () => {
  const certification = AssistantObjectContextManagementCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantObjectContextManagementCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(
    certification.nextPhase,
    "ASSISTANT-6:8 — Object & Context Management Freeze",
  );
});
