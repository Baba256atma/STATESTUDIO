/**
 * DKL-6:6 — Knowledge Repository Platform.
 *
 * Canonical immutable platform-level architectural surface for the
 * Knowledge Repository. Composes DKL-6:1 through DKL-6:5 by canonical
 * public reference. Metadata-only. Runtime-free. Certification-ready.
 *
 * Ownership: owned exclusively by DKL-6:6.
 *
 * Public exports (exactly 8):
 *   KnowledgeRepositoryPlatform
 *   KnowledgeRepositoryPlatformId
 *   KnowledgeRepositoryPlatformVersion
 *   KnowledgeRepositoryPlatformName
 *   KnowledgeRepositoryPlatformNamespace
 *   KnowledgeRepositoryPlatformStatus
 *   getKnowledgeRepositoryPlatformSummary()
 *   getKnowledgeRepositoryPlatformPublicApiCount()
 */

import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryPlatformCompatibilityEntries,
  KnowledgeRepositoryPlatformCompatibilityManifest,
} from "./knowledgeRepositoryPlatformCompatibility.ts";
import {
  KnowledgeRepositoryPlatformDependencies,
  KnowledgeRepositoryPlatformDependencyManifest,
} from "./knowledgeRepositoryPlatformDependencies.ts";
import {
  KnowledgeRepositoryPlatformBoundaries,
  KnowledgeRepositoryPlatformGuaranteeManifest,
  KnowledgeRepositoryPlatformGuarantees,
} from "./knowledgeRepositoryPlatformGuarantees.ts";
import {
  KnowledgeRepositoryPlatformInventoryAcceptance,
  KnowledgeRepositoryPlatformManifestAcceptance,
  KnowledgeRepositoryPlatformPublicApis,
  KnowledgeRepositoryPlatformReadinessGates,
  KnowledgeRepositoryPlatformReadinessManifest,
  KnowledgeRepositoryPlatformValidationAcceptance,
} from "./knowledgeRepositoryPlatformReadiness.ts";
import {
  KnowledgeRepositoryPlatformComponents,
  KnowledgeRepositoryPlatformSections,
} from "./knowledgeRepositoryPlatformSections.ts";
import type {
  KnowledgeRepositoryPlatformIdentityDescriptor,
  KnowledgeRepositoryPlatformResult,
  KnowledgeRepositoryPlatformSummaryDescriptor,
} from "./knowledgeRepositoryPlatformTypes.ts";
import {
  KnowledgeRepositoryManifest,
  KnowledgeRepositoryManifestId,
} from "./knowledgeRepositoryManifest.ts";
import {
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
} from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
} from "./knowledgeRepositoryValidation.ts";

export const KnowledgeRepositoryPlatformId =
  "DKL-6:6/KnowledgeRepositoryPlatform" as const;

export const KnowledgeRepositoryPlatformVersion = "1.0.0" as const;

export const KnowledgeRepositoryPlatformName =
  "Knowledge Repository Platform" as const;

export const KnowledgeRepositoryPlatformNamespace =
  "nexora.dkl.repository.platform" as const;

export const KnowledgeRepositoryPlatformStatus = "PlatformComplete" as const;

const identity: KnowledgeRepositoryPlatformIdentityDescriptor = Object.freeze({
  platformId: KnowledgeRepositoryPlatformId,
  platformName: KnowledgeRepositoryPlatformName,
  platformVersion: KnowledgeRepositoryPlatformVersion,
  platformNamespace: KnowledgeRepositoryPlatformNamespace,
  phase: "DKL-6:6",
  owner: "DKL-6",
  status: KnowledgeRepositoryPlatformStatus,
  readiness: "ReadyForDKL6Certification",
  metadataOnly: true,
  immutable: true,
});

const result: KnowledgeRepositoryPlatformResult = Object.freeze({
  status: "PlatformComplete",
  completeness: "Complete",
  validationStatus: "Pass",
  manifestStatus: "Manifested",
  blockingIssueCount: 0,
  readiness: "ReadyForDKL6Certification",
});

