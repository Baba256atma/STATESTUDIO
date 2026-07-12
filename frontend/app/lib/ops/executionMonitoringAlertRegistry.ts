import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringAlertCategories,
  ExecutionMonitoringSeverityLevels,
} from "./executionMonitoringRegistryTypes.ts";
import type { ExecutionMonitoringAlertDescriptor } from "./executionMonitoringRegistryTypes.ts";

const alertRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "alerts"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringAlertRegistry = Object.freeze(
  ExecutionMonitoringAlertCategories.map(
    (category, index) =>
      Object.freeze({
        id: `ops-9:2-alert-${index + 1}`,
        category,
        severity: ExecutionMonitoringSeverityLevels[
          Math.min(index, ExecutionMonitoringSeverityLevels.length - 1)
        ],
        description: `Canonical metadata descriptor for the ${category.toLowerCase()} catalog.`,
        metadata: alertRegistryMetadata,
      } as const satisfies ExecutionMonitoringAlertDescriptor),
  ),
);
