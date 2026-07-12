import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutionCapabilityRegistry,
  ExecutionPlatformMetadata,
} from "./executionMetadataIndex.ts";
import {
  ExecutionAutomationModel,
  ExecutionMonitoringModel,
  ExecutionProjectModel,
  ExecutionResourceModel,
  ExecutionScheduleModel,
  ExecutionTaskModel,
  ExecutionWorkflowModel,
  buildExecutionModelManifest,
  validateExecutionModel,
} from "./executionModelIndex.ts";

const executionModels = [
  ExecutionTaskModel,
  ExecutionWorkflowModel,
  ExecutionProjectModel,
  ExecutionResourceModel,
  ExecutionScheduleModel,
  ExecutionMonitoringModel,
  ExecutionAutomationModel,
] as const;

test("immutable models", () => {
  assert.equal(executionModels.every((model) => Object.isFrozen(model)), true);
});

test("manifest generation", () => {
  const manifest = buildExecutionModelManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.models.all.length, 7);
  assert.equal(manifest.compatibility.registryCapabilityCount, 8);
});

test("validation", () => {
  const validation = validateExecutionModel();

  assert.equal(validation.summary.status, "PASS");
  assert.equal(validation.summary.failed, 0);
  assert.equal(validation.checks.length, 6);
});

test("compatibility with OPS-1:2", () => {
  assert.equal(
    executionModels.every((model) =>
      ExecutionCapabilityRegistry.some(
        (capability) => capability.id === model.metadata.registryCapabilityId,
      ),
    ),
    true,
  );
  assert.equal(ExecutionPlatformMetadata.compatibilityVersion, "1.0.0");
});

test("deterministic behavior", () => {
  assert.deepEqual(buildExecutionModelManifest(), buildExecutionModelManifest());
  assert.deepEqual(validateExecutionModel(), validateExecutionModel());
});

test("public API stability", () => {
  assert.equal(ExecutionTaskModel.metadata.platformId, "OPS-1:1");
  assert.equal(ExecutionWorkflowModel.metadata.compatibilityVersion, "1.0.0");
  assert.equal(ExecutionAutomationModel.metadata.metadataOnly, true);
});
