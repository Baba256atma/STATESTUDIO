import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  buildProjectPlatformManifest,
  validateProjectPlatformManifest,
} from "./projectPlatformManifestIndex.ts";

test("manifest generation", () => {
  const manifest = buildProjectPlatformManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformIdentity.platformId, "OPS-4:1");
  assert.equal(manifest.phaseRegistry.length, 4);
});

test("manifest validation PASS", () => {
  const validation = validateProjectPlatformManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("deterministic output", () => {
  assert.deepEqual(buildProjectPlatformManifest(), buildProjectPlatformManifest());
  assert.deepEqual(
    validateProjectPlatformManifest(),
    validateProjectPlatformManifest(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildProjectPlatformManifest()), true);
  assert.equal(
    Object.isFrozen(buildProjectPlatformManifest().phaseRegistry),
    true,
  );
});

test("public API stability", () => {
  const manifest = buildProjectPlatformManifest();
  assert.equal(manifest.publicApiSurface.length >= 13, true);
  assert.equal(manifest.compatibilityVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("compatibility with OPS-1, OPS-2, OPS-3, and OPS-4:1 through OPS-4:4", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(
    buildProjectPlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-2:9",
    ),
    true,
  );
  assert.equal(
    buildProjectPlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-3:9",
    ),
    true,
  );
});

