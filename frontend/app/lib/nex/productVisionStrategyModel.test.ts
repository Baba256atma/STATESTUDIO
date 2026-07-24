import assert from "node:assert/strict";
import test from "node:test";

import * as PublicModel from "./productVisionStrategyModel.ts";

test("NEX-1:3 exposes exactly eight public model exports", () => {
  assert.equal(Object.keys(PublicModel).length, 8);
  assert.equal(PublicModel.ProductVisionStrategyModelPublicApiRegistry.length, 8);
});

test("NEX-1:3 publishes sixteen immutable models and canonical inventory", () => {
  const model = PublicModel.ProductVisionStrategyModel;
  assert.equal(model.identity.id, "NEX-1:3/ProductVisionStrategyModel");
  assert.equal(model.identity.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(model.readyForValidation, true);
  assert.equal(model.inventory.totalModelCount, 16);
  assert.equal(model.inventory.modelCategories.length, 16);
  assert.equal(model.inventory.modelGroups.length, 5);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.inventory), true);
});

test("NEX-1:3 consumes only Registry and implements no runtime surfaces", () => {
  const model = PublicModel.ProductVisionStrategyModel;
  assert.equal(model.dependency.upstreamId, "NEX-1:2/ProductVisionStrategyRegistry");
  assert.equal(model.dependency.registryOnly, true);
  assert.equal(model.dependency.otherDependenciesAllowed, false);
  assert.equal(model.runtimeBehavior, false);
  assert.equal(model.businessLogic, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
  assert.equal(model.rendering, false);
  assert.equal(model.ui, false);
  assert.equal(model.apiImplementation, false);
});
