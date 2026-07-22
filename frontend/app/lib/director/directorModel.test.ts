import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicModel from "./directorModel.ts";
import {
  DirectorModel, DirectorModelId, DirectorModelLayer, DirectorModelNamespace,
  DirectorModelReadiness, DirectorModelStatus, DirectorModelVersion,
} from "./directorModel.ts";

const FILES = Object.freeze([
  "directorModelTypes.ts", "directorSceneModels.ts", "directorCameraModels.ts",
  "directorVisualizationModels.ts", "directorTimelineModels.ts",
  "directorRelationships.ts", "directorModel.ts", "directorModel.test.ts",
]);

describe("DIRECTOR-1:3 Director Model", () => {
  it("has canonical model identity and readiness", () => {
    assert.equal(DirectorModelId, "DIRECTOR-1:3/DirectorModel");
    assert.equal(DirectorModelVersion, "1.0.0");
    assert.equal(DirectorModelNamespace, "nexora.director.model");
    assert.equal(DirectorModelLayer, "Director");
    assert.equal(DirectorModelStatus, "Model");
    assert.equal(DirectorModelReadiness, "ReadyForValidation");
  });

  it("adds exactly eight Model files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicModel).length, 8);
  });

  it("publishes twelve complete immutable model definitions", () => {
    assert.equal(DirectorModel.definitions.length, 12);
    assert.ok(Object.isFrozen(DirectorModel.definitions));
    assert.ok(DirectorModel.definitions.every((definition) => Object.isFrozen(definition)));
    assert.ok(DirectorModel.definitions.every(({ id, type, version, namespace, status, stability }) =>
      Boolean(id && type && version && namespace && status && stability)));
    assert.equal(new Set(DirectorModel.definitions.map(({ id }) => id)).size, 12);
  });

  it("maintains canonical registry references and deterministic ordering", () => {
    assert.equal(DirectorModel.dependency.registryId, "DIRECTOR-1:2/DirectorRegistry");
    assert.equal(DirectorModel.dependency.registryOnly, true);
    assert.ok(DirectorModel.definitions.every((definition, index) => definition.deterministicOrder === index + 1));
    assert.ok(DirectorModel.definitions.every(({ registryReference }) => registryReference.startsWith("DIRECTOR-1:2/")));
  });

  it("defines unique deterministic model relationships", () => {
    assert.equal(DirectorModel.relationships.length, 11);
    assert.equal(new Set(DirectorModel.relationships.map(({ relationshipId }) => relationshipId)).size, 11);
    assert.ok(DirectorModel.relationships.every((relationship, index) => relationship.deterministicOrder === index + 1));
    assert.ok(DirectorModel.relationships.every(({ runtimeReference }) => runtimeReference === false));
  });

  it("is immutable and exposes no runtime facilities", () => {
    assert.ok(Object.isFrozen(DirectorModel));
    assert.ok(Object.isFrozen(DirectorModel.relationships));
    assert.equal(DirectorModel.dependency.importsEve, false);
    assert.equal(DirectorModel.services, false);
    assert.equal(DirectorModel.factories, false);
    assert.equal(DirectorModel.orchestrationEngine, false);
  });
});
