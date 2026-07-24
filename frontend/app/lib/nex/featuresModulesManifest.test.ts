import assert from "node:assert/strict";
import test from "node:test";

import * as PublicManifest from "./featuresModulesManifest.ts";

test("NEX-3:5 exposes exactly eight public Manifest exports", () => {
  assert.equal(Object.keys(PublicManifest).length, 8);
  assert.equal(PublicManifest.FeaturesModulesManifestPublicApiRegistry.length, 8);
});

test("NEX-3:5 publishes complete upstream-derived Manifest metadata", () => {
  const manifest = PublicManifest.FeaturesModulesManifest;
  assert.equal(manifest.identity.id, "NEX-3:5/FeaturesModulesManifest");
  assert.equal(manifest.identity.status, "Manifest");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.equal(manifest.readyForPlatform, true);
  assert.equal(manifest.composition.sections.length, 16);
  assert.equal(manifest.inventory.registryCount, 16);
  assert.equal(manifest.inventory.modelCount, 16);
  assert.equal(manifest.inventory.validationCategoryCount, 10);
  assert.equal(manifest.inventory.validationRuleCount, 20);
  assert.equal(manifest.inventory.validationOutcomeCount, 4);
  assert.equal(manifest.inventory.validationGroupCount, 16);
  assert.equal(manifest.inventory.featureCount, 5);
  assert.equal(manifest.inventory.moduleCount, 3);
  assert.equal(manifest.inventory.upstreamDerived, true);
  assert.equal(manifest.inventory.hardcodedInventoryValues, false);
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.inventory), true);
});

test("NEX-3:5 consumes only Validation and implements no feature behavior", () => {
  const manifest = PublicManifest.FeaturesModulesManifest;
  assert.equal(manifest.dependency.upstreamId, "NEX-3:4/FeaturesModulesValidation");
  assert.equal(manifest.dependency.validationOnly, true);
  assert.equal(manifest.dependency.otherDependenciesAllowed, false);
  assert.equal(manifest.runtimeExecution, false);
  assert.equal(manifest.featureExecution, false);
  assert.equal(manifest.moduleLoading, false);
  assert.equal(manifest.featureLoading, false);
  assert.equal(manifest.businessLogic, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
  assert.equal(manifest.rendering, false);
  assert.equal(manifest.ui, false);
});
