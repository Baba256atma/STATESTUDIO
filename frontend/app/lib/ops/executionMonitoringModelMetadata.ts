import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import { ExecutionMonitoringAlertModel } from "./executionMonitoringAlertModel.ts";
import { ExecutionMonitoringHealthModel } from "./executionMonitoringHealthModel.ts";
import { ExecutionMonitoringMetricModel } from "./executionMonitoringMetricModel.ts";
import { ExecutionMonitoringPolicyModel } from "./executionMonitoringPolicyModel.ts";
import { ExecutionMonitoringSnapshotModel } from "./executionMonitoringSnapshotModel.ts";
import { ExecutionMonitoringStateModel } from "./executionMonitoringStateModel.ts";
import { ExecutionMonitoringTargetModel } from "./executionMonitoringTargetModel.ts";
import type {
  ExecutionMonitoringModelDescriptor,
  ExecutionMonitoringModelSummary as ExecutionMonitoringModelSummaryShape,
} from "./executionMonitoringModelTypes.ts";

export const ExecutionMonitoringModelMetadata = Object.freeze({
  modelId: "ops-9-3-executive-execution-monitoring-model",
  modelVersion: "1.0.0",
  supportedTargetModelVersion: "1.0.0",
  supportedStateModelVersion: "1.0.0",
  supportedHealthModelVersion: "1.0.0",
  supportedAlertModelVersion: "1.0.0",
  supportedMetricModelVersion: "1.0.0",
  supportedSnapshotModelVersion: "1.0.0",
  supportedPolicyModelVersion: "1.0.0",
  compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
  deterministicStatus: "Deterministic",
  readonlyStatus: "Readonly",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionMonitoringModelDescriptor);

export const ExecutionMonitoringModelSummary = Object.freeze({
  targetModelCount: ExecutionMonitoringTargetModel.length,
  stateModelCount: ExecutionMonitoringStateModel.length,
  healthModelCount: ExecutionMonitoringHealthModel.length,
  alertModelCount: ExecutionMonitoringAlertModel.length,
  metricModelCount: ExecutionMonitoringMetricModel.length,
  snapshotModelCount: ExecutionMonitoringSnapshotModel.length,
  policyModelCount: ExecutionMonitoringPolicyModel.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionMonitoringModelSummaryShape);
