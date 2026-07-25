import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";

const files = [
  "executionCapabilityRegistry.ts",
  "executionContractRegistry.ts",
  "executionLifecycleRegistry.ts",
  "executionMetadataRegistry.ts",
  "executionPolicyRegistry.ts",
  "executionStateRegistry.ts",
  "executiveActionExecutionRegistry.test.ts",
  "executiveActionExecutionRegistry.ts",
];

const registryModuleFiles = [
  "executionCapabilityRegistry.ts",
  "executionContractRegistry.ts",
  "executionLifecycleRegistry.ts",
  "executionMetadataRegistry.ts",
  "executionPolicyRegistry.ts",
  "executionStateRegistry.ts",
  "executiveActionExecutionRegistry.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:2 publishes canonical Registry identity", () => {
  const registry = ExecutiveActionExecutionRegistry;
  assert.equal(
    registry.identity.id,
    "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.identity.status, "Registry");
  assert.equal(registry.identity.stage, "ReadyForModel");
  assert.equal(registry.identity.canonical, true);
  assert.equal(registry.identity.mutable, false);
  assert.equal(
    registry.identity.sourceFoundation,
    "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
  );
  assert.equal(registry.status, "Registry");
  assert.equal(registry.stage, "ReadyForModel");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(registry.metadata.namespace,
    "nexora.assistant.executive-action-execution.registry");
  assert.equal(registry.metadata.readiness, "ReadyForModel");
  assert.equal(registry.metadata.releaseState, "Registry");
});

test("ASSISTANT-8:2 registries are complete against Foundation inventories", () => {
  const registry = ExecutiveActionExecutionRegistry;
  const foundation = ExecutiveActionExecutionFoundation;
  assert.equal(
    registry.contracts.length,
    foundation.contracts.length,
  );
  assert.equal(
    registry.capabilities.length,
    foundation.capabilities.length,
  );
  assert.equal(
    registry.lifecycle.length,
    foundation.lifecycle.length,
  );
  assert.equal(
    registry.executionStates.length,
    foundation.executionStates.length,
  );
  assert.equal(
    registry.progressTypes.length,
    foundation.progressTypes.length,
  );
  assert.equal(
    registry.exceptionTypes.length,
    foundation.exceptionTypes.length,
  );
  assert.equal(
    registry.feedbackTypes.length,
    foundation.feedbackTypes.length,
  );
  assert.equal(
    registry.policies.length,
    foundation.policies.length,
  );
  assert.equal(registry.metadata.definitions.length, 9);
  assert.deepEqual(
    registry.contracts.map(({ name }) => name),
    [
      "ExecutiveAction",
      "ExecutionPlan",
      "ExecutionStep",
      "ExecutionProgress",
      "ExecutionState",
      "ExecutionResult",
      "ExecutionFeedback",
      "ExecutionException",
      "ExecutionCheckpoint",
      "ExecutionSnapshot",
      "ExecutionHealth",
      "ExecutionSummary",
    ],
  );
  assert.deepEqual(
    registry.capabilities.map(({ name }) => name),
    foundation.capabilities.map(({ name }) => name),
  );
  assert.deepEqual(
    registry.lifecycle.map(({ name }) => name),
    [
      "Declared",
      "Prepared",
      "Queued",
      "Running",
      "Monitoring",
      "Paused",
      "Completed",
      "Cancelled",
      "Archived",
    ],
  );
  assert.deepEqual(
    registry.executionStates.map(({ name }) => name),
    [
      "NotStarted",
      "Queued",
      "Executing",
      "Waiting",
      "Blocked",
      "Paused",
      "Completed",
      "Cancelled",
      "Failed",
    ],
  );
  assert.deepEqual(
    registry.progressTypes.map(({ name }) => name),
    [
      "Percentage",
      "Milestone",
      "Task Count",
      "Weighted Progress",
      "Business Outcome",
      "Manual Confirmation",
    ],
  );
  assert.deepEqual(
    registry.exceptionTypes.map(({ name }) => name),
    foundation.exceptionTypes.map(({ name }) => name),
  );
  assert.deepEqual(
    new Set(registry.exceptionTypes.map(({ name }) => name)),
    new Set([
      "Blocked",
      "Dependency Failure",
      "Execution Error",
      "Resource Issue",
      "Deadline Risk",
      "Business Risk",
      "External Failure",
      "Policy Violation",
    ]),
  );
  assert.deepEqual(
    registry.feedbackTypes.map(({ name }) => name),
    [
      "Automatic",
      "Manual",
      "Executive",
      "Workspace",
      "System",
      "External",
    ],
  );
  assert.deepEqual(
    registry.policies.map(({ name }) => name),
    foundation.policies.map(({ name }) => name),
  );
  assert.deepEqual(
    registry.metadata.definitions.map(({ name }) => name),
    [
      "Canonical Id",
      "Namespace",
      "Ownership",
      "Version",
      "Release State",
      "Compatibility",
      "Readiness",
      "Dependencies",
      "Registry Category",
    ],
  );
  assert.deepEqual(Object.keys(registry.collections), [
    "contracts",
    "capabilities",
    "lifecycle",
    "executionStates",
    "progressTypes",
    "exceptionTypes",
    "feedbackTypes",
    "policies",
    "metadataDefinitions",
  ]);
  assert.equal(
    registry.statistics.collectionCount,
    Object.keys(registry.collections).length,
  );
  assert.equal(registry.statistics.entryCount, registry.entries.length);
  assert.equal(
    registry.statistics.entryCount,
    registry.contracts.length
      + registry.capabilities.length
      + registry.lifecycle.length
      + registry.executionStates.length
      + registry.progressTypes.length
      + registry.exceptionTypes.length
      + registry.feedbackTypes.length
      + registry.policies.length
      + registry.metadata.definitions.length,
  );
});

test("ASSISTANT-8:2 entries are unique, Foundation-linked, and immutable", () => {
  const registry = ExecutiveActionExecutionRegistry;
  const entries = registry.entries;
  assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
  assert.equal(
    new Set(entries.map(({ canonicalIdentity }) => canonicalIdentity)).size,
    entries.length,
  );
  assert.equal(entries.every(Object.isFrozen), true);
  assert.equal(entries.every(({ version }) => version === "1.0.0"), true);
  assert.equal(entries.every(({ immutableIdentity }) => immutableIdentity), true);
  assert.equal(entries.every(({ status }) => status === "Registered"), true);
  assert.equal(entries.every(({ executable }) => !executable), true);
  assert.equal(entries.every(({ metadataOnly }) => metadataOnly), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.collections), true);
  assert.equal(Object.isFrozen(registry.identity), true);
  assert.equal(Object.isFrozen(registry.metadata), true);
  for (const collection of Object.values(registry.collections)) {
    assert.equal(Object.isFrozen(collection), true);
    assert.deepEqual(
      collection.map(({ order }) => order),
      collection.map((_, index) => index + 1),
    );
  }
  assert.deepEqual(
    registry.contracts.map(({ canonicalIdentity }) => canonicalIdentity),
    ExecutiveActionExecutionFoundation.contracts.map(({ id }) => id),
  );
  assert.deepEqual(
    registry.capabilities.map(({ canonicalIdentity }) => canonicalIdentity),
    ExecutiveActionExecutionFoundation.capabilities.map(({ id }) => id),
  );
  assert.deepEqual(
    registry.policies.map(({ canonicalIdentity }) => canonicalIdentity),
    ExecutiveActionExecutionFoundation.policies.map(({ id }) => id),
  );
});

