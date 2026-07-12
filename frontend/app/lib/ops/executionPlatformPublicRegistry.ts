import type { ExecutionPlatformIndexRegistryEntry } from "./executionPlatformIndexTypes.ts";

const foundationApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveExecutionFoundation",
    phaseId: "OPS-1:1",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildExecutionManifest",
    phaseId: "OPS-1:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateExecutionFoundation",
    phaseId: "OPS-1:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
]);

const metadataApis = Object.freeze([
  Object.freeze({
    name: "ExecutionPlatformMetadata",
    phaseId: "OPS-1:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutionCapabilityRegistry",
    phaseId: "OPS-1:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildExecutionMetadataManifest",
    phaseId: "OPS-1:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateExecutionMetadata",
    phaseId: "OPS-1:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
]);

const modelApis = Object.freeze([
  Object.freeze({
    name: "ExecutionTaskModel",
    phaseId: "OPS-1:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutionWorkflowModel",
    phaseId: "OPS-1:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildExecutionModelManifest",
    phaseId: "OPS-1:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateExecutionModel",
    phaseId: "OPS-1:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
]);

const validationApis = Object.freeze([
  Object.freeze({
    name: "buildExecutionValidationManifest",
    phaseId: "OPS-1:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "runExecutionValidation",
    phaseId: "OPS-1:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "getExecutionValidationSummary",
    phaseId: "OPS-1:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
]);

const manifestApis = Object.freeze([
  Object.freeze({
    name: "buildExecutionPlatformManifest",
    phaseId: "OPS-1:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutionPlatformPhaseRegistry",
    phaseId: "OPS-1:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutionPlatformPublicSurface",
    phaseId: "OPS-1:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateExecutionPlatformManifest",
    phaseId: "OPS-1:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
]);

const platformIndexApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveOperationsPlatform",
    phaseId: "OPS-1:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveOperationsPlatformPublicRegistry",
    phaseId: "OPS-1:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveOperationsPlatformReleaseSummary",
    phaseId: "OPS-1:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateExecutionPlatformIndex",
    phaseId: "OPS-1:6",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformIndexRegistryEntry),
]);

const allExports = Object.freeze([
  ...foundationApis,
  ...metadataApis,
  ...modelApis,
  ...validationApis,
  ...manifestApis,
  ...platformIndexApis,
]);

export const ExecutiveOperationsPlatformPublicRegistry = Object.freeze({
  foundationApis,
  metadataApis,
  modelApis,
  validationApis,
  manifestApis,
  platformIndexApis,
  allExports,
  totalExportCount: allExports.length,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
