import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligenceFoundation,
} from "./workflowIntelligenceIndex.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import {
  buildWorkflowModelManifest,
  WorkflowApprovalModel,
  WorkflowDependencyModel,
  WorkflowIdentityModel,
  WorkflowReadinessModel,
  WorkflowStageModel,
  WorkflowTaskLinkModel,
  WorkflowTransitionModel,
  WorkflowTriggerModel,
  validateWorkflowModel,
} from "./workflowModelIndex.ts";

test("model integrity", () => {
  assert.equal(WorkflowIdentityModel.workflowClassification.length, 7);
  assert.equal(WorkflowStageModel.length, 5);
  assert.equal(WorkflowTransitionModel.length, 4);
  assert.equal(WorkflowReadinessModel.length, 2);
  assert.equal(WorkflowTaskLinkModel.length, 2);
});

test("manifest generation", () => {
  const manifest = buildWorkflowModelManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.compatibility.compatibilityVersion, "1.0.0");
  assert.equal(manifest.models.stage.length, 5);
});

test("validation PASS", () => {
  const result = validateWorkflowModel();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 13);
});

test("immutability", () => {
  assert.equal(Object.isFrozen(WorkflowIdentityModel), true);
  assert.equal(Object.isFrozen(WorkflowStageModel), true);
  assert.equal(Object.isFrozen(WorkflowTransitionModel), true);
  assert.equal(Object.isFrozen(WorkflowDependencyModel), true);
  assert.equal(Object.isFrozen(WorkflowTriggerModel), true);
  assert.equal(Object.isFrozen(WorkflowApprovalModel), true);
  assert.equal(Object.isFrozen(WorkflowReadinessModel), true);
  assert.equal(Object.isFrozen(WorkflowTaskLinkModel), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildWorkflowModelManifest(), buildWorkflowModelManifest());
  assert.deepEqual(validateWorkflowModel(), validateWorkflowModel());
});

test("public API stability", () => {
  assert.equal(WorkflowIdentityModel.metadata.platformId, "OPS-3:1");
  assert.equal(WorkflowIdentityModel.metadata.compatibilityVersion, "1.0.0");
  assert.equal(WorkflowIdentityModel.metadata.metadataOnly, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3:1, and OPS-3:2", () => {
  assert.equal(ExecutiveWorkflowIntelligenceFoundation.identity.platformId, "OPS-3:1");
  assert.equal(WorkflowPlatformMetadata.platformId, "OPS-3:1");
  assert.equal(WorkflowPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(
    WorkflowIdentityModel.metadata.sourceDependencies.includes(
      ExecutiveTaskIntelligencePublicIndexId,
    ),
    true,
  );
});
