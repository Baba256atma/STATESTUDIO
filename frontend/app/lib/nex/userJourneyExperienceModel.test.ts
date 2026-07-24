import assert from "node:assert/strict";
import test from "node:test";

import * as PublicModel from "./userJourneyExperienceModel.ts";

test("NEX-4:3 exposes exactly eight public Model exports", () => {
  assert.equal(Object.keys(PublicModel).length, 8);
  assert.equal(PublicModel.UserJourneyExperienceModelPublicApiRegistry.length, 8);
});

test("NEX-4:3 publishes sixteen immutable models", () => {
  const model = PublicModel.UserJourneyExperienceModel;
  assert.equal(model.identity.id, "NEX-4:3/UserJourneyExperienceModel");
  assert.equal(model.readiness, "ReadyForValidation");
  assert.equal(model.readyForValidation, true);
  assert.equal(model.models.length, 16);
  assert.equal(model.relationships.length, 11);
  assert.equal(model.validationMetadata.length, 10);
  assert.equal(model.inventory.modelCount, 16);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.models), true);
});

test("NEX-4:3 consumes only Registry and implements no UX behavior", () => {
  const model = PublicModel.UserJourneyExperienceModel;
  assert.equal(model.dependency.upstreamId, "NEX-4:2/UserJourneyExperienceRegistry");
  assert.equal(model.dependency.registryOnly, true);
  assert.equal(model.dependency.otherDependenciesAllowed, false);
  assert.equal(model.runtimeExecution, false);
  assert.equal(model.uiImplementation, false);
  assert.equal(model.uxBehavior, false);
  assert.equal(model.navigationLogic, false);
  assert.equal(model.workflows, false);
  assert.equal(model.businessLogic, false);
  assert.equal(model.persistence, false);
  assert.equal(model.networking, false);
  assert.equal(model.rendering, false);
});
