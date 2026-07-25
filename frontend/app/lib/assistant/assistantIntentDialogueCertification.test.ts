import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantIntentDialogueCertification } from "./assistantIntentDialogueCertification.ts";

const files = [
  "assistantIntentDialogueCertification.constants.ts",
  "assistantIntentDialogueCertification.criteria.ts",
  "assistantIntentDialogueCertification.gates.ts",
  "assistantIntentDialogueCertification.identity.ts",
  "assistantIntentDialogueCertification.results.ts",
  "assistantIntentDialogueCertification.test.ts",
  "assistantIntentDialogueCertification.ts",
  "assistantIntentDialogueCertification.types.ts",
];

test("ASSISTANT-3:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:7 publishes canonical Certification identity", () => {
  const certification = AssistantIntentDialogueCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.intent-dialogue.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
  );
});

test("ASSISTANT-3:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantIntentDialogueCertification;
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

test("ASSISTANT-3:7 identities and metadata are immutable", () => {
  const certification = AssistantIntentDialogueCertification;
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

test("ASSISTANT-3:7 preserves Platform canonical identity", () => {
  const certification = AssistantIntentDialogueCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ validationTarget }) =>
        validationTarget ===
          "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
    ),
    true,
  );
});

test("ASSISTANT-3:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantIntentDialogueCertification;
  const source = readFileSync(
    new URL("./assistantIntentDialogueCertification.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantIntentDialoguePlatform.ts",
    "./assistantIntentDialogueCertification.constants.ts",
    "./assistantIntentDialogueCertification.criteria.ts",
    "./assistantIntentDialogueCertification.gates.ts",
    "./assistantIntentDialogueCertification.identity.ts",
    "./assistantIntentDialogueCertification.results.ts",
  ]);
  assert.equal(source.includes("assistantIntentDialogueManifest"), false);
  assert.equal(source.includes("assistantIntentDialogueValidation"), false);
  assert.equal(source.includes("assistantIntentDialogueModel"), false);
  assert.equal(source.includes("assistantIntentDialogueRegistry"), false);
  assert.equal(source.includes("assistantIntentDialogueFoundation"), false);
  assert.equal(source.includes("assistantIntentDialogueFreeze"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-3:6 Intent & Dialogue Understanding Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.intentClassification, false);
  assert.equal(certification.nlp, false);
  assert.equal(certification.naturalLanguageParsing, false);
  assert.equal(certification.dialogueExecution, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-3:7 export integrity remains metadata-only", () => {
  const certification = AssistantIntentDialogueCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantIntentDialogueCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(
    certification.nextPhase,
    "ASSISTANT-3:8 — Intent & Dialogue Understanding Freeze",
  );
});
