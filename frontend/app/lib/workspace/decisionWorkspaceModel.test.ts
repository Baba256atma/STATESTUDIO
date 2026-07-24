import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceModel } from "./decisionWorkspaceModel.ts";

const files = [
  "decisionWorkspaceCompositionModels.ts",
  "decisionWorkspaceDomainModels.ts",
  "decisionWorkspaceIdentityModel.ts",
  "decisionWorkspaceMetadataModels.ts",
  "decisionWorkspaceModel.test.ts",
  "decisionWorkspaceModel.ts",
  "decisionWorkspaceModelRegistry.ts",
  "decisionWorkspaceRelationshipModels.ts",
];

test("WS-4:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-4:3 publishes complete unique model metadata", () => {
  const model = DecisionWorkspaceModel;
  assert.equal(model.identity.id, "WS-4:3/DecisionWorkspaceModel");
  assert.equal(model.identity.namespace, "nexora.workspace.decision.model");
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

test("WS-4:3 relationships and inventory are deterministic", () => {
  const model = DecisionWorkspaceModel;
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

test("WS-4:3 consumes only Foundation and Registry", () => {
  const model = DecisionWorkspaceModel;
  const source = readFileSync(
    new URL("./decisionWorkspaceModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("decisionWorkspaceValidation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "WS-4:1 Decision Workspace Foundation",
    "WS-4:2 Decision Workspace Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.businessLogic, false);
  assert.equal(model.persistence, false);
  assert.equal(model.ui, false);
});
