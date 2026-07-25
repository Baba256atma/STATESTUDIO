import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationCertification } from "./assistantWorkspaceOrchestrationCertification.ts";

const files = [
  "assistantWorkspaceOrchestrationCertification.constants.ts",
  "assistantWorkspaceOrchestrationCertification.criteria.ts",
  "assistantWorkspaceOrchestrationCertification.gates.ts",
  "assistantWorkspaceOrchestrationCertification.identity.ts",
  "assistantWorkspaceOrchestrationCertification.results.ts",
  "assistantWorkspaceOrchestrationCertification.test.ts",
  "assistantWorkspaceOrchestrationCertification.ts",
  "assistantWorkspaceOrchestrationCertification.types.ts",
];

test("ASSISTANT-5:7 consists of exactly eight Certification artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:7 publishes canonical Certification identity", () => {
  const certification = AssistantWorkspaceOrchestrationCertification;
  assert.equal(
    certification.identity.id,
    "ASSISTANT-5:7/WorkspaceOrchestrationCertification",
  );
  assert.equal(
    certification.identity.namespace,
    "nexora.assistant.workspace-orchestration.certification",
  );
  assert.equal(certification.identity.version, "1.0.0");
  assert.equal(certification.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-5:6/WorkspaceOrchestrationPlatform",
  );
});

test("ASSISTANT-5:7 publishes exactly 18 criteria and 16 gates", () => {
  const certification = AssistantWorkspaceOrchestrationCertification;
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

test("ASSISTANT-5:7 identities and metadata are immutable", () => {
  const certification = AssistantWorkspaceOrchestrationCertification;
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

test("ASSISTANT-5:7 preserves Platform canonical identity", () => {
  const certification = AssistantWorkspaceOrchestrationCertification;
  assert.equal(
    certification.platform.identity.id,
    "ASSISTANT-5:6/WorkspaceOrchestrationPlatform",
  );
  assert.equal(
    certification.identity.sourcePlatform,
    "ASSISTANT-5:6/WorkspaceOrchestrationPlatform",
  );
  assert.equal(
    certification.criteria.every(
      ({ validationTarget }) =>
        validationTarget === "ASSISTANT-5:6/WorkspaceOrchestrationPlatform",
    ),
    true,
  );
});

test("ASSISTANT-5:7 consumes Platform only and has no prohibited dependencies", () => {
  const certification = AssistantWorkspaceOrchestrationCertification;
  const source = readFileSync(
    new URL(
      "./assistantWorkspaceOrchestrationCertification.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationPlatform.ts",
    "./assistantWorkspaceOrchestrationCertification.constants.ts",
    "./assistantWorkspaceOrchestrationCertification.criteria.ts",
    "./assistantWorkspaceOrchestrationCertification.gates.ts",
    "./assistantWorkspaceOrchestrationCertification.identity.ts",
    "./assistantWorkspaceOrchestrationCertification.results.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationModel"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationFreeze"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(certification.upstreamDependencies, [
    "ASSISTANT-5:6 Workspace Orchestration Platform",
  ]);
  assert.equal(certification.executableLogic, false);
  assert.equal(certification.runtime, false);
  assert.equal(certification.workspaceExecution, false);
  assert.equal(certification.workspaceRouting, false);
  assert.equal(certification.workspaceSwitching, false);
  assert.equal(certification.orchestrationEngine, false);
  assert.equal(certification.scheduling, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.results.freezeEligibility, "Eligible");
  assert.equal(certification.results.certificationStatus, "Certified");
});

test("ASSISTANT-5:7 export integrity remains metadata-only", () => {
  const certification = AssistantWorkspaceOrchestrationCertification;
  assert.deepEqual(certification.publicApiSurface, [
    "AssistantWorkspaceOrchestrationCertification",
  ]);
  assert.equal(certification.metadataOnly, true);
  assert.equal(certification.immutable, true);
  assert.equal(
    certification.nextPhase,
    "ASSISTANT-5:8 — Workspace Orchestration Freeze",
  );
});
