import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionMonitoring } from "./executionModelTypes.ts";
import { ExecutionMonitoringAlertModel } from "./executionMonitoringAlertModel.ts";
import { ExecutionMonitoringHealthModel } from "./executionMonitoringHealthModel.ts";
import {
  ExecutionMonitoringModelMetadata,
  ExecutionMonitoringModelSummary,
} from "./executionMonitoringModelMetadata.ts";
import { ExecutionMonitoringMetricModel } from "./executionMonitoringMetricModel.ts";
import { ExecutionMonitoringPolicyModel } from "./executionMonitoringPolicyModel.ts";
import { ExecutionMonitoringSnapshotModel } from "./executionMonitoringSnapshotModel.ts";
import { ExecutionMonitoringStateModel } from "./executionMonitoringStateModel.ts";
import { ExecutionMonitoringTargetModel } from "./executionMonitoringTargetModel.ts";

export const ExecutionMonitoringModel = Object.freeze({
  identifier: "execution-monitoring-model",
  displayName: "Execution Monitoring Model",
  description: "Canonical metadata model for execution monitoring.",
  category: "Monitoring",
  status: "Modeled",
  monitoringTargets: Object.freeze([
    "TaskProgress",
    "WorkflowProgress",
    "ProjectHealth",
  ]),
  healthIndicators: Object.freeze([
    "ExecutionHealth",
    "DeliveryHealth",
  ]),
  progressIndicators: Object.freeze([
    "MilestoneProgress",
    "OutcomeProgress",
  ]),
  alertCategories: Object.freeze([
    "RiskAlert",
    "DelayAlert",
    "DependencyAlert",
  ]),
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-monitoring",
    domainId: "monitoring",
  }),
} as const satisfies ExecutionMonitoring);

export const ExecutiveExecutionMonitoringModel = Object.freeze({
  targets: ExecutionMonitoringTargetModel,
  states: ExecutionMonitoringStateModel,
  health: ExecutionMonitoringHealthModel,
  alerts: ExecutionMonitoringAlertModel,
  metrics: ExecutionMonitoringMetricModel,
  snapshots: ExecutionMonitoringSnapshotModel,
  policies: ExecutionMonitoringPolicyModel,
  metadata: ExecutionMonitoringModelMetadata,
  summary: ExecutionMonitoringModelSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveExecutionMonitoringModel = () =>
  ExecutiveExecutionMonitoringModel;
export const getExecutionMonitoringSnapshotModel = () =>
  ExecutionMonitoringSnapshotModel;
export const getExecutionMonitoringPolicyModel = () =>
  ExecutionMonitoringPolicyModel;
