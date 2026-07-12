import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import {
  SchedulingCapabilityRegistry,
  SchedulingPlatformMetadata,
} from "./schedulingMetadataIndex.ts";
import { buildSchedulingModelManifest } from "./schedulingModelIndex.ts";
import { getSchedulingValidationSummary } from "./schedulingValidationIndex.ts";
import {
  SchedulingPlatformDependencyMap,
  SchedulingPlatformDependencyMapMetadata,
} from "./schedulingPlatformDependencyMap.ts";
import type { SchedulingPlatformManifestDescriptor } from "./schedulingPlatformManifestTypes.ts";
import {
  SchedulingPlatformPhaseRegistry,
  SchedulingPlatformPhaseRegistryMetadata,
} from "./schedulingPlatformPhaseRegistry.ts";
import {
  SchedulingPlatformPublicSurface,
  SchedulingPlatformPublicSurfaceMetadata,
} from "./schedulingPlatformPublicSurface.ts";

export const buildSchedulingPlatformManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveSchedulingIntelligenceFoundation.identity,
    foundation: ExecutiveSchedulingIntelligenceFoundation,
    consumedPhases: Object.freeze(
      SchedulingPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: SchedulingPlatformPhaseRegistry,
    phaseRegistryMetadata: SchedulingPlatformPhaseRegistryMetadata,
    dependencyMap: SchedulingPlatformDependencyMap,
    dependencyMapMetadata: SchedulingPlatformDependencyMapMetadata,
    publicApiSurface: SchedulingPlatformPublicSurface,
    publicApiSurfaceMetadata: SchedulingPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      capabilityCount: SchedulingCapabilityRegistry.length,
      capabilityNames: Object.freeze(
        SchedulingCapabilityRegistry.map((capability) => capability.name),
      ),
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      supportedCategoryCount:
        buildSchedulingModelManifest().models.identity.supportedCategories.length,
      timelineDescriptorCount: buildSchedulingModelManifest().models.timeline.length,
      calendarDescriptorCount: buildSchedulingModelManifest().models.calendar.length,
      executionWindowDescriptorCount:
        buildSchedulingModelManifest().models.executionWindow.length,
      constraintDescriptorCount: buildSchedulingModelManifest().models.constraint.length,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getSchedulingValidationSummary(),
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildSchedulingModelManifest().models.taskLink.linkedEntities.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildSchedulingModelManifest().models.workflowLink.linkedEntities.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    projectCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildSchedulingModelManifest().models.projectLink.linkedEntities.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    resourceCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        buildSchedulingModelManifest().models.resourceLink.linkedEntities.length >= 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    compatibilityVersion: SchedulingPlatformMetadata.compatibilityVersion,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getSchedulingValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    descriptor: Object.freeze({
      platformId: SchedulingPlatformMetadata.platformId,
      platformName: ExecutiveSchedulingIntelligenceFoundation.identity.platformName,
      platformVersion: ExecutiveSchedulingIntelligenceFoundation.identity.platformVersion,
      compatibilityVersion: SchedulingPlatformMetadata.compatibilityVersion,
      releaseReadiness:
        getSchedulingValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies SchedulingPlatformManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
