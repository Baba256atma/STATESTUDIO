import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligenceFoundation } from "./resourceIntelligenceIndex.ts";
import { ResourcePlatformMetadata } from "./resourceMetadataIndex.ts";
import {
  ResourceAvailabilityModel,
  ResourceCapabilityModel,
  ResourceCapacityModel,
  ResourceCostModel,
  ResourceDependencyModel,
  ResourceIdentityModel,
  ResourceLinkageModel,
  ResourceLocationModel,
  buildResourceModelManifest,
  ResourceOwnershipModel,
  validateResourceModel,
} from "./resourceModelIndex.ts";

test("model integrity", () => {
  assert.equal(ResourceIdentityModel.resourceClassification.length, 8);
  assert.equal(ResourceCapacityModel.length, 3);
  assert.equal(ResourceAvailabilityModel.length, 2);
  assert.equal(ResourceOwnershipModel.length, 2);
  assert.equal(ResourceCostModel.length, 2);
  assert.equal(ResourceCapabilityModel.length, 3);
  assert.equal(ResourceLocationModel.length, 2);
  assert.equal(ResourceDependencyModel.length, 2);
  assert.equal(ResourceLinkageModel.executionReadinessSupport.length, 2);
});

test("manifest generation", () => {
  const manifest = buildResourceModelManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.compatibility.compatibilityVersion, "1.0.0");
  assert.equal(manifest.models.capacity.length, 3);
});

test("validation PASS", () => {
  const result = validateResourceModel();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 16);
});

test("immutability", () => {
  assert.equal(Object.isFrozen(ResourceIdentityModel), true);
  assert.equal(Object.isFrozen(ResourceCapacityModel), true);
  assert.equal(Object.isFrozen(ResourceAvailabilityModel), true);
  assert.equal(Object.isFrozen(ResourceOwnershipModel), true);
  assert.equal(Object.isFrozen(ResourceCostModel), true);
  assert.equal(Object.isFrozen(ResourceCapabilityModel), true);
  assert.equal(Object.isFrozen(ResourceLocationModel), true);
  assert.equal(Object.isFrozen(ResourceDependencyModel), true);
  assert.equal(Object.isFrozen(ResourceLinkageModel), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildResourceModelManifest(), buildResourceModelManifest());
  assert.deepEqual(validateResourceModel(), validateResourceModel());
});

test("public API stability", () => {
  assert.equal(ResourceIdentityModel.metadata.platformId, "OPS-5:1");
  assert.equal(ResourceIdentityModel.metadata.compatibilityVersion, "1.0.0");
  assert.equal(ResourceIdentityModel.metadata.metadataOnly, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, OPS-5:1, and OPS-5:2", () => {
  assert.equal(ExecutiveResourceIntelligenceFoundation.identity.platformId, "OPS-5:1");
  assert.equal(ResourcePlatformMetadata.platformId, "OPS-5:1");
  assert.equal(ResourcePlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(
    ResourceLinkageModel.metadata.sourceDependencies.includes(
      ExecutiveTaskIntelligencePublicIndexId,
    ),
    true,
  );
  assert.equal(
    ResourceLinkageModel.metadata.sourceDependencies.includes(
      ExecutiveWorkflowIntelligencePublicIndexId,
    ),
    true,
  );
  assert.equal(
    ResourceLinkageModel.metadata.sourceDependencies.includes(
      ExecutiveProjectExecutionPublicIndexId,
    ),
    true,
  );
});
