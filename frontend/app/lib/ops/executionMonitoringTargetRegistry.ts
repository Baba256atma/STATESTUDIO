import {
  ExecutionMonitoringCompatibilityVersion,
  SupportedExecutionMonitoringTargets,
} from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringTargetDescriptor } from "./executionMonitoringRegistryTypes.ts";

const targetRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "targets"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringTargetRegistry = Object.freeze(
  SupportedExecutionMonitoringTargets.map(
    (category) =>
      Object.freeze({
        id: `ops-9:2-target-${category.toLowerCase()}`,
        category,
        name: `${category} Monitoring`,
        description: `Canonical metadata catalog for ${category.toLowerCase()} monitoring targets within the Executive Execution Monitoring Platform.`,
        metadata: targetRegistryMetadata,
      } as const satisfies ExecutionMonitoringTargetDescriptor),
  ),
);
