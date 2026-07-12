import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
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

export const buildSchedulingModelManifest = () =>
  Object.freeze({
    foundation: ExecutiveSchedulingIntelligenceFoundation,
    metadata: SchedulingPlatformMetadata,
    models: Object.freeze({
      identity: ScheduleIdentityModel,
      timeline: ScheduleTimelineModel,
      calendar: ScheduleCalendarModel,
      executionWindow: ScheduleExecutionWindowModel,
      milestone: ScheduleMilestoneModel,
      dependency: ScheduleDependencyModel,
      sequence: ScheduleSequenceModel,
      constraint: ScheduleConstraintModel,
      taskLink: ScheduleTaskLinkModel,
      workflowLink: ScheduleWorkflowLinkModel,
      projectLink: ScheduleProjectLinkModel,
      resourceLink: ScheduleResourceLinkModel,
    }),
    compatibility: Object.freeze({
      compatibilityVersion: SchedulingPlatformMetadata.compatibilityVersion,
      supportedDomainCount: SchedulingPlatformMetadata.supportedSchedulingDomains.length,
      timelineDescriptorCount: ScheduleTimelineModel.length,
      calendarDescriptorCount: ScheduleCalendarModel.length,
      executionWindowDescriptorCount: ScheduleExecutionWindowModel.length,
      milestoneDescriptorCount: ScheduleMilestoneModel.length,
      dependencyDescriptorCount: ScheduleDependencyModel.length,
      sequenceDescriptorCount: ScheduleSequenceModel.length,
      constraintDescriptorCount: ScheduleConstraintModel.length,
      metadataOnly: true,
      immutable: true,
    }),
    dependencies: Object.freeze([
      "OPS-2:9",
      "OPS-3:9",
      "OPS-4:9",
      "OPS-5:9",
      "OPS-6:1",
      "OPS-6:2",
    ]),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
