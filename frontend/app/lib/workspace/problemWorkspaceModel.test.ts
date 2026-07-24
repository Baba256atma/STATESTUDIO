import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspaceModel } from "./problemWorkspaceModel.ts";

const files = [
  "problemWorkspaceCompositionModels.ts",
  "problemWorkspaceDomainModels.ts",
  "problemWorkspaceIdentityModel.ts",
  "problemWorkspaceModel.test.ts",
  "problemWorkspaceModel.ts",
  "problemWorkspaceModelRegistry.ts",
  "problemWorkspaceRelationshipModels.ts",
  "problemWorkspaceRepresentationModel.ts",
];

test("WS-6:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:3 publishes complete unique model metadata", () => {
  const model = ProblemWorkspaceModel;
  assert.equal(model.identity.id, "WS-6:3/ProblemWorkspaceModel");
  assert.equal(model.identity.namespace, "nexora.workspace.problem.model");
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.deepEqual(
    [
      model.domainModels.length,
      model.relationships.length,
      model.compositions.length,
      model.representation.fields.length,
    ],
    [15, 12, 6, 13],
  );
  const records = [
    model.domainModels,
    model.relationships,
    model.compositions,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-6:3 relationships and inventory are deterministic", () => {
  const model = ProblemWorkspaceModel;
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(model.modelRegistry.totalModelCount, 34);
  assert.equal(
    model.modelRegistry.domainModelCount,
    model.domainModels.length,
  );
  assert.equal(model.representation.computedValues, false);
});

test("WS-6:3 consumes only Foundation and Registry", () => {
  const model = ProblemWorkspaceModel;
  const source = readFileSync(
    new URL("./problemWorkspaceModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("problemWorkspaceValidation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "WS-6:1 Problem Workspace Foundation",
    "WS-6:2 Problem Workspace Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.analysis, false);
  assert.equal(model.aiReasoning, false);
  assert.equal(model.businessLogic, false);
});
