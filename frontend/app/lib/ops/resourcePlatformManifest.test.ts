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
  ExecutiveProjectExecutionPublicIndexId,
} from "./executiveProjectExecutionPublicIndex.ts";
import {
  buildResourcePlatformManifest,
  validateResourcePlatformManifest,
} from "./resourcePlatformManifestIndex.ts";

test("manifest generation", () => {
  const manifest = buildResourcePlatformManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformIdentity.platformId, "OPS-5:1");
  assert.equal(manifest.phaseRegistry.length, 4);
});

test("manifest validation PASS", () => {
  const validation = validateResourcePlatformManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("deterministic output", () => {
  assert.deepEqual(buildResourcePlatformManifest(), buildResourcePlatformManifest());
  assert.deepEqual(
    validateResourcePlatformManifest(),
    validateResourcePlatformManifest(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildResourcePlatformManifest()), true);
  assert.equal(
    Object.isFrozen(buildResourcePlatformManifest().phaseRegistry),
    true,
  );
});

test("public API stability", () => {
  const manifest = buildResourcePlatformManifest();
  assert.equal(manifest.publicApiSurface.length >= 13, true);
  assert.equal(manifest.compatibilityVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5:1 through OPS-5:4", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(
    buildResourcePlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-2:9",
    ),
    true,
  );
  assert.equal(
    buildResourcePlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-3:9",
    ),
    true,
  );
  assert.equal(
    buildResourcePlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-4:9",
    ),
    true,
  );
});
