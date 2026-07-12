import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentModelIndex.ts";
import { ExecutiveRequestIntentClassificationModel, ExecutiveRequestIntentContextModel, ExecutiveRequestIntentIntentModel, ExecutiveRequestIntentLifecycleModel, ExecutiveRequestIntentMetadataModel, ExecutiveRequestIntentModelManifest, ExecutiveRequestIntentRelationshipModel, ExecutiveRequestIntentRequestModel, getExecutiveRequestIntentModelManifest, getExecutiveRequestIntentModelSummary } from "./executiveRequestIntentModelIndex.ts";

const models = [
  ExecutiveRequestIntentRequestModel, ExecutiveRequestIntentIntentModel,
  ExecutiveRequestIntentClassificationModel, ExecutiveRequestIntentContextModel,
  ExecutiveRequestIntentMetadataModel, ExecutiveRequestIntentLifecycleModel,
  ExecutiveRequestIntentRelationshipModel,
] as const;

test("seven canonical models are complete and deeply immutable", () => {
  assert.equal(models.length, 7);
  assert.equal(models.every(Object.isFrozen), true);
  assert.equal(models.every((model) => Object.isFrozen(model.fields)), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentRelationshipModel.relationships), true);
  assert.equal(ExecutiveRequestIntentRelationshipModel.relationships.every(Object.isFrozen), true);
});

test("manifest aggregates the canonical model references deterministically", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentModelManifest), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentModelManifest.models), true);
  assert.deepEqual(ExecutiveRequestIntentModelManifest.models, models);
  assert.equal(getExecutiveRequestIntentModelManifest(), ExecutiveRequestIntentModelManifest);
  assert.equal(getExecutiveRequestIntentModelSummary(), ExecutiveRequestIntentModelManifest.architecturalSummary);
});

test("dependencies reference only ENG-2:1 and ENG-2:2 public indices", () => {
  assert.deepEqual(ExecutiveRequestIntentModelManifest.dependencyReferences.map(({ phase }) => phase), ["ENG-2:1", "ENG-2:2"]);
  assert.deepEqual(ExecutiveRequestIntentModelManifest.dependencyReferences.map(({ publicIndex }) => publicIndex), ["executiveRequestIntentIndex.ts", "executiveRequestIntentRegistryIndex.ts"]);
  assert.equal(ExecutiveRequestIntentModelManifest.dependencyReferences.every(Object.isFrozen), true);
});

test("namespace, ownership, and model identifiers are consistent", () => {
  assert.equal(models.every(({ namespace }) => namespace === ExecutiveRequestIntentModelManifest.namespace), true);
  assert.equal(new Set(models.map(({ id }) => id)).size, models.length);
  assert.equal(ExecutiveRequestIntentIntentModel.ownership.genericConceptOwner, "ENG-1");
  assert.equal(ExecutiveRequestIntentIntentModel.ownership.specializedModelOwner, "ENG-2");
  assert.equal(ExecutiveRequestIntentModelManifest.ownershipReferences.some((entry) => entry.includes("collision-safe")), true);
});

test("lifecycle, classification, context, and relationship metadata is complete", () => {
  assert.deepEqual(ExecutiveRequestIntentLifecycleModel.stages, ["Registered", "Classified", "Prepared", "Planned", "Completed", "Archived"]);
  assert.equal(ExecutiveRequestIntentClassificationModel.dimensions.length, 9);
  assert.equal(ExecutiveRequestIntentContextModel.contextTypes.length, 7);
  assert.equal(ExecutiveRequestIntentRelationshipModel.relationships.length, 5);
  assert.equal(getExecutiveRequestIntentModelSummary().modelCount, 7);
});

test("public API uses exactly ten collision-safe symbols", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentRequestModel", "ExecutiveRequestIntentIntentModel",
    "ExecutiveRequestIntentClassificationModel", "ExecutiveRequestIntentContextModel",
    "ExecutiveRequestIntentMetadataModel", "ExecutiveRequestIntentLifecycleModel",
    "ExecutiveRequestIntentRelationshipModel", "ExecutiveRequestIntentModelManifest",
    "getExecutiveRequestIntentModelManifest", "getExecutiveRequestIntentModelSummary",
  ].sort());
  assert.equal("ExecutiveRequestModel" in publicApi, false);
  assert.equal("ExecutiveIntentModel" in publicApi, false);
});
