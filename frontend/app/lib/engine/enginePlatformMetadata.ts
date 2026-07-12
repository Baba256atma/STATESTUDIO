import { ExecutiveEngineManifestMetadata } from "./engineManifestIndex.ts";
import type { ExecutiveEnginePlatformMetadataDescriptor } from "./enginePlatformTypes.ts";

export const ExecutiveEnginePlatformMetadata = Object.freeze({
  artifactId: "ENG-PLATFORM-METADATA-001", platformId: "ENG-PLATFORM-001",
  platformName: "Nexora Executive Engine Platform", platformVersion: ExecutiveEngineManifestMetadata.engineVersion,
  architecturalClassification: "ExecutiveBrainPlatform",
  metadataOnlyStatus: ExecutiveEngineManifestMetadata.metadataOnlyStatus,
  runtimeFreeStatus: ExecutiveEngineManifestMetadata.runtimeFreeStatus,
  ownership: "ExecutiveEngine", lifecycleStatus: "PlatformActive",
  dependencyCompliance: ExecutiveEngineManifestMetadata.dependencyCompliance,
  validationCompliance: ExecutiveEngineManifestMetadata.validationStatus,
  antiDuplicationCompliance: ExecutiveEngineManifestMetadata.antiDuplicationStatus,
  releaseStatus: "ReadyForCertification",
  nextPhase: "ENG-1:7 — Executive Engine Certification",
  immutable: true, deterministic: true,
} as const satisfies ExecutiveEnginePlatformMetadataDescriptor);
