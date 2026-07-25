import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryCertification } from "./assistantExecutiveMemoryCertification.ts";

const files = [
  "assistantExecutiveMemoryCertification.constants.ts",
  "assistantExecutiveMemoryCertification.criteria.ts",
  "assistantExecutiveMemoryCertification.gates.ts",
  "assistantExecutiveMemoryCertification.identity.ts",
  "assistantExecutiveMemoryCertification.results.ts",
  "assistantExecutiveMemoryCertification.test.ts",
  "assistantExecutiveMemoryCertification.ts",
  "assistantExecutiveMemoryCertification.types.ts",
];

test("ASSISTANT-2:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:7 publishes canonical Certification identity", () => {
  const certification = AssistantExecutiveMemoryCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-2:7/ExecutiveMemoryCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.executive-memory.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-2:6/ExecutiveMemoryPlatform",
  );
});

test("ASSISTANT-2:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantExecutiveMemoryCertification;
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

test("ASSISTANT-2:7 identities and metadata are immutable", () => {
  const certification = AssistantExecutiveMemoryCertification;
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

test("ASSISTANT-2:7 preserves Platform canonical identity", () => {
  const certification = AssistantExecutiveMemoryCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-2:6/ExecutiveMemoryPlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-2:6/ExecutiveMemoryPlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ validationTarget }) =>
        validationTarget === "ASSISTANT-2:6/ExecutiveMemoryPlatform",
    ),
    true,
  );
});

test("ASSISTANT-2:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantExecutiveMemoryCertification;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryCertification.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryPlatform.ts",
    "./assistantExecutiveMemoryCertification.constants.ts",
    "./assistantExecutiveMemoryCertification.criteria.ts",
    "./assistantExecutiveMemoryCertification.gates.ts",
    "./assistantExecutiveMemoryCertification.identity.ts",
    "./assistantExecutiveMemoryCertification.results.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryManifest"), false);
  assert.equal(source.includes("assistantExecutiveMemoryValidation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryModel"), false);
  assert.equal(source.includes("assistantExecutiveMemoryRegistry"), false);
  assert.equal(source.includes("assistantExecutiveMemoryFoundation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryFreeze"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-2:6 Executive Memory Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.memoryPersistence, false);
  assert.equal(certification.vectorDatabase, false);
  assert.equal(certification.retrieval, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-2:7 export integrity remains metadata-only", () => {
  const certification = AssistantExecutiveMemoryCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantExecutiveMemoryCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(
    certification.nextPhase,
    "ASSISTANT-2:8 — Executive Memory Freeze",
  );
});
