import assert from "node:assert/strict";
import test from "node:test";

import * as PublicRegistry from "./productRoadmapRegistry.ts";

test("NEX-2:2 exposes exactly eight public Registry exports", () => {
  assert.equal(Object.keys(PublicRegistry).length, 8);
  assert.equal(PublicRegistry.ProductRoadmapRegistryPublicApiRegistry.length, 8);
});

test("NEX-2:2 publishes sixteen immutable roadmap registries", () => {
  const registry = PublicRegistry.ProductRoadmapRegistry;
  assert.equal(registry.identity.id, "NEX-2:2/ProductRoadmapRegistry");
  assert.equal(registry.identity.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(registry.readyForModel, true);
  assert.equal(Object.keys(registry.registries).length, 16);
  assert.equal(registry.inventory.registryCount, 16);
  assert.equal(registry.relationships.length, 11);
  assert.equal(registry.validationMetadata.length, 10);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.registries), true);
});

test("NEX-2:2 consumes only Foundation and implements no roadmap execution", () => {
  const registry = PublicRegistry.ProductRoadmapRegistry;
  assert.equal(registry.dependency.upstreamId, "NEX-2:1/ProductRoadmapFoundation");
  assert.equal(registry.dependency.foundationOnly, true);
  assert.equal(registry.dependency.otherDependenciesAllowed, false);
  assert.equal(registry.runtimeExecution, false);
  assert.equal(registry.roadmapExecution, false);
  assert.equal(registry.scheduling, false);
  assert.equal(registry.projectManagementExecution, false);
  assert.equal(registry.businessLogic, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
  assert.equal(registry.rendering, false);
  assert.equal(registry.ui, false);
});
