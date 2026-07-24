import assert from "node:assert/strict";
import test from "node:test";

import * as PublicPlatform from "./productVisionStrategyPlatform.ts";

test("NEX-1:6 exposes exactly eight public Platform exports", () => {
  assert.equal(Object.keys(PublicPlatform).length, 8);
  assert.equal(PublicPlatform.ProductVisionStrategyPlatformPublicApiRegistry.length, 8);
});

test("NEX-1:6 publishes complete immutable Platform metadata", () => {
  const platform = PublicPlatform.ProductVisionStrategyPlatform;
  assert.equal(platform.identity.id, "NEX-1:6/ProductVisionStrategyPlatform");
  assert.equal(platform.identity.status, "Platform");
  assert.equal(platform.readiness, "ReadyForCertification");
  assert.equal(platform.readyForCertification, true);
  assert.equal(platform.inventory.manifestCount, 1);
  assert.equal(platform.inventory.registryCount, 16);
  assert.equal(platform.inventory.modelCount, 16);
  assert.equal(platform.inventory.platformCapabilityCount, 8);
  assert.equal(platform.inventory.platformGuaranteeCount, 10);
  assert.equal(platform.inventory.platformCompatibilityCount, 4);
  assert.equal(platform.inventory.platformEntryCount, 16);
  assert.equal(platform.capabilities.length, 8);
  assert.equal(platform.guarantees.length, 10);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(platform.capabilities), true);
});

test("NEX-1:6 consumes only Manifest and implements no runtime surfaces", () => {
  const platform = PublicPlatform.ProductVisionStrategyPlatform;
  assert.equal(platform.dependency.upstreamId, "NEX-1:5/ProductVisionStrategyManifest");
  assert.equal(platform.dependency.manifestOnly, true);
  assert.equal(platform.dependency.otherDependenciesAllowed, false);
  assert.equal(platform.dependency.runtimeDependency, false);
  assert.equal(platform.runtimeExecution, false);
  assert.equal(platform.businessLogic, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.networking, false);
  assert.equal(platform.rendering, false);
  assert.equal(platform.ui, false);
  assert.equal(platform.apiImplementation, false);
});
