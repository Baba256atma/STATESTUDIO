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
import {
  ExecutiveSchedulingIntelligenceFoundation,
  SchedulingIntelligenceContracts,
  SchedulingIntelligenceIdentity,
  SchedulingIntelligencePlatformId,
  SchedulingIntelligencePlatformName,
  SchedulingIntelligencePlatformNamespace,
  SchedulingIntelligencePlatformVersion,
  SchedulingIntelligenceRegistry,
  buildSchedulingIntelligenceManifest,
  validateSchedulingIntelligenceFoundation,
} from "./schedulingIntelligenceIndex.ts";

test("platform identity", () => {
  assert.equal(SchedulingIntelligencePlatformId, "OPS-6:1");
  assert.equal(
    SchedulingIntelligencePlatformName,
    "Nexora Executive Operations Scheduling Intelligence Foundation",
  );
  assert.equal(
    SchedulingIntelligencePlatformNamespace,
    "nexora.ops.scheduling-intelligence.foundation",
  );
  assert.equal(SchedulingIntelligencePlatformVersion, "1.0.0");
  assert.equal(SchedulingIntelligenceIdentity.platformStatus, "Draft");
});

test("registry exists", () => {
  assert.equal(Object.isFrozen(SchedulingIntelligenceRegistry), true);
  assert.equal(SchedulingIntelligenceRegistry.supportedSchedulingDomains.length, 8);
  assert.equal(SchedulingIntelligenceRegistry.registeredPhases.length, 1);
});

test("contracts exist", () => {
  assert.equal(Object.isFrozen(SchedulingIntelligenceContracts), true);
  assert.equal(SchedulingIntelligenceContracts.all.length, 8);
  assert.equal(SchedulingIntelligenceContracts.executive.name, "Executive Schedule");
});

test("manifest builds", () => {
  const manifest = buildSchedulingIntelligenceManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.identity.platformId, "OPS-6:1");
  assert.equal(manifest.dependencies.length, 5);
  assert.equal(manifest.publicSurface.length, 3);
});

test("validation PASS", () => {
  const result = validateSchedulingIntelligenceFoundation();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 10);
});

test("foundation frozen", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingIntelligenceFoundation), true);
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.metadataOnly, true);
});

test("public exports", () => {
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.identity.platformId, "OPS-6:1");
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.registry.version, "1.0.0");
});

test("dependency metadata", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.deepEqual(
    ExecutiveSchedulingIntelligenceFoundation.identity.dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9", "OPS-4:9", "OPS-5:9"],
  );
});
