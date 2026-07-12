import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  buildWorkflowPlatformManifest,
  validateWorkflowPlatformManifest,
} from "./workflowPlatformManifestIndex.ts";

test("manifest builds", () => {
  const manifest = buildWorkflowPlatformManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.platformIdentity.platformId, "OPS-3:1");
  assert.equal(manifest.phaseRegistry.length, 4);
});

test("manifest includes OPS-3:1 through OPS-3:4", () => {
  const manifest = buildWorkflowPlatformManifest();
  assert.deepEqual(manifest.consumedPhases, [
    "OPS-3:1",
    "OPS-3:2",
    "OPS-3:3",
    "OPS-3:4",
  ]);
});

test("validation returns PASS", () => {
  const validation = validateWorkflowPlatformManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("task compatibility summary exists", () => {
  const manifest = buildWorkflowPlatformManifest();
  assert.equal(manifest.taskCompatibilitySummary.ops2DependencyRepresented, true);
  assert.equal(manifest.taskCompatibilitySummary.linkedTaskGroupCount, 2);
});

test("manifest is immutable", () => {
  assert.equal(Object.isFrozen(buildWorkflowPlatformManifest()), true);
  assert.equal(
    Object.isFrozen(buildWorkflowPlatformManifest().phaseRegistry),
    true,
  );
});

test("output is deterministic", () => {
  assert.deepEqual(buildWorkflowPlatformManifest(), buildWorkflowPlatformManifest());
  assert.deepEqual(
    validateWorkflowPlatformManifest(),
    validateWorkflowPlatformManifest(),
  );
});

test("public API is stable", () => {
  const manifest = buildWorkflowPlatformManifest();
  assert.equal(manifest.publicApiSurface.length >= 13, true);
  assert.equal(manifest.compatibilityVersion, "1.0.0");
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("compatibility with OPS-1 and OPS-2 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.deepEqual(
    buildWorkflowPlatformManifest().foundation.identity.dependencySources,
    ["OPS-1:9", "OPS-2:9"],
  );
});
