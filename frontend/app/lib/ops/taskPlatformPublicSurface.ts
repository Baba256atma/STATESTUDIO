import type { TaskPlatformPublicSurfaceEntry } from "./taskPlatformManifestTypes.ts";

export const TaskPlatformPublicSurface = Object.freeze([
  Object.freeze({
    exportName: "ExecutiveTaskIntelligenceFoundation",
    phaseId: "OPS-2:1",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildTaskIntelligenceManifest",
    phaseId: "OPS-2:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateTaskIntelligenceFoundation",
    phaseId: "OPS-2:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "TaskPlatformMetadata",
    phaseId: "OPS-2:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "TaskCapabilityRegistry",
    phaseId: "OPS-2:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildTaskMetadataManifest",
    phaseId: "OPS-2:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateTaskMetadata",
    phaseId: "OPS-2:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "TaskIdentityModel",
    phaseId: "OPS-2:3",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildTaskModelManifest",
    phaseId: "OPS-2:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateTaskModel",
    phaseId: "OPS-2:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildTaskValidationManifest",
    phaseId: "OPS-2:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "runTaskValidation",
    phaseId: "OPS-2:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "TaskValidationEntry",
    phaseId: "OPS-2:4",
    exportKind: "TypeGroup",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies TaskPlatformPublicSurfaceEntry),
] as const);

export const TaskPlatformPublicSurfaceMetadata = Object.freeze({
  publicSurfaceId: "ops.task-intelligence.platform-public-surface",
  publicSurfaceVersion: "1.0.0",
  exportCount: TaskPlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
} as const);
