import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringMetricCategories,
} from "./executionMonitoringRegistryTypes.ts";
import type { ExecutionMonitoringMetricDescriptor } from "./executionMonitoringRegistryTypes.ts";

const metricRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "metrics"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringMetricRegistry = Object.freeze(
  ExecutionMonitoringMetricCategories.map(
    (category) =>
      Object.freeze({
        id: `ops-9:2-metric-${category.toLowerCase().replace(/ /g, "-")}`,
        category,
        description: `Canonical metadata descriptor for the ${category.toLowerCase()} metric category.`,
        metadata: metricRegistryMetadata,
      } as const satisfies ExecutionMonitoringMetricDescriptor),
  ),
);
