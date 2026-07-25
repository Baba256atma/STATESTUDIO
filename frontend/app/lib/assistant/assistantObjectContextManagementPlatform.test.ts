import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantObjectContextManagementPlatform } from "./assistantObjectContextManagementPlatform.ts";

const files = [
  "assistantObjectContextManagementPlatform.capabilities.ts",
  "assistantObjectContextManagementPlatform.compatibility.ts",
  "assistantObjectContextManagementPlatform.constants.ts",
  "assistantObjectContextManagementPlatform.guarantees.ts",
  "assistantObjectContextManagementPlatform.identity.ts",
  "assistantObjectContextManagementPlatform.test.ts",
  "assistantObjectContextManagementPlatform.ts",
  "assistantObjectContextManagementPlatform.types.ts",
];

test("ASSISTANT-6:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-6:6 publishes canonical Platform identity", () => {
  const platform = AssistantObjectContextManagementPlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-6:6/ObjectContextManagementPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.object-context-management.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.status, "Platform");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
  assert.equal(
    platform.identity.sourceManifest,
    "ASSISTANT-6:5/ObjectContextManagementManifest",
  );
});

test("ASSISTANT-6:6 publishes exact immutable declarations", () => {
  const platform = AssistantObjectContextManagementPlatform;
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

test("ASSISTANT-6:6 preserves canonical Manifest composition", () => {
  const platform = AssistantObjectContextManagementPlatform;
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

test("ASSISTANT-6:6 consumes Manifest only and has no prohibited behavior", () => {
  const platform = AssistantObjectContextManagementPlatform;
  const source = readFileSync(
    new URL(
      "./assistantObjectContextManagementPlatform.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantObjectContextManagementManifest.ts",
    "./assistantObjectContextManagementPlatform.capabilities.ts",
    "./assistantObjectContextManagementPlatform.compatibility.ts",
    "./assistantObjectContextManagementPlatform.constants.ts",
    "./assistantObjectContextManagementPlatform.guarantees.ts",
    "./assistantObjectContextManagementPlatform.identity.ts",
  ]);
  assert.equal(
    source.includes("assistantObjectContextManagementValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementModel"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementCertification"),
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
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-6:5 Object & Context Management Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-6:5/ObjectContextManagementManifest",
  );
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableLogic, false);
  assert.equal(platform.objectCreation, false);
  assert.equal(platform.objectPersistence, false);
  assert.equal(platform.contextPersistence, false);
  assert.equal(platform.contextSynchronization, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.services, false);
  assert.equal(platform.factories, false);
  assert.equal(platform.builders, false);
});
