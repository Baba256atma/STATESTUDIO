import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantIntentDialogueFreeze } from "./assistantIntentDialogueFreeze.ts";

const files = [
  "assistantIntentDialogueFreeze.baselines.ts",
  "assistantIntentDialogueFreeze.compatibility.ts",
  "assistantIntentDialogueFreeze.constants.ts",
  "assistantIntentDialogueFreeze.identity.ts",
  "assistantIntentDialogueFreeze.lock.ts",
  "assistantIntentDialogueFreeze.test.ts",
  "assistantIntentDialogueFreeze.ts",
  "assistantIntentDialogueFreeze.types.ts",
];

test("ASSISTANT-3:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:8 publishes canonical Freeze identity", () => {
  const freeze = AssistantIntentDialogueFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-3:8/IntentDialogueUnderstandingFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.intent-dialogue.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-3:8 publishes permanent lock identifier", () => {
  const freeze = AssistantIntentDialogueFreeze;
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-3-INTENT-DIALOGUE-UNDERSTANDING-LOCKED",
  );
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-3-INTENT-DIALOGUE-UNDERSTANDING-LOCKED",
  );
  assert.equal(
    freeze.constants.lockIdentifier,
    "ASSISTANT-3-INTENT-DIALOGUE-UNDERSTANDING-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockIdentifier,
    "ASSISTANT-3-INTENT-DIALOGUE-UNDERSTANDING-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
});

test("ASSISTANT-3:8 publishes exact freeze inventory counts", () => {
  const freeze = AssistantIntentDialogueFreeze;
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

test("ASSISTANT-3:8 identities and metadata are immutable", () => {
  const freeze = AssistantIntentDialogueFreeze;
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

test("ASSISTANT-3:8 consumes Certification only and has no prohibited dependencies", () => {
  const freeze = AssistantIntentDialogueFreeze;
  const source = readFileSync(
    new URL("./assistantIntentDialogueFreeze.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantIntentDialogueCertification.ts",
    "./assistantIntentDialogueFreeze.baselines.ts",
    "./assistantIntentDialogueFreeze.compatibility.ts",
    "./assistantIntentDialogueFreeze.constants.ts",
    "./assistantIntentDialogueFreeze.identity.ts",
    "./assistantIntentDialogueFreeze.lock.ts",
  ]);
  assert.equal(source.includes("assistantIntentDialoguePlatform"), false);
  assert.equal(source.includes("assistantIntentDialogueManifest"), false);
  assert.equal(source.includes("assistantIntentDialogueValidation"), false);
  assert.equal(source.includes("assistantIntentDialogueModel"), false);
  assert.equal(source.includes("assistantIntentDialogueRegistry"), false);
  assert.equal(source.includes("assistantIntentDialogueFoundation"), false);
  assert.equal(source.includes("assistantIntentDialoguePublicIndex"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-3:7 Intent & Dialogue Understanding Certification",
  ]);
  assert.equal(
    freeze.identity.sourceCertification,
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification",
  );
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification",
  );
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.intentClassification, false);
  assert.equal(freeze.nlp, false);
  assert.equal(freeze.naturalLanguageParsing, false);
  assert.equal(freeze.dialogueExecution, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.builders, false);
  assert.equal(freeze.executors, false);
});

test("ASSISTANT-3:8 export integrity remains metadata-only", () => {
  const freeze = AssistantIntentDialogueFreeze;
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantIntentDialogueFreeze",
  ]);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
  assert.equal(
    freeze.nextPhase,
    "ASSISTANT-3:9 — Intent & Dialogue Understanding Public Index",
  );
});
