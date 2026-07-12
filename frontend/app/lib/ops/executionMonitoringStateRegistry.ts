import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import type { ExecutionMonitoringMetadata } from "./executionMonitoringIndex.ts";
import {
  ExecutionMonitoringStateCategories,
} from "./executionMonitoringRegistryTypes.ts";
import type { ExecutionMonitoringStateDescriptor } from "./executionMonitoringRegistryTypes.ts";

const stateRegistryMetadata = Object.freeze({
  platformId: "OPS-9:2",
  platformVersion: ExecutionMonitoringCompatibilityVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: ["ops", "execution-monitoring", "registry", "states"],
} as const satisfies ExecutionMonitoringMetadata);

export const ExecutionMonitoringStateRegistry = Object.freeze(
  ExecutionMonitoringStateCategories.map(
    (state) =>
      Object.freeze({
        id: `ops-9:2-state-${state.toLowerCase()}`,
        state,
        description: `Canonical metadata descriptor for the ${state.toLowerCase()} monitoring state.`,
        metadata: stateRegistryMetadata,
      } as const satisfies ExecutionMonitoringStateDescriptor),
  ),
);
