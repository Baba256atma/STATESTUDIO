import {
  WorkflowCapabilityRegistry,
  WorkflowConsumerRegistry,
  WorkflowDependencyRegistry,
  WorkflowPlatformMetadata,
  buildWorkflowMetadataManifest,
  validateWorkflowMetadata,
} from "./workflowMetadataIndex.ts";
import type { WorkflowValidationEntry } from "./workflowValidationTypes.ts";

export const WorkflowRegistryValidation = Object.freeze([
  Object.freeze({
    id: "workflow-registry-integrity",
    name: "Metadata Registry Integrity",
    description: "Validates OPS-3:2 workflow metadata registry completeness.",
    category: "Registry",
    status:
      validateWorkflowMetadata().summary.status === "PASS" &&
      WorkflowCapabilityRegistry.length === 8
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-dependency-consistency",
    name: "Dependency Consistency",
    description: "Validates workflow dependency metadata consistency.",
    category: "Dependency",
    status:
      WorkflowDependencyRegistry.every(
        (entry) => entry.dependencyMode === "MetadataOnly",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-consumer-compatibility",
    name: "Consumer Compatibility",
    description: "Validates workflow consumer registry compatibility.",
    category: "Consumer",
    status:
      WorkflowConsumerRegistry.length === 8 &&
      WorkflowPlatformMetadata.compatibilityVersion === "1.0.0"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-registry-manifest-generation",
    name: "Registry Manifest Generation",
    description: "Validates deterministic OPS-3:2 metadata manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildWorkflowMetadataManifest()) &&
      buildWorkflowMetadataManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
] as const);
