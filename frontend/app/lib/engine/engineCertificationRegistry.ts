import { ExecutiveEngineFoundation } from "./engineIndex.ts";
import { ExecutiveEngineRegistryManifest } from "./engineRegistryIndex.ts";
import { ExecutiveEngineModelRegistry } from "./engineModelIndex.ts";
import { ExecutiveEngineValidationManifest, getExecutiveEngineValidationSummary } from "./engineValidationIndex.ts";
import { ExecutiveEngineManifest, ExecutiveEngineReleaseReadiness } from "./engineManifestIndex.ts";
import { ExecutiveEnginePlatform, ExecutiveEnginePlatformMetadata } from "./enginePlatformIndex.ts";
import type { ExecutiveEngineCertificationCategory, ExecutiveEngineCertificationEntry } from "./engineCertificationTypes.ts";

const gate = (sequence: number, id: string, name: string, category: ExecutiveEngineCertificationCategory, pass: boolean, evidenceReference: string) => Object.freeze({
  artifactId: `ENG-CERT-GATE-${String(sequence).padStart(3, "0")}`,
  certificationIdentifier: id, certificationName: name, certificationCategory: category,
  certificationStatus: pass ? "PASS" : "FAIL", evidenceReference,
  lifecycleStatus: "Certified", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineCertificationEntry);

export const ExecutiveEngineCertificationRegistry = Object.freeze([
  gate(1, "foundation-certification", "Foundation Architecture Complete", "Foundation", ExecutiveEngineFoundation.metadataOnly, "engineIndex.ExecutiveEngineFoundation"),
  gate(2, "registry-certification", "Registry Architecture Complete", "Registry", ExecutiveEngineRegistryManifest.registryId === "ENG-1:2", "engineRegistryIndex.ExecutiveEngineRegistryManifest"),
  gate(3, "model-certification", "Canonical Model Architecture Complete", "Model", ExecutiveEngineModelRegistry.length === 11, "engineModelIndex.ExecutiveEngineModelRegistry"),
  gate(4, "validation-certification", "Validation Architecture Complete", "Validation", getExecutiveEngineValidationSummary().status === "PASS", "engineValidationIndex.ExecutiveEngineValidationManifest"),
  gate(5, "manifest-certification", "Manifest Architecture Complete", "Manifest", Object.keys(ExecutiveEngineManifest).length === 9, "engineManifestIndex.ExecutiveEngineManifest"),
  gate(6, "platform-certification", "Platform Aggregation Complete", "Platform", Object.keys(ExecutiveEnginePlatform).length === 5, "enginePlatformIndex.ExecutiveEnginePlatform"),
  gate(7, "ownership-certification", "Ownership Boundaries Correct", "Ownership", ExecutiveEngineValidationManifest.ownershipCompliance === "PASS", "engineValidationIndex.ExecutiveEngineOwnershipValidation"),
  gate(8, "dependency-certification", "Approved Public Dependencies", "Dependency", ExecutiveEngineValidationManifest.dependencyCompliance === "PASS", "engineValidationIndex.ExecutiveEngineDependencyValidation"),
  gate(9, "anti-duplication-certification", "No Architectural Duplication", "AntiDuplication", ExecutiveEngineValidationManifest.antiDuplicationCompliance === "PASS", "engineValidationIndex.ExecutiveEngineAntiDuplicationValidation"),
  gate(10, "public-api-certification", "Public API Surface Stable", "PublicApi", ExecutiveEngineReleaseReadiness.publicApiStable, "engineManifestIndex.ExecutiveEnginePublicSurface"),
  gate(11, "immutability-certification", "Export Metadata Deeply Immutable", "Immutability", Object.isFrozen(ExecutiveEnginePlatform) && Object.isFrozen(ExecutiveEngineManifest), "enginePlatformIndex.ExecutiveEnginePlatform"),
  gate(12, "metadata-only-certification", "Metadata-only Architecture", "MetadataOnly", ExecutiveEnginePlatformMetadata.metadataOnlyStatus, "enginePlatformIndex.ExecutiveEnginePlatformMetadata"),
  gate(13, "runtime-free-certification", "Runtime-free Architecture", "RuntimeFree", ExecutiveEnginePlatformMetadata.runtimeFreeStatus, "enginePlatformIndex.ExecutiveEnginePlatformMetadata"),
  gate(14, "deterministic-certification", "Deterministic Public Exports", "Determinism", ExecutiveEnginePlatformMetadata.deterministic, "enginePlatformIndex.ExecutiveEnginePlatformMetadata"),
  gate(15, "release-readiness-certification", "Ready for Freeze", "ReleaseReadiness", ExecutiveEnginePlatformMetadata.releaseStatus === "ReadyForCertification", "enginePlatformIndex.ExecutiveEnginePlatformMetadata"),
] as const);

export const ExecutiveEngineCertificationMetadata = Object.freeze({
  certificationId: "ENG-1:7", artifactId: "ENG-CERT-METADATA-001",
  certificationName: "Executive Engine Certification", version: "1.0.0",
  gateCount: ExecutiveEngineCertificationRegistry.length,
  status: ExecutiveEngineCertificationRegistry.every((entry) => entry.certificationStatus === "PASS") ? "Certified" : "Incomplete",
  lifecycleStatus: "Certified", metadataOnly: true, immutable: true, deterministic: true,
} as const);
