import assert from "node:assert/strict";
import test from "node:test";

import * as PublicValidation from "./productRoadmapValidation.ts";

test("NEX-2:4 exposes exactly eight public Validation exports", () => {
  assert.equal(Object.keys(PublicValidation).length, 8);
  assert.equal(PublicValidation.ProductRoadmapValidationPublicApiRegistry.length, 8);
});

test("NEX-2:4 publishes complete immutable Validation metadata", () => {
  const validation = PublicValidation.ProductRoadmapValidation;
  assert.equal(validation.identity.id, "NEX-2:4/ProductRoadmapValidation");
  assert.equal(validation.identity.status, "Validation");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.readyForManifest, true);
  assert.equal(validation.categories.length, 10);
  assert.equal(validation.rules.length, 20);
  assert.equal(validation.outcomes.length, 4);
  assert.equal(validation.groups.length, 16);
  assert.equal(validation.inventory.validationGroupCount, 16);
  assert.equal(Object.isFrozen(validation), true);
  assert.equal(Object.isFrozen(validation.rules), true);
});

test("NEX-2:4 consumes only Model and executes no validation", () => {
  const validation = PublicValidation.ProductRoadmapValidation;
  assert.equal(validation.dependency.upstreamId, "NEX-2:3/ProductRoadmapModel");
  assert.equal(validation.dependency.modelOnly, true);
  assert.equal(validation.dependency.otherDependenciesAllowed, false);
  assert.equal(validation.executesValidation, false);
  assert.equal(validation.runtimeExecution, false);
  assert.equal(validation.roadmapExecution, false);
  assert.equal(validation.scheduling, false);
  assert.equal(validation.projectManagementExecution, false);
  assert.equal(validation.businessLogic, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.networking, false);
  assert.equal(validation.rendering, false);
  assert.equal(validation.ui, false);
});
