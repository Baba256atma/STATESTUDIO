import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import { ExecutionMonitoringAlertRegistry } from "./executionMonitoringAlertRegistry.ts";
import { ExecutionMonitoringHealthRegistry } from "./executionMonitoringHealthRegistry.ts";
import { ExecutionMonitoringLifecycleRegistry } from "./executionMonitoringLifecycleRegistry.ts";
import { ExecutionMonitoringMetricRegistry } from "./executionMonitoringMetricRegistry.ts";
import { ExecutionMonitoringSeverityRegistry } from "./executionMonitoringSeverityRegistry.ts";
import { ExecutionMonitoringStateRegistry } from "./executionMonitoringStateRegistry.ts";
import { ExecutionMonitoringTargetRegistry } from "./executionMonitoringTargetRegistry.ts";
import type {
  ExecutionMonitoringPlatformRegistryDescriptor,
  ExecutionMonitoringRegistrySummary,
} from "./executionMonitoringRegistryTypes.ts";

export const ExecutionMonitoringPlatformRegistryMetadata = Object.freeze({
  registryId: "ops-9-2-executive-execution-monitoring-registry",
  registryName: "Executive Execution Monitoring Registry",
  registryVersion: "1.0.0",
  compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionMonitoringPlatformRegistryDescriptor);

export const ExecutionMonitoringRegistryMetadata = Object.freeze({
  supportedTargetCount: ExecutionMonitoringTargetRegistry.length,
  supportedStateCount: ExecutionMonitoringStateRegistry.length,
  supportedHealthCount: ExecutionMonitoringHealthRegistry.length,
  supportedAlertCount: ExecutionMonitoringAlertRegistry.length,
  supportedMetricCount: ExecutionMonitoringMetricRegistry.length,
  supportedLifecycleCount: ExecutionMonitoringLifecycleRegistry.length,
  supportedSeverityCount: ExecutionMonitoringSeverityRegistry.length,
  compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
  deterministicStatus: "Deterministic",
  readonlyStatus: "Readonly",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionMonitoringRegistrySummary);
