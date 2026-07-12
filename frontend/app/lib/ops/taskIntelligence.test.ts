import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveTaskIntelligenceFoundation,
  TaskIntelligenceContracts,
  TaskIntelligencePlatformId,
  TaskIntelligenceIdentity,
  TaskIntelligencePlatformName,
  TaskIntelligencePlatformNamespace,
  TaskIntelligencePlatformVersion,
  TaskIntelligenceRegistry,
  buildTaskIntelligenceManifest,
  validateTaskIntelligenceFoundation,
} from "./taskIntelligenceIndex.ts";

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveTaskIntelligenceFoundation), true);
  assert.equal(Object.isFrozen(TaskIntelligenceIdentity), true);
  assert.equal(Object.isFrozen(TaskIntelligenceRegistry), true);
  assert.equal(Object.isFrozen(TaskIntelligenceContracts), true);
});

test("registry integrity", () => {
  assert.equal(TaskIntelligenceRegistry.platformId, "OPS-2:1");
  assert.equal(TaskIntelligenceRegistry.registeredPhases.length, 1);
  assert.equal(
    TaskIntelligenceRegistry.registeredPhases[0]?.phaseName,
    "Task Intelligence Foundation",
  );
});

test("manifest generation", () => {
  const manifest = buildTaskIntelligenceManifest();
  assert.equal(manifest.identity.platformId, "OPS-2:1");
  assert.equal(manifest.registry.version, "1.0.0");
  assert.equal(manifest.contracts.all.length, 7);
  assert.equal(manifest.publicApis.length, 3);
});

test("validation PASS", () => {
  const result = validateTaskIntelligenceFoundation();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 6);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildTaskIntelligenceManifest(), buildTaskIntelligenceManifest());
  assert.deepEqual(
    validateTaskIntelligenceFoundation(),
    validateTaskIntelligenceFoundation(),
  );
});

test("public API stability", () => {
  assert.equal(TaskIntelligencePlatformId, "OPS-2:1");
  assert.equal(
    TaskIntelligencePlatformName,
    "Nexora Executive Operations Task Intelligence Foundation",
  );
  assert.equal(
    TaskIntelligencePlatformNamespace,
    "nexora.ops.task-intelligence.foundation",
  );
  assert.equal(TaskIntelligencePlatformVersion, "1.0.0");
  assert.equal(ExecutiveTaskIntelligenceFoundation.metadataOnly, true);
  assert.equal(ExecutiveTaskIntelligenceFoundation.immutable, true);
});
