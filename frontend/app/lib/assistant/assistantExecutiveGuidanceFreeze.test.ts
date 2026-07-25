import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveGuidanceFreeze } from "./assistantExecutiveGuidanceFreeze.ts";

const files = [
  "assistantExecutiveGuidanceFreeze.baselines.ts",
  "assistantExecutiveGuidanceFreeze.compatibility.ts",
  "assistantExecutiveGuidanceFreeze.constants.ts",
  "assistantExecutiveGuidanceFreeze.identity.ts",
  "assistantExecutiveGuidanceFreeze.lock.ts",
  "assistantExecutiveGuidanceFreeze.test.ts",
  "assistantExecutiveGuidanceFreeze.ts",
  "assistantExecutiveGuidanceFreeze.types.ts",
];

test("ASSISTANT-4:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-4:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantExecutiveGuidanceFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-4:8/ExecutiveGuidanceFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.executive-guidance.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-4:8 publishes permanent lock identifier", () => {
  const freeze = AssistantExecutiveGuidanceFreeze;
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-4-EXECUTIVE-GUIDANCE-LOCKED",
  );
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-4-EXECUTIVE-GUIDANCE-LOCKED",
  );
  assert.equal(
    freeze.constants.lockIdentifier,
    "ASSISTANT-4-EXECUTIVE-GUIDANCE-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockIdentifier,
    "ASSISTANT-4-EXECUTIVE-GUIDANCE-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-4:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantExecutiveGuidanceFreeze;
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

test("ASSISTANT-4:8 identities and metadata are immutable", () => {
  const freeze = AssistantExecutiveGuidanceFreeze;
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

test("ASSISTANT-4:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantExecutiveGuidanceFreeze;
  const source = readFileSync(
    new URL("./assistantExecutiveGuidanceFreeze.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveGuidanceCertification.ts",
    "./assistantExecutiveGuidanceFreeze.baselines.ts",
    "./assistantExecutiveGuidanceFreeze.compatibility.ts",
    "./assistantExecutiveGuidanceFreeze.constants.ts",
    "./assistantExecutiveGuidanceFreeze.identity.ts",
    "./assistantExecutiveGuidanceFreeze.lock.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveGuidancePlatform"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceManifest"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceValidation"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceModel"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceRegistry"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceFoundation"), false);
  assert.equal(
    source.includes("assistantExecutiveGuidancePublicIndex"),
    false,
  );
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-4:7 Executive Guidance Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-4:7/ExecutiveGuidanceCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-4:7/ExecutiveGuidanceCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.recommendationGeneration, false);
  assert.equal(freeze.coachingGeneration, false);
  assert.equal(freeze.decisionGeneration, false);
  assert.equal(freeze.actionPlanning, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-4:8 export integrity remains metadata-only", () => {
  const freeze = AssistantExecutiveGuidanceFreeze;
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantExecutiveGuidanceFreeze",
  ]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-4:9 — Executive Guidance Public Index",
  );
});
