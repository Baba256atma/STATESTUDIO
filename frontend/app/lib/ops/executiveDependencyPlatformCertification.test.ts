import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveDependencyPlatformCertificationRegistry,
  ExecutiveDependencyPlatformCompatibility,
  buildExecutiveDependencyPlatformCertificationManifest,
  certifyExecutiveDependencyPlatform,
  getExecutiveDependencyCertificationSummary,
  getExecutiveDependencyPlatformCertification,
  runExecutiveDependencyPlatformCertification,
} from "./executiveDependencyPlatformCertificationIndex.ts";

test("certification registry", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformCertificationRegistry), true);
  assert.equal(
    ExecutiveDependencyPlatformCertificationRegistry.certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveDependencyPlatformCertificationRegistry.certificationStatus,
    "PASS",
  );
});

test("compatibility metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyPlatformCompatibility), true);
  assert.equal(ExecutiveDependencyPlatformCompatibility.internal.length, 6);
  assert.equal(ExecutiveDependencyPlatformCompatibility.crossPlatform.length, 5);
});

test("certification manifest", () => {
  const manifest = buildExecutiveDependencyPlatformCertificationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.releaseReadiness.status, "Ready");
});

test("certification helpers", () => {
  assert.equal(certifyExecutiveDependencyPlatform(), "PASS");
  assert.equal(getExecutiveDependencyPlatformCertification().status, "PASS");
  assert.equal(
    getExecutiveDependencyCertificationSummary().certificationStatus,
    "PASS",
  );
});

test("certification runner", () => {
  const result = runExecutiveDependencyPlatformCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, 15);
});

test("immutable exports", () => {
  assert.equal(
    Object.isFrozen(buildExecutiveDependencyPlatformCertificationManifest()),
    true,
  );
  assert.equal(Object.isFrozen(runExecutiveDependencyPlatformCertification()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    buildExecutiveDependencyPlatformCertificationManifest(),
    buildExecutiveDependencyPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runExecutiveDependencyPlatformCertification(),
    runExecutiveDependencyPlatformCertification(),
  );
  assert.deepEqual(
    getExecutiveDependencyCertificationSummary(),
    getExecutiveDependencyCertificationSummary(),
  );
});

test("public API stability", () => {
  assert.equal(
    getExecutiveDependencyPlatformCertification().manifest.metadataOnly,
    true,
  );
  assert.equal(
    getExecutiveDependencyPlatformCertification().result.status,
    "PASS",
  );
});
