import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspaceModel } from "./scenarioWorkspaceModel.ts";

const files = [
  "scenarioWorkspaceCompositionModels.ts",
  "scenarioWorkspaceDomainModels.ts",
  "scenarioWorkspaceIdentityModel.ts",
  "scenarioWorkspaceMetadataModels.ts",
  "scenarioWorkspaceModel.test.ts",
  "scenarioWorkspaceModel.ts",
  "scenarioWorkspaceModelRegistry.ts",
  "scenarioWorkspaceRelationshipModels.ts",
];

test("WS-5:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:3 publishes complete unique model metadata", () => {
  const model = ScenarioWorkspaceModel;
  assert.equal(model.identity.id, "WS-5:3/ScenarioWorkspaceModel");
  assert.equal(model.identity.namespace, "nexora.workspace.scenario.model");
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.identity.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.deepEqual(
    [
      model.domainModels.length,
      model.relationships.length,
      model.compositions.length,
      model.metadataModels.length,
    ],
    [12, 12, 10, 12],
  );
  const records = [
    model.domainModels,
    model.relationships,
    model.compositions,
    model.metadataModels,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-5:3 relationships and inventory are deterministic", () => {
  const model = ScenarioWorkspaceModel;
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(model.modelRegistry.totalModelCount, 46);
  assert.equal(
    model.modelRegistry.domainModelCount,
    model.domainModels.length,
  );
  assert.equal(
    model.modelRegistry.relationshipModelCount,
    model.relationships.length,
  );
});

test("WS-5:3 consumes only Foundation and Registry", () => {
  const model = ScenarioWorkspaceModel;
  const source = readFileSync(
    new URL("./scenarioWorkspaceModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("scenarioWorkspaceValidation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "WS-5:1 Scenario Workspace Foundation",
    "WS-5:2 Scenario Workspace Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.simulationEngine, false);
  assert.equal(model.predictionEngine, false);
  assert.equal(model.businessLogic, false);
});
