import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantObjectContextManagementFreeze } from "./assistantObjectContextManagementFreeze.ts";

const files = [
  "assistantObjectContextManagementFreeze.baselines.ts",
  "assistantObjectContextManagementFreeze.compatibility.ts",
  "assistantObjectContextManagementFreeze.constants.ts",
  "assistantObjectContextManagementFreeze.identity.ts",
  "assistantObjectContextManagementFreeze.lock.ts",
  "assistantObjectContextManagementFreeze.test.ts",
  "assistantObjectContextManagementFreeze.ts",
  "assistantObjectContextManagementFreeze.types.ts",
];

test("ASSISTANT-6:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-6:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantObjectContextManagementFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-6:8/ObjectContextManagementFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.object-context-management.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-6:8 publishes permanent lock identifier", () => {
  const freeze = AssistantObjectContextManagementFreeze;
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
  );
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
  );
  assert.equal(
    freeze.constants.lockIdentifier,
    "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockIdentifier,
    "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-6:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantObjectContextManagementFreeze;
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

test("ASSISTANT-6:8 identities and metadata are immutable", () => {
  const freeze = AssistantObjectContextManagementFreeze;
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

test("ASSISTANT-6:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantObjectContextManagementFreeze;
  const source = readFileSync(
    new URL(
      "./assistantObjectContextManagementFreeze.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantObjectContextManagementCertification.ts",
    "./assistantObjectContextManagementFreeze.baselines.ts",
    "./assistantObjectContextManagementFreeze.compatibility.ts",
    "./assistantObjectContextManagementFreeze.constants.ts",
    "./assistantObjectContextManagementFreeze.identity.ts",
    "./assistantObjectContextManagementFreeze.lock.ts",
  ]);
  assert.equal(
    source.includes("assistantObjectContextManagementPlatform"),
    false,
  );
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
    source.includes("assistantObjectContextManagementPublicIndex"),
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
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-6:7 Object & Context Management Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-6:7/ObjectContextManagementCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-6:7/ObjectContextManagementCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.objectCreation, false);
  assert.equal(freeze.objectPersistence, false);
  assert.equal(freeze.contextPersistence, false);
  assert.equal(freeze.contextSynchronization, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-6:8 export integrity remains metadata-only", () => {
  const freeze = AssistantObjectContextManagementFreeze;
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantObjectContextManagementFreeze",
  ]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-6:9 — Object & Context Management Public Index",
  );
});
