import { ExecutiveTaskIntelligenceFoundation } from "./taskIntelligenceIndex.ts";
import {
  TaskCapabilityRegistry,
  TaskPlatformMetadata,
} from "./taskMetadataIndex.ts";
import { buildTaskModelManifest } from "./taskModelIndex.ts";
import { getTaskValidationSummary } from "./taskValidationIndex.ts";
import {
  TaskPlatformDependencyMap,
  TaskPlatformDependencyMapMetadata,
} from "./taskPlatformDependencyMap.ts";
import type { TaskPlatformManifestDescriptor } from "./taskPlatformManifestTypes.ts";
import {
  TaskPlatformPhaseRegistry,
  TaskPlatformPhaseRegistryMetadata,
} from "./taskPlatformPhaseRegistry.ts";
import {
  TaskPlatformPublicSurface,
  TaskPlatformPublicSurfaceMetadata,
} from "./taskPlatformPublicSurface.ts";

export const buildTaskPlatformManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveTaskIntelligenceFoundation.identity,
    foundation: ExecutiveTaskIntelligenceFoundation,
    consumedPhases: Object.freeze(
      TaskPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: TaskPlatformPhaseRegistry,
    phaseRegistryMetadata: TaskPlatformPhaseRegistryMetadata,
    dependencyMap: TaskPlatformDependencyMap,
    dependencyMapMetadata: TaskPlatformDependencyMapMetadata,
    publicApiSurface: TaskPlatformPublicSurface,
    publicApiSurfaceMetadata: TaskPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      capabilityCount: TaskCapabilityRegistry.length,
      capabilityNames: Object.freeze(
        TaskCapabilityRegistry.map((capability) => capability.name),
      ),
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      lifecycleStateCount: buildTaskModelManifest().models.lifecycle.length,
      priorityDescriptorCount: buildTaskModelManifest().models.priority.length,
      executionReadinessCount:
        buildTaskModelManifest().models.executionReadiness.length,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getTaskValidationSummary(),
    compatibilityVersion: TaskPlatformMetadata.compatibilityVersion,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getTaskValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    descriptor: Object.freeze({
      platformId: TaskPlatformMetadata.platformId,
      platformName: ExecutiveTaskIntelligenceFoundation.identity.platformName,
      platformVersion: ExecutiveTaskIntelligenceFoundation.identity.platformVersion,
      compatibilityVersion: TaskPlatformMetadata.compatibilityVersion,
      releaseReadiness:
        getTaskValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies TaskPlatformManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
