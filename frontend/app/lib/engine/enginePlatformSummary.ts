import { ExecutiveEngineCapabilityRegistry } from "./engineRegistryIndex.ts";
import { ExecutiveEngineModelRegistry } from "./engineModelIndex.ts";
import { ExecutiveEngineValidationManifest } from "./engineValidationIndex.ts";
import { ExecutiveEngineDependencyMap, ExecutiveEnginePhaseRegistry, ExecutiveEnginePublicSurface } from "./engineManifestIndex.ts";
import type { ExecutiveEnginePlatformSummaryDescriptor } from "./enginePlatformTypes.ts";

export const ExecutiveEnginePlatformSummary = Object.freeze({
  artifactId: "ENG-PLATFORM-SUMMARY-001", platformIdentifier: "ENG-PLATFORM-001",
  completedPhases: ExecutiveEnginePhaseRegistry.length,
  architecturalSections: Object.freeze(["foundation", "registry", "model", "validation", "manifest"]),
  capabilityCount: ExecutiveEngineCapabilityRegistry.length,
  modelCount: ExecutiveEngineModelRegistry.length,
  validationDomainCount: ExecutiveEngineValidationManifest.validationDomains.length,
  dependencyCount: ExecutiveEngineDependencyMap.length,
  publicApiCount: ExecutiveEnginePublicSurface.all.length,
  metadataOnlyClassification: true, runtimeFreeClassification: true,
  ownershipClassification: "ExecutiveEngine", releaseReadiness: "ReadyForCertification",
  nextPhase: "ENG-1:7 — Executive Engine Certification",
  immutable: true, deterministic: true,
} as const satisfies ExecutiveEnginePlatformSummaryDescriptor);
