import assert from "node:assert/strict";
import test from "node:test";

import * as PublicPlatform from "./productRoadmapPlatform.ts";

test("NEX-2:6 exposes exactly eight public Platform exports", () => {
  assert.equal(Object.keys(PublicPlatform).length, 8);
  assert.equal(PublicPlatform.ProductRoadmapPlatformPublicApiRegistry.length, 8);
});

test("NEX-2:6 publishes complete upstream-derived Platform metadata", () => {
  const platform = PublicPlatform.ProductRoadmapPlatform;
  assert.equal(platform.identity.id, "NEX-2:6/ProductRoadmapPlatform");
  assert.equal(platform.identity.status, "Platform");
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.readyForCertification, true);
  assert.equal(platform.inventory.manifestCount, 1);
  assert.equal(platform.inventory.registryCount, 16);
  assert.equal(platform.inventory.modelCount, 16);
  assert.equal(platform.inventory.validationCategoryCount, 10);
  assert.equal(platform.inventory.validationRuleCount, 20);
  assert.equal(platform.inventory.platformCapabilityCount, 8);
  assert.equal(platform.inventory.platformGuaranteeCount, 10);
  assert.equal(platform.inventory.platformCompatibilityCount, 4);
  assert.equal(platform.inventory.platformEntryCount, 16);
  assert.equal(platform.inventory.upstreamDerived, true);
  assert.equal(platform.inventory.hardcodedInventoryValues, false);
  assert.equal(platform.capabilities.length, 8);
  assert.equal(platform.guarantees.length, 10);
  assert.equal(Object.isFrozen(platform), true);
});

test("NEX-2:6 consumes only Manifest and implements no roadmap execution", () => {
  const platform = PublicPlatform.ProductRoadmapPlatform;
  assert.equal(platform.dependency.upstreamId, "NEX-2:5/ProductRoadmapManifest");
  assert.equal(platform.dependency.manifestOnly, true);
  assert.equal(platform.dependency.otherDependenciesAllowed, false);
  assert.equal(platform.runtimeExecution, false);
  assert.equal(platform.roadmapExecution, false);
  assert.equal(platform.scheduling, false);
  assert.equal(platform.projectManagementExecution, false);
  assert.equal(platform.businessLogic, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.rendering, false);
  assert.equal(platform.ui, false);
});
