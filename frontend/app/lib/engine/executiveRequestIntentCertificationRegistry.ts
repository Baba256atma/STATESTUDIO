import type { ExecutiveRequestIntentCertificationCategory, ExecutiveRequestIntentCertificationGate } from "./executiveRequestIntentCertificationTypes.ts";

const gate = (identifier: ExecutiveRequestIntentCertificationGate["identifier"], name: string, description: string, owningPhase: ExecutiveRequestIntentCertificationGate["owningPhase"], category: ExecutiveRequestIntentCertificationCategory, evidenceReference: string) => Object.freeze({
  identifier, name, description, owningPhase, category, status: "Certified",
  evidenceReference, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentCertificationGate);

export const ExecutiveRequestIntentCertificationRegistry = Object.freeze([
  gate("eng-2-certification-foundation", "Foundation Certified", "Foundation contracts, registry metadata, and aggregation are certified.", "ENG-2:1", "Foundation", "executiveRequestIntentIndex.ts"),
  gate("eng-2-certification-registry", "Registry Certified", "Eight canonical immutable registries are certified.", "ENG-2:2", "Registry", "executiveRequestIntentRegistryIndex.ts"),
  gate("eng-2-certification-model", "Model Certified", "Seven collision-safe architectural models are certified.", "ENG-2:3", "Model", "executiveRequestIntentModelIndex.ts"),
  gate("eng-2-certification-validation", "Validation Certified", "Five metadata-only validation groups are certified.", "ENG-2:4", "Validation", "executiveRequestIntentValidationIndex.ts"),
  gate("eng-2-certification-manifest", "Manifest Certified", "Canonical phase and dependency aggregation is certified.", "ENG-2:5", "Manifest", "executiveRequestIntentManifestIndex.ts"),
  gate("eng-2-certification-platform", "Platform Certified", "Five-section canonical platform aggregation is certified.", "ENG-2:6", "Platform", "executiveRequestIntentPlatformIndex.ts"),
  gate("eng-2-certification-public-api", "Public API Stable", "Explicit phase-owned public API surfaces are stable.", "ENG-2:7", "PublicAPI", "ENG-2 approved public indices"),
  gate("eng-2-certification-namespace", "Namespace Verified", "Request & Intent namespaces are stable and phase-owned.", "ENG-2:7", "Namespace", "nexora.engine.executive.request-intent"),
  gate("eng-2-certification-ownership", "Ownership Verified", "ENG-1 and ENG-2 ownership boundaries are preserved.", "ENG-2:7", "Ownership", "ExecutiveRequestIntentPlatformMetadata.ownershipPolicy"),
  gate("eng-2-certification-anti-duplication", "Anti-Duplication Verified", "Collision-safe files and symbols prevent architectural duplication.", "ENG-2:7", "AntiDuplication", "ExecutiveRequestIntentPublicSurface.antiDuplicationPolicy"),
  gate("eng-2-certification-metadata-only", "Metadata-Only Verified", "All platform layers are declared metadata-only.", "ENG-2:7", "MetadataOnly", "ExecutiveRequestIntentPlatform"),
  gate("eng-2-certification-dependency", "Dependency Verified", "Dependencies use approved public indices only.", "ENG-2:7", "Dependency", "ExecutiveRequestIntentPlatformRegistry"),
] as const);
