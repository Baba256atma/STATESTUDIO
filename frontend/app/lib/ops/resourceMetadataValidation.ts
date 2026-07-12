import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligenceFoundation } from "./resourceIntelligenceIndex.ts";
import {
  ResourceCapabilityRegistry,
  ResourceCapabilityRegistryMetadata,
} from "./resourceCapabilityRegistry.ts";
import {
  ResourceConsumerRegistry,
  ResourceConsumerRegistryMetadata,
} from "./resourceConsumerRegistry.ts";
import {
  ResourceDependencyRegistry,
  ResourceDependencyRegistryMetadata,
} from "./resourceDependencyRegistry.ts";
import {
  ResourcePlatformMetadata,
  ResourceSupportedDomains,
} from "./resourceMetadata.ts";
import { buildResourceMetadataManifest } from "./resourceMetadataManifest.ts";
import {
  ResourcePublicApiRegistry,
  ResourcePublicApiRegistryMetadata,
} from "./resourcePublicApiRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "resource-metadata-completeness",
      name: "Metadata Completeness",
      status:
        ResourcePlatformMetadata.supportedResourceDomains.length === 16 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-registry-integrity",
      name: "Registry Integrity",
      status:
        ResourceCapabilityRegistry.length === ResourceCapabilityRegistryMetadata.capabilityCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-dependency-consistency",
      name: "Dependency Consistency",
      status:
        ResourceDependencyRegistry.length === ResourceDependencyRegistryMetadata.dependencyCount &&
        ResourceDependencyRegistry.every(
          (entry) => entry.dependencyMode === "MetadataOnly",
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-consumer-registry-integrity",
      name: "Consumer Registry Integrity",
      status:
        ResourceConsumerRegistry.length === ResourceConsumerRegistryMetadata.consumerCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-public-api-registry-integrity",
      name: "Public API Registry Integrity",
      status:
        ResourcePublicApiRegistry.length === ResourcePublicApiRegistryMetadata.exportedApiCount &&
        ResourcePublicApiRegistry.length >= 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-generation",
      name: "Manifest Generation",
      status:
        Object.isFrozen(buildResourceMetadataManifest()) &&
        buildResourceMetadataManifest().metadata.supportedResourceDomains.length ===
          ResourceSupportedDomains.length
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ExecutiveResourceIntelligenceFoundation) &&
        Object.isFrozen(ResourcePlatformMetadata) &&
        Object.isFrozen(ResourceCapabilityRegistry) &&
        Object.isFrozen(ResourcePublicApiRegistry)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-ops-2-compatibility",
      name: "OPS-2 Compatibility",
      status:
        ExecutiveResourceIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-ops-3-compatibility",
      name: "OPS-3 Compatibility",
      status:
        ExecutiveResourceIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-ops-4-compatibility",
      name: "OPS-4 Compatibility",
      status:
        ExecutiveResourceIntelligenceFoundation.identity.dependencySources.includes(
          ExecutiveProjectExecutionPublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateResourceMetadata = () => {
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

