import type {
  ExecutionMonitoringAlertDescriptor,
  ExecutionMonitoringHealth,
  ExecutionMonitoringMetadata,
  ExecutionMonitoringMetricDescriptor,
  ExecutionMonitoringPlatformDescriptor,
  ExecutionMonitoringSnapshot,
  ExecutionMonitoringState,
  ExecutionMonitoringTarget,
} from "./executionMonitoringTypes.ts";

const monitoringMetadata = Object.freeze({
  platformId: "OPS-9:1",
  platformVersion: "1.0.0",
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "execution-monitoring", "metadata-only"]),
} as const satisfies ExecutionMonitoringMetadata);

const platformMetadata = Object.freeze({
  platformId: "OPS-9:1",
  platformName: "Executive Execution Monitoring Foundation",
  platformNamespace: "nexora.ops.execution-monitoring.foundation",
  platformVersion: "1.0.0",
  platformDescription:
    "Canonical metadata-only foundation for executive execution monitoring contracts.",
  platformStatus: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionMonitoringPlatformDescriptor);

export const ExecutionMonitoringTargetContract = Object.freeze({
  id: "execution-monitoring-target-contract",
  category: "Task",
  name: "Execution Monitoring Target",
  description:
    "Canonical metadata-only contract describing one execution monitoring target.",
  metadata: monitoringMetadata,
} as const satisfies ExecutionMonitoringTarget);

export const ExecutionMonitoringStateContract = Object.freeze({
  status: "Defined",
  health: "Observed",
  severity: "Informational",
  metadata: monitoringMetadata,
} as const satisfies ExecutionMonitoringState);

export const ExecutionMonitoringSnapshotContract = Object.freeze({
  targetReference: ExecutionMonitoringTargetContract.id,
  monitoringMetadata: monitoringMetadata,
  timestampDescriptor: "snapshot-timestamp-descriptor",
  summary: "Canonical metadata-only snapshot summary for execution visibility.",
} as const satisfies ExecutionMonitoringSnapshot);

export const ExecutionMonitoringAlertContract = Object.freeze({
  id: "execution-monitoring-alert-contract",
  category: "ExecutionVisibility",
  severity: "Moderate",
  description:
    "Canonical metadata-only alert descriptor without delivery behavior.",
  metadata: monitoringMetadata,
} as const satisfies ExecutionMonitoringAlertDescriptor);

export const ExecutionMonitoringMetricContract = Object.freeze({
  id: "execution-monitoring-metric-contract",
  metricCategory: "Progress",
  description:
    "Canonical metadata-only metric descriptor without calculation behavior.",
  metadata: monitoringMetadata,
} as const satisfies ExecutionMonitoringMetricDescriptor);

export const ExecutionMonitoringContracts = Object.freeze({
  target: ExecutionMonitoringTargetContract,
  state: ExecutionMonitoringStateContract,
  snapshot: ExecutionMonitoringSnapshotContract,
  alert: ExecutionMonitoringAlertContract,
  metric: ExecutionMonitoringMetricContract,
  platform: platformMetadata,
  all: Object.freeze([
    ExecutionMonitoringTargetContract,
    ExecutionMonitoringStateContract,
    ExecutionMonitoringSnapshotContract,
    ExecutionMonitoringAlertContract,
    ExecutionMonitoringMetricContract,
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
