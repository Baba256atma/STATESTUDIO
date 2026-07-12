import {
  getExecutionMonitoringAlertRegistry,
  getExecutionMonitoringMetricRegistry,
  getExecutionMonitoringStateRegistry,
  getExecutionMonitoringTargetRegistry,
} from "./executionMonitoringRegistryIndex.ts";
import type { ExecutionMonitoringSnapshotModelDescriptor } from "./executionMonitoringModelTypes.ts";

const stateRegistry = getExecutionMonitoringStateRegistry();
const metricRegistry = getExecutionMonitoringMetricRegistry();
const alertRegistry = getExecutionMonitoringAlertRegistry();

export const ExecutionMonitoringSnapshotModel = Object.freeze(
  getExecutionMonitoringTargetRegistry().map((target, index) =>
    Object.freeze({
      id: `monitoring-snapshot-model-${index + 1}`,
      targetReference: target.id,
      monitoringStateReference:
        stateRegistry[index % stateRegistry.length]?.id ?? stateRegistry[0]!.id,
      metricReferences: Object.freeze([
        metricRegistry[index % metricRegistry.length]?.id ?? metricRegistry[0]!.id,
        metricRegistry[(index + 1) % metricRegistry.length]?.id ??
          metricRegistry[0]!.id,
      ]),
      alertReferences: Object.freeze([
        alertRegistry[index % alertRegistry.length]?.id ?? alertRegistry[0]!.id,
      ]),
      metadata: target.metadata,
    } as const satisfies ExecutionMonitoringSnapshotModelDescriptor),
  ),
);
