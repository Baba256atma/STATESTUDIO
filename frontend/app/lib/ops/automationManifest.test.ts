import assert from "node:assert/strict";
import test from "node:test";

import {
  AutomationPlatformDependencyMap,
  AutomationPlatformPhaseRegistry,
  AutomationPlatformPublicSurface,
  buildAutomationManifest,
  validateAutomationManifest,
} from "./automationManifestIndex.ts";

test("phase registry", () => {
  assert.equal(Object.isFrozen(AutomationPlatformPhaseRegistry), true);
  assert.equal(AutomationPlatformPhaseRegistry.length, 4);
});

test("dependency map", () => {
  assert.equal(Object.isFrozen(AutomationPlatformDependencyMap), true);
  assert.equal(AutomationPlatformDependencyMap.length, 13);
});

test("public API surface", () => {
  assert.equal(Object.isFrozen(AutomationPlatformPublicSurface), true);
  assert.equal(AutomationPlatformPublicSurface.length, 27);
});

test("manifest", () => {
  const manifest = buildAutomationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.descriptor.platformId, "OPS-8:1");
  assert.equal(manifest.consumedPhases.length, 4);
});

test("manifest validation", () => {
  const validation = validateAutomationManifest();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildAutomationManifest()), true);
  assert.equal(Object.isFrozen(validateAutomationManifest()), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(buildAutomationManifest(), buildAutomationManifest());
  assert.deepEqual(validateAutomationManifest(), validateAutomationManifest());
});

test("public API stability", () => {
  assert.equal(buildAutomationManifest().summary.publicApiCount, 27);
  assert.equal(buildAutomationManifest().releaseReadinessMetadata.readinessState, "Ready");
  assert.equal(buildAutomationManifest().metadataOnly, true);
});