/** Canonical immutable Knowledge Repository Platform aggregate. */
export const KnowledgeRepositoryPlatform = Object.freeze({
  identity,
  sections: KnowledgeRepositoryPlatformSections,
  components: KnowledgeRepositoryPlatformComponents,
  foundation: KnowledgeRepositoryFoundation,
  registry: KnowledgeRepositoryRegistry,
  model: KnowledgeRepositoryModel,
  validation: KnowledgeRepositoryValidation,
  manifest: KnowledgeRepositoryManifest,
  dependencies: KnowledgeRepositoryPlatformDependencies,
  compatibility: KnowledgeRepositoryPlatformCompatibilityEntries,
  boundaries: KnowledgeRepositoryPlatformBoundaries,
  guarantees: KnowledgeRepositoryPlatformGuarantees,
  publicApis: KnowledgeRepositoryPlatformPublicApis,
  readinessGates: KnowledgeRepositoryPlatformReadinessGates,
  result,
  readiness: "ReadyForDKL6Certification" as const,
  acceptances: Object.freeze({
    manifest: KnowledgeRepositoryPlatformManifestAcceptance,
    validation: KnowledgeRepositoryPlatformValidationAcceptance,
    inventory: KnowledgeRepositoryPlatformInventoryAcceptance,
  }),
  supporting: Object.freeze({
    dependency: KnowledgeRepositoryPlatformDependencyManifest,
    compatibility: KnowledgeRepositoryPlatformCompatibilityManifest,
    guarantee: KnowledgeRepositoryPlatformGuaranteeManifest,
    readiness: KnowledgeRepositoryPlatformReadinessManifest,
  }),
  runtimeProhibitions: Object.freeze({
    noPersistence: true as const,
    noDatabaseCoupling: true as const,
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

/** Total declared public API count across DKL-6:1 through DKL-6:6. */
export function getKnowledgeRepositoryPlatformPublicApiCount(): number {
  return KnowledgeRepositoryPlatform.publicApis.reduce(
    (sum, phase) => sum + phase.publicApiCount,
    0,
  );
}

/** Deterministic immutable platform summary. */
export function getKnowledgeRepositoryPlatformSummary(): KnowledgeRepositoryPlatformSummaryDescriptor {
  const passedGates = KnowledgeRepositoryPlatform.readinessGates.filter(
    (gate) => gate.status === "Pass",
  ).length;
  const failedGates =
    KnowledgeRepositoryPlatform.readinessGates.length - passedGates;
  return Object.freeze({
    platformId: KnowledgeRepositoryPlatformId,
    version: KnowledgeRepositoryPlatformVersion,
    name: KnowledgeRepositoryPlatformName,
    namespace: KnowledgeRepositoryPlatformNamespace,
    status: KnowledgeRepositoryPlatformStatus,
    foundationIdentity: KnowledgeRepositoryFoundationId,
    registryIdentity: KnowledgeRepositoryRegistryId,
    modelIdentity: KnowledgeRepositoryModelId,
    validationIdentity: KnowledgeRepositoryValidationId,
    manifestIdentity: KnowledgeRepositoryManifestId,
    platformSectionCount: KnowledgeRepositoryPlatform.sections.length,
    platformComponentCount: KnowledgeRepositoryPlatform.components.length,
    dependencyCount: KnowledgeRepositoryPlatform.dependencies.length,
    compatibilityCount: KnowledgeRepositoryPlatform.compatibility.length,
    boundaryCount: KnowledgeRepositoryPlatform.boundaries.length,
    guaranteeCount: KnowledgeRepositoryPlatform.guarantees.length,
    publicApiCount: getKnowledgeRepositoryPlatformPublicApiCount(),
    readinessGateCount: KnowledgeRepositoryPlatform.readinessGates.length,
    passedReadinessGateCount: passedGates,
    failedReadinessGateCount: failedGates,
    validationRuleCount:
      KnowledgeRepositoryPlatform.acceptances.validation.rules,
    validationPassedRuleCount:
      KnowledgeRepositoryPlatform.acceptances.validation.passedRules,
    manifestCompleteness: "Complete",
    blockingIssueCount: KnowledgeRepositoryPlatform.result.blockingIssueCount,
    completeness: "Complete",
    readiness: "ReadyForDKL6Certification",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
