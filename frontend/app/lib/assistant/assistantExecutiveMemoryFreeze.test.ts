import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryFreeze } from "./assistantExecutiveMemoryFreeze.ts";

const files = [
  "assistantExecutiveMemoryFreeze.baselines.ts",
  "assistantExecutiveMemoryFreeze.compatibility.ts",
  "assistantExecutiveMemoryFreeze.constants.ts",
  "assistantExecutiveMemoryFreeze.identity.ts",
  "assistantExecutiveMemoryFreeze.lock.ts",
  "assistantExecutiveMemoryFreeze.test.ts",
  "assistantExecutiveMemoryFreeze.ts",
  "assistantExecutiveMemoryFreeze.types.ts",
];

test("ASSISTANT-2:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantExecutiveMemoryFreeze;
  assert.equal(freeze.identity.id, "ASSISTANT-2:8/ExecutiveMemoryFreeze");
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.executive-memory.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-2:8 publishes permanent lock identifier", () => {
  const freeze = AssistantExecutiveMemoryFreeze;
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-2-EXECUTIVE-MEMORY-LOCKED",
  );
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-2-EXECUTIVE-MEMORY-LOCKED",
  );
  assert.equal(
    freeze.constants.lockIdentifier,
    "ASSISTANT-2-EXECUTIVE-MEMORY-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockIdentifier,
    "ASSISTANT-2-EXECUTIVE-MEMORY-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-2:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantExecutiveMemoryFreeze;
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

test("ASSISTANT-2:8 identities and metadata are immutable", () => {
  const freeze = AssistantExecutiveMemoryFreeze;
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

test("ASSISTANT-2:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantExecutiveMemoryFreeze;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryFreeze.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryCertification.ts",
    "./assistantExecutiveMemoryFreeze.baselines.ts",
    "./assistantExecutiveMemoryFreeze.compatibility.ts",
    "./assistantExecutiveMemoryFreeze.constants.ts",
    "./assistantExecutiveMemoryFreeze.identity.ts",
    "./assistantExecutiveMemoryFreeze.lock.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryPlatform"), false);
  assert.equal(source.includes("assistantExecutiveMemoryManifest"), false);
  assert.equal(source.includes("assistantExecutiveMemoryValidation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryModel"), false);
  assert.equal(source.includes("assistantExecutiveMemoryRegistry"), false);
  assert.equal(source.includes("assistantExecutiveMemoryFoundation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryPublicIndex"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-2:7 Executive Memory Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-2:7/ExecutiveMemoryCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-2:7/ExecutiveMemoryCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.memoryPersistence, false);
  assert.equal(freeze.vectorDatabase, false);
  assert.equal(freeze.retrieval, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-2:8 export integrity remains metadata-only", () => {
  const freeze = AssistantExecutiveMemoryFreeze;
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantExecutiveMemoryFreeze",
  ]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-2:9 — Executive Memory Public Index",
  );
});
