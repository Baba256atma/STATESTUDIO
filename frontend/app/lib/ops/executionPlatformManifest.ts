import {
  ExecutiveExecutionFoundation,
  ExecutionPlatformIdentity,
} from "./executionIndex.ts";
import {
  ExecutionCapabilityRegistry,
  ExecutionPlatformMetadata,
} from "./executionMetadataIndex.ts";
import { buildExecutionModelManifest } from "./executionModelIndex.ts";
import { getExecutionValidationSummary } from "./executionValidationIndex.ts";
import {
  ExecutionPlatformDependencyMap,
  ExecutionPlatformDependencyMapMetadata,
} from "./executionPlatformDependencyMap.ts";
import type { ExecutionPlatformManifestDescriptor } from "./executionPlatformManifestTypes.ts";
import {
  ExecutionPlatformPhaseRegistry,
  ExecutionPlatformPhaseRegistryMetadata,
} from "./executionPlatformPhaseRegistry.ts";
import {
  ExecutionPlatformPublicSurface,
  ExecutionPlatformPublicSurfaceMetadata,
} from "./executionPlatformPublicSurface.ts";

export const buildExecutionPlatformManifest = () =>
  Object.freeze({
    platformIdentity: ExecutionPlatformIdentity,
    foundation: ExecutiveExecutionFoundation,
    consumedPhases: Object.freeze(
      ExecutionPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: ExecutionPlatformPhaseRegistry,
    phaseRegistryMetadata: ExecutionPlatformPhaseRegistryMetadata,
    dependencyMap: ExecutionPlatformDependencyMap,
    dependencyMapMetadata: ExecutionPlatformDependencyMapMetadata,
    publicApiSurface: ExecutionPlatformPublicSurface,
    publicApiSurfaceMetadata: ExecutionPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      capabilityCount: ExecutionCapabilityRegistry.length,
      capabilityNames: Object.freeze(
        ExecutionCapabilityRegistry.map((capability) => capability.name),
      ),
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      modelCount: buildExecutionModelManifest().models.all.length,
      modeledCapabilityCount:
        buildExecutionModelManifest().compatibility.modeledCapabilityCount,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getExecutionValidationSummary(),
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getExecutionValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    descriptor: Object.freeze({
      platformId: ExecutionPlatformMetadata.platformId,
      platformName: ExecutionPlatformIdentity.platformName,
      platformVersion: ExecutionPlatformIdentity.platformVersion,
      compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
      releaseReadiness:
        getExecutionValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutionPlatformManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
