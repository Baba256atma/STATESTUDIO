import assert from "node:assert/strict";
import test from "node:test";

import * as PublicModel from "./productRoadmapModel.ts";

test("NEX-2:3 exposes exactly eight public Model exports", () => {
  assert.equal(Object.keys(PublicModel).length, 8);
  assert.equal(PublicModel.ProductRoadmapModelPublicApiRegistry.length, 8);
});

test("NEX-2:3 publishes sixteen immutable Roadmap models", () => {
  const model = PublicModel.ProductRoadmapModel;
  assert.equal(model.identity.id, "NEX-2:3/ProductRoadmapModel");
  assert.equal(model.identity.status, "Model");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(model.readyForValidation, true);
  assert.equal(model.models.length, 16);
  assert.equal(model.relationships.length, 14);
  assert.equal(model.validationMetadata.length, 10);
  assert.equal(model.inventory.modelCount, 16);
  assert.equal(model.inventory.modelCategoryCount, 16);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.models), true);
});

test("NEX-2:3 consumes only Registry and implements no roadmap behavior", () => {
  const model = PublicModel.ProductRoadmapModel;
  assert.equal(model.dependency.upstreamId, "NEX-2:2/ProductRoadmapRegistry");
  assert.equal(model.dependency.registryOnly, true);
  assert.equal(model.dependency.otherDependenciesAllowed, false);
  assert.equal(model.runtimeExecution, false);
  assert.equal(model.roadmapExecution, false);
  assert.equal(model.scheduling, false);
  assert.equal(model.projectManagementExecution, false);
  assert.equal(model.businessLogic, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
  assert.equal(model.rendering, false);
  assert.equal(model.ui, false);
});
