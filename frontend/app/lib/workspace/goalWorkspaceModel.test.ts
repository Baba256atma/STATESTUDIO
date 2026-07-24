import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceModel } from "./goalWorkspaceModel.ts";

const files = ["goalWorkspaceCompositionModels.ts", "goalWorkspaceDomainModels.ts",
  "goalWorkspaceIdentityModel.ts", "goalWorkspaceMetadataModels.ts",
  "goalWorkspaceModel.test.ts", "goalWorkspaceModel.ts", "goalWorkspaceModelRegistry.ts",
  "goalWorkspaceRelationshipModels.ts"];

test("WS-3:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-3:3 publishes complete unique model metadata", () => {
  const model = GoalWorkspaceModel;
  assert.equal(model.identity.id, "WS-3:3/GoalWorkspaceModel");
  assert.equal(model.identity.status, "Model");
  assert.deepEqual([model.domainModels.length, model.relationships.length,
    model.compositions.length, model.metadataModels.length], [12, 12, 9, 12]);
  const records = [model.domainModels, model.relationships,
    model.compositions, model.metadataModels].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-3:3 inventory is deterministic and dynamically derived", () => {
  const registry = GoalWorkspaceModel.modelRegistry;
  assert.equal(registry.totalModelCount, 45);
  assert.equal(registry.domainModelCount, GoalWorkspaceModel.domainModels.length);
  assert.equal(registry.relationshipModelCount, GoalWorkspaceModel.relationships.length);
});

test("WS-3:3 consumes only Foundation and Registry and contains no runtime", () => {
  const model = GoalWorkspaceModel;
  const source = readFileSync(new URL("./goalWorkspaceModel.ts", import.meta.url), "utf8");
  assert.equal(source.includes("goalWorkspaceValidation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "WS-3:1 Goal Workspace Foundation", "WS-3:2 Goal Workspace Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.businessLogic, false);
  assert.equal(model.readiness, "ReadyForValidation");
});
