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
  ExecutiveResourceIntelligencePublicIndexId,
} from "./executiveResourceIntelligencePublicIndex.ts";
import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import {
  SchedulingCapabilityRegistry,
  SchedulingConsumerRegistry,
  SchedulingDependencyRegistry,
  SchedulingPlatformMetadata,
  SchedulingPublicApiRegistry,
  SchedulingSupportedDomains,
  buildSchedulingMetadataManifest,
  validateSchedulingMetadata,
} from "./schedulingMetadataIndex.ts";

test("immutable metadata", () => {
  assert.equal(Object.isFrozen(SchedulingPlatformMetadata), true);
  assert.equal(Object.isFrozen(SchedulingSupportedDomains), true);
  assert.equal(SchedulingPlatformMetadata.platformId, "OPS-6:1");
});

test("registry integrity", () => {
  assert.equal(SchedulingCapabilityRegistry.length, 9);
  assert.equal(SchedulingConsumerRegistry.length, 9);
  assert.equal(SchedulingDependencyRegistry.length, 6);
  assert.equal(SchedulingPublicApiRegistry.length, 9);
});

test("manifest generation", () => {
  const manifest = buildSchedulingMetadataManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.metadata.supportedSchedulingDomains.length, 9);
  assert.equal(manifest.publicApiRegistry.length, 9);
});

test("deterministic validation", () => {
  assert.deepEqual(validateSchedulingMetadata(), validateSchedulingMetadata());
  assert.equal(validateSchedulingMetadata().summary.status, "PASS");
});

test("public API stability", () => {
  assert.equal(SchedulingPublicApiRegistry.length >= 9, true);
  assert.equal(
    buildSchedulingMetadataManifest().publicApiRegistryMetadata.exportedApiCount,
    9,
  );
});

test("compatibility with OPS-1 through OPS-6:1", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.identity.platformId, "OPS-6:1");
  assert.deepEqual(
    ExecutiveSchedulingIntelligenceFoundation.identity.dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9", "OPS-4:9", "OPS-5:9"],
  );
});
