import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringLifecycleStages,
} from "./executionMonitoringRegistryTypes.ts";
import type { ExecutionMonitoringLifecycleDescriptor } from "./executionMonitoringRegistryTypes.ts";

const lifecycleRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "lifecycle"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringLifecycleRegistry = Object.freeze(
  ExecutionMonitoringLifecycleStages.map(
    (stage) =>
      Object.freeze({
        id: `ops-9:2-lifecycle-${stage.toLowerCase()}`,
        stage,
        description: `Canonical metadata descriptor for the ${stage.toLowerCase()} lifecycle stage.`,
        metadata: lifecycleRegistryMetadata,
      } as const satisfies ExecutionMonitoringLifecycleDescriptor),
  ),
);
