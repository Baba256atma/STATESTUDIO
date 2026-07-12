import type { ExecutionPlatformPublicSurfaceEntry } from "./executionPlatformManifestTypes.ts";

export const ExecutionPlatformPublicSurface = Object.freeze([
  Object.freeze({
    exportName: "ExecutiveExecutionFoundation",
    phaseId: "OPS-1:1",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildExecutionManifest",
    phaseId: "OPS-1:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateExecutionFoundation",
    phaseId: "OPS-1:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ExecutionPlatformMetadata",
    phaseId: "OPS-1:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ExecutionCapabilityRegistry",
    phaseId: "OPS-1:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildExecutionMetadataManifest",
    phaseId: "OPS-1:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateExecutionMetadata",
    phaseId: "OPS-1:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ExecutionTaskModel",
    phaseId: "OPS-1:3",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildExecutionModelManifest",
    phaseId: "OPS-1:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateExecutionModel",
    phaseId: "OPS-1:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildExecutionValidationManifest",
    phaseId: "OPS-1:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "runExecutionValidation",
    phaseId: "OPS-1:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "ExecutionValidationEntry",
    phaseId: "OPS-1:4",
    exportKind: "TypeGroup",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPublicSurfaceEntry),
] as const);

export const ExecutionPlatformPublicSurfaceMetadata = Object.freeze({
  publicSurfaceId: "ops.execution.platform-public-surface",
  publicSurfaceVersion: "1.0.0",
  exportCount: ExecutionPlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
} as const);
