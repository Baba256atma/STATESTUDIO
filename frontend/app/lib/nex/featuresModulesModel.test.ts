import assert from "node:assert/strict";
import test from "node:test";

import * as PublicModel from "./featuresModulesModel.ts";

test("NEX-3:3 exposes exactly eight public Model exports", () => {
  assert.equal(Object.keys(PublicModel).length, 8);
  assert.equal(PublicModel.FeaturesModulesModelPublicApiRegistry.length, 8);
});

test("NEX-3:3 publishes sixteen immutable models", () => {
  const model = PublicModel.FeaturesModulesModel;
  assert.equal(model.identity.id, "NEX-3:3/FeaturesModulesModel");
  assert.equal(model.identity.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(model.readyForValidation, true);
  assert.equal(model.models.length, 16);
  assert.equal(model.relationships.length, 13);
  assert.equal(model.validationMetadata.length, 10);
  assert.equal(model.inventory.modelCount, 16);
  assert.equal(model.inventory.modelCategoryCount, 16);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.models), true);
});

test("NEX-3:3 consumes only Registry and implements no feature behavior", () => {
  const model = PublicModel.FeaturesModulesModel;
  assert.equal(model.dependency.upstreamId, "NEX-3:2/FeaturesModulesRegistry");
  assert.equal(model.dependency.registryOnly, true);
  assert.equal(model.dependency.otherDependenciesAllowed, false);
  assert.equal(model.runtimeExecution, false);
  assert.equal(model.featureExecution, false);
  assert.equal(model.moduleLoading, false);
  assert.equal(model.featureLoading, false);
  assert.equal(model.businessLogic, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
  assert.equal(model.rendering, false);
  assert.equal(model.ui, false);
});
