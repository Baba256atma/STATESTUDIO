import { ExecutiveReasoningCompatibility } from "./executiveReasoningCompatibility.ts";
import { ExecutiveReasoningManifest } from "./executiveReasoningManifest.ts";
import { ExecutiveReasoningManifestMetadata } from "./executiveReasoningManifestMetadata.ts";

export const ExecutiveReasoningManifestSummary = Object.freeze({
  manifestId: ExecutiveReasoningManifestMetadata.manifestId,
  phase: "ENG-6:5",
  namespace: ExecutiveReasoningManifestMetadata.namespace,
  owner: ExecutiveReasoningManifestMetadata.owner,
  version: ExecutiveReasoningManifestMetadata.version,
  totalPhases: ExecutiveReasoningManifestMetadata.includedPhases.length,
  aggregatedPhaseCount: ExecutiveReasoningManifestMetadata.aggregatedPhases.length,
  totalPublicApis: ExecutiveReasoningManifest.PublicSurface.apiCount,
  totalComponents: ExecutiveReasoningManifest.Registry.componentCount,
  totalModels: ExecutiveReasoningManifest.Model.modelCount,
  totalValidationDomains: ExecutiveReasoningManifest.Validation.domainCount,
  totalValidationRules: ExecutiveReasoningManifest.Validation.totalRuleCount,
  totalSections: ExecutiveReasoningManifestMetadata.sectionCount,
  dependencyEdgeCount: ExecutiveReasoningManifest.DependencyMap.edgeCount,
  ownershipEntryCount: ExecutiveReasoningManifest.Ownership.entryCount,
  compatibilityDeclarationCount: ExecutiveReasoningManifest.Compatibility.declarationCount,
  compatibilityStatus: ExecutiveReasoningCompatibility.status,
  validationStatus: ExecutiveReasoningManifest.Validation.status,
  releaseStatus: ExecutiveReasoningManifest.ReleaseMetadata.releaseStatus,
  releaseReadiness: ExecutiveReasoningManifest.ReleaseMetadata.platformReadiness,
  certificationReadiness: ExecutiveReasoningManifest.ReleaseMetadata.certificationReadiness,
  freezeReadiness: ExecutiveReasoningManifest.ReleaseMetadata.freezeReadiness,
  nextPhase: ExecutiveReasoningManifestMetadata.nextPhase,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
