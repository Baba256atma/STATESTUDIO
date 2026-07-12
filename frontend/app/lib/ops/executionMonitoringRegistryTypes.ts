import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";

export type ExecutionMonitoringTargetCategory =
  | "Task"
  | "Workflow"
  | "Project"
  | "Resource"
  | "Schedule"
  | "Dependency"
  | "Automation";

export interface ExecutionMonitoringTargetDescriptor {
  readonly id: string;
  readonly category: ExecutionMonitoringTargetCategory;
  readonly name: string;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export type ExecutionMonitoringStateCategory =
  | "Idle"
  | "Pending"
  | "Running"
  | "Paused"
  | "Completed"
  | "Failed"
  | "Cancelled";

export interface ExecutionMonitoringStateDescriptor {
  readonly id: string;
  readonly state: ExecutionMonitoringStateCategory;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export type ExecutionMonitoringHealthCategory =
  | "Healthy"
  | "Warning"
  | "Critical"
  | "Unknown";

export interface ExecutionMonitoringHealthDescriptor {
  readonly id: string;
  readonly level: ExecutionMonitoringHealthCategory;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export type ExecutionMonitoringAlertCategory =
  | "Execution Alert"
  | "Resource Alert"
  | "Dependency Alert"
  | "Schedule Alert"
  | "Automation Alert"
  | "System Alert";

export type ExecutionMonitoringSeverityLevel =
  | "Informational"
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export interface ExecutionMonitoringAlertDescriptor {
  readonly id: string;
  readonly category: ExecutionMonitoringAlertCategory;
  readonly severity: ExecutionMonitoringSeverityLevel;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export type ExecutionMonitoringMetricCategory =
  | "Progress"
  | "Duration"
  | "Throughput"
  | "Latency"
  | "Availability"
  | "Error Rate"
  | "Success Rate";

export interface ExecutionMonitoringMetricDescriptor {
  readonly id: string;
  readonly category: ExecutionMonitoringMetricCategory;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export type ExecutionMonitoringLifecycleStage =
  | "Draft"
  | "Proposed"
  | "Active"
  | "Deprecated"
  | "Archived";

export interface ExecutionMonitoringLifecycleDescriptor {
  readonly id: string;
  readonly stage: ExecutionMonitoringLifecycleStage;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringSeverityDescriptor {
  readonly id: string;
  readonly severity: ExecutionMonitoringSeverityLevel;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringPlatformRegistryDescriptor {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly compatibilityVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringRegistrySummary {
  readonly supportedTargetCount: number;
  readonly supportedStateCount: number;
  readonly supportedHealthCount: number;
  readonly supportedAlertCount: number;
  readonly supportedMetricCount: number;
  readonly supportedLifecycleCount: number;
  readonly supportedSeverityCount: number;
  readonly compatibilityVersion: string;
  readonly deterministicStatus: "Deterministic";
  readonly readonlyStatus: "Readonly";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ExecutionMonitoringTargetCategories = Object.freeze([
  "Task",
  "Workflow",
  "Project",
  "Resource",
  "Schedule",
  "Dependency",
  "Automation",
] as const satisfies readonly ExecutionMonitoringTargetCategory[]);

export const ExecutionMonitoringStateCategories = Object.freeze([
  "Idle",
  "Pending",
  "Running",
  "Paused",
  "Completed",
  "Failed",
  "Cancelled",
] as const satisfies readonly ExecutionMonitoringStateCategory[]);

export const ExecutionMonitoringHealthCategories = Object.freeze([
  "Healthy",
  "Warning",
  "Critical",
  "Unknown",
] as const satisfies readonly ExecutionMonitoringHealthCategory[]);

export const ExecutionMonitoringAlertCategories = Object.freeze([
  "Execution Alert",
  "Resource Alert",
  "Dependency Alert",
  "Schedule Alert",
  "Automation Alert",
  "System Alert",
] as const satisfies readonly ExecutionMonitoringAlertCategory[]);

export const ExecutionMonitoringMetricCategories = Object.freeze([
  "Progress",
  "Duration",
  "Throughput",
  "Latency",
  "Availability",
  "Error Rate",
  "Success Rate",
] as const satisfies readonly ExecutionMonitoringMetricCategory[]);

export const ExecutionMonitoringLifecycleStages = Object.freeze([
  "Draft",
  "Proposed",
  "Active",
  "Deprecated",
  "Archived",
] as const satisfies readonly ExecutionMonitoringLifecycleStage[]);

export const ExecutionMonitoringSeverityLevels = Object.freeze([
  "Informational",
  "Low",
  "Medium",
  "High",
  "Critical",
] as const satisfies readonly ExecutionMonitoringSeverityLevel[]);
