import { getExecutionMonitoringHealthRegistry } from "./executionMonitoringRegistryIndex.ts";
import type { ExecutionMonitoringHealthModelDescriptor } from "./executionMonitoringModelTypes.ts";

export const ExecutionMonitoringHealthModel = Object.freeze(
  getExecutionMonitoringHealthRegistry().map((entry) =>
    Object.freeze({
      id: `monitoring-health-model-${entry.id}`,
      healthLevel: entry.level,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies ExecutionMonitoringHealthModelDescriptor),
  ),
);
