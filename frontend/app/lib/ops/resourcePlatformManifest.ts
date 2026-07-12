import { ExecutiveResourceIntelligenceFoundation } from "./resourceIntelligenceIndex.ts";
import {
  ResourceCapabilityRegistry,
  ResourcePlatformMetadata,
} from "./resourceMetadataIndex.ts";
import { buildResourceModelManifest } from "./resourceModelIndex.ts";
import { getResourceValidationSummary } from "./resourceValidationIndex.ts";
import {
  ResourcePlatformDependencyMap,
  ResourcePlatformDependencyMapMetadata,
} from "./resourcePlatformDependencyMap.ts";
import type { ResourcePlatformManifestDescriptor } from "./resourcePlatformManifestTypes.ts";
import {
  ResourcePlatformPhaseRegistry,
  ResourcePlatformPhaseRegistryMetadata,
} from "./resourcePlatformPhaseRegistry.ts";
import {
  ResourcePlatformPublicSurface,
  ResourcePlatformPublicSurfaceMetadata,
} from "./resourcePlatformPublicSurface.ts";

export const buildResourcePlatformManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveResourceIntelligenceFoundation.identity,
    foundation: ExecutiveResourceIntelligenceFoundation,
    consumedPhases: Object.freeze(
      ResourcePlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: ResourcePlatformPhaseRegistry,
    phaseRegistryMetadata: ResourcePlatformPhaseRegistryMetadata,
    dependencyMap: ResourcePlatformDependencyMap,
    dependencyMapMetadata: ResourcePlatformDependencyMapMetadata,
    publicApiSurface: ResourcePlatformPublicSurface,
    publicApiSurfaceMetadata: ResourcePlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      capabilityCount: ResourceCapabilityRegistry.length,
      capabilityNames: Object.freeze(
        ResourceCapabilityRegistry.map((capability) => capability.name),
      ),
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      supportedCategoryCount:
        buildResourceModelManifest().models.identity.supportedCategories.length,
      capacityDescriptorCount: buildResourceModelManifest().models.capacity.length,
      availabilityDescriptorCount: buildResourceModelManifest().models.availability.length,
      dependencyDescriptorCount: buildResourceModelManifest().models.dependency.length,
      executionReadinessDescriptorCount:
        buildResourceModelManifest().models.linkage.executionReadinessSupport.length,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getResourceValidationSummary(),
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildResourceModelManifest().models.linkage.linkedTasks.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildResourceModelManifest().models.linkage.linkedWorkflows.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    projectCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildResourceModelManifest().models.linkage.linkedProjects.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    compatibilityVersion: ResourcePlatformMetadata.compatibilityVersion,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getResourceValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    descriptor: Object.freeze({
      platformId: ResourcePlatformMetadata.platformId,
      platformName: ExecutiveResourceIntelligenceFoundation.identity.platformName,
      platformVersion: ExecutiveResourceIntelligenceFoundation.identity.platformVersion,
      compatibilityVersion: ResourcePlatformMetadata.compatibilityVersion,
      releaseReadiness:
        getResourceValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ResourcePlatformManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
