import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceModel } from "./executiveHomeWorkspaceModel.ts";

const files = ["executiveHomeWorkspaceCompositionModels.ts",
  "executiveHomeWorkspaceDomainModels.ts", "executiveHomeWorkspaceLifecycleModels.ts",
  "executiveHomeWorkspaceModel.test.ts", "executiveHomeWorkspaceModel.ts",
  "executiveHomeWorkspaceModelInventory.ts", "executiveHomeWorkspaceModelTypes.ts",
  "executiveHomeWorkspaceRelationshipModels.ts"];

test("WS-2:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:3 publishes complete unique immutable models", () => {
  const model = ExecutiveHomeWorkspaceModel;
  assert.equal(model.identity.id, "WS-2:3/ExecutiveHomeWorkspaceModel");
  assert.deepEqual([model.domainModels.length, model.relationships.length,
    model.compositions.length, model.lifecycleModels.length], [26, 24, 12, 9]);
  assert.equal(model.inventory.totalModelCount, 71);
  assert.equal(new Set(model.domainModels.map(({ id }) => id)).size, 26);
  assert.equal(new Set(model.relationships.map(({ id }) => id)).size, 24);
  assert.equal(model.domainModels.every(Object.isFrozen), true);
});

test("WS-2:3 has valid declarative relationship endpoints", () => {
  assert.equal(ExecutiveHomeWorkspaceModel.relationships.every(
    ({ sourceKind, relation, targetKind }) =>
      sourceKind.length > 0 && relation.length > 0 && targetKind.length > 0,
  ), true);
  assert.equal(Object.keys(ExecutiveHomeWorkspaceModel.aggregate).length, 26);
});

test("WS-2:3 consumes only Registry and contains no runtime", () => {
  const model = ExecutiveHomeWorkspaceModel;
  const source = readFileSync(new URL("./executiveHomeWorkspaceModel.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./executiveHomeWorkspaceFoundation"), false);
  assert.deepEqual(model.upstreamDependencies,
    ["WS-2:2 Executive Home Workspace Registry"]);
  assert.equal(model.runtimeState, false);
  assert.equal(model.ui, false);
  assert.equal(model.readiness, "ReadyForValidation");
});
