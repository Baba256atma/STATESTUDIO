import assert from "node:assert/strict";
import test from "node:test";

import * as PublicManifest from "./productVisionStrategyManifest.ts";

test("NEX-1:5 exposes exactly eight public Manifest exports", () => {
  assert.equal(Object.keys(PublicManifest).length, 8);
  assert.equal(PublicManifest.ProductVisionStrategyManifestPublicApiRegistry.length, 8);
});

test("NEX-1:5 publishes canonical immutable Manifest metadata", () => {
  const manifest = PublicManifest.ProductVisionStrategyManifest;
  assert.equal(manifest.identity.id, "NEX-1:5/ProductVisionStrategyManifest");
  assert.equal(manifest.identity.status, "Manifest");
  assert.equal(manifest.readiness, "ReadyForPlatform");
  assert.equal(manifest.readyForPlatform, true);
  assert.equal(manifest.inventory.registryCount, 16);
  assert.equal(manifest.inventory.modelCount, 16);
  assert.equal(manifest.inventory.validationCategoryCount, 10);
  assert.equal(manifest.inventory.validationRuleCount, 20);
  assert.equal(manifest.inventory.validationOutcomeCount, 4);
  assert.equal(manifest.inventory.domainGroupCount, 16);
  assert.equal(manifest.inventory.manifestEntryCount, 16);
  assert.equal(manifest.guarantees.length, 10);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.inventory), true);
});

test("NEX-1:5 consumes only Validation and implements no runtime surfaces", () => {
  const manifest = PublicManifest.ProductVisionStrategyManifest;
  assert.equal(manifest.dependency.upstreamId, "NEX-1:4/ProductVisionStrategyValidation");
  assert.equal(manifest.dependency.validationOnly, true);
  assert.equal(manifest.dependency.otherDependenciesAllowed, false);
  assert.equal(manifest.runtimeExecution, false);
  assert.equal(manifest.businessLogic, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.networking, false);
  assert.equal(manifest.rendering, false);
  assert.equal(manifest.ui, false);
  assert.equal(manifest.apiImplementation, false);
});
