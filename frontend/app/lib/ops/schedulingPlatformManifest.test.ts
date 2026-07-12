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
  ExecutiveResourceIntelligencePublicIndexId,
} from "./executiveResourceIntelligencePublicIndex.ts";
import {
  buildSchedulingPlatformManifest,
  validateSchedulingPlatformManifest,
} from "./schedulingPlatformManifestIndex.ts";

test("manifest generation", () => {
  const manifest = buildSchedulingPlatformManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformIdentity.platformId, "OPS-6:1");
  assert.equal(manifest.phaseRegistry.length, 4);
});

test("manifest validation PASS", () => {
  const validation = validateSchedulingPlatformManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("deterministic output", () => {
  assert.deepEqual(buildSchedulingPlatformManifest(), buildSchedulingPlatformManifest());
  assert.deepEqual(
    validateSchedulingPlatformManifest(),
    validateSchedulingPlatformManifest(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildSchedulingPlatformManifest()), true);
  assert.equal(
    Object.isFrozen(buildSchedulingPlatformManifest().phaseRegistry),
    true,
  );
});

test("public API stability", () => {
  const manifest = buildSchedulingPlatformManifest();
  assert.equal(manifest.publicApiSurface.length >= 13, true);
  assert.equal(manifest.compatibilityVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("compatibility with OPS-1 through OPS-6:4", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(
    buildSchedulingPlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-2:9",
    ),
    true,
  );
  assert.equal(
    buildSchedulingPlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-3:9",
    ),
    true,
  );
  assert.equal(
    buildSchedulingPlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-4:9",
    ),
    true,
  );
  assert.equal(
    buildSchedulingPlatformManifest().foundation.identity.dependencySources.includes(
      "OPS-5:9",
    ),
    true,
  );
});
