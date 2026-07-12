import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionFoundation,
} from "./projectExecutionIndex.ts";
import { ProjectPlatformMetadata } from "./projectMetadataIndex.ts";
import {
  buildProjectModelManifest,
  ProjectDependencyModel,
  ProjectGovernanceModel,
  ProjectIdentityModel,
  ProjectLifecycleModel,
  ProjectMilestoneModel,
  ProjectPhaseModel,
  ProjectPortfolioModel,
  ProjectReadinessModel,
  ProjectTaskReferenceModel,
  ProjectWorkflowReferenceModel,
  validateProjectModel,
} from "./projectModelIndex.ts";

test("model integrity", () => {
  assert.equal(ProjectIdentityModel.projectClassification.length, 7);
  assert.equal(ProjectLifecycleModel.lifecycleStages.length, 5);
  assert.equal(ProjectPhaseModel.length, 5);
  assert.equal(ProjectMilestoneModel.length, 3);
  assert.equal(ProjectReadinessModel.length, 2);
  assert.equal(ProjectPortfolioModel.length, 2);
});

test("manifest generation", () => {
  const manifest = buildProjectModelManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.compatibility.compatibilityVersion, "1.0.0");
  assert.equal(manifest.models.phase.length, 5);
});

test("validation PASS", () => {
  const result = validateProjectModel();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 16);
});

test("immutability", () => {
  assert.equal(Object.isFrozen(ProjectIdentityModel), true);
  assert.equal(Object.isFrozen(ProjectLifecycleModel), true);
  assert.equal(Object.isFrozen(ProjectPhaseModel), true);
  assert.equal(Object.isFrozen(ProjectMilestoneModel), true);
  assert.equal(Object.isFrozen(ProjectDependencyModel), true);
  assert.equal(Object.isFrozen(ProjectWorkflowReferenceModel), true);
  assert.equal(Object.isFrozen(ProjectTaskReferenceModel), true);
  assert.equal(Object.isFrozen(ProjectGovernanceModel), true);
  assert.equal(Object.isFrozen(ProjectReadinessModel), true);
  assert.equal(Object.isFrozen(ProjectPortfolioModel), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(buildProjectModelManifest(), buildProjectModelManifest());
  assert.deepEqual(validateProjectModel(), validateProjectModel());
});

test("public API stability", () => {
  assert.equal(ProjectIdentityModel.metadata.platformId, "OPS-4:1");
  assert.equal(ProjectIdentityModel.metadata.compatibilityVersion, "1.0.0");
  assert.equal(ProjectIdentityModel.metadata.metadataOnly, true);
});

test("compatibility with OPS-2, OPS-3, OPS-4:1, and OPS-4:2", () => {
  assert.equal(ExecutiveProjectExecutionFoundation.identity.platformId, "OPS-4:1");
  assert.equal(ProjectPlatformMetadata.platformId, "OPS-4:1");
  assert.equal(ProjectPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(
    ProjectTaskReferenceModel.metadata.sourceDependencies.includes(
      ExecutiveTaskIntelligencePublicIndexId,
    ),
    true,
  );
  assert.equal(
    ProjectWorkflowReferenceModel.metadata.sourceDependencies.includes(
      ExecutiveWorkflowIntelligencePublicIndexId,
    ),
    true,
  );
});

