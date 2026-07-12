import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import { SchedulingPlatformMetadata } from "./schedulingMetadataIndex.ts";
import {
  ScheduleCalendarModel,
  ScheduleConstraintModel,
  ScheduleDependencyModel,
  ScheduleExecutionWindowModel,
  ScheduleIdentityModel,
  ScheduleMilestoneModel,
  ScheduleProjectLinkModel,
  ScheduleResourceLinkModel,
  ScheduleSequenceModel,
  ScheduleTaskLinkModel,
  ScheduleTimelineModel,
  ScheduleWorkflowLinkModel,
  buildSchedulingModelManifest,
  validateSchedulingModel,
} from "./schedulingModelIndex.ts";

test("model exported", () => {
  assert.equal(ScheduleIdentityModel.scheduleClassification.length, 8);
  assert.equal(ScheduleTimelineModel.length, 2);
  assert.equal(ScheduleCalendarModel.length, 2);
  assert.equal(ScheduleExecutionWindowModel.length, 2);
  assert.equal(ScheduleMilestoneModel.length, 2);
  assert.equal(ScheduleDependencyModel.length, 2);
  assert.equal(ScheduleSequenceModel.length, 2);
  assert.equal(ScheduleConstraintModel.length, 2);
});

test("manifest builds", () => {
  const manifest = buildSchedulingModelManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.compatibility.compatibilityVersion, "1.0.0");
  assert.equal(manifest.models.timeline.length, 2);
});

test("validation PASS", () => {
  const result = validateSchedulingModel();
  assert.equal(result.summary.status, "PASS");
  assert.equal(result.summary.failed, 0);
  assert.equal(result.checks.length, 20);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ScheduleIdentityModel), true);
  assert.equal(Object.isFrozen(ScheduleTimelineModel), true);
  assert.equal(Object.isFrozen(ScheduleCalendarModel), true);
  assert.equal(Object.isFrozen(ScheduleExecutionWindowModel), true);
  assert.equal(Object.isFrozen(ScheduleMilestoneModel), true);
  assert.equal(Object.isFrozen(ScheduleDependencyModel), true);
  assert.equal(Object.isFrozen(ScheduleSequenceModel), true);
  assert.equal(Object.isFrozen(ScheduleConstraintModel), true);
  assert.equal(Object.isFrozen(ScheduleTaskLinkModel), true);
  assert.equal(Object.isFrozen(ScheduleWorkflowLinkModel), true);
  assert.equal(Object.isFrozen(ScheduleProjectLinkModel), true);
  assert.equal(Object.isFrozen(ScheduleResourceLinkModel), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(buildSchedulingModelManifest(), buildSchedulingModelManifest());
  assert.deepEqual(validateSchedulingModel(), validateSchedulingModel());
});

test("compatibility metadata", () => {
  assert.equal(
    ScheduleTaskLinkModel.metadata.sourceDependencies.includes(
      ExecutiveTaskIntelligencePublicIndexId,
    ),
    true,
  );
  assert.equal(
    ScheduleWorkflowLinkModel.metadata.sourceDependencies.includes(
      ExecutiveWorkflowIntelligencePublicIndexId,
    ),
    true,
  );
  assert.equal(
    ScheduleProjectLinkModel.metadata.sourceDependencies.includes(
      ExecutiveProjectExecutionPublicIndexId,
    ),
    true,
  );
  assert.equal(
    ScheduleResourceLinkModel.metadata.sourceDependencies.includes(
      ExecutiveResourceIntelligencePublicIndexId,
    ),
    true,
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveSchedulingIntelligenceFoundation.identity.platformId, "OPS-6:1");
  assert.equal(SchedulingPlatformMetadata.platformId, "OPS-6:1");
  assert.equal(SchedulingPlatformMetadata.compatibilityVersion, "1.0.0");
  assert.equal(ScheduleIdentityModel.metadata.metadataOnly, true);
});
