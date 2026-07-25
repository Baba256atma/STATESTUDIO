import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationManifest } from "./assistantWorkspaceOrchestrationManifest.ts";

const files = [
  "assistantWorkspaceOrchestrationManifest.constants.ts",
  "assistantWorkspaceOrchestrationManifest.identity.ts",
  "assistantWorkspaceOrchestrationManifest.inventory.ts",
  "assistantWorkspaceOrchestrationManifest.metadata.ts",
  "assistantWorkspaceOrchestrationManifest.summary.ts",
  "assistantWorkspaceOrchestrationManifest.test.ts",
  "assistantWorkspaceOrchestrationManifest.ts",
  "assistantWorkspaceOrchestrationManifest.types.ts",
];

test("ASSISTANT-5:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:5 publishes canonical Manifest identity", () => {
  const manifest = AssistantWorkspaceOrchestrationManifest;
  assert.equal(
    manifest.identity.id,
    "ASSISTANT-5:5/WorkspaceOrchestrationManifest",
  );
  assert.equal(
    manifest.identity.namespace,
    "nexora.assistant.workspace-orchestration.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.status, "Manifest");
  assert.equal(manifest.readinessStatus, "ReadyForPlatform");
  assert.equal(
    manifest.identity.sourceValidation,
    "ASSISTANT-5:4/WorkspaceOrchestrationValidation",
  );
});

test("ASSISTANT-5:5 preserves Validation-derived inventories only", () => {
  const manifest = AssistantWorkspaceOrchestrationManifest;
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

test("ASSISTANT-5:5 inventory, compatibility, and readiness metadata are complete", () => {
  const manifest = AssistantWorkspaceOrchestrationManifest;
  assert.equal(manifest.summary.publishedInventoryCount, 9);
  assert.equal(manifest.constants.inventoryCount, 9);
  assert.equal(manifest.summary.validationRuleCount, 40);
  assert.equal(manifest.summary.validationGateCount, 16);
  assert.equal(manifest.statistics.compatibilityCount, 4);
  assert.equal(manifest.statistics.readinessStatus, "ReadyForPlatform");
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

test("ASSISTANT-5:5 consumes Validation only and has no prohibited behavior", () => {
  const manifest = AssistantWorkspaceOrchestrationManifest;
  const source = readFileSync(
    new URL("./assistantWorkspaceOrchestrationManifest.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationValidation.ts",
    "./assistantWorkspaceOrchestrationManifest.constants.ts",
    "./assistantWorkspaceOrchestrationManifest.identity.ts",
    "./assistantWorkspaceOrchestrationManifest.inventory.ts",
    "./assistantWorkspaceOrchestrationManifest.metadata.ts",
    "./assistantWorkspaceOrchestrationManifest.summary.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationModel"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationPlatform"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(manifest.upstreamDependencies, [
    "ASSISTANT-5:4 Workspace Orchestration Validation",
  ]);
  assert.equal(
    manifest.validation.identity.id,
    "ASSISTANT-5:4/WorkspaceOrchestrationValidation",
  );
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.executableLogic, false);
  assert.equal(manifest.workspaceExecution, false);
  assert.equal(manifest.workspaceRouting, false);
  assert.equal(manifest.workspaceSwitching, false);
  assert.equal(manifest.orchestrationEngine, false);
  assert.equal(manifest.scheduling, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
  assert.equal(manifest.services, false);
  assert.equal(manifest.factories, false);
  assert.equal(manifest.builders, false);
});
