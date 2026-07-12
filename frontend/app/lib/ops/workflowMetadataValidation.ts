import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligenceFoundation } from "./workflowIntelligenceIndex.ts";
import {
  WorkflowCapabilityRegistry,
  WorkflowCapabilityRegistryMetadata,
} from "./workflowCapabilityRegistry.ts";
import {
  WorkflowConsumerRegistry,
  WorkflowConsumerRegistryMetadata,
} from "./workflowConsumerRegistry.ts";
import {
  WorkflowDependencyRegistry,
  WorkflowDependencyRegistryMetadata,
} from "./workflowDependencyRegistry.ts";
import {
  WorkflowPlatformMetadata,
  WorkflowSupportedDomains,
} from "./workflowMetadata.ts";
import { buildWorkflowMetadataManifest } from "./workflowMetadataManifest.ts";
import {
  WorkflowPublicApiRegistry,
  WorkflowPublicApiRegistryMetadata,
} from "./workflowPublicApiRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "workflow-metadata-completeness",
      name: "Metadata Completeness",
      status:
        WorkflowPlatformMetadata.supportedWorkflowDomains.length === 8 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-registry-integrity",
      name: "Registry Integrity",
      status:
        WorkflowCapabilityRegistry.length === WorkflowCapabilityRegistryMetadata.capabilityCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-dependency-consistency",
      name: "Dependency Consistency",
      status:
        WorkflowDependencyRegistry.length === WorkflowDependencyRegistryMetadata.dependencyCount &&
        WorkflowDependencyRegistry.every(
          (entry) => entry.dependencyMode === "MetadataOnly",
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-consumer-registry-integrity",
      name: "Consumer Registry Integrity",
      status:
        WorkflowConsumerRegistry.length === WorkflowConsumerRegistryMetadata.consumerCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-public-api-registry-integrity",
      name: "Public API Registry Integrity",
      status:
        WorkflowPublicApiRegistry.length === WorkflowPublicApiRegistryMetadata.exportedApiCount &&
        WorkflowPublicApiRegistry.length >= 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-generation",
      name: "Manifest Generation",
      status:
        Object.isFrozen(buildWorkflowMetadataManifest()) &&
        buildWorkflowMetadataManifest().metadata.supportedWorkflowDomains.length ===
          WorkflowSupportedDomains.length
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ExecutiveWorkflowIntelligenceFoundation) &&
        Object.isFrozen(WorkflowPlatformMetadata) &&
        Object.isFrozen(WorkflowCapabilityRegistry) &&
        Object.isFrozen(WorkflowPublicApiRegistry)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-ops-2-dependency-compatibility",
      name: "OPS-2 Dependency Compatibility",
      status:
        WorkflowPlatformMetadata.dependencySources.includes(
          ExecutiveTaskIntelligencePublicIndexId,
        ) &&
        ExecutiveWorkflowIntelligenceFoundation.registry.taskIntelligenceDependency
          .dependencyPhase === ExecutiveTaskIntelligencePublicIndexId
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateWorkflowMetadata = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
