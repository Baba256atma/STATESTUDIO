import { ExecutiveEngineMetadata } from "./engineIndex.ts";
import { ExecutiveEngineRegistryMetadata } from "./engineRegistryIndex.ts";
import { getExecutiveEngineModelSummary } from "./engineModelIndex.ts";
import { ExecutiveEngineValidationManifest, getExecutiveEngineValidationSummary } from "./engineValidationIndex.ts";
import { ExecutiveEngineDependencyMap } from "./engineDependencyMap.ts";
import { ExecutiveEnginePhaseRegistry } from "./enginePhaseRegistry.ts";
import { ExecutiveEnginePublicSurface } from "./enginePublicSurface.ts";
import type { ExecutiveEngineManifestMetadataDescriptor, ExecutiveEngineReleaseReadinessDescriptor } from "./engineManifestTypes.ts";

export const ExecutiveEngineManifestMetadata = Object.freeze({
  manifestId: "ENG-MANIFEST-001", manifestVersion: "1.0.0", engineVersion: ExecutiveEngineMetadata.identity.version,
  architecturalClassification: "ExecutiveBrainManifest", metadataOnlyStatus: true, runtimeFreeStatus: true,
  ownershipStatus: ExecutiveEngineValidationManifest.ownershipCompliance === "PASS" ? "Compliant" : "NonCompliant",
  dependencyCompliance: ExecutiveEngineValidationManifest.dependencyCompliance,
  validationStatus: getExecutiveEngineValidationSummary().status,
  antiDuplicationStatus: ExecutiveEngineValidationManifest.antiDuplicationCompliance,
  releaseReadiness: "ReadyForPlatform", nextPhase: "ENG-1:6 — Executive Engine Platform",
  immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineManifestMetadataDescriptor);

export const ExecutiveEngineReleaseReadiness = Object.freeze({
  artifactId: "ENG-READINESS-001",
  foundationComplete: ExecutiveEnginePhaseRegistry[0]?.lifecycleStatus === "Complete",
  registryComplete: ExecutiveEngineRegistryMetadata.registryId === "ENG-1:2",
  modelComplete: getExecutiveEngineModelSummary().totalModelCount === 11,
  validationComplete: getExecutiveEngineValidationSummary().status === "PASS",
  manifestComplete: true,
  dependencyCompliant: ExecutiveEngineDependencyMap.every((edge) => !edge.circularDependencyAllowed),
  ownershipCompliant: ExecutiveEngineValidationManifest.ownershipCompliance === "PASS",
  antiDuplicationCompliant: ExecutiveEngineValidationManifest.antiDuplicationCompliance === "PASS",
  publicApiStable: ExecutiveEnginePublicSurface.all.length > 0,
  readiness: "ReadyForPlatform", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineReleaseReadinessDescriptor);
