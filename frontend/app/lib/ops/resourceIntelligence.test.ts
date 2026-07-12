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
  ResourceIntelligenceContracts,
  ResourceIntelligenceIdentity,
  ResourceIntelligencePlatformId,
  ResourceIntelligencePlatformName,
  ResourceIntelligencePlatformNamespace,
  ResourceIntelligencePlatformVersion,
  ResourceIntelligenceRegistry,
  buildResourceIntelligenceManifest,
  validateResourceIntelligenceFoundation,
} from "./resourceIntelligenceIndex.ts";

test("platform identity", () => {
  assert.equal(ResourceIntelligencePlatformId, "OPS-5:1");
  assert.equal(
    ResourceIntelligencePlatformName,
    "Nexora Executive Operations Resource Intelligence Foundation",
  );
  assert.equal(
    ResourceIntelligencePlatformNamespace,
    "nexora.ops.resource-intelligence.foundation",
  );
  assert.equal(ResourceIntelligencePlatformVersion, "1.0.0");
  assert.equal(ResourceIntelligenceIdentity.platformStatus, "Draft");
});

test("registry exists", () => {
  assert.equal(Object.isFrozen(ResourceIntelligenceRegistry), true);
  assert.equal(ResourceIntelligenceRegistry.supportedResourceCategories.length, 21);
  assert.equal(ResourceIntelligenceRegistry.registeredPhases.length, 1);
});

test("contracts exist", () => {
  assert.equal(Object.isFrozen(ResourceIntelligenceContracts), true);
  assert.equal(ResourceIntelligenceContracts.all.length, 12);
  assert.equal(ResourceIntelligenceContracts.human.name, "Human Resource");
});

test("manifest builds", () => {
  const manifest = buildResourceIntelligenceManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.identity.platformId, "OPS-5:1");
  assert.equal(manifest.dependencies.length, 4);
  assert.equal(manifest.publicSurface.length, 3);
});

test("validation PASS", () => {
  const result = validateResourceIntelligenceFoundation();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 9);
});

test("foundation frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveResourceIntelligenceFoundation), true);
  assert.equal(ExecutiveResourceIntelligenceFoundation.metadataOnly, true);
});

test("public exports", () => {
  assert.equal(ExecutiveResourceIntelligenceFoundation.identity.platformId, "OPS-5:1");
  assert.equal(ExecutiveResourceIntelligenceFoundation.registry.version, "1.0.0");
});

test("dependency metadata", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.deepEqual(
    ExecutiveResourceIntelligenceFoundation.identity.dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9", "OPS-4:9"],
  );
});

