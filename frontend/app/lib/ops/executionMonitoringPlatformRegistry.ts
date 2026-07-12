import { ExecutionMonitoringAlertRegistry } from "./executionMonitoringAlertRegistry.ts";
import { ExecutionMonitoringHealthRegistry } from "./executionMonitoringHealthRegistry.ts";
import { ExecutionMonitoringLifecycleRegistry } from "./executionMonitoringLifecycleRegistry.ts";
import { ExecutionMonitoringMetricRegistry } from "./executionMonitoringMetricRegistry.ts";
import {
  ExecutionMonitoringPlatformRegistryMetadata,
  ExecutionMonitoringRegistryMetadata,
} from "./executionMonitoringRegistryMetadata.ts";
import { ExecutionMonitoringSeverityRegistry } from "./executionMonitoringSeverityRegistry.ts";
import { ExecutionMonitoringStateRegistry } from "./executionMonitoringStateRegistry.ts";
import { ExecutionMonitoringTargetRegistry } from "./executionMonitoringTargetRegistry.ts";

export const ExecutiveExecutionMonitoringRegistry = Object.freeze({
  targets: ExecutionMonitoringTargetRegistry,
  states: ExecutionMonitoringStateRegistry,
  health: ExecutionMonitoringHealthRegistry,
  alerts: ExecutionMonitoringAlertRegistry,
  metrics: ExecutionMonitoringMetricRegistry,
  lifecycle: ExecutionMonitoringLifecycleRegistry,
  severity: ExecutionMonitoringSeverityRegistry,
  metadata: ExecutionMonitoringRegistryMetadata,
  descriptor: ExecutionMonitoringPlatformRegistryMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveExecutionMonitoringRegistry = () =>
  ExecutiveExecutionMonitoringRegistry;
export const getExecutionMonitoringTargetRegistry = () =>
  ExecutionMonitoringTargetRegistry;
export const getExecutionMonitoringStateRegistry = () =>
  ExecutionMonitoringStateRegistry;
export const getExecutionMonitoringHealthRegistry = () =>
  ExecutionMonitoringHealthRegistry;
export const getExecutionMonitoringAlertRegistry = () =>
  ExecutionMonitoringAlertRegistry;
export const getExecutionMonitoringMetricRegistry = () =>
  ExecutionMonitoringMetricRegistry;
export const getExecutionMonitoringLifecycleRegistry = () =>
  ExecutionMonitoringLifecycleRegistry;
export const getExecutionMonitoringSeverityRegistry = () =>
  ExecutionMonitoringSeverityRegistry;
