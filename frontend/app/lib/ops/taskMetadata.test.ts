import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveTaskIntelligenceFoundation,
} from "./taskIntelligenceIndex.ts";
import {
  TaskCapabilityRegistry,
  TaskConsumerRegistry,
  TaskDependencyRegistry,
  TaskPlatformMetadata,
  TaskPublicApiRegistry,
  TaskSupportedDomains,
  buildTaskMetadataManifest,
  validateTaskMetadata,
} from "./taskMetadataIndex.ts";

test("immutable metadata", () => {
  assert.equal(Object.isFrozen(TaskPlatformMetadata), true);
  assert.equal(Object.isFrozen(TaskSupportedDomains), true);
  assert.equal(Object.isFrozen(TaskCapabilityRegistry), true);
  assert.equal(Object.isFrozen(TaskDependencyRegistry), true);
  assert.equal(Object.isFrozen(TaskConsumerRegistry), true);
  assert.equal(Object.isFrozen(TaskPublicApiRegistry), true);
});

test("registry integrity", () => {
  assert.equal(TaskCapabilityRegistry.length, 8);
  assert.equal(TaskCapabilityRegistry[0]?.name, "Executive Tasks");
  assert.equal(TaskConsumerRegistry.length, 6);
  assert.equal(TaskDependencyRegistry.length, 5);
});

test("manifest generation", () => {
  const manifest = buildTaskMetadataManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.metadata.platformId, "OPS-2:1");
  assert.equal(manifest.capabilityRegistry.length, 8);
  assert.equal(manifest.consumerRegistry.length, 6);
});

test("deterministic validation", () => {
  assert.deepEqual(validateTaskMetadata(), validateTaskMetadata());
  assert.equal(validateTaskMetadata().summary.status, "PASS");
  assert.equal(validateTaskMetadata().summary.failed, 0);
});

test("public API stability", () => {
  assert.equal(TaskPublicApiRegistry.length, 9);
  assert.equal(TaskPublicApiRegistry[0]?.stability, "Stable");
  assert.equal(TaskPlatformMetadata.releaseStatus, "Draft");
});

test("compatibility with OPS-2:1", () => {
  assert.equal(ExecutiveTaskIntelligenceFoundation.identity.platformId, "OPS-2:1");
  assert.equal(TaskPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(TaskSupportedDomains.length, 8);
});
