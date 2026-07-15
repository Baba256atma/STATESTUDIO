import { getExecutiveReasoningManifestSummary } from "./executiveReasoningManifestPlatform.ts";
import { getExecutiveReasoningModelSummary } from "./executiveReasoningModelIndex.ts";
import { ExecutiveReasoningPlatformMetadata } from "./executiveReasoningPlatformMetadata.ts";
import { ExecutiveReasoningPlatformRegistry } from "./executiveReasoningPlatformRegistry.ts";
import { getReasoningRegistrySummary } from "./executiveReasoningRegistryIndex.ts";
import { getExecutiveReasoningValidationSummary } from "./executiveReasoningValidationPlatform.ts";

const registrySummary = getReasoningRegistrySummary();
const modelSummary = getExecutiveReasoningModelSummary();
const validationSummary = getExecutiveReasoningValidationSummary();
const manifestSummary = getExecutiveReasoningManifestSummary();

/**
 * Deterministic summary derived only from declared metadata.
 */
export const ExecutiveReasoningPlatformSummary = Object.freeze({
  platformId: ExecutiveReasoningPlatformMetadata.platformId,
  phase: "ENG-6:6",
  namespace: ExecutiveReasoningPlatformMetadata.namespace,
  owner: ExecutiveReasoningPlatformMetadata.owner,
  version: ExecutiveReasoningPlatformMetadata.version,
  totalPhases: ExecutiveReasoningPlatformRegistry.counts.phaseCount,
  totalComponents: registrySummary.componentCount,
  totalCapabilities: registrySummary.capabilityCount,
  totalModels: modelSummary.modelCount,
  totalRelationships: modelSummary.relationshipEdgeCount,
  totalValidationDomains: validationSummary.domainCount,
  totalValidationRules: validationSummary.totalRuleCount,
  totalPublicApis: ExecutiveReasoningPlatformRegistry.counts.publicApiCount,
  totalManifestPublicApis: manifestSummary.totalPublicApis,
  sectionCount: ExecutiveReasoningPlatformMetadata.sectionCount,
  releaseStatus: ExecutiveReasoningPlatformMetadata.releaseStatus,
  releaseReadiness: "ReadyForCertification",
  nextPhase: ExecutiveReasoningPlatformMetadata.nextPhase,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
