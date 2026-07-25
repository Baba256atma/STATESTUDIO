import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantExecutiveActionPlanningPlatform } from "./assistantExecutiveActionPlanningPlatform.ts";

const files = [
  "assistantExecutiveActionPlanningPlatform.capabilities.ts",
  "assistantExecutiveActionPlanningPlatform.compatibility.ts",
  "assistantExecutiveActionPlanningPlatform.constants.ts",
  "assistantExecutiveActionPlanningPlatform.guarantees.ts",
  "assistantExecutiveActionPlanningPlatform.identity.ts",
  "assistantExecutiveActionPlanningPlatform.test.ts",
  "assistantExecutiveActionPlanningPlatform.ts",
  "assistantExecutiveActionPlanningPlatform.types.ts",
];

test("ASSISTANT-7:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:6 publishes canonical Platform identity", () => {
  const platform = AssistantExecutiveActionPlanningPlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-7:6/ExecutiveActionPlanningPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.executive-action-planning.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.status, "Platform");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
  assert.equal(
    platform.identity.sourceManifest,
    "ASSISTANT-7:5/ExecutiveActionPlanningManifest",
  );
});

test("ASSISTANT-7:6 publishes exact immutable declarations", () => {
  const platform = AssistantExecutiveActionPlanningPlatform;
  assert.equal(platform.capabilities.length, 12);
  assert.equal(platform.guarantees.length, 18);
  assert.equal(platform.compatibility.length, 12);
  assert.equal(platform.constants.capabilityCount, 12);
  assert.equal(platform.constants.guaranteeCount, 18);
  assert.equal(platform.constants.compatibilityCount, 12);
  assert.equal(platform.statistics.platformCapabilityCount, 12);
  assert.equal(platform.statistics.platformGuaranteeCount, 18);
  assert.equal(platform.statistics.compatibilityCount, 12);
  assert.equal(platform.canonicalInventoryRuleSatisfied, true);
  assert.equal(platform.capabilities.every(Object.isFrozen), true);
  assert.equal(platform.guarantees.every(Object.isFrozen), true);
  assert.equal(platform.compatibility.every(Object.isFrozen), true);
  assert.deepEqual(
    platform.capabilities.map(({ order }) => order),
    platform.capabilities.map((_, index) => index + 1),
  );
});

test("ASSISTANT-7:6 preserves canonical Manifest composition", () => {
  const platform = AssistantExecutiveActionPlanningPlatform;
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
    platform.composition.planning,
    platform.manifest.inventory.planningInventory,
  );
  assert.equal(
    platform.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.equal(
    platform.statistics.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.deepEqual(platform.composition.layers, [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ]);
  assert.equal(Object.isFrozen(platform), true);
});

test("ASSISTANT-7:6 consumes Manifest only and has no prohibited behavior", () => {
  const platform = AssistantExecutiveActionPlanningPlatform;
  const source = readFileSync(
    new URL(
      "./assistantExecutiveActionPlanningPlatform.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveActionPlanningManifest.ts",
    "./assistantExecutiveActionPlanningPlatform.capabilities.ts",
    "./assistantExecutiveActionPlanningPlatform.compatibility.ts",
    "./assistantExecutiveActionPlanningPlatform.constants.ts",
    "./assistantExecutiveActionPlanningPlatform.guarantees.ts",
    "./assistantExecutiveActionPlanningPlatform.identity.ts",
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningModel"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningCertification"),
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
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-7:5 Executive Action Planning Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-7:5/ExecutiveActionPlanningManifest",
  );
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableLogic, false);
  assert.equal(platform.planningEngine, false);
  assert.equal(platform.taskExecution, false);
  assert.equal(platform.scheduling, false);
  assert.equal(platform.assignment, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.services, false);
  assert.equal(platform.factories, false);
  assert.equal(platform.builders, false);
});
