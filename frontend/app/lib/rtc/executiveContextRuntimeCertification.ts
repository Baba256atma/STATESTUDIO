/**
 * RTC-1:7 — Executive Context Runtime Certification.
 *
 * Formal read-only certification gate for the Executive Context Runtime.
 * Consumes RTC-1:6 Platform public surface only.
 * Does not add Runtime capabilities or mutate Runtime state.
 *
 * Ownership: owned exclusively by RTC-1:7.
 *
 * Public exports:
 *   ExecutiveContextRuntimeCertificationId
 *   ExecutiveContextRuntimeCertificationVersion
 *   ExecutiveContextRuntimeCertificationName
 *   ExecutiveContextRuntimeCertificationNamespace
 *   ExecutiveContextRuntimeCertificationStatus
 *   ExecutiveContextRuntimeCertificationReadiness
 *   ExecutiveContextRuntimeCertification
 *   getExecutiveContextRuntimeCertificationSummary()
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
  ExecutiveContextCertificationCompatibilityTargets,
  ExecutiveContextCertificationGuarantees,
  ExecutiveContextCertificationIdentity,
  ExecutiveContextCertificationMetadata,
  ExecutiveContextCertificationPrinciples,
  ExecutiveContextCertificationProhibitedSurfaces,
  ExecutiveContextCertificationScope,
  ExecutiveContextReleaseReadinessConditions,
  ExecutiveContextRuntimeCertificationId,
  ExecutiveContextRuntimeCertificationName,
  ExecutiveContextRuntimeCertificationNamespace,
  ExecutiveContextRuntimeCertificationNextPhase,
  ExecutiveContextRuntimeCertificationReadiness,
  ExecutiveContextRuntimeCertificationStatus,
  ExecutiveContextRuntimeCertificationVersion,
} from "./executiveContextCertificationMetadata.ts";
import { ExecutiveContextCertificationRegistry } from "./executiveContextCertificationRegistry.ts";
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
import { ExecutiveContextRuntimePlatform } from "./executiveContextRuntimePlatform.ts";

export {
  ExecutiveContextRuntimeCertificationId,
  ExecutiveContextRuntimeCertificationName,
  ExecutiveContextRuntimeCertificationNamespace,
  ExecutiveContextRuntimeCertificationReadiness,
  ExecutiveContextRuntimeCertificationStatus,
  ExecutiveContextRuntimeCertificationVersion,
};

/**
 * Canonical immutable Executive Context Runtime Certification aggregate.
 */
export const ExecutiveContextRuntimeCertification = Object.freeze({
  identity: ExecutiveContextCertificationIdentity,
  platform: ExecutiveContextRuntimePlatform,
  metadata: ExecutiveContextCertificationMetadata,
  registry: ExecutiveContextCertificationRegistry,
  categories: ExecutiveContextCertificationCategories,
  categoryNames: ExecutiveContextCertificationCategoryNames,
  gates: ExecutiveContextCertificationGates,
  gateNames: ExecutiveContextCertificationGateNames,
  statuses: ExecutiveContextCertificationStatuses,
  statusNames: ExecutiveContextCertificationStatusNames,
  freezeProgressionStatus: ExecutiveContextFreezeProgressionStatus,
  resultModel: ExecutiveContextCertificationResultModel,
  scope: ExecutiveContextCertificationScope,
  compatibility: ExecutiveContextCertificationCompatibilityTargets,
  guarantees: ExecutiveContextCertificationGuarantees,
  principles: ExecutiveContextCertificationPrinciples,
  releaseReadinessConditions: ExecutiveContextReleaseReadinessConditions,
  prohibitedSurfaces: ExecutiveContextCertificationProhibitedSurfaces,
  architecturalCompliance: ExecutiveContextArchitecturalComplianceChecks,
  identityCompliance: ExecutiveContextIdentityComplianceChecks,
  apiStability: ExecutiveContextApiStabilityChecks,
  qualityChecks: ExecutiveContextQualityChecks,
  baselines: ExecutiveContextCertificationRegistry.baselines,
  statistics: Object.freeze({
    categoryCount: ExecutiveContextCertificationCategories.length,
    gateCount: ExecutiveContextCertificationGates.length,
    statusCount: ExecutiveContextCertificationStatuses.length,
    scopeCount: ExecutiveContextCertificationScope.length,
    compatibilityCount: ExecutiveContextCertificationCompatibilityTargets.length,
    guaranteeCount: ExecutiveContextCertificationGuarantees.length,
    principleCount: ExecutiveContextCertificationPrinciples.length,
    resultFieldCount: ExecutiveContextCertificationResultModel.fieldCount,
    architecturalCheckCount:
      ExecutiveContextArchitecturalComplianceChecks.length,
    apiStabilityCheckCount: ExecutiveContextApiStabilityChecks.length,
    qualityCheckCount: ExecutiveContextQualityChecks.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:6 — Executive Context Runtime Platform",
  ]),
  compositionLayers: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
  ]),
  status: ExecutiveContextRuntimeCertificationStatus,
  readiness: ExecutiveContextRuntimeCertificationReadiness,
  nextPhase: ExecutiveContextRuntimeCertificationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  readOnly: true as const,
  evaluatesOnly: true as const,
  addsNewRuntimeCapabilities: false as const,
  modifiesRuntimeState: false as const,
  generatesRuntimeCode: false as const,
  executesBusinessLogic: false as const,
  renderingBehavior: false as const,
  invokesAi: false as const,
  persistsApplicationData: false as const,
  publishesReleases: false as const,
  introducesNewApis: false as const,
  includesDownstreamModules: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  freezePhase: false as const,
  publicIndexPhase: false as const,
} as const);

/** Deterministic frozen Certification summary. */
export function getExecutiveContextRuntimeCertificationSummary() {
  return Object.freeze({
    certificationId: ExecutiveContextRuntimeCertificationId,
    version: ExecutiveContextRuntimeCertificationVersion,
    name: ExecutiveContextRuntimeCertificationName,
    namespace: ExecutiveContextRuntimeCertificationNamespace,
    status: ExecutiveContextRuntimeCertificationStatus,
    readiness: ExecutiveContextRuntimeCertificationReadiness,
    categoryCount: ExecutiveContextCertificationCategories.length,
    gateCount: ExecutiveContextCertificationGates.length,
    statusCount: ExecutiveContextCertificationStatuses.length,
    guaranteeCount: ExecutiveContextCertificationGuarantees.length,
    compatibilityCount: ExecutiveContextCertificationCompatibilityTargets.length,
    upstreamPhaseCount: ExecutiveContextCertificationScope.length,
    freezeProgressionStatus: ExecutiveContextFreezeProgressionStatus,
    nextPhase: ExecutiveContextRuntimeCertificationNextPhase,
    sourcePlatform: ExecutiveContextCertificationIdentity.sourcePlatform,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeCertification = () =>
  ExecutiveContextRuntimeCertification;

export {
  ExecutiveContextCertificationIdentity,
  ExecutiveContextRuntimeCertificationNextPhase,
};
