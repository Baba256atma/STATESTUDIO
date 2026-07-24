import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";

const files = ["executiveHomeWorkspaceBoundaryRegistry.ts",
  "executiveHomeWorkspaceCapabilityRegistry.ts", "executiveHomeWorkspaceCategoryRegistry.ts",
  "executiveHomeWorkspaceLifecycleRegistry.ts", "executiveHomeWorkspaceRegistry.test.ts",
  "executiveHomeWorkspaceRegistry.ts", "executiveHomeWorkspaceRegistryTypes.ts",
  "executiveHomeWorkspaceResponsibilityRegistry.ts"];

test("WS-2:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:2 publishes complete deterministic registry coverage", () => {
  const registry = ExecutiveHomeWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-2:2/ExecutiveHomeWorkspaceRegistry");
  assert.deepEqual([registry.categories.length, registry.contracts.length,
    registry.capabilities.length, registry.responsibilities.length,
    registry.lifecycle.length, registry.boundaries.length,
    registry.terminology.length], [10, 17, 15, 12, 9, 28, 17]);
  assert.equal(registry.readiness, "ReadyForModel");
});

test("WS-2:2 IDs and keys are globally unique", () => {
  const records = [ExecutiveHomeWorkspaceRegistry.categories,
    ExecutiveHomeWorkspaceRegistry.contracts, ExecutiveHomeWorkspaceRegistry.capabilities,
    ExecutiveHomeWorkspaceRegistry.responsibilities, ExecutiveHomeWorkspaceRegistry.lifecycle,
    ExecutiveHomeWorkspaceRegistry.boundaries, ExecutiveHomeWorkspaceRegistry.terminology].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-2:2 preserves Foundation references and dependency isolation", () => {
  const registry = ExecutiveHomeWorkspaceRegistry;
  assert.equal(registry.contracts[0].source, registry.foundation.contracts[0]);
  assert.equal(registry.capabilities[0].source, registry.foundation.capabilities[0]);
  assert.equal(registry.boundaries[0].source, registry.foundation.boundaries[0]);
  const source = readFileSync(new URL("./executiveHomeWorkspaceRegistry.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspacePublicIndex"), false);
  assert.deepEqual(registry.upstreamDependencies,
    ["WS-2:1 Executive Home Workspace Foundation"]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.ui, false);
});
