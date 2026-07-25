import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantWorkspaceOrchestrationPlatform } from "./assistantWorkspaceOrchestrationPlatform.ts";

const files = [
  "assistantWorkspaceOrchestrationPlatform.capabilities.ts",
  "assistantWorkspaceOrchestrationPlatform.compatibility.ts",
  "assistantWorkspaceOrchestrationPlatform.constants.ts",
  "assistantWorkspaceOrchestrationPlatform.guarantees.ts",
  "assistantWorkspaceOrchestrationPlatform.identity.ts",
  "assistantWorkspaceOrchestrationPlatform.test.ts",
  "assistantWorkspaceOrchestrationPlatform.ts",
  "assistantWorkspaceOrchestrationPlatform.types.ts",
];

test("ASSISTANT-5:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:6 publishes canonical Platform identity", () => {
  const platform = AssistantWorkspaceOrchestrationPlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-5:6/WorkspaceOrchestrationPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.workspace-orchestration.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.status, "Platform");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
  assert.equal(
    platform.identity.sourceManifest,
    "ASSISTANT-5:5/WorkspaceOrchestrationManifest",
  );
});

test("ASSISTANT-5:6 publishes exact immutable declarations", () => {
  const platform = AssistantWorkspaceOrchestrationPlatform;
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

test("ASSISTANT-5:6 preserves canonical Manifest composition", () => {
  const platform = AssistantWorkspaceOrchestrationPlatform;
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

test("ASSISTANT-5:6 consumes Manifest only and has no prohibited behavior", () => {
  const platform = AssistantWorkspaceOrchestrationPlatform;
  const source = readFileSync(
    new URL("./assistantWorkspaceOrchestrationPlatform.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantWorkspaceOrchestrationManifest.ts",
    "./assistantWorkspaceOrchestrationPlatform.capabilities.ts",
    "./assistantWorkspaceOrchestrationPlatform.compatibility.ts",
    "./assistantWorkspaceOrchestrationPlatform.constants.ts",
    "./assistantWorkspaceOrchestrationPlatform.guarantees.ts",
    "./assistantWorkspaceOrchestrationPlatform.identity.ts",
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationModel"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationCertification"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-5:5 Workspace Orchestration Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-5:5/WorkspaceOrchestrationManifest",
  );
  assert.equal(platform.runtime, false);
  assert.equal(platform.executableLogic, false);
  assert.equal(platform.workspaceExecution, false);
  assert.equal(platform.workspaceRouting, false);
  assert.equal(platform.workspaceSwitching, false);
  assert.equal(platform.orchestrationEngine, false);
  assert.equal(platform.scheduling, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.services, false);
  assert.equal(platform.factories, false);
  assert.equal(platform.builders, false);
});
