import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import { SchedulingPlatformMetadata } from "./schedulingMetadataIndex.ts";
import { ScheduleCalendarModel } from "./scheduleCalendarModel.ts";
import { ScheduleConstraintModel } from "./scheduleConstraintModel.ts";
import { ScheduleDependencyModel } from "./scheduleDependencyModel.ts";
import { ScheduleExecutionWindowModel } from "./scheduleExecutionWindowModel.ts";
import { ScheduleIdentityModel } from "./scheduleIdentityModel.ts";
import { ScheduleMilestoneModel } from "./scheduleMilestoneModel.ts";
import { ScheduleProjectLinkModel } from "./scheduleProjectLinkModel.ts";
import { ScheduleResourceLinkModel } from "./scheduleResourceLinkModel.ts";
import { ScheduleSequenceModel } from "./scheduleSequenceModel.ts";
import { ScheduleTaskLinkModel } from "./scheduleTaskLinkModel.ts";
import { ScheduleTimelineModel } from "./scheduleTimelineModel.ts";
import { ScheduleWorkflowLinkModel } from "./scheduleWorkflowLinkModel.ts";
import { buildSchedulingModelManifest } from "./schedulingModelManifest.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "scheduling-model-completeness",
      name: "Model Completeness",
      status:
        ScheduleIdentityModel.scheduleClassification.length === 8 &&
        buildSchedulingModelManifest().models.timeline.length === 2
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-identity-metadata-exists",
      name: "Identity Metadata Exists",
      status: ScheduleIdentityModel.scheduleIdPattern.length > 0 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-timeline-metadata-exists",
      name: "Timeline Metadata Exists",
      status: ScheduleTimelineModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-calendar-metadata-exists",
      name: "Calendar Metadata Exists",
      status: ScheduleCalendarModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-execution-window-metadata-exists",
      name: "Execution Window Metadata Exists",
      status: ScheduleExecutionWindowModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-milestone-metadata-exists",
      name: "Milestone Metadata Exists",
      status: ScheduleMilestoneModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-dependency-metadata-exists",
      name: "Dependency Metadata Exists",
      status: ScheduleDependencyModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-sequencing-metadata-exists",
      name: "Sequencing Metadata Exists",
      status: ScheduleSequenceModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-constraint-metadata-exists",
      name: "Constraint Metadata Exists",
      status: ScheduleConstraintModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-task-linkage-exists",
      name: "Task Linkage Exists",
      status: ScheduleTaskLinkModel.linkedEntities.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-workflow-linkage-exists",
      name: "Workflow Linkage Exists",
      status: ScheduleWorkflowLinkModel.linkedEntities.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-project-linkage-exists",
      name: "Project Linkage Exists",
      status: ScheduleProjectLinkModel.linkedEntities.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-resource-linkage-exists",
      name: "Resource Linkage Exists",
      status: ScheduleResourceLinkModel.linkedEntities.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-builds",
      name: "Manifest Builds",
      status:
        Object.isFrozen(buildSchedulingModelManifest()) &&
        buildSchedulingModelManifest().compatibility.compatibilityVersion ===
          SchedulingPlatformMetadata.compatibilityVersion
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ScheduleIdentityModel) &&
        Object.isFrozen(ScheduleTimelineModel) &&
        Object.isFrozen(ScheduleCalendarModel) &&
        Object.isFrozen(ScheduleExecutionWindowModel) &&
        Object.isFrozen(ScheduleMilestoneModel) &&
        Object.isFrozen(ScheduleDependencyModel) &&
        Object.isFrozen(ScheduleSequenceModel) &&
        Object.isFrozen(ScheduleConstraintModel) &&
        Object.isFrozen(ScheduleTaskLinkModel) &&
        Object.isFrozen(ScheduleWorkflowLinkModel) &&
        Object.isFrozen(ScheduleProjectLinkModel) &&
        Object.isFrozen(ScheduleResourceLinkModel)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-deterministic-output",
      name: "Deterministic Output",
      status:
        JSON.stringify(buildSchedulingModelManifest()) ===
        JSON.stringify(buildSchedulingModelManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-2-compatibility",
      name: "OPS-2 Compatibility",
      status: ScheduleTaskLinkModel.metadata.sourceDependencies.includes(
        ExecutiveTaskIntelligencePublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-3-compatibility",
      name: "OPS-3 Compatibility",
      status: ScheduleWorkflowLinkModel.metadata.sourceDependencies.includes(
        ExecutiveWorkflowIntelligencePublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-4-compatibility",
      name: "OPS-4 Compatibility",
      status: ScheduleProjectLinkModel.metadata.sourceDependencies.includes(
        ExecutiveProjectExecutionPublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-ops-5-compatibility",
      name: "OPS-5 Compatibility",
      status: ScheduleResourceLinkModel.metadata.sourceDependencies.includes(
        ExecutiveResourceIntelligencePublicIndexId,
      )
        ? "PASS"
        : "FAIL",
    }),
  ] as const);

export const validateSchedulingModel = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
