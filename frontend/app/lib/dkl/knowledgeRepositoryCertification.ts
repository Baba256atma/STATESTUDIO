/**
 * DKL-6:7 — Knowledge Repository Certification.
 *
 * Canonical immutable certification layer for the Knowledge Repository.
 * Certifies DKL-6:1 through DKL-6:6 via Platform-centered public evidence.
 * Metadata-only. Runtime-free. Freeze-ready.
 *
 * Ownership: owned exclusively by DKL-6:7.
 *
 * Public exports (exactly 8):
 *   KnowledgeRepositoryCertification
 *   KnowledgeRepositoryCertificationId
 *   KnowledgeRepositoryCertificationVersion
 *   KnowledgeRepositoryCertificationName
 *   KnowledgeRepositoryCertificationNamespace
 *   KnowledgeRepositoryCertificationStatus
 *   getKnowledgeRepositoryCertificationSummary()
 *   getKnowledgeRepositoryCertificationPublicApiCount()
 */

import {
  KnowledgeRepositoryCertificationCompatibilityEntries,
  KnowledgeRepositoryCertificationCompatibilityManifest,
} from "./knowledgeRepositoryCertificationCompatibility.ts";
import {
  KnowledgeRepositoryCertificationCriteria,
  KnowledgeRepositoryCertificationScopeEntries,
} from "./knowledgeRepositoryCertificationCriteria.ts";
import {
  KnowledgeRepositoryCertificationEvidenceEntries,
  KnowledgeRepositoryCertificationEvidenceManifest,
  KnowledgeRepositoryCertificationPublicApis,
} from "./knowledgeRepositoryCertificationEvidence.ts";
import {
  KnowledgeRepositoryCertificationBoundaries,
  KnowledgeRepositoryCertificationGateManifest,
  KnowledgeRepositoryCertificationGates,
  KnowledgeRepositoryCertificationGuarantees,
} from "./knowledgeRepositoryCertificationGates.ts";
import {
  KnowledgeRepositoryCertificationRegressionManifest,
  KnowledgeRepositoryCertificationRegressionProtections,
} from "./knowledgeRepositoryCertificationRegression.ts";
import type {
  KnowledgeRepositoryCertificationIdentityDescriptor,
  KnowledgeRepositoryCertificationResult,
  KnowledgeRepositoryCertificationSummaryDescriptor,
} from "./knowledgeRepositoryCertificationTypes.ts";
import {
  KnowledgeRepositoryPlatform,
  KnowledgeRepositoryPlatformId,
  KnowledgeRepositoryPlatformStatus,
} from "./knowledgeRepositoryPlatform.ts";

export const KnowledgeRepositoryCertificationId =
  "DKL-6:7/KnowledgeRepositoryCertification" as const;

export const KnowledgeRepositoryCertificationVersion = "1.0.0" as const;

export const KnowledgeRepositoryCertificationName =
  "Knowledge Repository Certification" as const;

export const KnowledgeRepositoryCertificationNamespace =
  "nexora.dkl.repository.certification" as const;

export const KnowledgeRepositoryCertificationStatus = "Certified" as const;

const identity: KnowledgeRepositoryCertificationIdentityDescriptor =
  Object.freeze({
    certificationId: KnowledgeRepositoryCertificationId,
    certificationName: KnowledgeRepositoryCertificationName,
    certificationVersion: KnowledgeRepositoryCertificationVersion,
    certificationNamespace: KnowledgeRepositoryCertificationNamespace,
    phase: "DKL-6:7",
    owner: "DKL-6",
    status: KnowledgeRepositoryCertificationStatus,
    readiness: "ReadyForDKL6Freeze",
    metadataOnly: true,
    immutable: true,
  });

const passedCriteria = KnowledgeRepositoryCertificationCriteria.filter(
  (item) => item.status === "Pass",
).length;
const failedCriteria = KnowledgeRepositoryCertificationCriteria.filter(
  (item) => item.status === "Fail",
).length;
const passedGates = KnowledgeRepositoryCertificationGates.filter(
  (item) => item.status === "Pass",
).length;
const failedGates = KnowledgeRepositoryCertificationGates.filter(
  (item) => item.status === "Fail",
).length;

const result: KnowledgeRepositoryCertificationResult = Object.freeze({
  status: "Certified",
  totalCriteria: KnowledgeRepositoryCertificationCriteria.length,
  passedCriteria,
  failedCriteria,
  totalGates: KnowledgeRepositoryCertificationGates.length,
  passedGates,
  failedGates,
  blockingIssueCount: 0,
  readiness: "ReadyForDKL6Freeze",
});

