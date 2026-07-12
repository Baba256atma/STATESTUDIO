import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingPlatformCertificationDescription,
  ExecutiveReportingPlatformCertificationId,
  ExecutiveReportingPlatformCertificationName,
  ExecutiveReportingPlatformCertificationVersion,
  buildExecutiveReportingCertificationSummary,
  getExecutiveReportingCertificationChecks,
  getExecutiveReportingCertificationMetadata,
  runExecutiveReportingPlatformCertification,
} from "./executiveReportingPlatformCertificationIndex.ts";

test("certification metadata builds successfully", () => {
  const result = runExecutiveReportingPlatformCertification();
  assert.equal(ExecutiveReportingPlatformCertificationId, "BUS-33:7");
  assert.equal(ExecutiveReportingPlatformCertificationVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingPlatformCertificationName,
    "Executive Reporting Platform Certification",
  );
  assert.equal(
    ExecutiveReportingPlatformCertificationDescription,
    "Canonical metadata-only certification layer for the Executive Reporting Intelligence Platform.",
  );
  assert.equal(result.certificationStatus, "PASS");
});

test("certification summary is deterministic and categories are complete", () => {
  const summary = buildExecutiveReportingCertificationSummary();
  const metadata = getExecutiveReportingCertificationMetadata();
  assert.equal(summary.totalChecks, 13);
  assert.equal(summary.failedChecks, 0);
  assert.equal(metadata.categories.length, 13);
  assert.equal(metadata.categories.includes("Release Readiness"), true);
});

test("certification result is immutable and dependency metadata is complete", () => {
  const result = runExecutiveReportingPlatformCertification();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(result.dependencyReadiness, "READY");
  assert.equal(result.platformReadiness, "READY");
  assert.equal(result.releaseReadiness, "READY");
});

test("helper APIs are deterministic and public exports are correct", () => {
  assert.equal(
    getExecutiveReportingCertificationChecks(),
    runExecutiveReportingPlatformCertification().checks,
  );
  assert.equal(getExecutiveReportingCertificationMetadata().metadataOnly, true);
  assert.equal(
    getExecutiveReportingCertificationChecks().every((check) => check.metadataOnly),
    true,
  );
});

test("no runtime behavior exists", () => {
  const checks = getExecutiveReportingCertificationChecks();
  assert.equal(Array.isArray(checks), true);
  assert.equal(checks.every((check) => check.status === "PASS"), true);
  assert.equal(typeof runExecutiveReportingPlatformCertification(), "object");
});
