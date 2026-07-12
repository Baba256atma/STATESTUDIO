import { getExecutionMonitoringMetricRegistry } from "./executionMonitoringRegistryIndex.ts";
import type { ExecutionMonitoringMetricModelDescriptor } from "./executionMonitoringModelTypes.ts";

const metricUnits = Object.freeze({
  Progress: "percent",
  Duration: "hours",
  Throughput: "items-per-period",
  Latency: "milliseconds",
  Availability: "percent",
  "Error Rate": "percent",
  "Success Rate": "percent",
} as const);

export const ExecutionMonitoringMetricModel = Object.freeze(
  getExecutionMonitoringMetricRegistry().map((entry) =>
    Object.freeze({
      id: `monitoring-metric-model-${entry.id}`,
      metricCategory: entry.category,
      unit: metricUnits[entry.category],
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies ExecutionMonitoringMetricModelDescriptor),
  ),
);
