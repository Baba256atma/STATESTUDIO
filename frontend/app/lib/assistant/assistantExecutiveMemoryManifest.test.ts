import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveMemoryManifest } from "./assistantExecutiveMemoryManifest.ts";

const files = [
  "assistantExecutiveMemoryManifest.constants.ts",
  "assistantExecutiveMemoryManifest.identity.ts",
  "assistantExecutiveMemoryManifest.inventory.ts",
  "assistantExecutiveMemoryManifest.metadata.ts",
  "assistantExecutiveMemoryManifest.summary.ts",
  "assistantExecutiveMemoryManifest.test.ts",
  "assistantExecutiveMemoryManifest.ts",
  "assistantExecutiveMemoryManifest.types.ts",
];

test("ASSISTANT-2:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:5 publishes canonical Manifest identity", () => {
  const manifest = AssistantExecutiveMemoryManifest;
  assert.equal(
    manifest.identity.id,
    "ASSISTANT-2:5/ExecutiveMemoryManifest",
  );
  assert.equal(
    manifest.identity.namespace,
    "nexora.assistant.executive-memory.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.status, "Manifest");
  assert.equal(manifest.readinessStatus, "ReadyForPlatform");
  assert.equal(
    manifest.identity.sourceValidation,
    "ASSISTANT-2:4/ExecutiveMemoryValidation",
  );
});

test("ASSISTANT-2:5 preserves Validation-derived inventories only", () => {
  const manifest = AssistantExecutiveMemoryManifest;
  assert.equal(
    manifest.inventory.domainModelInventory.domainModels,
    manifest.validation.model.domainModels,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    manifest.validation.model.relationships,
  );
  assert.equal(
    manifest.inventory.lifecycleInventory,
    manifest.validation.model.lifecycle,
  );
  assert.equal(
    manifest.inventory.validationInventory.rules,
    manifest.validation.rules,
  );
  assert.equal(
    manifest.inventory.validationInventory.gates,
    manifest.validation.gates,
  );
  assert.equal(
    manifest.inventory.registryInventory.entries,
    manifest.validation.model.registry.entries,
  );
  assert.equal(manifest.inventory.source, manifest.validation);
  assert.equal(manifest.inventory.reconstructedInventories, false);
  assert.equal(manifest.inventory.recalculatedMetadata, false);
  assert.equal(manifest.inventory.duplicatedDefinitions, false);
  assert.equal(manifest.canonicalInventoryRuleSatisfied, true);
});

test("ASSISTANT-2:5 inventory, compatibility, and readiness metadata are complete", () => {
  const manifest = AssistantExecutiveMemoryManifest;
  assert.equal(manifest.summary.publishedInventoryCount, 9);
  assert.equal(manifest.constants.inventoryCount, 9);
  assert.equal(manifest.summary.validationRuleCount, 40);
  assert.equal(manifest.summary.validationGateCount, 16);
  assert.equal(manifest.summary.architectureCompleteness, "Complete");
  assert.equal(manifest.summary.inventoryCompleteness, "Complete");
  assert.equal(manifest.summary.validationCompleteness, "Complete");
  assert.equal(manifest.summary.consumerReadiness, "Ready");
  assert.equal(manifest.summary.platformEligibility, "Eligible");
  assert.equal(manifest.compatibility.platformCompatible, true);
  assert.equal(manifest.compatibility.certificationCompatible, true);
  assert.equal(manifest.compatibility.freezeCompatible, true);
  assert.equal(manifest.compatibility.publicIndexCompatible, true);
  assert.equal(manifest.readiness.readiness, "ReadyForPlatform");
  assert.equal(Object.isFrozen(manifest.inventory), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("ASSISTANT-2:5 consumes Validation only and has no prohibited behavior", () => {
  const manifest = AssistantExecutiveMemoryManifest;
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryManifest.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveMemoryValidation.ts",
    "./assistantExecutiveMemoryManifest.constants.ts",
    "./assistantExecutiveMemoryManifest.identity.ts",
    "./assistantExecutiveMemoryManifest.inventory.ts",
    "./assistantExecutiveMemoryManifest.metadata.ts",
    "./assistantExecutiveMemoryManifest.summary.ts",
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryModel"), false);
  assert.equal(source.includes("assistantExecutiveMemoryRegistry"), false);
  assert.equal(source.includes("assistantExecutiveMemoryPlatform"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "ASSISTANT-2:4 Executive Memory Validation",
  ]);
  assert.equal(
    manifest.validation.identity.id,
    "ASSISTANT-2:4/ExecutiveMemoryValidation",
  );
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.executableLogic, false);
  assert.equal(manifest.memoryPersistence, false);
  assert.equal(manifest.vectorDatabase, false);
  assert.equal(manifest.retrieval, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
  assert.equal(manifest.services, false);
  assert.equal(manifest.factories, false);
  assert.equal(manifest.builders, false);
});
