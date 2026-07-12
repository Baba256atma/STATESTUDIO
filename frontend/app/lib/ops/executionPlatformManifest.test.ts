import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutionPlatformManifest,
  validateExecutionPlatformManifest,
} from "./executionPlatformManifestIndex.ts";

test("manifest builds", () => {
  const manifest = buildExecutionPlatformManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformIdentity.platformId, "OPS-1:1");
  assert.equal(manifest.phaseRegistry.length, 4);
});

test("manifest includes OPS-1:1 through OPS-1:4", () => {
  const manifest = buildExecutionPlatformManifest();

  assert.deepEqual(manifest.consumedPhases, [
    "OPS-1:1",
    "OPS-1:2",
    "OPS-1:3",
    "OPS-1:4",
  ]);
});

test("validation returns PASS", () => {
  const validation = validateExecutionPlatformManifest();

  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("manifest is immutable", () => {
  assert.equal(Object.isFrozen(buildExecutionPlatformManifest()), true);
  assert.equal(
    Object.isFrozen(buildExecutionPlatformManifest().phaseRegistry),
    true,
  );
});

test("output is deterministic", () => {
  assert.deepEqual(
    buildExecutionPlatformManifest(),
    buildExecutionPlatformManifest(),
  );
  assert.deepEqual(
    validateExecutionPlatformManifest(),
    validateExecutionPlatformManifest(),
  );
});

test("public API is stable", () => {
  const manifest = buildExecutionPlatformManifest();

  assert.equal(manifest.publicApiSurface.length >= 13, true);
  assert.equal(manifest.compatibilityVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});
