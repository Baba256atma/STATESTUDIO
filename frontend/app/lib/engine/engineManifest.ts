import * as foundationApi from "./engineIndex.ts";
import * as registryApi from "./engineRegistryIndex.ts";
import * as modelApi from "./engineModelIndex.ts";
import * as validationApi from "./engineValidationIndex.ts";
import { ExecutiveEngineDependencyMap } from "./engineDependencyMap.ts";
import { ExecutiveEngineManifestMetadata, ExecutiveEngineReleaseReadiness } from "./engineManifestMetadata.ts";
import { ExecutiveEnginePhaseRegistry } from "./enginePhaseRegistry.ts";
import { ExecutiveEnginePublicSurface } from "./enginePublicSurface.ts";
import type { ExecutiveEngineManifestDescriptor } from "./engineManifestTypes.ts";

export const ExecutiveEngineManifest = Object.freeze({
  foundation: Object.freeze({ ...foundationApi }),
  registry: Object.freeze({ ...registryApi }),
  model: Object.freeze({ ...modelApi }),
  validation: Object.freeze({ ...validationApi }),
  phaseRegistry: ExecutiveEnginePhaseRegistry,
  dependencyMap: ExecutiveEngineDependencyMap,
  publicSurface: ExecutiveEnginePublicSurface,
  manifestMetadata: ExecutiveEngineManifestMetadata,
  releaseReadiness: ExecutiveEngineReleaseReadiness,
} as const satisfies ExecutiveEngineManifestDescriptor);

const summary = Object.freeze({
  phaseId: "ENG-1:5", version: "1.0.0", manifestIdentifier: ExecutiveEngineManifestMetadata.manifestId,
  totalSections: Object.keys(ExecutiveEngineManifest).length,
  completedPhases: ExecutiveEnginePhaseRegistry.filter((phase) => phase.lifecycleStatus === "Complete").length,
  activePhase: ExecutiveEnginePhaseRegistry.find((phase) => phase.lifecycleStatus === "Active")?.phaseId,
  dependencyCount: ExecutiveEngineDependencyMap.length,
  capabilityCount: registryApi.ExecutiveEngineCapabilityRegistry.length,
  modelCount: modelApi.ExecutiveEngineModelRegistry.length,
  validationDomainCount: validationApi.ExecutiveEngineValidationManifest.validationDomains.length,
  publicApiCount: ExecutiveEnginePublicSurface.all.length,
  releaseReadiness: ExecutiveEngineReleaseReadiness.readiness,
  metadataOnlyStatus: true, runtimeFreeStatus: true,
  nextPhase: "ENG-1:6 — Executive Engine Platform",
  immutable: true, deterministic: true,
} as const);

export const getExecutiveEngineManifest = () => ExecutiveEngineManifest;
export const getExecutiveEngineManifestMetadata = () => ExecutiveEngineManifestMetadata;
export const getExecutiveEngineReleaseReadiness = () => ExecutiveEngineReleaseReadiness;
export const getExecutiveEngineManifestSummary = () => summary;
