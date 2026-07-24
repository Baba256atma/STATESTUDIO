import assert from "node:assert/strict";
import test from "node:test";

import * as PublicManifest from "./userJourneyExperienceManifest.ts";

test("NEX-4:5 exposes exactly eight public Manifest exports", () => {
  assert.equal(Object.keys(PublicManifest).length, 8);
  assert.equal(PublicManifest.UserJourneyExperienceManifestPublicApiRegistry.length, 8);
});

test("NEX-4:5 publishes complete upstream-derived Manifest metadata", () => {
  const manifest = PublicManifest.UserJourneyExperienceManifest;
  assert.equal(manifest.identity.id, "NEX-4:5/UserJourneyExperienceManifest");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.equal(manifest.readyForPlatform, true);
  assert.equal(manifest.composition.sections.length, 16);
  assert.equal(manifest.inventory.registryCount, 16);
  assert.equal(manifest.inventory.modelCount, 16);
  assert.equal(manifest.inventory.validationCategoryCount, 10);
  assert.equal(manifest.inventory.validationRuleCount, 20);
  assert.equal(manifest.inventory.validationOutcomeCount, 4);
  assert.equal(manifest.inventory.validationGroupCount, 16);
  assert.equal(manifest.inventory.journeyCount, 2);
  assert.equal(manifest.inventory.experienceCount, 6);
  assert.equal(manifest.inventory.upstreamDerived, true);
  assert.equal(manifest.inventory.hardcodedInventoryValues, false);
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(Object.isFrozen(manifest), true);
});

test("NEX-4:5 consumes only Validation and implements no UX behavior", () => {
  const manifest = PublicManifest.UserJourneyExperienceManifest;
  assert.equal(manifest.dependency.upstreamId, "NEX-4:4/UserJourneyExperienceValidation");
  assert.equal(manifest.dependency.validationOnly, true);
  assert.equal(manifest.dependency.otherDependenciesAllowed, false);
  assert.equal(manifest.runtimeExecution, false);
  assert.equal(manifest.uiImplementation, false);
  assert.equal(manifest.uxBehavior, false);
  assert.equal(manifest.navigationLogic, false);
  assert.equal(manifest.workflows, false);
  assert.equal(manifest.businessLogic, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
  assert.equal(manifest.rendering, false);
});
