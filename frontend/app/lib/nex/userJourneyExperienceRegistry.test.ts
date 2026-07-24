import assert from "node:assert/strict";
import test from "node:test";

import * as PublicRegistry from "./userJourneyExperienceRegistry.ts";

test("NEX-4:2 exposes exactly eight public Registry exports", () => {
  assert.equal(Object.keys(PublicRegistry).length, 8);
  assert.equal(PublicRegistry.UserJourneyExperienceRegistryPublicApiRegistry.length, 8);
});

test("NEX-4:2 publishes sixteen immutable registries", () => {
  const registry = PublicRegistry.UserJourneyExperienceRegistry;
  assert.equal(registry.identity.id, "NEX-4:2/UserJourneyExperienceRegistry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.equal(registry.readyForModel, true);
  assert.equal(Object.keys(registry.registries).length, 16);
  assert.equal(registry.inventory.registryCount, 16);
  assert.equal(registry.relationships.length, 10);
  assert.equal(registry.validationMetadata.length, 10);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.registries), true);
});

test("NEX-4:2 consumes only Foundation and implements no UX behavior", () => {
  const registry = PublicRegistry.UserJourneyExperienceRegistry;
  assert.equal(registry.dependency.upstreamId, "NEX-4:1/UserJourneyExperienceFoundation");
  assert.equal(registry.dependency.foundationOnly, true);
  assert.equal(registry.dependency.otherDependenciesAllowed, false);
  assert.equal(registry.runtimeExecution, false);
  assert.equal(registry.uiImplementation, false);
  assert.equal(registry.uxBehavior, false);
  assert.equal(registry.navigationLogic, false);
  assert.equal(registry.workflows, false);
  assert.equal(registry.businessLogic, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.networking, false);
  assert.equal(registry.rendering, false);
});
