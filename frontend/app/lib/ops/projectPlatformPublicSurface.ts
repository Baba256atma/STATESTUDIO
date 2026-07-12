import type { ProjectPlatformPublicSurfaceEntry } from "./projectPlatformManifestTypes.ts";

export const ProjectPlatformPublicSurface = Object.freeze([
  Object.freeze({
    exportName: "ExecutiveProjectExecutionFoundation",
    phaseId: "OPS-4:1",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildProjectExecutionManifest",
    phaseId: "OPS-4:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateProjectExecutionFoundation",
    phaseId: "OPS-4:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ProjectPlatformMetadata",
    phaseId: "OPS-4:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ProjectCapabilityRegistry",
    phaseId: "OPS-4:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildProjectMetadataManifest",
    phaseId: "OPS-4:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateProjectMetadata",
    phaseId: "OPS-4:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ProjectIdentityModel",
    phaseId: "OPS-4:3",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildProjectModelManifest",
    phaseId: "OPS-4:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateProjectModel",
    phaseId: "OPS-4:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildProjectValidationManifest",
    phaseId: "OPS-4:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "runProjectValidation",
    phaseId: "OPS-4:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ProjectValidationEntry",
    phaseId: "OPS-4:4",
    exportKind: "TypeGroup",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPublicSurfaceEntry),
] as const);

export const ProjectPlatformPublicSurfaceMetadata = Object.freeze({
  publicSurfaceId: "ops.project-execution.platform-public-surface",
  publicSurfaceVersion: "1.0.0",
  exportCount: ProjectPlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
} as const);

