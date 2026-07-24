import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WarRoomWorkspaceModel } from "./warRoomWorkspaceModel.ts";

const files = [
  "warRoomWorkspaceCompositionModels.ts",
  "warRoomWorkspaceDomainModels.ts",
  "warRoomWorkspaceIdentityModel.ts",
  "warRoomWorkspaceModel.test.ts",
  "warRoomWorkspaceModel.ts",
  "warRoomWorkspaceModelRegistry.ts",
  "warRoomWorkspaceRelationshipModels.ts",
  "warRoomWorkspaceRepresentationModel.ts",
];

test("WS-8:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-8:3 publishes complete immutable model metadata", () => {
  const model = WarRoomWorkspaceModel;
  assert.equal(model.identity.id, "WS-8:3/WarRoomWorkspaceModel");
  assert.equal(
    model.identity.namespace,
    "nexora.workspace.war-room.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.deepEqual(
    [
      model.domainModels.length,
      model.relationships.length,
      model.compositions.length,
      model.representation.fields.length,
    ],
    [15, 12, 8, 15],
  );
  assert.equal(Object.isFrozen(model), true);
});

test("WS-8:3 model identities and ordering are deterministic", () => {
  const model = WarRoomWorkspaceModel;
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
  assert.equal(model.modelRegistry.totalModelCount, 36);
});

test("WS-8:3 preserves representation and readiness metadata", () => {
  const model = WarRoomWorkspaceModel;
  assert.equal(model.representation.runtimeValues, false);
  assert.equal(
    model.compositions[7].fields.includes("ReadyForValueWorkspace"),
    true,
  );
  assert.equal(model.compositions.every(({ computed }) => !computed), true);
});

test("WS-8:3 consumes only Foundation and Registry", () => {
  const model = WarRoomWorkspaceModel;
  const source = readFileSync(
    new URL("./warRoomWorkspaceModel.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("warRoomWorkspaceValidation"), false);
  assert.deepEqual(model.upstreamDependencies, [
    "WS-8:1 War Room Workspace Foundation",
    "WS-8:2 War Room Workspace Registry",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.liveMonitoring, false);
  assert.equal(model.eventProcessing, false);
  assert.equal(model.businessLogic, false);
});
