import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringHealthCategories,
} from "./executionMonitoringRegistryTypes.ts";
import type { ExecutionMonitoringHealthDescriptor } from "./executionMonitoringRegistryTypes.ts";

const healthRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "health"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringHealthRegistry = Object.freeze(
  ExecutionMonitoringHealthCategories.map(
    (level) =>
      Object.freeze({
        id: `ops-9:2-health-${level.toLowerCase()}`,
        level,
        description: `Canonical metadata descriptor for the ${level.toLowerCase()} health level.`,
        metadata: healthRegistryMetadata,
      } as const satisfies ExecutionMonitoringHealthDescriptor),
  ),
);
