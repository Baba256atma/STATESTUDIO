import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligencePlatformCertificationDescription,
  ExecutiveBusinessIntelligencePlatformCertificationId,
  ExecutiveBusinessIntelligencePlatformCertificationName,
  ExecutiveBusinessIntelligencePlatformCertificationVersion,
  buildExecutiveBusinessIntelligenceCertificationSummary,
  getExecutiveBusinessIntelligenceCertificationChecks,
  getExecutiveBusinessIntelligenceCertificationMetadata,
  runExecutiveBusinessIntelligencePlatformCertification,
} from "./executiveBusinessIntelligencePlatformCertificationIndex.ts";

test("certification metadata builds successfully", () => {
  const result = runExecutiveBusinessIntelligencePlatformCertification();
  assert.equal(ExecutiveBusinessIntelligencePlatformCertificationId, "BUS-34:7");
  assert.equal(
    ExecutiveBusinessIntelligencePlatformCertificationVersion,
    "1.0.0",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformCertificationName,
    "Executive Business Intelligence Platform Certification",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformCertificationDescription,
    "Canonical metadata-only certification layer for the Executive Business Intelligence Platform.",
  );
  assert.equal(result.certificationStatus, "PASS");
});

test("certification categories are complete", () => {
  const metadata = getExecutiveBusinessIntelligenceCertificationMetadata();
  assert.equal(metadata.categories.length, 16);
  assert.equal(metadata.categories.includes("Domains"), true);
  assert.equal(metadata.categories.includes("Platforms"), true);
  assert.equal(metadata.categories.includes("Integration"), true);
  assert.equal(metadata.categories.includes("Release Readiness"), true);
});

test("dependency metadata is complete and platform reference certification exists", () => {
  const checks = getExecutiveBusinessIntelligenceCertificationChecks();
  assert.equal(
    checks.some((check) => check.name === "Dependency Integrity"),
    true,
  );
  assert.equal(
    checks.some((check) => check.name === "Platform Reference Coverage"),
    true,
  );
});

test("release readiness metadata exists, helper APIs are deterministic, and result is immutable", () => {
  const result = runExecutiveBusinessIntelligencePlatformCertification();
  const summary = buildExecutiveBusinessIntelligenceCertificationSummary();
  assert.equal(result.releaseReadiness, "READY");
  assert.equal(summary.failedChecks, 0);
  assert.equal(
    getExecutiveBusinessIntelligenceCertificationChecks(),
    result.checks,
  );
  assert.equal(Object.isFrozen(result), true);
});

test("public exports are correct and no runtime behavior exists", () => {
  const checks = getExecutiveBusinessIntelligenceCertificationChecks();
  assert.equal(Array.isArray(checks), true);
  assert.equal(checks.every((check) => check.metadataOnly), true);
  assert.equal(typeof runExecutiveBusinessIntelligencePlatformCertification(), "object");
});
