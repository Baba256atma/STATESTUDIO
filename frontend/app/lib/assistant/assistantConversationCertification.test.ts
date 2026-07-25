import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantConversationCertification } from "./assistantConversationCertification.ts";

const files = [
  "assistantConversationCertification.constants.ts",
  "assistantConversationCertification.criteria.ts",
  "assistantConversationCertification.gates.ts",
  "assistantConversationCertification.identity.ts",
  "assistantConversationCertification.results.ts",
  "assistantConversationCertification.test.ts",
  "assistantConversationCertification.ts",
  "assistantConversationCertification.types.ts",
];

test("ASSISTANT-1:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:7 publishes canonical Certification identity", () => {
  const certification = AssistantConversationCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-1:7/ConversationCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.conversation.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
});

test("ASSISTANT-1:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantConversationCertification;
  assert.equal(certification.criteria.length, 18);
  assert.equal(certification.gates.length, 16);
  assert.equal(certification.results.criteriaCount, 18);
  assert.equal(certification.results.gateCount, 16);
  assert.equal(certification.constants.criteriaCount, 18);
  assert.equal(certification.constants.gateCount, 16);
  assert.equal(certification.metadata.criteriaCount, 18);
  assert.equal(certification.metadata.gateCount, 16);
});

test("ASSISTANT-1:7 identities and metadata are immutable", () => {
  const certification = AssistantConversationCertification;
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

test("ASSISTANT-1:7 preserves Platform canonical identity", () => {
  const certification = AssistantConversationCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-1:6/ConversationPlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-1:6/ConversationPlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ target }) => target === "ASSISTANT-1:6/ConversationPlatform",
    ),
    true,
  );
});

test("ASSISTANT-1:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantConversationCertification;
  const source = readFileSync(
    new URL("./assistantConversationCertification.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("assistantConversationManifest"), false);
  assert.equal(source.includes("assistantConversationValidation"), false);
  assert.equal(source.includes("assistantConversationModel"), false);
  assert.equal(source.includes("assistantConversationRegistry"), false);
  assert.equal(source.includes("assistantConversationFoundation"), false);
  assert.equal(source.includes("assistantConversationFreeze"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-1:6 Conversation Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-1:7 export integrity remains metadata-only", () => {
  const certification = AssistantConversationCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantConversationCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(certification.nextPhase, "ASSISTANT-1:8 — Conversation Freeze");
});
