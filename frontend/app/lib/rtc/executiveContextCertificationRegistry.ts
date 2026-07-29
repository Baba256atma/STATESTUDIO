/**
 * RTC-1:7 — Executive Context Certification Registry.
 *
 * Deterministic catalogue of certification categories, gates, statuses,
 * and compliance check baselines.
 *
 * Ownership: owned exclusively by RTC-1:7.
 */

import {
  ExecutiveContextCertificationCategories,
  ExecutiveContextCertificationCategoryNames,
} from "./executiveContextCertificationCategories.ts";
import {
  ExecutiveContextCertificationGateNames,
  ExecutiveContextCertificationGates,
} from "./executiveContextCertificationGates.ts";
import {
  ExecutiveContextCertificationIdentity,
  ExecutiveContextCertificationMetadata,
  ExecutiveContextCertificationScope,
} from "./executiveContextCertificationMetadata.ts";
import {
  ExecutiveContextApiStabilityChecks,
  ExecutiveContextArchitecturalComplianceChecks,
  ExecutiveContextCertificationResultModel,
  ExecutiveContextIdentityComplianceChecks,
  ExecutiveContextQualityChecks,
} from "./executiveContextCertificationResult.ts";
import {
  ExecutiveContextCertificationStatuses,
  ExecutiveContextCertificationStatusNames,
  ExecutiveContextFreezeProgressionStatus,
} from "./executiveContextCertificationStatus.ts";

/**
 * Canonical certification registry / baseline catalogue.
 */
export const ExecutiveContextCertificationRegistry = Object.freeze({
  registryId: "RTC-1:7/CertificationRegistry",
  sourcePhase: "RTC-1:7" as const,
  identity: ExecutiveContextCertificationIdentity,
  categories: ExecutiveContextCertificationCategories,
  categoryNames: ExecutiveContextCertificationCategoryNames,
  gates: ExecutiveContextCertificationGates,
  gateNames: ExecutiveContextCertificationGateNames,
  statuses: ExecutiveContextCertificationStatuses,
  statusNames: ExecutiveContextCertificationStatusNames,
  freezeProgressionStatus: ExecutiveContextFreezeProgressionStatus,
  resultModel: ExecutiveContextCertificationResultModel,
  scope: ExecutiveContextCertificationScope,
  metadata: ExecutiveContextCertificationMetadata,
  architecturalCompliance: ExecutiveContextArchitecturalComplianceChecks,
  identityCompliance: ExecutiveContextIdentityComplianceChecks,
  apiStability: ExecutiveContextApiStabilityChecks,
  qualityChecks: ExecutiveContextQualityChecks,
  baselines: Object.freeze({
    certificationCategories: ExecutiveContextCertificationCategories.length,
    certificationGates: ExecutiveContextCertificationGates.length,
    certificationStatuses: ExecutiveContextCertificationStatuses.length,
    runtimeGuarantees: ExecutiveContextCertificationMetadata.guarantees.length,
    compatibilityTargets:
      ExecutiveContextCertificationMetadata.compatibility.length,
    upstreamRuntimePhases: ExecutiveContextCertificationScope.length,
  }),
  introducesNewApis: false as const,
  modifiesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
