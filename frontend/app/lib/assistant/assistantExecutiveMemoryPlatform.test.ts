import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryPlatform } from "./assistantExecutiveMemoryPlatform.ts";

const files = [
  "assistantExecutiveMemoryPlatform.capabilities.ts",
  "assistantExecutiveMemoryPlatform.compatibility.ts",
  "assistantExecutiveMemoryPlatform.constants.ts",
  "assistantExecutiveMemoryPlatform.guarantees.ts",
  "assistantExecutiveMemoryPlatform.identity.ts",
  "assistantExecutiveMemoryPlatform.test.ts",
  "assistantExecutiveMemoryPlatform.ts",
  "assistantExecutiveMemoryPlatform.types.ts",
];

test("ASSISTANT-2:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:6 publishes canonical Platform identity", () => {
  const platform = AssistantExecutiveMemoryPlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-2:6/ExecutiveMemoryPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.executive-memory.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.status, "Platform");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
  assert.equal(
    platform.identity.sourceManifest,
    "ASSISTANT-2:5/ExecutiveMemoryManifest",
  );
});

test("ASSISTANT-2:6 publishes exact immutable declarations", () => {
  const platform = AssistantExecutiveMemoryPlatform;
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

test("ASSISTANT-2:6 preserves canonical Manifest composition", () => {
  const platform = AssistantExecutiveMemoryPlatform;
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

test("ASSISTANT-2:6 consumes Manifest only and has no prohibited behavior", () => {
  const platform = AssistantExecutiveMemoryPlatform;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryPlatform.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryManifest.ts",
    "./assistantExecutiveMemoryPlatform.capabilities.ts",
    "./assistantExecutiveMemoryPlatform.compatibility.ts",
    "./assistantExecutiveMemoryPlatform.constants.ts",
    "./assistantExecutiveMemoryPlatform.guarantees.ts",
    "./assistantExecutiveMemoryPlatform.identity.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryValidation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryModel"), false);
  assert.equal(
    source.includes("assistantExecutiveMemoryCertification"),
    false,
  );
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-2:5 Executive Memory Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-2:5/ExecutiveMemoryManifest",
  );
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableLogic, false);
  assert.equal(platform.memoryPersistence, false);
  assert.equal(platform.vectorDatabase, false);
  assert.equal(platform.retrieval, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.services, false);
  assert.equal(platform.factories, false);
  assert.equal(platform.builders, false);
});
