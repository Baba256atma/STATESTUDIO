import assert from "node:assert/strict";
import test from "node:test";

import * as PublicCertification from "./userJourneyExperienceCertification.ts";

test("NEX-4:7 exposes exactly eight public Certification exports", () => {
  assert.equal(Object.keys(PublicCertification).length, 8);
  assert.equal(PublicCertification.UserJourneyExperienceCertificationPublicApiRegistry.length, 8);
});

test("NEX-4:7 publishes complete upstream-derived Certification metadata", () => {
  const certification = PublicCertification.UserJourneyExperienceCertification;
  assert.equal(certification.identity.id, "NEX-4:7/UserJourneyExperienceCertification");
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

test("NEX-4:7 consumes only Platform and executes no certification", () => {
  const certification = PublicCertification.UserJourneyExperienceCertification;
  assert.equal(certification.dependency.upstreamId, "NEX-4:6/UserJourneyExperiencePlatform");
  assert.equal(certification.dependency.platformOnly, true);
  assert.equal(certification.dependency.otherDependenciesAllowed, false);
  assert.equal(certification.executesCertification, false);
  assert.equal(certification.runtimeExecution, false);
  assert.equal(certification.uiImplementation, false);
  assert.equal(certification.uxBehavior, false);
  assert.equal(certification.navigationLogic, false);
  assert.equal(certification.workflows, false);
  assert.equal(certification.businessLogic, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.rendering, false);
});
