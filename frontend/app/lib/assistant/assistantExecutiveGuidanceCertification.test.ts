import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveGuidanceCertification } from "./assistantExecutiveGuidanceCertification.ts";

const files = [
  "assistantExecutiveGuidanceCertification.constants.ts",
  "assistantExecutiveGuidanceCertification.criteria.ts",
  "assistantExecutiveGuidanceCertification.gates.ts",
  "assistantExecutiveGuidanceCertification.identity.ts",
  "assistantExecutiveGuidanceCertification.results.ts",
  "assistantExecutiveGuidanceCertification.test.ts",
  "assistantExecutiveGuidanceCertification.ts",
  "assistantExecutiveGuidanceCertification.types.ts",
];

test("ASSISTANT-4:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-4:7 publishes canonical Certification identity", () => {
  const certification = AssistantExecutiveGuidanceCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-4:7/ExecutiveGuidanceCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.executive-guidance.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-4:6/ExecutiveGuidancePlatform",
  );
});

test("ASSISTANT-4:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantExecutiveGuidanceCertification;
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

test("ASSISTANT-4:7 identities and metadata are immutable", () => {
  const certification = AssistantExecutiveGuidanceCertification;
  assert.equal(
    new Set(certification.criteria.map(({ criterionId }) => criterionId)).size,
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

test("ASSISTANT-4:7 preserves Platform canonical identity", () => {
  const certification = AssistantExecutiveGuidanceCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-4:6/ExecutiveGuidancePlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-4:6/ExecutiveGuidancePlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ validationTarget }) =>
        validationTarget === "ASSISTANT-4:6/ExecutiveGuidancePlatform",
    ),
    true,
  );
});

test("ASSISTANT-4:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantExecutiveGuidanceCertification;
  const source = readFileSync(
    new URL("./assistantExecutiveGuidanceCertification.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveGuidancePlatform.ts",
    "./assistantExecutiveGuidanceCertification.constants.ts",
    "./assistantExecutiveGuidanceCertification.criteria.ts",
    "./assistantExecutiveGuidanceCertification.gates.ts",
    "./assistantExecutiveGuidanceCertification.identity.ts",
    "./assistantExecutiveGuidanceCertification.results.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveGuidanceManifest"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceValidation"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceModel"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceRegistry"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceFoundation"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceFreeze"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-4:6 Executive Guidance Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.recommendationGeneration, false);
  assert.equal(certification.coachingGeneration, false);
  assert.equal(certification.decisionGeneration, false);
  assert.equal(certification.actionPlanning, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-4:7 export integrity remains metadata-only", () => {
  const certification = AssistantExecutiveGuidanceCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantExecutiveGuidanceCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(
    certification.nextPhase,
    "ASSISTANT-4:8 — Executive Guidance Freeze",
  );
});
