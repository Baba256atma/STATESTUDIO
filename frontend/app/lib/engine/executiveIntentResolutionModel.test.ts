import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionModelIndex.ts";
import { ExecutiveIntentResolutionGoalModel, ExecutiveIntentResolutionIntentModel, ExecutiveIntentResolutionModelManifest, ExecutiveIntentResolutionModelPlatform, ExecutiveIntentResolutionResolutionModel, getExecutiveIntentResolutionModelManifest, getExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";

test("model platform exists and is deeply immutable", () => {
  assert.ok(ExecutiveIntentResolutionModelPlatform);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionModelPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionModelPlatform.metadata), true);
  assert.equal(Object.values(ExecutiveIntentResolutionModelPlatform).filter((value) => typeof value === "object").every(Object.isFrozen), true);
});

test("intent model completely describes identity and classification structure", () => {
  assert.equal(ExecutiveIntentResolutionIntentModel.fields.length, 10);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionIntentModel), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionIntentModel.fields), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionIntentModel.registryReferences), true);
  assert.equal(ExecutiveIntentResolutionIntentModel.registryReferences.intentTypes.entries.length, 15);
  assert.equal(ExecutiveIntentResolutionIntentModel.registryReferences.domains.entries.length, 17);
});

test("goal model completely describes objectives, capabilities, outputs, and dependencies", () => {
  assert.equal(ExecutiveIntentResolutionGoalModel.fields.length, 7);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionGoalModel.objectiveModel), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionGoalModel.objectiveModel.fields), true);
  assert.equal(ExecutiveIntentResolutionGoalModel.goalRegistryReference.length, 5);
  assert.equal(ExecutiveIntentResolutionGoalModel.capabilityRegistryReference.entries.length, 13);
  assert.equal(ExecutiveIntentResolutionGoalModel.outputRegistryReference.entries.length, 10);
});

test("resolution model publishes all required structural model descriptors", () => {
  assert.equal(ExecutiveIntentResolutionResolutionModel.fields.length, 11);
  assert.deepEqual(Object.keys(ExecutiveIntentResolutionResolutionModel.structuralModels), ["domainMapping", "capabilityMapping", "outputExpectation", "confidence", "priority", "lifecycle", "snapshot", "summary"]);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionResolutionModel.structuralModels), true);
  assert.equal(Object.values(ExecutiveIntentResolutionResolutionModel.structuralModels).every(Object.isFrozen), true);
  assert.equal(Object.values(ExecutiveIntentResolutionResolutionModel.structuralModels).every(({ fields }) => Object.isFrozen(fields)), true);
});

test("manifest preserves public foundation and registry dependencies", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionModelManifest), true);
  assert.equal(ExecutiveIntentResolutionModelManifest.modelCollections.length, 3);
  assert.equal(ExecutiveIntentResolutionModelManifest.modelCollections.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveIntentResolutionModelManifest.registryDependencies.map(({ publicIndex }) => publicIndex), ["executiveIntentResolutionRegistryIndex.ts"]);
  assert.deepEqual(ExecutiveIntentResolutionModelManifest.foundationDependencies.map(({ publicIndex }) => publicIndex), ["executiveIntentResolutionIndex.ts"]);
  assert.equal(ExecutiveIntentResolutionModelManifest.compatibility.ownershipSafe, true);
});

test("model identifiers are unique and helpers return canonical references", () => {
  const models = [ExecutiveIntentResolutionIntentModel, ExecutiveIntentResolutionGoalModel, ExecutiveIntentResolutionResolutionModel];
  assert.equal(new Set(models.map(({ id }) => id)).size, 3);
  assert.equal(getExecutiveIntentResolutionModelPlatform(), ExecutiveIntentResolutionModelPlatform);
  assert.equal(getExecutiveIntentResolutionModelManifest(), ExecutiveIntentResolutionModelManifest);
});

test("public model index exposes exactly seven approved APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionIntentModel", "ExecutiveIntentResolutionGoalModel",
    "ExecutiveIntentResolutionResolutionModel", "ExecutiveIntentResolutionModelManifest",
    "ExecutiveIntentResolutionModelPlatform", "getExecutiveIntentResolutionModelPlatform",
    "getExecutiveIntentResolutionModelManifest",
  ].sort());
});
