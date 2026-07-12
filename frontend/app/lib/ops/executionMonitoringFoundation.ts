import { ExecutionMonitoringContracts } from "./executionMonitoringContracts.ts";
import { ExecutionMonitoringMetadataCatalog } from "./executionMonitoringMetadata.ts";
import { ExecutionMonitoringRegistry } from "./executionMonitoringRegistry.ts";
import {
  ExecutionMonitoringTypes,
  type ExecutionMonitoringFoundationDescriptor,
} from "./executionMonitoringTypes.ts";

const foundationDescriptor = Object.freeze({
  namespace: "nexora.ops.execution-monitoring.foundation",
  contractCount: ExecutionMonitoringContracts.all.length,
  metadataCatalogCount: 5,
  registryStatus: "Complete",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionMonitoringFoundationDescriptor);

export const ExecutiveExecutionMonitoringFoundation = Object.freeze({
  contracts: ExecutionMonitoringContracts,
  registry: ExecutionMonitoringRegistry,
  metadata: ExecutionMonitoringMetadataCatalog,
  types: ExecutionMonitoringTypes,
  descriptor: foundationDescriptor,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveExecutionMonitoringFoundation = () =>
  ExecutiveExecutionMonitoringFoundation;

export const getExecutiveExecutionMonitoringMetadata = () =>
  ExecutionMonitoringMetadataCatalog;
