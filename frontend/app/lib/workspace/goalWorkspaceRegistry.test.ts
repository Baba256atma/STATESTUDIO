import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";

const files = ["goalWorkspaceCapabilityRegistry.ts", "goalWorkspaceContractRegistry.ts",
  "goalWorkspaceGoalTypeRegistry.ts", "goalWorkspaceIdentityRegistry.ts",
  "goalWorkspaceLifecycleRegistry.ts", "goalWorkspaceRegistry.test.ts",
  "goalWorkspaceRegistry.ts", "goalWorkspaceResponsibilityRegistry.ts"];

test("WS-3:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-3:2 publishes complete canonical registries", () => {
  const registry = GoalWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-3:2/GoalWorkspaceRegistry");
  assert.equal(registry.identity.status, "Registry");
  assert.deepEqual([registry.responsibilities.length, registry.capabilities.length,
    registry.goalTypes.length, registry.lifecycle.length, registry.contracts.length,
    registry.boundaries.length], [10, 12, 12, 8, 12, 14]);
  assert.equal(registry.readiness, "ReadyForModel");
});

test("WS-3:2 identifiers and keys are globally unique and immutable", () => {
  const records = [GoalWorkspaceRegistry.responsibilities, GoalWorkspaceRegistry.capabilities,
    GoalWorkspaceRegistry.goalTypes, GoalWorkspaceRegistry.lifecycle,
    GoalWorkspaceRegistry.contracts, GoalWorkspaceRegistry.boundaries].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-3:2 consumes only Foundation and preserves references", () => {
  const registry = GoalWorkspaceRegistry;
  assert.equal(registry.contracts[0].source, registry.foundation.contracts[0]);
  assert.equal(registry.capabilities[0].source, registry.foundation.capabilities[0]);
  const source = readFileSync(new URL("./goalWorkspaceRegistry.ts", import.meta.url), "utf8");
  assert.equal(source.includes("goalWorkspaceModel"), false);
  assert.deepEqual(registry.upstreamDependencies, ["WS-3:1 Goal Workspace Foundation"]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.businessLogic, false);
});
