import { getExecutionMonitoringTargetRegistry } from "./executionMonitoringRegistryIndex.ts";
import type { ExecutionMonitoringTargetModelDescriptor } from "./executionMonitoringModelTypes.ts";

export const ExecutionMonitoringTargetModel = Object.freeze(
  getExecutionMonitoringTargetRegistry().map((entry) =>
    Object.freeze({
      id: `monitoring-target-model-${entry.id}`,
      category: entry.category,
      name: entry.name,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies ExecutionMonitoringTargetModelDescriptor),
  ),
);
