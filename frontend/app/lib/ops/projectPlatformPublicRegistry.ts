import type { ProjectPlatformIndexRegistryEntry } from "./projectPlatformIndexTypes.ts";

const foundationApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveProjectExecutionFoundation",
    phaseId: "OPS-4:1",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildProjectExecutionManifest",
    phaseId: "OPS-4:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateProjectExecutionFoundation",
    phaseId: "OPS-4:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
]);

const metadataApis = Object.freeze([
  Object.freeze({
    name: "ProjectPlatformMetadata",
    phaseId: "OPS-4:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ProjectCapabilityRegistry",
    phaseId: "OPS-4:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildProjectMetadataManifest",
    phaseId: "OPS-4:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateProjectMetadata",
    phaseId: "OPS-4:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
]);

const modelApis = Object.freeze([
  Object.freeze({
    name: "ProjectIdentityModel",
    phaseId: "OPS-4:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ProjectLifecycleModel",
    phaseId: "OPS-4:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildProjectModelManifest",
    phaseId: "OPS-4:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateProjectModel",
    phaseId: "OPS-4:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
]);

const validationApis = Object.freeze([
  Object.freeze({
    name: "buildProjectValidationManifest",
    phaseId: "OPS-4:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "runProjectValidation",
    phaseId: "OPS-4:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "getProjectValidationSummary",
    phaseId: "OPS-4:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
]);

const manifestApis = Object.freeze([
  Object.freeze({
    name: "buildProjectPlatformManifest",
    phaseId: "OPS-4:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ProjectPlatformPhaseRegistry",
    phaseId: "OPS-4:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ProjectPlatformPublicSurface",
    phaseId: "OPS-4:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateProjectPlatformManifest",
    phaseId: "OPS-4:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
]);

const platformIndexApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveProjectExecutionPlatform",
    phaseId: "OPS-4:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveProjectExecutionPlatformPublicRegistry",
    phaseId: "OPS-4:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveProjectExecutionPlatformReleaseSummary",
    phaseId: "OPS-4:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateProjectPlatformIndex",
    phaseId: "OPS-4:6",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformIndexRegistryEntry),
]);

const allExports = Object.freeze([
  ...foundationApis,
  ...metadataApis,
  ...modelApis,
  ...validationApis,
  ...manifestApis,
  ...platformIndexApis,
]);

export const ExecutiveProjectExecutionPlatformPublicRegistry = Object.freeze({
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

