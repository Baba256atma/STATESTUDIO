import {
  ExecutionMonitoringAlertSeverities,
  ExecutionMonitoringHealthLevels,
  ExecutionMonitoringStatuses,
} from "./executionMonitoringTypes.ts";

export const SupportedExecutionMonitoringTargets = Object.freeze([
  "Task",
  "Workflow",
  "Project",
  "Resource",
  "Schedule",
  "Dependency",
  "Automation",
] as const);

export const SupportedExecutionMonitoringMetricCategories = Object.freeze([
  "Progress",
  "Health",
  "Risk",
  "Latency",
  "Readiness",
  "Coverage",
] as const);

export const ExecutionMonitoringCompatibilityVersion = "1.0.0" as const;

export const ExecutionMonitoringReleaseMetadata = Object.freeze({
  releaseStage: "Draft",
  releaseStatus: "Defined",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutionMonitoringMetadataCatalog = Object.freeze({
  supportedMonitoringTargets: SupportedExecutionMonitoringTargets,
  supportedHealthLevels: ExecutionMonitoringHealthLevels,
  supportedMonitoringStatuses: ExecutionMonitoringStatuses,
  supportedAlertSeverities: ExecutionMonitoringAlertSeverities,
  supportedMetricCategories: SupportedExecutionMonitoringMetricCategories,
  compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
  releaseMetadata: ExecutionMonitoringReleaseMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
