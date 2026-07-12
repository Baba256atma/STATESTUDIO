import type { SchedulingPlatformPublicSurfaceEntry } from "./schedulingPlatformManifestTypes.ts";

export const SchedulingPlatformPublicSurface = Object.freeze([
  Object.freeze({
    exportName: "ExecutiveSchedulingIntelligenceFoundation",
    phaseId: "OPS-6:1",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildSchedulingIntelligenceManifest",
    phaseId: "OPS-6:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateSchedulingIntelligenceFoundation",
    phaseId: "OPS-6:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "SchedulingPlatformMetadata",
    phaseId: "OPS-6:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "SchedulingCapabilityRegistry",
    phaseId: "OPS-6:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildSchedulingMetadataManifest",
    phaseId: "OPS-6:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateSchedulingMetadata",
    phaseId: "OPS-6:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ScheduleIdentityModel",
    phaseId: "OPS-6:3",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildSchedulingModelManifest",
    phaseId: "OPS-6:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateSchedulingModel",
    phaseId: "OPS-6:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildSchedulingValidationManifest",
    phaseId: "OPS-6:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "runSchedulingValidation",
    phaseId: "OPS-6:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "SchedulingValidationEntry",
    phaseId: "OPS-6:4",
    exportKind: "TypeGroup",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPublicSurfaceEntry),
] as const);

export const SchedulingPlatformPublicSurfaceMetadata = Object.freeze({
  publicSurfaceId: "ops.scheduling-intelligence.platform-public-surface",
  publicSurfaceVersion: "1.0.0",
  exportCount: SchedulingPlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
} as const);
