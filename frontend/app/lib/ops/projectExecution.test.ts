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
  ProjectExecutionContracts,
  ProjectExecutionIdentity,
  ProjectExecutionPlatformId,
  ProjectExecutionPlatformName,
  ProjectExecutionPlatformNamespace,
  ProjectExecutionPlatformVersion,
  ProjectExecutionRegistry,
  buildProjectExecutionManifest,
  validateProjectExecutionFoundation,
} from "./projectExecutionIndex.ts";

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveProjectExecutionFoundation), true);
  assert.equal(Object.isFrozen(ProjectExecutionIdentity), true);
  assert.equal(Object.isFrozen(ProjectExecutionRegistry), true);
  assert.equal(Object.isFrozen(ProjectExecutionContracts), true);
});

test("registry integrity", () => {
  assert.equal(ProjectExecutionRegistry.platformId, "OPS-4:1");
  assert.equal(ProjectExecutionRegistry.registeredPhases.length, 1);
  assert.equal(
    ProjectExecutionRegistry.registeredPhases[0]?.phaseName,
    "Project Execution Foundation",
  );
});

test("manifest generation", () => {
  const manifest = buildProjectExecutionManifest();
  assert.equal(manifest.identity.platformId, "OPS-4:1");
  assert.equal(manifest.registry.version, "1.0.0");
  assert.equal(manifest.contracts.all.length, 7);
  assert.equal(manifest.publicApis.length, 3);
  assert.equal(manifest.dependencies.length, 3);
});

test("validation PASS", () => {
  const result = validateProjectExecutionFoundation();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 8);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildProjectExecutionManifest(), buildProjectExecutionManifest());
  assert.deepEqual(
    validateProjectExecutionFoundation(),
    validateProjectExecutionFoundation(),
  );
});

test("public API stability", () => {
  assert.equal(ProjectExecutionPlatformId, "OPS-4:1");
  assert.equal(
    ProjectExecutionPlatformName,
    "Nexora Executive Operations Project Execution Foundation",
  );
  assert.equal(
    ProjectExecutionPlatformNamespace,
    "nexora.ops.project-execution.foundation",
  );
  assert.equal(ProjectExecutionPlatformVersion, "1.0.0");
  assert.equal(ExecutiveProjectExecutionFoundation.metadataOnly, true);
  assert.equal(ExecutiveProjectExecutionFoundation.immutable, true);
});

test("compatibility with OPS-1, OPS-2, and OPS-3 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.deepEqual(
    ExecutiveProjectExecutionFoundation.identity.dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9"],
  );
  assert.equal(
    ExecutiveProjectExecutionFoundation.registry.taskIntelligenceDependency.dependencyPhase,
    "OPS-2:9",
  );
  assert.equal(
    ExecutiveProjectExecutionFoundation.registry.workflowIntelligenceDependency.dependencyPhase,
    "OPS-3:9",
  );
});
