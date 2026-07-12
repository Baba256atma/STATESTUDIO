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
  WorkflowIntelligenceContracts,
  WorkflowIntelligenceIdentity,
  WorkflowIntelligencePlatformId,
  WorkflowIntelligencePlatformName,
  WorkflowIntelligencePlatformNamespace,
  WorkflowIntelligencePlatformVersion,
  WorkflowIntelligenceRegistry,
  buildWorkflowIntelligenceManifest,
  validateWorkflowIntelligenceFoundation,
} from "./workflowIntelligenceIndex.ts";

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveWorkflowIntelligenceFoundation), true);
  assert.equal(Object.isFrozen(WorkflowIntelligenceIdentity), true);
  assert.equal(Object.isFrozen(WorkflowIntelligenceRegistry), true);
  assert.equal(Object.isFrozen(WorkflowIntelligenceContracts), true);
});

test("registry integrity", () => {
  assert.equal(WorkflowIntelligenceRegistry.platformId, "OPS-3:1");
  assert.equal(WorkflowIntelligenceRegistry.registeredPhases.length, 1);
  assert.equal(
    WorkflowIntelligenceRegistry.registeredPhases[0]?.phaseName,
    "Workflow Intelligence Foundation",
  );
});

test("manifest generation", () => {
  const manifest = buildWorkflowIntelligenceManifest();
  assert.equal(manifest.identity.platformId, "OPS-3:1");
  assert.equal(manifest.registry.version, "1.0.0");
  assert.equal(manifest.contracts.all.length, 7);
  assert.equal(manifest.publicApis.length, 3);
  assert.equal(manifest.dependencies.length, 2);
});

test("validation PASS", () => {
  const result = validateWorkflowIntelligenceFoundation();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 7);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildWorkflowIntelligenceManifest(),
    buildWorkflowIntelligenceManifest(),
  );
  assert.deepEqual(
    validateWorkflowIntelligenceFoundation(),
    validateWorkflowIntelligenceFoundation(),
  );
});

test("public API stability", () => {
  assert.equal(WorkflowIntelligencePlatformId, "OPS-3:1");
  assert.equal(
    WorkflowIntelligencePlatformName,
    "Nexora Executive Operations Workflow Intelligence Foundation",
  );
  assert.equal(
    WorkflowIntelligencePlatformNamespace,
    "nexora.ops.workflow-intelligence.foundation",
  );
  assert.equal(WorkflowIntelligencePlatformVersion, "1.0.0");
  assert.equal(ExecutiveWorkflowIntelligenceFoundation.metadataOnly, true);
  assert.equal(ExecutiveWorkflowIntelligenceFoundation.immutable, true);
});

test("compatibility with OPS-1 and OPS-2 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.deepEqual(
    ExecutiveWorkflowIntelligenceFoundation.identity.dependencySources,
    ["OPS-1:9", "OPS-2:9"],
  );
  assert.equal(
    ExecutiveWorkflowIntelligenceFoundation.registry.taskIntelligenceDependency.dependencyPhase,
    "OPS-2:9",
  );
});