/** Canonical immutable Knowledge Repository Certification aggregate. */
export const KnowledgeRepositoryCertification = Object.freeze({
  identity,
  scope: KnowledgeRepositoryCertificationScopeEntries,
  platform: KnowledgeRepositoryPlatform,
  criteria: KnowledgeRepositoryCertificationCriteria,
  evidence: KnowledgeRepositoryCertificationEvidenceEntries,
  compatibility: KnowledgeRepositoryCertificationCompatibilityEntries,
  regressionProtection: KnowledgeRepositoryCertificationRegressionProtections,
  boundaries: KnowledgeRepositoryCertificationBoundaries,
  guarantees: KnowledgeRepositoryCertificationGuarantees,
  publicApis: KnowledgeRepositoryCertificationPublicApis,
  gates: KnowledgeRepositoryCertificationGates,
  result,
  readiness: "ReadyForDKL6Freeze" as const,
  acceptances: Object.freeze({
    platformStatus: KnowledgeRepositoryPlatform.result.status,
    platformCompleteness: KnowledgeRepositoryPlatform.result.completeness,
    platformValidationStatus: KnowledgeRepositoryPlatform.result.validationStatus,
    platformManifestStatus: KnowledgeRepositoryPlatform.result.manifestStatus,
    platformBlockingIssueCount:
      KnowledgeRepositoryPlatform.result.blockingIssueCount,
    platformReadiness: KnowledgeRepositoryPlatform.result.readiness,
    validation: KnowledgeRepositoryPlatform.acceptances.validation,
    manifest: KnowledgeRepositoryPlatform.acceptances.manifest,
    inventory: KnowledgeRepositoryPlatform.acceptances.inventory,
  }),
  supporting: Object.freeze({
    evidence: KnowledgeRepositoryCertificationEvidenceManifest,
    compatibility: KnowledgeRepositoryCertificationCompatibilityManifest,
    regression: KnowledgeRepositoryCertificationRegressionManifest,
    gates: KnowledgeRepositoryCertificationGateManifest,
  }),
  runtimeProhibitions: Object.freeze({
    noPersistence: true as const,
    noQueryExecution: true as const,
    noRetrievalExecution: true as const,
    noIndexExecution: true as const,
    noVersionExecution: true as const,
    noSnapshotExecution: true as const,
    noHistoryExecution: true as const,
    noArchiveExecution: true as const,
    noRetentionExecution: true as const,
    noRuntimeExecutor: true as const,
    noAiBehavior: true as const,
    noEngineReasoning: true as const,
    noAdvisorOrSceneBehavior: true as const,
    noUiBehavior: true as const,
    technologyNeutral: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Total declared public API count across DKL-6:1 through DKL-6:7. */
export function getKnowledgeRepositoryCertificationPublicApiCount(): number {
  return KnowledgeRepositoryCertification.publicApis.reduce(
    (sum, phase) => sum + phase.publicApiCount,
    0,
  );
}

/** Deterministic immutable certification summary. */
export function getKnowledgeRepositoryCertificationSummary(): KnowledgeRepositoryCertificationSummaryDescriptor {
  const criticalCriteriaCount =
    KnowledgeRepositoryCertification.criteria.filter(
      (item) => item.severity === "Critical",
    ).length;
  const requiredCriteriaCount =
    KnowledgeRepositoryCertification.criteria.filter(
      (item) => item.severity === "Required",
    ).length;
  return Object.freeze({
    certificationId: KnowledgeRepositoryCertificationId,
    version: KnowledgeRepositoryCertificationVersion,
    name: KnowledgeRepositoryCertificationName,
    namespace: KnowledgeRepositoryCertificationNamespace,
    status: KnowledgeRepositoryCertificationStatus,
    platformIdentity: KnowledgeRepositoryPlatformId,
    platformStatus: KnowledgeRepositoryPlatformStatus,
    scopeCount: KnowledgeRepositoryCertification.scope.length,
    criteriaCount: KnowledgeRepositoryCertification.criteria.length,
    passedCriteriaCount: KnowledgeRepositoryCertification.result.passedCriteria,
    failedCriteriaCount: KnowledgeRepositoryCertification.result.failedCriteria,
    criticalCriteriaCount,
    requiredCriteriaCount,
    evidenceCount: KnowledgeRepositoryCertification.evidence.length,
    compatibilityCertificationCount:
      KnowledgeRepositoryCertification.compatibility.length,
    regressionProtectionCount:
      KnowledgeRepositoryCertification.regressionProtection.length,
    boundaryCertificationCount:
      KnowledgeRepositoryCertification.boundaries.length,
    guaranteeCount: KnowledgeRepositoryCertification.guarantees.length,
    certificationGateCount: KnowledgeRepositoryCertification.gates.length,
    passedGateCount: KnowledgeRepositoryCertification.result.passedGates,
    failedGateCount: KnowledgeRepositoryCertification.result.failedGates,
    publicApiCount: getKnowledgeRepositoryCertificationPublicApiCount(),
    blockingIssueCount:
      KnowledgeRepositoryCertification.result.blockingIssueCount,
    platformCompleteness: "Complete",
    certificationResult: "Certified",
    readiness: "ReadyForDKL6Freeze",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
