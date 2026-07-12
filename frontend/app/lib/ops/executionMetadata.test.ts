import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutionCapabilityRegistry,
  ExecutionConsumerRegistry,
  ExecutionDependencyRegistry,
  ExecutionPlatformMetadata,
  ExecutionPublicApiRegistry,
  ExecutionSupportedExecutionDomains,
  buildExecutionMetadataManifest,
  validateExecutionMetadata,
} from "./executionMetadataIndex.ts";

test("immutable metadata", () => {
  assert.equal(Object.isFrozen(ExecutionPlatformMetadata), true);
  assert.equal(Object.isFrozen(ExecutionSupportedExecutionDomains), true);
  assert.equal(Object.isFrozen(ExecutionCapabilityRegistry), true);
  assert.equal(Object.isFrozen(ExecutionDependencyRegistry), true);
  assert.equal(Object.isFrozen(ExecutionConsumerRegistry), true);
  assert.equal(Object.isFrozen(ExecutionPublicApiRegistry), true);
});

test("registry integrity", () => {
  assert.equal(ExecutionCapabilityRegistry.length, 8);
  assert.equal(ExecutionCapabilityRegistry[0]?.name, "Task Intelligence");
  assert.equal(ExecutionConsumerRegistry.length, 5);
  assert.equal(ExecutionDependencyRegistry.length, 8);
});

test("manifest generation", () => {
  const manifest = buildExecutionMetadataManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.metadata.platformId, "OPS-1:1");
  assert.equal(manifest.capabilityRegistry.length, 8);
  assert.equal(manifest.consumerRegistry.length, 5);
});

test("deterministic validation", () => {
  assert.deepEqual(validateExecutionMetadata(), validateExecutionMetadata());
  assert.equal(validateExecutionMetadata().summary.status, "PASS");
  assert.equal(validateExecutionMetadata().summary.failed, 0);
});

test("public API stability", () => {
  assert.equal(ExecutionPublicApiRegistry.length, 9);
  assert.equal(ExecutionPublicApiRegistry[0]?.stability, "Stable");
  assert.equal(ExecutionPlatformMetadata.publicReleaseStatus, "Draft");
});

test("compatibility metadata consistency", () => {
  assert.equal(ExecutionPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(ExecutionPlatformMetadata.certificationState, "Pending");
  assert.equal(ExecutionSupportedExecutionDomains.length, 8);
});
