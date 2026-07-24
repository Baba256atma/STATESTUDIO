import assert from "node:assert/strict";
import test from "node:test";

import * as PublicValidation from "./userJourneyExperienceValidation.ts";

test("NEX-4:4 exposes exactly eight public Validation exports", () => {
  assert.equal(Object.keys(PublicValidation).length, 8);
  assert.equal(PublicValidation.UserJourneyExperienceValidationPublicApiRegistry.length, 8);
});

test("NEX-4:4 publishes exact immutable Validation metadata", () => {
  const validation = PublicValidation.UserJourneyExperienceValidation;
  assert.equal(validation.identity.id, "NEX-4:4/UserJourneyExperienceValidation");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.readyForManifest, true);
  assert.equal(validation.categories.length, 10);
  assert.equal(validation.rules.length, 20);
  assert.equal(validation.outcomes.length, 4);
  assert.equal(validation.groups.length, 16);
  assert.equal(validation.inventory.validationCategoryCount, 10);
  assert.equal(validation.inventory.validationRuleCount, 20);
  assert.equal(validation.inventory.validationOutcomeCount, 4);
  assert.equal(validation.inventory.validationGroupCount, 16);
  assert.equal(Object.isFrozen(validation), true);
});

test("NEX-4:4 consumes only Model and executes no validation", () => {
  const validation = PublicValidation.UserJourneyExperienceValidation;
  assert.equal(validation.dependency.upstreamId, "NEX-4:3/UserJourneyExperienceModel");
  assert.equal(validation.dependency.modelOnly, true);
  assert.equal(validation.dependency.otherDependenciesAllowed, false);
  assert.equal(validation.executesValidation, false);
  assert.equal(validation.runtimeExecution, false);
  assert.equal(validation.uiImplementation, false);
  assert.equal(validation.uxBehavior, false);
  assert.equal(validation.navigationLogic, false);
  assert.equal(validation.workflows, false);
  assert.equal(validation.businessLogic, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.networking, false);
  assert.equal(validation.rendering, false);
});
