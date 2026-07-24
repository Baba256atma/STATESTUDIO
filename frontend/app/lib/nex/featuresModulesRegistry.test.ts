import assert from "node:assert/strict";
import test from "node:test";

import * as PublicRegistry from "./featuresModulesRegistry.ts";

test("NEX-3:2 exposes exactly eight public Registry exports", () => {
  assert.equal(Object.keys(PublicRegistry).length, 8);
  assert.equal(PublicRegistry.FeaturesModulesRegistryPublicApiRegistry.length, 8);
});

test("NEX-3:2 publishes sixteen immutable registries", () => {
  const registry = PublicRegistry.FeaturesModulesRegistry;
  assert.equal(registry.identity.id, "NEX-3:2/FeaturesModulesRegistry");
  assert.equal(registry.identity.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(registry.readyForModel, true);
  assert.equal(Object.keys(registry.registries).length, 16);
  assert.equal(registry.inventory.registryCount, 16);
  assert.equal(registry.relationships.length, 10);
  assert.equal(registry.validationMetadata.length, 10);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.registries), true);
});

test("NEX-3:2 consumes only Foundation and implements no feature behavior", () => {
  const registry = PublicRegistry.FeaturesModulesRegistry;
  assert.equal(registry.dependency.upstreamId, "NEX-3:1/FeaturesModulesFoundation");
  assert.equal(registry.dependency.foundationOnly, true);
  assert.equal(registry.dependency.otherDependenciesAllowed, false);
  assert.equal(registry.runtimeExecution, false);
  assert.equal(registry.featureExecution, false);
  assert.equal(registry.moduleLoading, false);
  assert.equal(registry.featureLoading, false);
  assert.equal(registry.businessLogic, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
  assert.equal(registry.rendering, false);
  assert.equal(registry.ui, false);
});
