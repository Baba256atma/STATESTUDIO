import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

import { WorkspaceRegistry } from "./workspaceRegistry.ts";

const collections = [
  WorkspaceRegistry.types,
  WorkspaceRegistry.contracts,
  WorkspaceRegistry.capabilities,
  WorkspaceRegistry.responsibilities,
  WorkspaceRegistry.lifecycle,
  WorkspaceRegistry.boundaries,
  WorkspaceRegistry.terminology,
] as const;

test("WS-1:2 consists of exactly eight Registry files", () => {
  const requiredFiles = [
    "workspaceBoundaryRegistry.ts",
    "workspaceCapabilityRegistry.ts",
    "workspaceLifecycleRegistry.ts",
    "workspaceRegistry.test.ts",
    "workspaceRegistry.ts",
    "workspaceRegistryTypes.ts",
    "workspaceResponsibilityRegistry.ts",
    "workspaceTypeRegistry.ts",
  ];
  const files = readdirSync(new URL(".", import.meta.url))
    .filter((name) => requiredFiles.includes(name));
  assert.deepEqual(files.sort(), requiredFiles);
});

test("WS-1:2 publishes complete canonical coverage", () => {
  assert.equal(WorkspaceRegistry.identity.id, "WS-1:2/WorkspaceRegistry");
  assert.equal(WorkspaceRegistry.identity.namespace, "nexora.workspace.registry");
  assert.equal(WorkspaceRegistry.readiness, "ReadyForModel");
  assert.deepEqual(
    [WorkspaceRegistry.types.length, WorkspaceRegistry.contracts.length,
      WorkspaceRegistry.capabilities.length, WorkspaceRegistry.responsibilities.length,
      WorkspaceRegistry.lifecycle.length, WorkspaceRegistry.boundaries.length,
      WorkspaceRegistry.terminology.length],
    [11, 17, 15, 12, 9, 28, 18],
  );
});

test("WS-1:2 IDs and keys are unique and ordering is deterministic", () => {
  const records = collections.flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.deepEqual(records.map(({ id }) => id), collections.flat().map(({ id }) => id));
});

test("WS-1:2 records are immutable and preserve Foundation references", () => {
  assert.equal(collections.every(Object.isFrozen), true);
  assert.equal(collections.flat().every(Object.isFrozen), true);
  assert.equal(WorkspaceRegistry.contracts[0].source, WorkspaceRegistry.foundation.contracts[0]);
  assert.equal(WorkspaceRegistry.capabilities[0].source, WorkspaceRegistry.foundation.capabilities[0]);
  assert.equal(WorkspaceRegistry.responsibilities[0].source, WorkspaceRegistry.foundation.responsibilities[0]);
  assert.equal(WorkspaceRegistry.lifecycle[0].source, WorkspaceRegistry.foundation.lifecycle[0]);
  assert.equal(WorkspaceRegistry.boundaries[0].source, WorkspaceRegistry.foundation.boundaries[0]);
});

test("WS-1:2 consumes only Foundation and contains no runtime behavior", () => {
  const registryFiles = [
    "workspaceRegistry.ts", "workspaceTypeRegistry.ts",
    "workspaceCapabilityRegistry.ts", "workspaceResponsibilityRegistry.ts",
    "workspaceLifecycleRegistry.ts", "workspaceBoundaryRegistry.ts",
  ];
  const imports = registryFiles.flatMap((file) =>
    (readFileSync(new URL(file, import.meta.url), "utf8").match(/^import .* from .*;$/gm) ?? []));
  assert.equal(imports.every((value) => value.includes("./workspaceFoundation")
    || value.includes("./workspaceRegistryTypes")
    || value.includes("./workspaceTypeRegistry")
    || value.includes("./workspaceCapabilityRegistry")
    || value.includes("./workspaceResponsibilityRegistry")
    || value.includes("./workspaceLifecycleRegistry")
    || value.includes("./workspaceBoundaryRegistry")), true);
  assert.equal(WorkspaceRegistry.upstreamDependencies.length, 1);
  assert.equal(WorkspaceRegistry.runtimeExecution, false);
  assert.equal(WorkspaceRegistry.uiImplementation, false);
  assert.equal(WorkspaceRegistry.stateMutation, false);
  assert.equal(WorkspaceRegistry.orchestration, false);
});
