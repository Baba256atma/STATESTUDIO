import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  buildTaskPlatformManifest,
  validateTaskPlatformManifest,
} from "./taskPlatformManifestIndex.ts";

test("manifest builds", () => {
  const manifest = buildTaskPlatformManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformIdentity.platformId, "OPS-2:1");
  assert.equal(manifest.phaseRegistry.length, 4);
});

test("manifest includes OPS-2:1 through OPS-2:4", () => {
  const manifest = buildTaskPlatformManifest();
  assert.deepEqual(manifest.consumedPhases, [
    "OPS-2:1",
    "OPS-2:2",
    "OPS-2:3",
    "OPS-2:4",
  ]);
});

test("validation returns PASS", () => {
  const validation = validateTaskPlatformManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("manifest is immutable", () => {
  assert.equal(Object.isFrozen(buildTaskPlatformManifest()), true);
  assert.equal(
    Object.isFrozen(buildTaskPlatformManifest().phaseRegistry),
    true,
  );
});

test("output is deterministic", () => {
  assert.deepEqual(buildTaskPlatformManifest(), buildTaskPlatformManifest());
  assert.deepEqual(
    validateTaskPlatformManifest(),
    validateTaskPlatformManifest(),
  );
});

test("public API is stable", () => {
  const manifest = buildTaskPlatformManifest();
  assert.equal(manifest.publicApiSurface.length >= 13, true);
  assert.equal(manifest.compatibilityVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("compatibility with OPS-1 public platform", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(
    buildTaskPlatformManifest().foundation.identity.dependencySource,
    "OPS-1:9",
  );
});
