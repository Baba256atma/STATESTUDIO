import type { ResourcePlatformIndexRegistryEntry } from "./resourcePlatformIndexTypes.ts";

const foundationApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveResourceIntelligenceFoundation",
    phaseId: "OPS-5:1",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildResourceIntelligenceManifest",
    phaseId: "OPS-5:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateResourceIntelligenceFoundation",
    phaseId: "OPS-5:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
]);

const metadataApis = Object.freeze([
  Object.freeze({
    name: "ResourcePlatformMetadata",
    phaseId: "OPS-5:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "ResourceCapabilityRegistry",
    phaseId: "OPS-5:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildResourceMetadataManifest",
    phaseId: "OPS-5:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateResourceMetadata",
    phaseId: "OPS-5:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
]);

const modelApis = Object.freeze([
  Object.freeze({
    name: "ResourceIdentityModel",
    phaseId: "OPS-5:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "ResourceCapacityModel",
    phaseId: "OPS-5:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildResourceModelManifest",
    phaseId: "OPS-5:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateResourceModel",
    phaseId: "OPS-5:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
]);

const validationApis = Object.freeze([
  Object.freeze({
    name: "buildResourceValidationManifest",
    phaseId: "OPS-5:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "runResourceValidation",
    phaseId: "OPS-5:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "getResourceValidationSummary",
    phaseId: "OPS-5:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
]);

const manifestApis = Object.freeze([
  Object.freeze({
    name: "buildResourcePlatformManifest",
    phaseId: "OPS-5:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "ResourcePlatformPhaseRegistry",
    phaseId: "OPS-5:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "ResourcePlatformPublicSurface",
    phaseId: "OPS-5:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateResourcePlatformManifest",
    phaseId: "OPS-5:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
]);

const platformIndexApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveResourceIntelligencePlatform",
    phaseId: "OPS-5:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveResourceIntelligencePlatformPublicRegistry",
    phaseId: "OPS-5:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveResourceIntelligencePlatformReleaseSummary",
    phaseId: "OPS-5:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateResourcePlatformIndex",
    phaseId: "OPS-5:6",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformIndexRegistryEntry),
]);

const allExports = Object.freeze([
  ...foundationApis,
  ...metadataApis,
  ...modelApis,
  ...validationApis,
  ...manifestApis,
  ...platformIndexApis,
]);

export const ExecutiveResourceIntelligencePlatformPublicRegistry = Object.freeze({
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
