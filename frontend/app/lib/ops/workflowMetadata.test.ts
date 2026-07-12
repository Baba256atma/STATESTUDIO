import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligenceFoundation,
} from "./workflowIntelligenceIndex.ts";
import {
  WorkflowCapabilityRegistry,
  WorkflowConsumerRegistry,
  WorkflowDependencyRegistry,
  WorkflowPlatformMetadata,
  WorkflowPublicApiRegistry,
  WorkflowSupportedDomains,
  buildWorkflowMetadataManifest,
  validateWorkflowMetadata,
} from "./workflowMetadataIndex.ts";

test("immutable metadata", () => {
  assert.equal(Object.isFrozen(WorkflowPlatformMetadata), true);
  assert.equal(Object.isFrozen(WorkflowSupportedDomains), true);
  assert.equal(Object.isFrozen(WorkflowCapabilityRegistry), true);
  assert.equal(Object.isFrozen(WorkflowDependencyRegistry), true);
  assert.equal(Object.isFrozen(WorkflowConsumerRegistry), true);
  assert.equal(Object.isFrozen(WorkflowPublicApiRegistry), true);
});

test("registry integrity", () => {
  assert.equal(WorkflowCapabilityRegistry.length, 8);
  assert.equal(WorkflowCapabilityRegistry[0]?.name, "Executive Workflows");
  assert.equal(WorkflowConsumerRegistry.length, 8);
  assert.equal(WorkflowDependencyRegistry.length, 5);
});

test("manifest generation", () => {
  const manifest = buildWorkflowMetadataManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.metadata.platformId, "OPS-3:1");
  assert.equal(manifest.capabilityRegistry.length, 8);
  assert.equal(manifest.consumerRegistry.length, 8);
});

test("deterministic validation", () => {
  assert.deepEqual(validateWorkflowMetadata(), validateWorkflowMetadata());
  assert.equal(validateWorkflowMetadata().summary.status, "PASS");
  assert.equal(validateWorkflowMetadata().summary.failed, 0);
});

test("public API stability", () => {
  assert.equal(WorkflowPublicApiRegistry.length, 9);
  assert.equal(WorkflowPublicApiRegistry[0]?.stability, "Stable");
  assert.equal(WorkflowPlatformMetadata.releaseStatus, "Draft");
});

test("compatibility with OPS-1, OPS-2, and OPS-3:1", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligenceFoundation.identity.platformId, "OPS-3:1");
  assert.deepEqual(WorkflowPlatformMetadata.dependencySources, ["OPS-1:9", "OPS-2:9"]);
  assert.equal(WorkflowPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(WorkflowSupportedDomains.length, 8);
});
