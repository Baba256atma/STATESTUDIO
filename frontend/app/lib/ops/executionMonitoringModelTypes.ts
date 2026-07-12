import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import type {
  ExecutionMonitoringAlertCategory,
  ExecutionMonitoringHealthCategory,
  ExecutionMonitoringMetricCategory,
  ExecutionMonitoringSeverityLevel,
  ExecutionMonitoringStateCategory,
  ExecutionMonitoringTargetCategory,
} from "./executionMonitoringRegistryIndex.ts";

export interface ExecutionMonitoringTargetModelDescriptor {
  readonly id: string;
  readonly category: ExecutionMonitoringTargetCategory;
  readonly name: string;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringStateModelDescriptor {
  readonly id: string;
  readonly state: ExecutionMonitoringStateCategory;
  readonly healthReference: string;
  readonly severityReference: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringHealthModelDescriptor {
  readonly id: string;
  readonly healthLevel: ExecutionMonitoringHealthCategory;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringAlertModelDescriptor {
  readonly id: string;
  readonly category: ExecutionMonitoringAlertCategory;
  readonly severity: ExecutionMonitoringSeverityLevel;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringMetricModelDescriptor {
  readonly id: string;
  readonly metricCategory: ExecutionMonitoringMetricCategory;
  readonly unit: string;
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringSnapshotModelDescriptor {
  readonly id: string;
  readonly targetReference: string;
  readonly monitoringStateReference: string;
  readonly metricReferences: readonly string[];
  readonly alertReferences: readonly string[];
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringPolicyModelDescriptor {
  readonly id: string;
  readonly policyCategory:
    | "Observation Policy"
    | "Retention Policy"
    | "Visibility Policy"
    | "Notification Policy"
    | "Escalation Policy";
  readonly description: string;
  readonly metadata: ExecutionMonitoringMetadata;
}

export interface ExecutionMonitoringModelDescriptor {
  readonly modelId: string;
  readonly modelVersion: string;
  readonly supportedTargetModelVersion: string;
  readonly supportedStateModelVersion: string;
  readonly supportedHealthModelVersion: string;
  readonly supportedAlertModelVersion: string;
  readonly supportedMetricModelVersion: string;
  readonly supportedSnapshotModelVersion: string;
  readonly supportedPolicyModelVersion: string;
  readonly compatibilityVersion: string;
  readonly deterministicStatus: "Deterministic";
  readonly readonlyStatus: "Readonly";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringModelSummary {
  readonly targetModelCount: number;
  readonly stateModelCount: number;
  readonly healthModelCount: number;
  readonly alertModelCount: number;
  readonly metricModelCount: number;
  readonly snapshotModelCount: number;
  readonly policyModelCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ExecutionMonitoringPolicyCategories = Object.freeze([
  "Observation Policy",
  "Retention Policy",
  "Visibility Policy",
  "Notification Policy",
  "Escalation Policy",
] as const);

