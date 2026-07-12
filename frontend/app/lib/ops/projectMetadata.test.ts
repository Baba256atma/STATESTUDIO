import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionFoundation,
} from "./projectExecutionIndex.ts";
import {
  ProjectCapabilityRegistry,
  ProjectConsumerRegistry,
  ProjectDependencyRegistry,
  ProjectPlatformMetadata,
  ProjectPublicApiRegistry,
  ProjectSupportedDomains,
  buildProjectMetadataManifest,
  validateProjectMetadata,
} from "./projectMetadataIndex.ts";

test("immutable metadata", () => {
  assert.equal(Object.isFrozen(ProjectPlatformMetadata), true);
  assert.equal(Object.isFrozen(ProjectSupportedDomains), true);
  assert.equal(Object.isFrozen(ProjectCapabilityRegistry), true);
  assert.equal(Object.isFrozen(ProjectDependencyRegistry), true);
  assert.equal(Object.isFrozen(ProjectConsumerRegistry), true);
  assert.equal(Object.isFrozen(ProjectPublicApiRegistry), true);
});

test("registry integrity", () => {
  assert.equal(ProjectCapabilityRegistry.length, 8);
  assert.equal(ProjectCapabilityRegistry[0]?.name, "Executive Projects");
  assert.equal(ProjectConsumerRegistry.length, 6);
  assert.equal(ProjectDependencyRegistry.length, 6);
});

test("manifest generation", () => {
  const manifest = buildProjectMetadataManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.metadata.platformId, "OPS-4:1");
  assert.equal(manifest.capabilityRegistry.length, 8);
  assert.equal(manifest.consumerRegistry.length, 6);
});

test("deterministic validation", () => {
  assert.deepEqual(validateProjectMetadata(), validateProjectMetadata());
  assert.equal(validateProjectMetadata().summary.status, "PASS");
  assert.equal(validateProjectMetadata().summary.failed, 0);
});

test("public API stability", () => {
  assert.equal(ProjectPublicApiRegistry.length, 9);
  assert.equal(ProjectPublicApiRegistry[0]?.stability, "Stable");
  assert.equal(ProjectPlatformMetadata.releaseStatus, "Draft");
});

test("compatibility with OPS-1, OPS-2, OPS-3, and OPS-4:1", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionFoundation.identity.platformId, "OPS-4:1");
  assert.equal(ProjectPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(ProjectSupportedDomains.length, 8);
});

