import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionFoundation } from "./projectExecutionIndex.ts";
import {
  ProjectCapabilityRegistry,
  ProjectCapabilityRegistryMetadata,
} from "./projectCapabilityRegistry.ts";
import {
  ProjectConsumerRegistry,
  ProjectConsumerRegistryMetadata,
} from "./projectConsumerRegistry.ts";
import {
  ProjectDependencyRegistry,
  ProjectDependencyRegistryMetadata,
} from "./projectDependencyRegistry.ts";
import {
  ProjectPlatformMetadata,
  ProjectSupportedDomains,
} from "./projectMetadata.ts";
import { buildProjectMetadataManifest } from "./projectMetadataManifest.ts";
import {
  ProjectPublicApiRegistry,
  ProjectPublicApiRegistryMetadata,
} from "./projectPublicApiRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "project-metadata-completeness",
      name: "Metadata Completeness",
      status:
        ProjectPlatformMetadata.supportedProjectDomains.length === 8 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-registry-integrity",
      name: "Registry Integrity",
      status:
        ProjectCapabilityRegistry.length === ProjectCapabilityRegistryMetadata.capabilityCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-dependency-consistency",
      name: "Dependency Consistency",
      status:
        ProjectDependencyRegistry.length === ProjectDependencyRegistryMetadata.dependencyCount &&
        ProjectDependencyRegistry.every(
          (entry) => entry.dependencyMode === "MetadataOnly",
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-consumer-registry-integrity",
      name: "Consumer Registry Integrity",
      status:
        ProjectConsumerRegistry.length === ProjectConsumerRegistryMetadata.consumerCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-public-api-registry-integrity",
      name: "Public API Registry Integrity",
      status:
        ProjectPublicApiRegistry.length === ProjectPublicApiRegistryMetadata.exportedApiCount &&
        ProjectPublicApiRegistry.length >= 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-generation",
      name: "Manifest Generation",
      status:
        Object.isFrozen(buildProjectMetadataManifest()) &&
        buildProjectMetadataManifest().metadata.supportedProjectDomains.length ===
          ProjectSupportedDomains.length
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ExecutiveProjectExecutionFoundation) &&
        Object.isFrozen(ProjectPlatformMetadata) &&
        Object.isFrozen(ProjectCapabilityRegistry) &&
        Object.isFrozen(ProjectPublicApiRegistry)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-ops-2-compatibility",
      name: "OPS-2 Compatibility",
      status:
        ExecutiveProjectExecutionFoundation.identity.dependencySources.includes(
          ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-ops-3-compatibility",
      name: "OPS-3 Compatibility",
      status:
        ExecutiveProjectExecutionFoundation.identity.dependencySources.includes(
          ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateProjectMetadata = () => {
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

