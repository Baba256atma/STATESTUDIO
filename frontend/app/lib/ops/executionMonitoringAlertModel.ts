import { getExecutionMonitoringAlertRegistry } from "./executionMonitoringRegistryIndex.ts";
import type { ExecutionMonitoringAlertModelDescriptor } from "./executionMonitoringModelTypes.ts";

export const ExecutionMonitoringAlertModel = Object.freeze(
  getExecutionMonitoringAlertRegistry().map((entry) =>
    Object.freeze({
      id: `monitoring-alert-model-${entry.id}`,
      category: entry.category,
      severity: entry.severity,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies ExecutionMonitoringAlertModelDescriptor),
  ),
);
