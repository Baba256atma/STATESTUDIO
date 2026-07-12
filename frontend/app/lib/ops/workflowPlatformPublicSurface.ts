import type { WorkflowPlatformPublicSurfaceEntry } from "./workflowPlatformManifestTypes.ts";

export const WorkflowPlatformPublicSurface = Object.freeze([
  Object.freeze({
    exportName: "ExecutiveWorkflowIntelligenceFoundation",
    phaseId: "OPS-3:1",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildWorkflowIntelligenceManifest",
    phaseId: "OPS-3:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateWorkflowIntelligenceFoundation",
    phaseId: "OPS-3:1",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "WorkflowPlatformMetadata",
    phaseId: "OPS-3:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "WorkflowCapabilityRegistry",
    phaseId: "OPS-3:2",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildWorkflowMetadataManifest",
    phaseId: "OPS-3:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateWorkflowMetadata",
    phaseId: "OPS-3:2",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "WorkflowIdentityModel",
    phaseId: "OPS-3:3",
    exportKind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildWorkflowModelManifest",
    phaseId: "OPS-3:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "validateWorkflowModel",
    phaseId: "OPS-3:3",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "buildWorkflowValidationManifest",
    phaseId: "OPS-3:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "runWorkflowValidation",
    phaseId: "OPS-3:4",
    exportKind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
  Object.freeze({
    exportName: "WorkflowValidationEntry",
    phaseId: "OPS-3:4",
    exportKind: "TypeGroup",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPublicSurfaceEntry),
] as const);

export const WorkflowPlatformPublicSurfaceMetadata = Object.freeze({
  publicSurfaceId: "ops.workflow-intelligence.platform-public-surface",
  publicSurfaceVersion: "1.0.0",
  exportCount: WorkflowPlatformPublicSurface.length,
  metadataOnly: true,
  immutable: true,
} as const);
