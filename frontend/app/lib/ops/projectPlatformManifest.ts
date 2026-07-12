import { ExecutiveProjectExecutionFoundation } from "./projectExecutionIndex.ts";
import {
  ProjectCapabilityRegistry,
  ProjectPlatformMetadata,
} from "./projectMetadataIndex.ts";
import { buildProjectModelManifest } from "./projectModelIndex.ts";
import { getProjectValidationSummary } from "./projectValidationIndex.ts";
import {
  ProjectPlatformDependencyMap,
  ProjectPlatformDependencyMapMetadata,
} from "./projectPlatformDependencyMap.ts";
import type { ProjectPlatformManifestDescriptor } from "./projectPlatformManifestTypes.ts";
import {
  ProjectPlatformPhaseRegistry,
  ProjectPlatformPhaseRegistryMetadata,
} from "./projectPlatformPhaseRegistry.ts";
import {
  ProjectPlatformPublicSurface,
  ProjectPlatformPublicSurfaceMetadata,
} from "./projectPlatformPublicSurface.ts";

export const buildProjectPlatformManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveProjectExecutionFoundation.identity,
    foundation: ExecutiveProjectExecutionFoundation,
    consumedPhases: Object.freeze(
      ProjectPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: ProjectPlatformPhaseRegistry,
    phaseRegistryMetadata: ProjectPlatformPhaseRegistryMetadata,
    dependencyMap: ProjectPlatformDependencyMap,
    dependencyMapMetadata: ProjectPlatformDependencyMapMetadata,
    publicApiSurface: ProjectPlatformPublicSurface,
    publicApiSurfaceMetadata: ProjectPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      capabilityCount: ProjectCapabilityRegistry.length,
      capabilityNames: Object.freeze(
        ProjectCapabilityRegistry.map((capability) => capability.name),
      ),
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      lifecycleStageCount: buildProjectModelManifest().models.lifecycle.lifecycleStages.length,
      phaseDescriptorCount: buildProjectModelManifest().models.phase.length,
      milestoneDescriptorCount: buildProjectModelManifest().models.milestone.length,
      portfolioLinkageCount: buildProjectModelManifest().models.portfolio.length,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getProjectValidationSummary(),
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildProjectModelManifest().models.workflowReference
          .workflowCompatibilityMetadata.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildProjectModelManifest().models.taskReference.taskCompatibility.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    compatibilityVersion: ProjectPlatformMetadata.compatibilityVersion,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getProjectValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    descriptor: Object.freeze({
      platformId: ProjectPlatformMetadata.platformId,
      platformName: ExecutiveProjectExecutionFoundation.identity.platformName,
      platformVersion: ExecutiveProjectExecutionFoundation.identity.platformVersion,
      compatibilityVersion: ProjectPlatformMetadata.compatibilityVersion,
      releaseReadiness:
        getProjectValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ProjectPlatformManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

