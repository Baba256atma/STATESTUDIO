import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantIntentDialoguePlatform } from "./assistantIntentDialoguePlatform.ts";

const files = [
  "assistantIntentDialoguePlatform.capabilities.ts",
  "assistantIntentDialoguePlatform.compatibility.ts",
  "assistantIntentDialoguePlatform.constants.ts",
  "assistantIntentDialoguePlatform.guarantees.ts",
  "assistantIntentDialoguePlatform.identity.ts",
  "assistantIntentDialoguePlatform.test.ts",
  "assistantIntentDialoguePlatform.ts",
  "assistantIntentDialoguePlatform.types.ts",
];

test("ASSISTANT-3:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:6 publishes canonical Platform identity", () => {
  const platform = AssistantIntentDialoguePlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.intent-dialogue.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.status, "Platform");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
  assert.equal(
    platform.identity.sourceManifest,
    "ASSISTANT-3:5/IntentDialogueUnderstandingManifest",
  );
});

test("ASSISTANT-3:6 publishes exact immutable declarations", () => {
  const platform = AssistantIntentDialoguePlatform;
  assert.equal(platform.capabilities.length, 12);
  assert.equal(platform.guarantees.length, 18);
  assert.equal(platform.compatibility.length, 12);
  assert.equal(platform.constants.capabilityCount, 12);
  assert.equal(platform.constants.guaranteeCount, 18);
  assert.equal(platform.constants.compatibilityCount, 12);
  assert.equal(platform.statistics.platformCapabilityCount, 12);
  assert.equal(platform.statistics.platformGuaranteeCount, 18);
  assert.equal(platform.statistics.compatibilityCount, 12);
  assert.equal(platform.capabilities.every(Object.isFrozen), true);
  assert.equal(platform.guarantees.every(Object.isFrozen), true);
  assert.equal(platform.compatibility.every(Object.isFrozen), true);
});

test("ASSISTANT-3:6 preserves canonical Manifest composition", () => {
  const platform = AssistantIntentDialoguePlatform;
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(
    platform.composition.model,
    platform.manifest.inventory.domainModelInventory,
  );
  assert.equal(
    platform.composition.registry,
    platform.manifest.inventory.registryInventory,
  );
  assert.equal(
    platform.composition.validation,
    platform.manifest.validation,
  );
  assert.equal(
    platform.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.equal(
    platform.statistics.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.equal(Object.isFrozen(platform), true);
});

test("ASSISTANT-3:6 consumes Manifest only and has no prohibited behavior", () => {
  const platform = AssistantIntentDialoguePlatform;
  const source = readFileSync(
    new URL("./assistantIntentDialoguePlatform.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantIntentDialogueManifest.ts",
    "./assistantIntentDialoguePlatform.capabilities.ts",
    "./assistantIntentDialoguePlatform.compatibility.ts",
    "./assistantIntentDialoguePlatform.constants.ts",
    "./assistantIntentDialoguePlatform.guarantees.ts",
    "./assistantIntentDialoguePlatform.identity.ts",
  ]);
  assert.equal(source.includes("assistantIntentDialogueValidation"), false);
  assert.equal(source.includes("assistantIntentDialogueModel"), false);
  assert.equal(
    source.includes("assistantIntentDialogueCertification"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-3:5 Intent & Dialogue Understanding Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-3:5/IntentDialogueUnderstandingManifest",
  );
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableLogic, false);
  assert.equal(platform.intentClassification, false);
  assert.equal(platform.nlp, false);
  assert.equal(platform.naturalLanguageParsing, false);
  assert.equal(platform.dialogueExecution, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.services, false);
  assert.equal(platform.factories, false);
  assert.equal(platform.builders, false);
});
