import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAutomationPlatformCertificationRegistry,
  ExecutiveAutomationPlatformCompatibility,
  buildExecutiveAutomationPlatformCertificationManifest,
  certifyExecutiveAutomationPlatform,
  getExecutiveAutomationCertificationSummary,
  getExecutiveAutomationPlatformCertification,
  runExecutiveAutomationPlatformCertification,
} from "./executiveAutomationPlatformCertificationIndex.ts";

test("certification registry", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformCertificationRegistry), true);
  assert.equal(
    ExecutiveAutomationPlatformCertificationRegistry.certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveAutomationPlatformCertificationRegistry.certificationStatus,
    "PASS",
  );
});

test("compatibility metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformCompatibility), true);
  assert.equal(ExecutiveAutomationPlatformCompatibility.internal.length, 6);
  assert.equal(ExecutiveAutomationPlatformCompatibility.crossPlatform.length, 6);
});

test("certification manifest", () => {
  const manifest = buildExecutiveAutomationPlatformCertificationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.releaseReadiness.status, "Ready");
});

test("certification helpers", () => {
  assert.equal(certifyExecutiveAutomationPlatform(), "PASS");
  assert.equal(getExecutiveAutomationPlatformCertification().status, "PASS");
  assert.equal(
    getExecutiveAutomationCertificationSummary().certificationStatus,
    "PASS",
  );
});

test("certification runner", () => {
  const result = runExecutiveAutomationPlatformCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, 15);
});

test("immutable exports", () => {
  assert.equal(
    Object.isFrozen(buildExecutiveAutomationPlatformCertificationManifest()),
    true,
  );
  assert.equal(Object.isFrozen(runExecutiveAutomationPlatformCertification()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    buildExecutiveAutomationPlatformCertificationManifest(),
    buildExecutiveAutomationPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runExecutiveAutomationPlatformCertification(),
    runExecutiveAutomationPlatformCertification(),
  );
  assert.deepEqual(
    getExecutiveAutomationCertificationSummary(),
    getExecutiveAutomationCertificationSummary(),
  );
});

test("public API stability", () => {
  assert.equal(
    getExecutiveAutomationPlatformCertification().manifest.metadataOnly,
    true,
  );
  assert.equal(
    getExecutiveAutomationPlatformCertification().result.status,
    "PASS",
  );
});
