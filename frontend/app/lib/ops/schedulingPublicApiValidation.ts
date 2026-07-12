import { SchedulingPublicApiRegistry } from "./schedulingMetadataIndex.ts";
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
} from "./schedulingModelIndex.ts";
import {
  SchedulingIntelligenceIdentity,
  SchedulingIntelligencePublicApis,
} from "./schedulingIntelligenceIndex.ts";
import type { SchedulingValidationEntry } from "./schedulingValidationTypes.ts";

const objectModels = Object.freeze([
  ScheduleIdentityModel,
  ScheduleTaskLinkModel,
  ScheduleWorkflowLinkModel,
  ScheduleProjectLinkModel,
  ScheduleResourceLinkModel,
]);

const arrayModels = Object.freeze([
  ScheduleTimelineModel,
  ScheduleCalendarModel,
  ScheduleExecutionWindowModel,
  ScheduleMilestoneModel,
  ScheduleDependencyModel,
  ScheduleSequenceModel,
  ScheduleConstraintModel,
]);

export const SchedulingPublicApiValidation = Object.freeze([
  Object.freeze({
    id: "scheduling-public-api-stability",
    name: "Public API Stability",
    description: "Validates stable public API exposure across OPS-6 phases.",
    category: "PublicApi",
    status:
      SchedulingIntelligencePublicApis.length === 3 &&
      SchedulingPublicApiRegistry.length >= 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-public-api-consumer-only",
    name: "Public API Consumer Only",
    description: "Validates public API remains consumer-facing and metadata-only.",
    category: "PublicApi",
    status:
      objectModels.every((model) => model.metadata.metadataOnly) &&
      arrayModels.every(
        (model) => Object.isFrozen(model) && model.every((entry) => entry.metadata.metadataOnly),
      ) &&
      SchedulingIntelligenceIdentity.metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-public-api-immutability",
    name: "Public API Immutability",
    description: "Validates immutable public API registry and exported models.",
    category: "Immutability",
    status:
      Object.isFrozen(SchedulingPublicApiRegistry) &&
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
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
] as const);
