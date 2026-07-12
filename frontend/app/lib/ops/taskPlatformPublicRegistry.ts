import type { TaskPlatformIndexRegistryEntry } from "./taskPlatformIndexTypes.ts";

const foundationApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveTaskIntelligenceFoundation",
    phaseId: "OPS-2:1",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildTaskIntelligenceManifest",
    phaseId: "OPS-2:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateTaskIntelligenceFoundation",
    phaseId: "OPS-2:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
]);

const metadataApis = Object.freeze([
  Object.freeze({
    name: "TaskPlatformMetadata",
    phaseId: "OPS-2:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "TaskCapabilityRegistry",
    phaseId: "OPS-2:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildTaskMetadataManifest",
    phaseId: "OPS-2:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateTaskMetadata",
    phaseId: "OPS-2:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
]);

const modelApis = Object.freeze([
  Object.freeze({
    name: "TaskIdentityModel",
    phaseId: "OPS-2:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "TaskLifecycleModel",
    phaseId: "OPS-2:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildTaskModelManifest",
    phaseId: "OPS-2:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateTaskModel",
    phaseId: "OPS-2:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
]);

const validationApis = Object.freeze([
  Object.freeze({
    name: "buildTaskValidationManifest",
    phaseId: "OPS-2:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "runTaskValidation",
    phaseId: "OPS-2:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "getTaskValidationSummary",
    phaseId: "OPS-2:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
]);

const manifestApis = Object.freeze([
  Object.freeze({
    name: "buildTaskPlatformManifest",
    phaseId: "OPS-2:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "TaskPlatformPhaseRegistry",
    phaseId: "OPS-2:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "TaskPlatformPublicSurface",
    phaseId: "OPS-2:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateTaskPlatformManifest",
    phaseId: "OPS-2:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
]);

const platformIndexApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveTaskIntelligencePlatform",
    phaseId: "OPS-2:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveTaskIntelligencePlatformPublicRegistry",
    phaseId: "OPS-2:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveTaskIntelligencePlatformReleaseSummary",
    phaseId: "OPS-2:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateTaskPlatformIndex",
    phaseId: "OPS-2:6",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformIndexRegistryEntry),
]);

const allExports = Object.freeze([
  ...foundationApis,
  ...metadataApis,
  ...modelApis,
  ...validationApis,
  ...manifestApis,
  ...platformIndexApis,
]);

export const ExecutiveTaskIntelligencePlatformPublicRegistry = Object.freeze({
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
