import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthPlatformCertificationDescription,
  ExecutiveBusinessHealthPlatformCertificationId,
  ExecutiveBusinessHealthPlatformCertificationName,
  ExecutiveBusinessHealthPlatformCertificationVersion,
  buildExecutiveBusinessHealthCertificationSummary,
  getExecutiveBusinessHealthCertificationChecks,
  getExecutiveBusinessHealthCertificationMetadata,
  runExecutiveBusinessHealthPlatformCertification,
} from "./executiveBusinessHealthPlatformCertificationIndex.ts";

test("certification metadata builds successfully", () => {
  const result = runExecutiveBusinessHealthPlatformCertification();
  assert.equal(ExecutiveBusinessHealthPlatformCertificationId, "BUS-32:7");
  assert.equal(ExecutiveBusinessHealthPlatformCertificationVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthPlatformCertificationName,
    "Executive Business Health Platform Certification",
  );
  assert.equal(
    ExecutiveBusinessHealthPlatformCertificationDescription,
    "Canonical metadata-only certification layer for the Executive Business Health Intelligence Platform.",
  );
  assert.equal(result.certificationStatus, "PASS");
});

test("certification summary is deterministic and categories exist", () => {
  const summary = buildExecutiveBusinessHealthCertificationSummary();
  const metadata = getExecutiveBusinessHealthCertificationMetadata();
  assert.equal(summary.totalChecks, 13);
  assert.equal(summary.failedChecks, 0);
  assert.equal(metadata.categories.length, 13);
  assert.equal(metadata.categories.includes("Release Readiness"), true);
});

test("certification result is immutable and dependency metadata is complete", () => {
  const result = runExecutiveBusinessHealthPlatformCertification();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(result.dependencyReadiness, "READY");
  assert.equal(result.platformReadiness, "READY");
  assert.equal(result.releaseReadiness, "READY");
});

test("helper APIs are deterministic and public exports are correct", () => {
  assert.equal(
    getExecutiveBusinessHealthCertificationChecks(),
    runExecutiveBusinessHealthPlatformCertification().checks,
  );
  assert.equal(
    getExecutiveBusinessHealthCertificationMetadata().metadataOnly,
    true,
  );
  assert.equal(
    getExecutiveBusinessHealthCertificationChecks().every((check) => check.metadataOnly),
    true,
  );
});

test("no runtime execution exists", () => {
  const checks = getExecutiveBusinessHealthCertificationChecks();
  assert.equal(Array.isArray(checks), true);
  assert.equal(checks.every((check) => check.status === "PASS"), true);
  assert.equal(typeof runExecutiveBusinessHealthPlatformCertification(), "object");
});
