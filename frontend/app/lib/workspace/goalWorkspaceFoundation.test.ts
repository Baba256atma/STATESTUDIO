import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";

const files = ["goalWorkspaceBoundaries.ts", "goalWorkspaceCapabilities.ts",
  "goalWorkspaceContracts.ts", "goalWorkspaceFoundation.test.ts", "goalWorkspaceFoundation.ts",
  "goalWorkspaceGoalTypes.ts", "goalWorkspaceIdentity.ts", "goalWorkspaceLifecycle.ts"];

test("WS-3:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-3:1 publishes complete immutable Foundation metadata", () => {
  const foundation = GoalWorkspaceFoundation;
  assert.equal(foundation.identity.id, "WS-3:1/GoalWorkspaceFoundation");
  assert.equal(foundation.identity.namespace, "nexora.workspace.goal.foundation");
  assert.equal(foundation.identity.status, "Foundation");
  assert.deepEqual([foundation.contracts.length, foundation.capabilities.length,
    foundation.responsibilities.length, foundation.goalTypes.length,
    foundation.lifecycle.length, foundation.boundaries.length], [12, 12, 10, 12, 8, 14]);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(foundation.readiness, "ReadyForRegistry");
});

test("WS-3:1 has no Workspace or runtime dependency", () => {
  const source = readFileSync(new URL("./goalWorkspaceFoundation.ts", import.meta.url), "utf8");
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.equal(imports.every((value) => value.includes("./goalWorkspace")), true);
  assert.equal(GoalWorkspaceFoundation.upstreamDependencies.length, 0);
});

test("WS-3:1 implements no prohibited behavior", () => {
  const foundation = GoalWorkspaceFoundation;
  assert.equal(foundation.boundaries.every(({ implemented }) => implemented === false), true);
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.ui, false);
  assert.equal(foundation.storage, false);
  assert.equal(foundation.aiBehavior, false);
  assert.equal(foundation.businessLogic, false);
  assert.equal(foundation.goalExecution, false);
  assert.equal(foundation.planning, false);
});
