import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_CERTIFICATION_COMPATIBILITY,
  EXECUTIVE_RESOURCE_CERTIFICATION_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_RESOURCE_CERTIFICATION_GATES,
  EXECUTIVE_RESOURCE_CERTIFICATION_METADATA,
  EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE,
  EXECUTIVE_RESOURCE_CERTIFICATION_POLICY,
  EXECUTIVE_RESOURCE_CERTIFICATION_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
  EXECUTIVE_RESOURCE_CERTIFICATION_SUMMARY,
  EXECUTIVE_RESOURCE_CERTIFICATION_VERSION,
  EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION,
  ExecutiveResourceCertificationFoundation,
  ExecutiveResourceCertificationPublicFoundation,
} from "./executiveResourceCertificationIndex.ts";

test("publishes immutable certification exports", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE,
    "nexora.bus.executive-resource.certification",
  );
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_STATUS, "PASS");
  assert.equal(Object.isFrozen(ExecutiveResourceCertificationFoundation), true);
});

test("publishes certification gate integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_GATES.length, 16);
  assert.equal(
    EXECUTIVE_RESOURCE_CERTIFICATION_GATES.every((gate) => gate.status === "PASS"),
    true,
  );
});

test("publishes certification summary and compatibility integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_SUMMARY.gateCount, 16);
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_SUMMARY.failedGateCount, 0);
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_CERTIFICATION.certificationLevel, "Platform");
});

test("publishes certification policy integrity", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_CERTIFICATION_POLICY.policyId,
    "executive-resource-certification-policy",
  );
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_POLICY.requirements.length, 10);
});

test("publishes namespace consistency and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_CERTIFICATION_METADATA.certificationNamespace,
    EXECUTIVE_RESOURCE_CERTIFICATION_NAMESPACE,
  );
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_PUBLIC_APIS.length, 11);
  assert.equal(
    EXECUTIVE_RESOURCE_CERTIFICATION_FOUNDATION_COMPATIBILITY.platformPublicApiCount > 0,
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveResourceCertificationPublicFoundation), true);
});
