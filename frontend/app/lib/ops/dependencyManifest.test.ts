import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDependencyManifest,
  validateDependencyManifest,
} from "./dependencyManifestIndex.ts";

test("phase registry", () => {
  const manifest = buildDependencyManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.phaseRegistry.length, 4);
  assert.equal(manifest.phaseRegistry[0]?.phaseId, "OPS-7:1");
});

test("dependency map", () => {
  const manifest = buildDependencyManifest();
  assert.equal(manifest.dependencyMap.length, 11);
  assert.equal(
    manifest.dependencyMap.filter((entry) => entry.sourcePhaseId === "OPS-7").length,
    5,
  );
});

test("public API surface", () => {
  const manifest = buildDependencyManifest();
  assert.equal(manifest.publicApiSurface.length >= 16, true);
  assert.equal(manifest.publicApiSurfaceMetadata.exportCount, 16);
});

test("manifest", () => {
  const manifest = buildDependencyManifest();
  assert.equal(manifest.platformIdentity.platformId, "OPS-7:1");
  assert.equal(manifest.dependencyPlatformVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("manifest validation", () => {
  const validation = validateDependencyManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildDependencyManifest()), true);
  assert.equal(Object.isFrozen(buildDependencyManifest().phaseRegistry), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(buildDependencyManifest(), buildDependencyManifest());
  assert.deepEqual(validateDependencyManifest(), validateDependencyManifest());
});

test("public API stability", () => {
  const manifest = buildDependencyManifest();
  assert.equal(manifest.summary.phaseCount, 4);
  assert.equal(manifest.summary.compatibilityStatus, "PASS");
  assert.equal(manifest.metadataOnly, true);
});
