export type MonitoringId = string;
export type MonitoringTargetId = string;
export type MonitoringRuleId = string;
export type MonitoringEventId = string;
export type MonitoringStatusId = string;

export type ExecutionMonitoringHealth =
  | "Healthy"
  | "Observed"
  | "Warning"
  | "Critical"
  | "Unknown";

export type ExecutionMonitoringStatus =
  | "Defined"
  | "Visible"
  | "Tracked"
  | "Escalated"
  | "Acknowledged"
  | "Archived";

export type ExecutionMonitoringAlertSeverity =
  | "Informational"
  | "Low"
  | "Moderate"
  | "High"
  | "Critical";

export interface ExecutionMonitoringMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly tags: readonly string[];
}

export interface ExecutionMonitoringTarget {
  readonly id: MonitoringTargetId;
  readonly category: string;
  readonly name: string;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringState {
  readonly status: ExecutionMonitoringStatus;
  readonly health: ExecutionMonitoringHealth;
  readonly severity: ExecutionMonitoringAlertSeverity;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringSnapshot {
  readonly targetReference: MonitoringTargetId;
  readonly monitoringMetadata: ExecutionMonitoringMetadata;
  readonly timestampDescriptor: string;
  readonly summary: string;
}

export interface ExecutionMonitoringAlertDescriptor {
  readonly id: MonitoringEventId;
  readonly category: string;
  readonly severity: ExecutionMonitoringAlertSeverity;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringMetricDescriptor {
  readonly id: MonitoringId;
  readonly metricCategory: string;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringSummary {
  readonly totalContracts: number;
  readonly supportedTargets: readonly string[];
  readonly supportedStatuses: readonly ExecutionMonitoringStatus[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringStatistics {
  readonly targetCategoryCount: number;
  readonly healthLevelCount: number;
  readonly statusCount: number;
  readonly metricCategoryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringPlatformDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly platformDescription: string;
  readonly platformStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringFoundationDescriptor {
  readonly namespace: string;
  readonly contractCount: number;
  readonly metadataCatalogCount: number;
  readonly registryStatus: "Complete";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ExecutionMonitoringHealthLevels = Object.freeze([
  "Healthy",
  "Observed",
  "Warning",
  "Critical",
  "Unknown",
] as const satisfies readonly ExecutionMonitoringHealth[]);

export const ExecutionMonitoringStatuses = Object.freeze([
  "Defined",
  "Visible",
  "Tracked",
  "Escalated",
  "Acknowledged",
  "Archived",
] as const satisfies readonly ExecutionMonitoringStatus[]);

export const ExecutionMonitoringAlertSeverities = Object.freeze([
  "Informational",
  "Low",
  "Moderate",
  "High",
  "Critical",
] as const satisfies readonly ExecutionMonitoringAlertSeverity[]);

export const ExecutionMonitoringTypes = Object.freeze({
  healthLevels: ExecutionMonitoringHealthLevels,
  statuses: ExecutionMonitoringStatuses,
  alertSeverities: ExecutionMonitoringAlertSeverities,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
