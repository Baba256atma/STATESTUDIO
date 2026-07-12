import type { ResourcePlatformPublicSurfaceEntry } from "./resourcePlatformManifestTypes.ts";

export const ResourcePlatformPublicSurface = Object.freeze([
  Object.freeze({
    exportName: "ExecutiveResourceIntelligenceFoundation",
    phaseId: "OPS-5:1",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildResourceIntelligenceManifest",
    phaseId: "OPS-5:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateResourceIntelligenceFoundation",
    phaseId: "OPS-5:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ResourcePlatformMetadata",
    phaseId: "OPS-5:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ResourceCapabilityRegistry",
    phaseId: "OPS-5:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildResourceMetadataManifest",
    phaseId: "OPS-5:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateResourceMetadata",
    phaseId: "OPS-5:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ResourceIdentityModel",
    phaseId: "OPS-5:3",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildResourceModelManifest",
    phaseId: "OPS-5:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateResourceModel",
    phaseId: "OPS-5:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildResourceValidationManifest",
    phaseId: "OPS-5:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "runResourceValidation",
    phaseId: "OPS-5:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ResourceValidationEntry",
    phaseId: "OPS-5:4",
    exportKind: "TypeGroup",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPublicSurfaceEntry),
] as const);

export const ResourcePlatformPublicSurfaceMetadata = Object.freeze({
  publicSurfaceId: "ops.resource-intelligence.platform-public-surface",
  publicSurfaceVersion: "1.0.0",
  exportCount: ResourcePlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
} as const);
