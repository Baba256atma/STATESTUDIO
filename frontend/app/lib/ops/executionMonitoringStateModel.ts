import {
  getExecutionMonitoringHealthRegistry,
  getExecutionMonitoringSeverityRegistry,
  getExecutionMonitoringStateRegistry,
} from "./executionMonitoringRegistryIndex.ts";
import type { ExecutionMonitoringStateModelDescriptor } from "./executionMonitoringModelTypes.ts";

const healthRegistry = getExecutionMonitoringHealthRegistry();
const severityRegistry = getExecutionMonitoringSeverityRegistry();

export const ExecutionMonitoringStateModel = Object.freeze(
  getExecutionMonitoringStateRegistry().map((entry, index) =>
    Object.freeze({
      id: `monitoring-state-model-${entry.id}`,
      state: entry.state,
      healthReference:
        healthRegistry[Math.min(index, healthRegistry.length - 1)]?.id ??
        healthRegistry[0]!.id,
      severityReference:
        severityRegistry[Math.min(index, severityRegistry.length - 1)]?.id ??
        severityRegistry[0]!.id,
      metadata: entry.metadata,
    } as const satisfies ExecutionMonitoringStateModelDescriptor),
  ),
);
