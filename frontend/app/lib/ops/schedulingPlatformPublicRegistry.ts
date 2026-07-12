import type { SchedulingPlatformIndexRegistryEntry } from "./schedulingPlatformIndexTypes.ts";

const foundationApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveSchedulingIntelligenceFoundation",
    phaseId: "OPS-6:1",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildSchedulingIntelligenceManifest",
    phaseId: "OPS-6:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateSchedulingIntelligenceFoundation",
    phaseId: "OPS-6:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
]);

const metadataApis = Object.freeze([
  Object.freeze({
    name: "SchedulingPlatformMetadata",
    phaseId: "OPS-6:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "SchedulingCapabilityRegistry",
    phaseId: "OPS-6:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildSchedulingMetadataManifest",
    phaseId: "OPS-6:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateSchedulingMetadata",
    phaseId: "OPS-6:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
]);

const modelApis = Object.freeze([
  Object.freeze({
    name: "ScheduleIdentityModel",
    phaseId: "OPS-6:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ScheduleTimelineModel",
    phaseId: "OPS-6:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildSchedulingModelManifest",
    phaseId: "OPS-6:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateSchedulingModel",
    phaseId: "OPS-6:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
]);

const validationApis = Object.freeze([
  Object.freeze({
    name: "buildSchedulingValidationManifest",
    phaseId: "OPS-6:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "runSchedulingValidation",
    phaseId: "OPS-6:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "getSchedulingValidationSummary",
    phaseId: "OPS-6:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
]);

const manifestApis = Object.freeze([
  Object.freeze({
    name: "buildSchedulingPlatformManifest",
    phaseId: "OPS-6:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "SchedulingPlatformPhaseRegistry",
    phaseId: "OPS-6:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "SchedulingPlatformPublicSurface",
    phaseId: "OPS-6:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateSchedulingPlatformManifest",
    phaseId: "OPS-6:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
]);

const platformIndexApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveSchedulingPlatform",
    phaseId: "OPS-6:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveSchedulingPlatformPublicRegistry",
    phaseId: "OPS-6:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveSchedulingPlatformReleaseSummary",
    phaseId: "OPS-6:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateSchedulingPlatformIndex",
    phaseId: "OPS-6:6",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformIndexRegistryEntry),
]);

const allExports = Object.freeze([
  ...foundationApis,
  ...metadataApis,
  ...modelApis,
  ...validationApis,
  ...manifestApis,
  ...platformIndexApis,
]);

export const ExecutiveSchedulingPlatformPublicRegistry = Object.freeze({
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
