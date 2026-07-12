import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveTaskIntelligenceFoundation } from "./taskIntelligenceIndex.ts";
import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import {
  buildTaskModelManifest,
  TaskDependencyModel,
  TaskEffortModel,
  TaskExecutionReadinessModel,
  TaskIdentityModel,
  TaskLifecycleModel,
  TaskOwnershipModel,
  TaskPriorityModel,
  TaskRiskModel,
  validateTaskModel,
} from "./taskModelIndex.ts";

test("model integrity", () => {
  assert.equal(TaskIdentityModel.taskClassification.length, 7);
  assert.equal(TaskLifecycleModel.length, 8);
  assert.equal(TaskPriorityModel.length, 4);
  assert.equal(TaskExecutionReadinessModel.length, 2);
});

test("manifest generation", () => {
  const manifest = buildTaskModelManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.compatibility.compatibilityVersion, "1.0.0");
  assert.equal(manifest.models.lifecycle.length, 8);
});

test("validation PASS", () => {
  const result = validateTaskModel();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 10);
});

test("immutability", () => {
  assert.equal(Object.isFrozen(TaskIdentityModel), true);
  assert.equal(Object.isFrozen(TaskLifecycleModel), true);
  assert.equal(Object.isFrozen(TaskPriorityModel), true);
  assert.equal(Object.isFrozen(TaskOwnershipModel), true);
  assert.equal(Object.isFrozen(TaskDependencyModel), true);
  assert.equal(Object.isFrozen(TaskEffortModel), true);
  assert.equal(Object.isFrozen(TaskRiskModel), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildTaskModelManifest(), buildTaskModelManifest());
  assert.deepEqual(validateTaskModel(), validateTaskModel());
});

test("public API stability", () => {
  assert.equal(TaskIdentityModel.metadata.platformId, "OPS-2:1");
  assert.equal(TaskIdentityModel.metadata.compatibilityVersion, "1.0.0");
  assert.equal(TaskIdentityModel.metadata.metadataOnly, true);
});

test("compatibility with OPS-2:1 and OPS-2:2", () => {
  assert.equal(ExecutiveTaskIntelligenceFoundation.identity.platformId, "OPS-2:1");
  assert.equal(TaskPlatformMetadata.platformId, "OPS-2:1");
  assert.equal(TaskPlatformMetadata.compatibilityVersion, "1.0.0");
});
