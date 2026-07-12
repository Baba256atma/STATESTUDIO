import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringSeverityLevels,
} from "./executionMonitoringRegistryTypes.ts";
import type { ExecutionMonitoringSeverityDescriptor } from "./executionMonitoringRegistryTypes.ts";

const severityRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "severity"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringSeverityRegistry = Object.freeze(
  ExecutionMonitoringSeverityLevels.map(
    (severity) =>
      Object.freeze({
        id: `ops-9:2-severity-${severity.toLowerCase()}`,
        severity,
        description: `Canonical metadata descriptor for the ${severity.toLowerCase()} severity level.`,
        metadata: severityRegistryMetadata,
      } as const satisfies ExecutionMonitoringSeverityDescriptor),
  ),
);
