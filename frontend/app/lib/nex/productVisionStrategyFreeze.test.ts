import assert from "node:assert/strict";
import test from "node:test";

import * as PublicFreeze from "./visionProductStrategyFreeze.ts";

test("NEX-1:8 exposes exactly eight public Freeze exports", () => {
  assert.equal(Object.keys(PublicFreeze).length, 8);
  assert.equal(PublicFreeze.ProductVisionStrategyFreezePublicApiRegistry.length, 8);
});

test("NEX-1:8 publishes the canonical immutable frozen baseline", () => {
  const freeze = PublicFreeze.ProductVisionStrategyFreeze;
  assert.equal(freeze.identity.id, "NEX-1:8/ProductVisionStrategyFreeze");
  assert.equal(freeze.identity.status, "Freeze");
  assert.equal(freeze.canonicalLockIdentifier, "NEX-1-VISION-PRODUCT-STRATEGY-LOCKED");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.readyForPublicIndex, true);
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.architecturalLocks.length, 12);
  assert.equal(freeze.extensionPolicy.length, 8);
  assert.equal(freeze.inventory.frozenSectionCount, 16);
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.baselines), true);
});

test("NEX-1:8 consumes only Certification and executes no locks", () => {
  const freeze = PublicFreeze.ProductVisionStrategyFreeze;
  assert.equal(freeze.dependency.upstreamId, "NEX-1:7/ProductVisionStrategyCertification");
  assert.equal(freeze.dependency.certificationOnly, true);
  assert.equal(freeze.dependency.otherDependenciesAllowed, false);
  assert.equal(freeze.dependency.runtimeDependency, false);
  assert.equal(freeze.executesLocks, false);
  assert.equal(freeze.runtimeExecution, false);
  assert.equal(freeze.businessLogic, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.rendering, false);
  assert.equal(freeze.ui, false);
  assert.equal(freeze.apiImplementation, false);
});
