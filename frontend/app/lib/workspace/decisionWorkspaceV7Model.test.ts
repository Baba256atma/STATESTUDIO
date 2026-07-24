import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Model } from "./decisionWorkspaceV7Model.ts";

const files = [
  "decisionWorkspaceV7CompositionModels.ts",
  "decisionWorkspaceV7DomainModels.ts",
  "decisionWorkspaceV7IdentityModel.ts",
  "decisionWorkspaceV7Model.test.ts",
  "decisionWorkspaceV7Model.ts",
  "decisionWorkspaceV7ModelRegistry.ts",
  "decisionWorkspaceV7RelationshipModels.ts",
  "decisionWorkspaceV7RepresentationModel.ts",
];

test("WS-7:3 consists of exactly eight collision-safe Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:3 publishes complete immutable model metadata", () => {
  const model = DecisionWorkspaceV7Model;
  assert.equal(model.identity.id, "WS-7:3/DecisionWorkspaceModel");
  assert.equal(model.identity.namespace, "nexora.workspace.decision.model");
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.deepEqual(
    [
      model.domainModels.length,
      model.relationships.length,
      model.compositions.length,
      model.representation.fields.length,
    ],
    [15, 12, 6, 15],
  );
  assert.equal(Object.isFrozen(model), true);
});

test("WS-7:3 model identities and ordering are deterministic", () => {
  const model = DecisionWorkspaceV7Model;
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
  assert.equal(model.modelRegistry.totalModelCount, 34);
});

test("WS-7:3 preserves canonical representation and readiness metadata", () => {
  const model = DecisionWorkspaceV7Model;
  assert.equal(model.representation.computedValues, false);
  assert.equal(
    model.compositions[5].fields.includes("ReadyForExecution"),
    true,
  );
  assert.equal(model.compositions.every(({ computed }) => !computed), true);
});

test("WS-7:3 consumes only WS-7 Foundation and Registry", () => {
  const model = DecisionWorkspaceV7Model;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Model.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("decisionWorkspaceV7Validation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "WS-7:1 Decision Workspace Foundation",
    "WS-7:2 Decision Workspace Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.aiReasoning, false);
  assert.equal(model.scoring, false);
  assert.equal(model.businessLogic, false);
});
