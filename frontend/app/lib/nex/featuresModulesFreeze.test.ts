import assert from "node:assert/strict";
import test from "node:test";

import * as PublicFreeze from "./featuresModulesFreeze.ts";

test("NEX-3:8 exposes exactly eight public Freeze exports", () => {
  assert.equal(Object.keys(PublicFreeze).length, 8);
  assert.equal(PublicFreeze.FeaturesModulesFreezePublicApiRegistry.length, 8);
});

test("NEX-3:8 publishes the immutable frozen baseline", () => {
  const freeze = PublicFreeze.FeaturesModulesFreeze;
  assert.equal(freeze.identity.id, "NEX-3:8/FeaturesModulesFreeze");
  assert.equal(freeze.canonicalLockIdentifier, "NEX-3-FEATURES-MODULES-LOCKED");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.readyForPublicIndex, true);
  assert.equal(freeze.inventory.frozenBaselineCount, 8);
  assert.equal(freeze.inventory.architecturalLockCount, 12);
  assert.equal(freeze.inventory.extensionPolicyCount, 8);
  assert.equal(freeze.inventory.compatibilityCount, 4);
  assert.equal(freeze.inventory.publicApiCount, 8);
  assert.equal(freeze.inventory.freezeEntryCount, 16);
  assert.equal(freeze.inventory.upstreamDerived, true);
  assert.equal(freeze.inventory.hardcodedInventoryValues, false);
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.architecturalLocks.length, 12);
  assert.equal(freeze.extensionPolicy.length, 8);
  assert.equal(Object.isFrozen(freeze), true);
});

test("NEX-3:8 consumes only Certification and executes no locks", () => {
  const freeze = PublicFreeze.FeaturesModulesFreeze;
  assert.equal(freeze.dependency.upstreamId, "NEX-3:7/FeaturesModulesCertification");
  assert.equal(freeze.dependency.certificationOnly, true);
  assert.equal(freeze.dependency.otherDependenciesAllowed, false);
  assert.equal(freeze.executesLocks, false);
  assert.equal(freeze.runtimeExecution, false);
  assert.equal(freeze.featureExecution, false);
  assert.equal(freeze.moduleLoading, false);
  assert.equal(freeze.featureLoading, false);
  assert.equal(freeze.businessLogic, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.networking, false);
  assert.equal(freeze.rendering, false);
  assert.equal(freeze.ui, false);
});
