import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_ORGANIZATION_CERTIFICATION_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_FOUNDATION_COMPATIBILITY,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_PUBLIC_APIS,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_SUMMARY,
  EXECUTIVE_ORGANIZATION_CERTIFICATION_VERSION,
  EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION,
  ExecutiveOrganizationCertificationFoundation,
  ExecutiveOrganizationCertificationPublicFoundation,
} from "./executiveOrganizationCertificationIndex.ts";

test("publishes immutable certification exports", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE,
    "nexora.bus.executive-organization.certification",
  );
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_STATUS, "PASS");
  assert.equal(Object.isFrozen(ExecutiveOrganizationCertificationFoundation), true);
});

test("publishes certification gate integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES.length, 16);
  assert.equal(
    EXECUTIVE_ORGANIZATION_CERTIFICATION_GATES.every((gate) => gate.status === "PASS"),
    true,
  );
});

test("publishes certification summary and compatibility integrity", () => {
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_SUMMARY.gateCount, 16);
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_SUMMARY.failedGateCount, 0);
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_COMPATIBILITY.compatibilityStatus, "Compatible");
  assert.equal(EXECUTIVE_ORGANIZATION_PLATFORM_CERTIFICATION.certificationLevel, "Platform");
});

test("publishes certification policy integrity", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY.policyId,
    "executive-organization-certification-policy",
  );
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_POLICY.requirements.length, 10);
});

test("publishes namespace consistency and deterministic public API", () => {
  assert.equal(
    EXECUTIVE_ORGANIZATION_CERTIFICATION_METADATA.certificationNamespace,
    EXECUTIVE_ORGANIZATION_CERTIFICATION_NAMESPACE,
  );
  assert.equal(EXECUTIVE_ORGANIZATION_CERTIFICATION_PUBLIC_APIS.length, 11);
  assert.equal(
    EXECUTIVE_ORGANIZATION_CERTIFICATION_FOUNDATION_COMPATIBILITY.platformPublicApiCount > 0,
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveOrganizationCertificationPublicFoundation), true);
});