test("ASSISTANT-8:2 consumes Foundation only and forbids runtime behavior", () => {
  const registry = ExecutiveActionExecutionRegistry;
  assert.deepEqual(readImports("executiveActionExecutionRegistry.ts"), [
    "./executiveActionExecutionFoundation.ts",
    "./executionCapabilityRegistry.ts",
    "./executionContractRegistry.ts",
    "./executionLifecycleRegistry.ts",
    "./executionMetadataRegistry.ts",
    "./executionPolicyRegistry.ts",
    "./executionStateRegistry.ts",
  ]);
  for (const fileName of registryModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      assert.equal(
        importPath === "./executiveActionExecutionFoundation.ts"
          || importPath === "./executionMetadataRegistry.ts"
          || registryModuleFiles.includes(
            importPath.slice(2) as typeof registryModuleFiles[number],
          ),
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
    }
    assert.equal(
      imports.includes("./executiveActionExecutionFoundation.ts"),
      true,
      `${fileName} must import Foundation`,
    );
    assert.equal(
      imports.some((path) => path.includes("executiveActionExecutionModel")),
      false,
    );
    assert.equal(
      imports.some((path) => path.includes("assistantExecutiveActionPlanning")),
      false,
    );
  }
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-8:1 Executive Action Execution Foundation",
  ]);
  assert.equal(
    registry.metadata.sourceFoundation.id,
    "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
  );
  assert.equal(
    registry.foundation.identity.id,
    "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
  );
  assert.deepEqual(registry.publicApiSurface, [
    "ExecutiveActionExecutionRegistry",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.executionEngine, false);
  assert.equal(registry.scheduler, false);
  assert.equal(registry.workflowRuntime, false);
  assert.equal(registry.monitoringServices, false);
  assert.equal(registry.automation, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.orchestration, false);
  assert.equal(registry.apis, false);
  assert.equal(registry.aiLogic, false);
  assert.equal(registry.ui, false);
  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
  assert.equal(registry.mutable, false);
});
