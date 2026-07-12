import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutiveTenantPlatformCertificationManifest,
  CORE_TENANT_CERTIFICATION_METADATA,
  CORE_TENANT_RELEASE_METADATA,
  ExecutiveTenantPlatformCertification,
  runExecutiveTenantPlatformCertification,
} from "./coreTenantPlatformCertificationIndex.ts";

test("TEN-1 through TEN-6 certified", () => {
  const result = runExecutiveTenantPlatformCertification();

  assert.equal(result.status, "PASS");
  assert.equal(result.dependencies.length, 6);
  assert.equal(result.gates.some((gate) => gate.gateId === "gate-ten-6" && gate.passed), true);
});

test("all certification gates pass", () => {
  const result = runExecutiveTenantPlatformCertification();

  assert.equal(result.gates.length, 14);
  assert.equal(result.gates.every((gate) => gate.passed), true);
});

test("cross-phase compatibility verified", () => {
  const result = runExecutiveTenantPlatformCertification();
  const gate = result.gates.find((entry) => entry.gateId === "gate-cross-phase");

  assert.equal(gate?.passed, true);
});

test("dependency graph complete", () => {
  const result = runExecutiveTenantPlatformCertification();

  assert.deepEqual(result.dependencies, [
    "CORE-TEN-1",
    "CORE-TEN-2",
    "CORE-TEN-3",
    "CORE-TEN-4",
    "CORE-TEN-5",
    "CORE-TEN-6",
  ]);
});

test("manifest builds deterministically", () => {
  const first = buildExecutiveTenantPlatformCertificationManifest();
  const second = buildExecutiveTenantPlatformCertificationManifest();

  assert.equal(first.platformId, "CORE-TEN-7");
  assert.equal(first.platformNamespace, "nexora.core.tenant.certification");
  assert.equal(first.deterministicFingerprint, second.deterministicFingerprint);
  assert.equal(Object.isFrozen(first), true);
});

test("public APIs verified", () => {
  assert.equal(typeof ExecutiveTenantPlatformCertification.buildExecutiveTenantPlatformCertificationManifest, "function");
  assert.equal(typeof ExecutiveTenantPlatformCertification.runExecutiveTenantPlatformCertification, "function");
  assert.equal(Object.isFrozen(ExecutiveTenantPlatformCertification), true);
});

test("boundary verification", () => {
  const result = runExecutiveTenantPlatformCertification();

  assert.equal(result.gates.some((gate) => gate.gateId === "gate-no-runtime" && gate.passed), true);
  assert.equal(result.gates.some((gate) => gate.gateId === "gate-boundaries" && gate.passed), true);
});

test("metadata is immutable and complete", () => {
  assert.equal(CORE_TENANT_CERTIFICATION_METADATA.namespace, "nexora.core.tenant.certification");
  assert.deepEqual(CORE_TENANT_CERTIFICATION_METADATA.supportedContracts, ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4", "CORE-TEN-5", "CORE-TEN-6"]);
  assert.equal(CORE_TENANT_RELEASE_METADATA.releaseStage, "Certified");
  assert.equal(Object.isFrozen(CORE_TENANT_CERTIFICATION_METADATA), true);
});

