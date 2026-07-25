import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationFreeze } from "./assistantWorkspaceOrchestrationFreeze.ts";

const files = [
  "assistantWorkspaceOrchestrationFreeze.baselines.ts",
  "assistantWorkspaceOrchestrationFreeze.compatibility.ts",
  "assistantWorkspaceOrchestrationFreeze.constants.ts",
  "assistantWorkspaceOrchestrationFreeze.identity.ts",
  "assistantWorkspaceOrchestrationFreeze.lock.ts",
  "assistantWorkspaceOrchestrationFreeze.test.ts",
  "assistantWorkspaceOrchestrationFreeze.ts",
  "assistantWorkspaceOrchestrationFreeze.types.ts",
];

test("ASSISTANT-5:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantWorkspaceOrchestrationFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-5:8/WorkspaceOrchestrationFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.workspace-orchestration.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-5:8 publishes permanent lock identifier", () => {
  const freeze = AssistantWorkspaceOrchestrationFreeze;
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
  );
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
  );
  assert.equal(
    freeze.constants.lockIdentifier,
    "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockIdentifier,
    "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-5:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantWorkspaceOrchestrationFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.compatibility.length, 8);
  assert.equal(freeze.architecturalLocks.length, 12);
  assert.equal(freeze.architectureRegistry.length, 7);
  assert.equal(freeze.constants.baselineCount, 8);
  assert.equal(freeze.constants.compatibilityCount, 8);
  assert.equal(freeze.constants.lockCount, 12);
  assert.equal(freeze.constants.registryEntryCount, 7);
  assert.equal(freeze.metadata.baselineCount, 8);
  assert.equal(freeze.metadata.compatibilityCount, 8);
  assert.equal(freeze.metadata.architecturalLockCount, 12);
  assert.equal(freeze.metadata.frozenRegistryEntryCount, 7);
});

test("ASSISTANT-5:8 identities and metadata are immutable", () => {
  const freeze = AssistantWorkspaceOrchestrationFreeze;
  assert.equal(
    new Set(freeze.baselines.map(({ baselineId }) => baselineId)).size,
    8,
  );
  assert.equal(
    new Set(freeze.compatibility.map(({ id }) => id)).size,
    8,
  );
  assert.equal(
    new Set(freeze.architecturalLocks.map(({ lockId }) => lockId)).size,
    12,
  );
  assert.equal(
    new Set(freeze.architectureRegistry.map(({ entryId }) => entryId)).size,
    7,
  );
  assert.equal(freeze.baselines.every(Object.isFrozen), true);
  assert.equal(freeze.compatibility.every(Object.isFrozen), true);
  assert.equal(freeze.architecturalLocks.every(Object.isFrozen), true);
  assert.equal(freeze.architectureRegistry.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.lock), true);
  assert.equal(Object.isFrozen(freeze.metadata), true);
});

test("ASSISTANT-5:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantWorkspaceOrchestrationFreeze;
  const source = readFileSync(
    new URL("./assistantWorkspaceOrchestrationFreeze.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationCertification.ts",
    "./assistantWorkspaceOrchestrationFreeze.baselines.ts",
    "./assistantWorkspaceOrchestrationFreeze.compatibility.ts",
    "./assistantWorkspaceOrchestrationFreeze.constants.ts",
    "./assistantWorkspaceOrchestrationFreeze.identity.ts",
    "./assistantWorkspaceOrchestrationFreeze.lock.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationPlatform"),
    false,
  );
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
    source.includes("assistantWorkspaceOrchestrationPublicIndex"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-5:7 Workspace Orchestration Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-5:7/WorkspaceOrchestrationCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-5:7/WorkspaceOrchestrationCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.workspaceExecution, false);
  assert.equal(freeze.workspaceRouting, false);
  assert.equal(freeze.workspaceSwitching, false);
  assert.equal(freeze.orchestrationEngine, false);
  assert.equal(freeze.scheduling, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-5:8 export integrity remains metadata-only", () => {
  const freeze = AssistantWorkspaceOrchestrationFreeze;
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantWorkspaceOrchestrationFreeze",
  ]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-5:9 — Workspace Orchestration Public Index",
  );
});
