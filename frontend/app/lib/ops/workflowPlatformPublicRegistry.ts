import type { WorkflowPlatformIndexRegistryEntry } from "./workflowPlatformIndexTypes.ts";

const foundationApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveWorkflowIntelligenceFoundation",
    phaseId: "OPS-3:1",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildWorkflowIntelligenceManifest",
    phaseId: "OPS-3:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateWorkflowIntelligenceFoundation",
    phaseId: "OPS-3:1",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
]);

const metadataApis = Object.freeze([
  Object.freeze({
    name: "WorkflowPlatformMetadata",
    phaseId: "OPS-3:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "WorkflowCapabilityRegistry",
    phaseId: "OPS-3:2",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildWorkflowMetadataManifest",
    phaseId: "OPS-3:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateWorkflowMetadata",
    phaseId: "OPS-3:2",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
]);

const modelApis = Object.freeze([
  Object.freeze({
    name: "WorkflowIdentityModel",
    phaseId: "OPS-3:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "WorkflowStageModel",
    phaseId: "OPS-3:3",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "buildWorkflowModelManifest",
    phaseId: "OPS-3:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateWorkflowModel",
    phaseId: "OPS-3:3",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
]);

const validationApis = Object.freeze([
  Object.freeze({
    name: "buildWorkflowValidationManifest",
    phaseId: "OPS-3:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "runWorkflowValidation",
    phaseId: "OPS-3:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "getWorkflowValidationSummary",
    phaseId: "OPS-3:4",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
]);

const manifestApis = Object.freeze([
  Object.freeze({
    name: "buildWorkflowPlatformManifest",
    phaseId: "OPS-3:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "WorkflowPlatformPhaseRegistry",
    phaseId: "OPS-3:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "WorkflowPlatformPublicSurface",
    phaseId: "OPS-3:5",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateWorkflowPlatformManifest",
    phaseId: "OPS-3:5",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
]);

const platformIndexApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveWorkflowIntelligencePlatform",
    phaseId: "OPS-3:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveWorkflowIntelligencePlatformPublicRegistry",
    phaseId: "OPS-3:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "ExecutiveWorkflowIntelligencePlatformReleaseSummary",
    phaseId: "OPS-3:6",
    kind: "Object",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
  Object.freeze({
    name: "validateWorkflowPlatformIndex",
    phaseId: "OPS-3:6",
    kind: "Function",
    stability: "Stable",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformIndexRegistryEntry),
]);

const allExports = Object.freeze([
  ...foundationApis,
  ...metadataApis,
  ...modelApis,
  ...validationApis,
  ...manifestApis,
  ...platformIndexApis,
]);

export const ExecutiveWorkflowIntelligencePlatformPublicRegistry = Object.freeze({
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
