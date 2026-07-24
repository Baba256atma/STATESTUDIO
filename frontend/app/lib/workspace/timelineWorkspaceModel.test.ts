import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { TimelineWorkspaceModel } from "./timelineWorkspaceModel.ts";

const files = [
  "timelineWorkspaceCompositionModels.ts",
  "timelineWorkspaceDomainModels.ts",
  "timelineWorkspaceIdentityModel.ts",
  "timelineWorkspaceModel.test.ts",
  "timelineWorkspaceModel.ts",
  "timelineWorkspaceModelRegistry.ts",
  "timelineWorkspaceRelationshipModels.ts",
  "timelineWorkspaceRepresentationModel.ts",
];

test("WS-10:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-10:3 publishes complete immutable model metadata", () => {
  const model = TimelineWorkspaceModel;
  assert.equal(model.identity.id, "WS-10:3/TimelineWorkspaceModel");
  assert.equal(
    model.identity.namespace,
    "nexora.workspace.timeline.model",
  );
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

test("WS-10:3 identities and ordering are deterministic", () => {
  const model = TimelineWorkspaceModel;
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

test("WS-10:3 preserves representation and readiness metadata", () => {
  const model = TimelineWorkspaceModel;
  assert.equal(model.representation.runtimeValues, false);
  assert.equal(model.representation.navigationRuntime, false);
  assert.equal(model.compositions[8].fields[3], "ReadyForConsumer");
  assert.equal(model.compositions.every(({ computed }) => !computed), true);
});

test("WS-10:3 consumes only Foundation and Registry", () => {
  const source = readFileSync(
    new URL("./timelineWorkspaceModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("timelineWorkspaceValidation"), false);
  assert.deepEqual(TimelineWorkspaceModel.upstreamDependencies, [
    "WS-10:1 Timeline Workspace Foundation",
    "WS-10:2 Timeline Workspace Registry",
  ]);
  assert.equal(TimelineWorkspaceModel.runtime, false);
  assert.equal(TimelineWorkspaceModel.eventPlayback, false);
  assert.equal(TimelineWorkspaceModel.chronologicalProcessing, false);
  assert.equal(TimelineWorkspaceModel.businessLogic, false);
});
