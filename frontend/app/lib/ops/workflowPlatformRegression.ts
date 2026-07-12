import type { WorkflowPlatformRegressionEntry } from "./workflowPlatformFreezeTypes.ts";

export const WorkflowPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "workflow-reg-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Workflow foundation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Workflow registry and metadata public surfaces remain stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Workflow model public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Workflow validation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Workflow manifest public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-platform-index-stability",
    scope: "Platform Index",
    stabilityStatus: "Stable",
    description: "Workflow platform index public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Workflow certification public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-compatibility-stability",
    scope: "Workflow Compatibility",
    stabilityStatus: "Stable",
    description: "Workflow compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-task-compatibility-stability",
    scope: "Task Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-2 task compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
  Object.freeze({
    id: "workflow-reg-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Workflow public API surface remains stable and frozen.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformRegressionEntry),
] as const);

export const WorkflowPlatformRegressionMetadataSummary = Object.freeze({
  regressionId: "ops.workflow.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: WorkflowPlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);
