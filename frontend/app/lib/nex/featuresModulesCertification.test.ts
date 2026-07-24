import assert from "node:assert/strict";
import test from "node:test";

import * as PublicCertification from "./featuresModulesCertification.ts";

test("NEX-3:7 exposes exactly eight public Certification exports", () => {
  assert.equal(Object.keys(PublicCertification).length, 8);
  assert.equal(PublicCertification.FeaturesModulesCertificationPublicApiRegistry.length, 8);
});

test("NEX-3:7 publishes complete upstream-derived Certification metadata", () => {
  const certification = PublicCertification.FeaturesModulesCertification;
  assert.equal(certification.identity.id, "NEX-3:7/FeaturesModulesCertification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.inventory.platformCount, 1);
  assert.equal(certification.inventory.capabilityCount, 8);
  assert.equal(certification.inventory.guaranteeCount, 10);
  assert.equal(certification.inventory.compatibilityCount, 4);
  assert.equal(certification.inventory.certificationCriteriaCount, 16);
  assert.equal(certification.inventory.certificationGateCount, 12);
  assert.equal(certification.inventory.dependencyCount, 1);
  assert.equal(certification.inventory.certificationEntryCount, 16);
  assert.equal(certification.inventory.upstreamDerived, true);
  assert.equal(certification.inventory.hardcodedInventoryValues, false);
  assert.equal(certification.criteria.length, 16);
  assert.equal(certification.gates.length, 12);
  assert.equal(certification.guarantees.length, 10);
  assert.equal(Object.isFrozen(certification), true);
});

test("NEX-3:7 consumes only Platform and executes no certification", () => {
  const certification = PublicCertification.FeaturesModulesCertification;
  assert.equal(certification.dependency.upstreamId, "NEX-3:6/FeaturesModulesPlatform");
  assert.equal(certification.dependency.platformOnly, true);
  assert.equal(certification.dependency.otherDependenciesAllowed, false);
  assert.equal(certification.executesCertification, false);
  assert.equal(certification.runtimeExecution, false);
  assert.equal(certification.featureExecution, false);
  assert.equal(certification.moduleLoading, false);
  assert.equal(certification.featureLoading, false);
  assert.equal(certification.businessLogic, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.rendering, false);
  assert.equal(certification.ui, false);
});
