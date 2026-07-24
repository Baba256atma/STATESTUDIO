import assert from "node:assert/strict";
import test from "node:test";

import * as PublicManifest from "./productRoadmapManifest.ts";

test("NEX-2:5 exposes exactly eight public Manifest exports", () => {
  assert.equal(Object.keys(PublicManifest).length, 8);
  assert.equal(PublicManifest.ProductRoadmapManifestPublicApiRegistry.length, 8);
});

test("NEX-2:5 publishes complete upstream-derived Manifest metadata", () => {
  const manifest = PublicManifest.ProductRoadmapManifest;
  assert.equal(manifest.identity.id, "NEX-2:5/ProductRoadmapManifest");
  assert.equal(manifest.identity.status, "Manifest");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.equal(manifest.readyForPlatform, true);
  assert.equal(manifest.inventory.registryCount, 16);
  assert.equal(manifest.inventory.modelCount, 16);
  assert.equal(manifest.inventory.validationCategoryCount, 10);
  assert.equal(manifest.inventory.validationRuleCount, 20);
  assert.equal(manifest.inventory.validationOutcomeCount, 4);
  assert.equal(manifest.inventory.validationGroupCount, 16);
  assert.equal(manifest.inventory.relationshipCount, 14);
  assert.equal(manifest.inventory.upstreamDerived, true);
  assert.equal(manifest.inventory.hardcodedInventoryValues, false);
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.inventory), true);
});

test("NEX-2:5 consumes only Validation and implements no roadmap execution", () => {
  const manifest = PublicManifest.ProductRoadmapManifest;
  assert.equal(manifest.dependency.upstreamId, "NEX-2:4/ProductRoadmapValidation");
  assert.equal(manifest.dependency.validationOnly, true);
  assert.equal(manifest.dependency.otherDependenciesAllowed, false);
  assert.equal(manifest.runtimeExecution, false);
  assert.equal(manifest.roadmapExecution, false);
  assert.equal(manifest.scheduling, false);
  assert.equal(manifest.projectManagementExecution, false);
  assert.equal(manifest.businessLogic, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
  assert.equal(manifest.rendering, false);
  assert.equal(manifest.ui, false);
});
