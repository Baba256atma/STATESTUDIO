import assert from "node:assert/strict";
import test from "node:test";

import * as PublicCertification from "./productVisionStrategyCertification.ts";

test("NEX-1:7 exposes exactly eight public Certification exports", () => {
  assert.equal(Object.keys(PublicCertification).length, 8);
  assert.equal(PublicCertification.ProductVisionStrategyCertificationPublicApiRegistry.length, 8);
});

test("NEX-1:7 publishes complete immutable Certification metadata", () => {
  const certification = PublicCertification.ProductVisionStrategyCertification;
  assert.equal(certification.identity.id, "NEX-1:7/ProductVisionStrategyCertification");
  assert.equal(certification.identity.status, "Certification");
  assert.equal(certification.readiness, "ReadyForFreeze");
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.inventory.platformCount, 1);
  assert.equal(certification.inventory.certificationCriteriaCount, 16);
  assert.equal(certification.inventory.certificationGateCount, 12);
  assert.equal(certification.criteria.length, 16);
  assert.equal(certification.gates.length, 12);
  assert.equal(certification.guarantees.length, 10);
  assert.equal(Object.isFrozen(certification), true);
  assert.equal(Object.isFrozen(certification.criteria), true);
});

test("NEX-1:7 consumes only Platform and executes no certification", () => {
  const certification = PublicCertification.ProductVisionStrategyCertification;
  assert.equal(certification.dependency.upstreamId, "NEX-1:6/ProductVisionStrategyPlatform");
  assert.equal(certification.dependency.platformOnly, true);
  assert.equal(certification.dependency.otherDependenciesAllowed, false);
  assert.equal(certification.dependency.runtimeDependency, false);
  assert.equal(certification.executesCertification, false);
  assert.equal(certification.runtimeExecution, false);
  assert.equal(certification.businessLogic, false);
  assert.equal(certification.persistence, false);
  assert.equal(certification.networking, false);
  assert.equal(certification.rendering, false);
  assert.equal(certification.ui, false);
  assert.equal(certification.apiImplementation, false);
});
