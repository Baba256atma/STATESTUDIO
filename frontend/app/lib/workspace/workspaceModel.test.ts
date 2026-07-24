import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WorkspaceModel } from "./workspaceModel.ts";

const files = ["workspaceCompositionModels.ts", "workspaceDomainModels.ts",
  "workspaceLifecycleModels.ts", "workspaceModel.test.ts", "workspaceModel.ts",
  "workspaceModelInventory.ts", "workspaceModelTypes.ts", "workspaceRelationshipModels.ts"];

test("WS-1:3 has exactly eight Model artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
});
test("WS-1:3 is complete, derived, and immutable", () => {
  assert.equal(WorkspaceModel.identity.id, "WS-1:3/WorkspaceModel");
  assert.deepEqual([WorkspaceModel.domainModels.length, WorkspaceModel.relationships.length,
    WorkspaceModel.compositions.length, WorkspaceModel.lifecycleModels.length], [26, 24, 10, 9]);
  assert.equal(WorkspaceModel.inventory.totalCount, 69);
  assert.equal(Object.isFrozen(WorkspaceModel), true);
  assert.equal(new Set(WorkspaceModel.domainModels.map(({ id }) => id)).size, 26);
  assert.equal(new Set(WorkspaceModel.relationships.map(({ id }) => id)).size, 24);
});
test("WS-1:3 consumes only Registry and has no runtime", () => {
  const source = readFileSync(new URL("./workspaceModel.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspaceFoundation"), false);
  assert.equal(WorkspaceModel.upstreamDependencies.length, 1);
  assert.equal(WorkspaceModel.runtimeState, false);
  assert.equal(WorkspaceModel.rendering, false);
});
