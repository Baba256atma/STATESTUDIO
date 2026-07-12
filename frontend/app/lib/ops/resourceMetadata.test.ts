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
  ExecutiveProjectExecutionPublicIndexId,
} from "./executiveProjectExecutionPublicIndex.ts";
import {
  ExecutiveResourceIntelligenceFoundation,
} from "./resourceIntelligenceIndex.ts";
import {
  ResourceCapabilityRegistry,
  ResourceConsumerRegistry,
  ResourceDependencyRegistry,
  ResourcePlatformMetadata,
  ResourcePublicApiRegistry,
  ResourceSupportedDomains,
  buildResourceMetadataManifest,
  validateResourceMetadata,
} from "./resourceMetadataIndex.ts";

test("immutable metadata", () => {
  assert.equal(Object.isFrozen(ResourcePlatformMetadata), true);
  assert.equal(Object.isFrozen(ResourceSupportedDomains), true);
  assert.equal(Object.isFrozen(ResourceCapabilityRegistry), true);
  assert.equal(Object.isFrozen(ResourceDependencyRegistry), true);
  assert.equal(Object.isFrozen(ResourceConsumerRegistry), true);
  assert.equal(Object.isFrozen(ResourcePublicApiRegistry), true);
});

test("registry integrity", () => {
  assert.equal(ResourceCapabilityRegistry.length, 16);
  assert.equal(ResourceCapabilityRegistry[0]?.name, "Human Resources");
  assert.equal(ResourceConsumerRegistry.length, 6);
  assert.equal(ResourceDependencyRegistry.length, 6);
});

test("manifest generation", () => {
  const manifest = buildResourceMetadataManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.metadata.platformId, "OPS-5:1");
  assert.equal(manifest.capabilityRegistry.length, 16);
  assert.equal(manifest.consumerRegistry.length, 6);
});

test("deterministic validation", () => {
  assert.deepEqual(validateResourceMetadata(), validateResourceMetadata());
  assert.equal(validateResourceMetadata().summary.status, "PASS");
  assert.equal(validateResourceMetadata().summary.failed, 0);
});

test("public API stability", () => {
  assert.equal(ResourcePublicApiRegistry.length, 9);
  assert.equal(ResourcePublicApiRegistry[0]?.stability, "Stable");
  assert.equal(ResourcePlatformMetadata.releaseStatus, "Draft");
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, and OPS-5:1", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligenceFoundation.identity.platformId, "OPS-5:1");
  assert.equal(ResourcePlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(ResourceSupportedDomains.length, 16);
});

