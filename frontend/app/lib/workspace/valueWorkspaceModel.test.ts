import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceModel } from "./valueWorkspaceModel.ts";

const files = [
  "valueWorkspaceCompositionModels.ts",
  "valueWorkspaceDomainModels.ts",
  "valueWorkspaceIdentityModel.ts",
  "valueWorkspaceModel.test.ts",
  "valueWorkspaceModel.ts",
  "valueWorkspaceModelRegistry.ts",
  "valueWorkspaceRelationshipModels.ts",
  "valueWorkspaceRepresentationModel.ts",
];

test("WS-9:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-9:3 publishes complete immutable model metadata", () => {
  const model = ValueWorkspaceModel;
  assert.equal(model.identity.id, "WS-9:3/ValueWorkspaceModel");
  assert.equal(model.identity.namespace, "nexora.workspace.value.model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.deepEqual(
    [
      model.domainModels.length,
      model.relationships.length,
      model.compositions.length,
      model.representation.fields.length,
    ],
    [15, 12, 9, 14],
  );
  assert.equal(Object.isFrozen(model), true);
});

test("WS-9:3 identities and ordering are deterministic", () => {
  const model = ValueWorkspaceModel;
  const records = [
    model.domainModels,
    model.relationships,
    model.compositions,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(model.modelRegistry.totalModelCount, 37);
});

test("WS-9:3 preserves representation and readiness metadata", () => {
  const model = ValueWorkspaceModel;
  assert.equal(model.representation.runtimeValues, false);
  assert.equal(model.representation.calculatedValues, false);
  assert.equal(
    model.compositions[8].fields[1],
    "ReadyForTimelineWorkspace",
  );
  assert.equal(model.compositions.every(({ computed }) => !computed), true);
});

test("WS-9:3 consumes only Foundation and Registry", () => {
  const source = readFileSync(
    new URL("./valueWorkspaceModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("valueWorkspaceValidation"), false);
  assert.deepEqual(ValueWorkspaceModel.upstreamDependencies, [
    "WS-9:1 Value Workspace Foundation",
    "WS-9:2 Value Workspace Registry",
  ]);
  assert.equal(ValueWorkspaceModel.runtime, false);
  assert.equal(ValueWorkspaceModel.roiCalculation, false);
  assert.equal(ValueWorkspaceModel.valueComputation, false);
  assert.equal(ValueWorkspaceModel.businessLogic, false);
});
