import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveActionPlanningFreeze } from "./assistantExecutiveActionPlanningFreeze.ts";

const files = [
  "assistantExecutiveActionPlanningFreeze.baselines.ts",
  "assistantExecutiveActionPlanningFreeze.compatibility.ts",
  "assistantExecutiveActionPlanningFreeze.constants.ts",
  "assistantExecutiveActionPlanningFreeze.identity.ts",
  "assistantExecutiveActionPlanningFreeze.lock.ts",
  "assistantExecutiveActionPlanningFreeze.test.ts",
  "assistantExecutiveActionPlanningFreeze.ts",
  "assistantExecutiveActionPlanningFreeze.types.ts",
];

test("ASSISTANT-7:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantExecutiveActionPlanningFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-7:8/ExecutiveActionPlanningFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.executive-action-planning.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-7:8 publishes permanent lock identifier", () => {
  const freeze = AssistantExecutiveActionPlanningFreeze;
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-7-EXECUTIVE-ACTION-PLANNING-LOCKED",
  );
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-7-EXECUTIVE-ACTION-PLANNING-LOCKED",
  );
  assert.equal(
    freeze.constants.lockIdentifier,
    "ASSISTANT-7-EXECUTIVE-ACTION-PLANNING-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockIdentifier,
    "ASSISTANT-7-EXECUTIVE-ACTION-PLANNING-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-7:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantExecutiveActionPlanningFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.compatibility.length, 8);
  assert.equal(freeze.architecturalLocks.length, 12);
  assert.equal(freeze.architectureRegistry.length, 7);
  assert.equal(freeze.constants.baselineCount, 8);
  assert.equal(freeze.constants.compatibilityCount, 8);
  assert.equal(freeze.constants.lockCount, 12);
  assert.equal(freeze.constants.registryEntryCount, 7);
  assert.equal(freeze.constants.frozenRegistryEntryCount, 7);
  assert.equal(freeze.metadata.baselineCount, 8);
  assert.equal(freeze.metadata.compatibilityCount, 8);
  assert.equal(freeze.metadata.architecturalLockCount, 12);
  assert.equal(freeze.metadata.frozenRegistryEntryCount, 7);
  assert.equal(freeze.canonicalInventoryRuleSatisfied, true);
});

test("ASSISTANT-7:8 identities and metadata are immutable", () => {
  const freeze = AssistantExecutiveActionPlanningFreeze;
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
  assert.deepEqual(
    freeze.baselines.map(({ order }) => order),
    freeze.baselines.map((_, index) => index + 1),
  );
});

test("ASSISTANT-7:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantExecutiveActionPlanningFreeze;
  const source = readFileSync(
    new URL(
      "./assistantExecutiveActionPlanningFreeze.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveActionPlanningCertification.ts",
    "./assistantExecutiveActionPlanningFreeze.baselines.ts",
    "./assistantExecutiveActionPlanningFreeze.compatibility.ts",
    "./assistantExecutiveActionPlanningFreeze.constants.ts",
    "./assistantExecutiveActionPlanningFreeze.identity.ts",
    "./assistantExecutiveActionPlanningFreeze.lock.ts",
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningModel"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningPublicIndex"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagement"),
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
    "ASSISTANT-7:7 Executive Action Planning Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-7:7/ExecutiveActionPlanningCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-7:7/ExecutiveActionPlanningCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.planningEngine, false);
  assert.equal(freeze.taskExecution, false);
  assert.equal(freeze.scheduling, false);
  assert.equal(freeze.assignment, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-7:8 export integrity remains metadata-only", () => {
  const freeze = AssistantExecutiveActionPlanningFreeze;
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantExecutiveActionPlanningFreeze",
  ]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-7:9 — Executive Action Planning Public Index",
  );
});
