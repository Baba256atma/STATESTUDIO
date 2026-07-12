import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionSchedule } from "./executionModelTypes.ts";

export const ExecutionScheduleModel = Object.freeze({
  identifier: "execution-schedule-model",
  displayName: "Execution Schedule Model",
  description: "Canonical metadata model for execution scheduling.",
  category: "Schedule",
  status: "Modeled",
  scheduleIdentity: "ExecutiveExecutionSchedule",
  timelineMetadata: Object.freeze([
    "QuarterlyHorizon",
    "ExecutionCadence",
  ]),
  milestones: Object.freeze([
    "StartWindow",
    "CheckpointWindow",
    "CloseWindow",
  ]),
  deadlines: Object.freeze([
    "TargetDeadline",
    "EscalationDeadline",
  ]),
  executionWindows: Object.freeze([
    "PrimaryExecutionWindow",
    "FallbackExecutionWindow",
  ]),
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-scheduling-intelligence",
    domainId: "scheduling-intelligence",
  }),
} as const satisfies ExecutionSchedule);
