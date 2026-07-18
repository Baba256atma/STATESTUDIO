/**
 * DKL-6:8 — Knowledge Repository Freeze.
 *
 * Canonical immutable Freeze aggregate for DKL-6 Knowledge Repository.
 * Publishes exactly eight public exports. Locks certified architecture for
 * Public Index readiness. Freeze only — no new architecture, no runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:8.
 * Dependencies: DKL-6:1 through DKL-6:7 public entry points only.
 */

import {
  KnowledgeRepositoryFoundationId,
  getKnowledgeRepositoryFoundationSummary,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryRegistryId,
  getKnowledgeRepositoryRegistrySummary,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryModelId,
  getKnowledgeRepositoryModelSummary,
} from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryValidationId,
  getKnowledgeRepositoryValidationSummary,
} from "./knowledgeRepositoryValidation.ts";
import {
  KnowledgeRepositoryManifestId,
  getKnowledgeRepositoryManifestPublicApiCount,
  getKnowledgeRepositoryManifestSummary,
} from "./knowledgeRepositoryManifest.ts";
import {
  KnowledgeRepositoryPlatformId,
  getKnowledgeRepositoryPlatformPublicApiCount,
  getKnowledgeRepositoryPlatformSummary,
} from "./knowledgeRepositoryPlatform.ts";
import {
  KnowledgeRepositoryCertification,
  KnowledgeRepositoryCertificationId,
  getKnowledgeRepositoryCertificationPublicApiCount,
  getKnowledgeRepositoryCertificationSummary,
} from "./knowledgeRepositoryCertification.ts";
import { KnowledgeRepositoryFreezeCompatibilityLocks } from "./knowledgeRepositoryFreezeCompatibility.ts";
import { KnowledgeRepositoryFreezeDependencyLocks } from "./knowledgeRepositoryFreezeDependencies.ts";
import {
  KnowledgeRepositoryFreezeGuarantees,
  KnowledgeRepositoryFreezeGates,
} from "./knowledgeRepositoryFreezeGuarantees.ts";
import {
  KnowledgeRepositoryFreezeBoundaryLocks,
  KnowledgeRepositoryFreezeCoreLocks,
  KnowledgeRepositoryFreezeExtensionLocks,
  KnowledgeRepositoryFreezePublicApiInventory,
  KnowledgeRepositoryFreezeRegressionLocks,
} from "./knowledgeRepositoryFreezeLocks.ts";
import {
  KnowledgeRepositoryFreezeCanonicalCountBaseline,
  KnowledgeRepositoryFreezeScopeEntries,
  KnowledgeRepositoryFrozenComponents,
} from "./knowledgeRepositoryFreezeRegistry.ts";
import type {
  KnowledgeRepositoryFreezeIdentityDescriptor,
  KnowledgeRepositoryFreezeResult,
  KnowledgeRepositoryFreezeSummaryDescriptor,
} from "./knowledgeRepositoryFreezeTypes.ts";

export const KnowledgeRepositoryFreezeId =
  "DKL-6:8/KnowledgeRepositoryFreeze" as const;

export const KnowledgeRepositoryFreezeVersion = "1.0.0" as const;

export const KnowledgeRepositoryFreezeName =
  "Knowledge Repository Freeze" as const;

export const KnowledgeRepositoryFreezeNamespace =
  "nexora.dkl.repository.freeze" as const;

export const KnowledgeRepositoryFreezeStatus = "Frozen" as const;

const foundationSummary = getKnowledgeRepositoryFoundationSummary();
const registrySummary = getKnowledgeRepositoryRegistrySummary();
const modelSummary = getKnowledgeRepositoryModelSummary();
const validationSummary = getKnowledgeRepositoryValidationSummary();
const manifestSummary = getKnowledgeRepositoryManifestSummary();
const platformSummary = getKnowledgeRepositoryPlatformSummary();
const certificationSummary = getKnowledgeRepositoryCertificationSummary();

const identity: KnowledgeRepositoryFreezeIdentityDescriptor = Object.freeze({
  freezeId: KnowledgeRepositoryFreezeId,
  freezeName: KnowledgeRepositoryFreezeName,
  freezeVersion: KnowledgeRepositoryFreezeVersion,
  freezeNamespace: KnowledgeRepositoryFreezeNamespace,
  phase: "DKL-6:8",
  owner: "DKL-6",
  status: "Frozen",
  certificationStatus: "Certified",
  baseline: "DKL-6-LOCKED",
  stability: "StableAndFrozen",
  readiness: "ReadyForDKL6PublicIndex",
  metadataOnly: true,
  immutable: true,
});

/**
 * Canonical counts derived from public summaries where available,
 * aligned to the locked DKL-6 baseline.
 */
const canonicalCounts = Object.freeze({
  foundation: Object.freeze({
    capabilities: foundationSummary.capabilityCount,
    contracts: foundationSummary.contractCount,
    lifecycleStates: foundationSummary.lifecycleStateCount,
    policies: foundationSummary.policyCount,
    publicApis: KnowledgeRepositoryFreezeCanonicalCountBaseline.foundation.publicApis,
    sourceIdentity: KnowledgeRepositoryFoundationId,
  }),
  registry: Object.freeze({
    entries: registrySummary.totalEntryCount,
    groups: registrySummary.registryGroupCount,
    publicApis: KnowledgeRepositoryFreezeCanonicalCountBaseline.registry.publicApis,
    sourceIdentity: KnowledgeRepositoryRegistryId,
  }),
  model: Object.freeze({
    models: modelSummary.totalModelCount,
    relationships: modelSummary.relationshipCount,
    registryTraceabilityGroups: modelSummary.registryTraceabilityCount,
    publicApis: KnowledgeRepositoryFreezeCanonicalCountBaseline.model.publicApis,
    sourceIdentity: KnowledgeRepositoryModelId,
  }),
  validation: Object.freeze({
    categories: validationSummary.categoryCount,
    rules: validationSummary.ruleCount,
    passedRules: validationSummary.passedRuleCount,
    failedRules: validationSummary.failedRuleCount,
    gates: validationSummary.gateCount,
    passedGates: validationSummary.passedGateCount,
    failedGates: validationSummary.failedGateCount,
    publicApis: KnowledgeRepositoryFreezeCanonicalCountBaseline.validation.publicApis,
    sourceIdentity: KnowledgeRepositoryValidationId,
  }),
  manifest: Object.freeze({
    sections: manifestSummary.architectureSectionCount,
    components: manifestSummary.componentCount,
    dependencies: manifestSummary.dependencyCount,
    boundaries: manifestSummary.boundaryDeclarationCount,
    compatibilityDeclarations: manifestSummary.compatibilityDeclarationCount,
    guarantees: manifestSummary.guaranteeCount,
    completenessGates: manifestSummary.completenessGateCount,
    passedCompletenessGates: manifestSummary.passedCompletenessGateCount,
    failedCompletenessGates: manifestSummary.failedCompletenessGateCount,
    completeness: manifestSummary.completeness,
    publicApisThroughManifest: getKnowledgeRepositoryManifestPublicApiCount(),
    sourceIdentity: KnowledgeRepositoryManifestId,
  }),
  platform: Object.freeze({
    sections: platformSummary.platformSectionCount,
    components: platformSummary.platformComponentCount,
    dependencies: platformSummary.dependencyCount,
    compatibilityDeclarations: platformSummary.compatibilityCount,
    boundaries: platformSummary.boundaryCount,
    guarantees: platformSummary.guaranteeCount,
    readinessGates: platformSummary.readinessGateCount,
    passedReadinessGates: platformSummary.passedReadinessGateCount,
    failedReadinessGates: platformSummary.failedReadinessGateCount,
    completeness: platformSummary.completeness,
    publicApisThroughPlatform: getKnowledgeRepositoryPlatformPublicApiCount(),
    sourceIdentity: KnowledgeRepositoryPlatformId,
  }),
  certification: Object.freeze({
    scopeEntries: certificationSummary.scopeCount,
    criteria: certificationSummary.criteriaCount,
    passedCriteria: certificationSummary.passedCriteriaCount,
    failedCriteria: certificationSummary.failedCriteriaCount,
    evidenceEntries: certificationSummary.evidenceCount,
    compatibilityCertifications:
      certificationSummary.compatibilityCertificationCount,
    regressionProtections: certificationSummary.regressionProtectionCount,
    boundaryCertifications: certificationSummary.boundaryCertificationCount,
    guarantees: certificationSummary.guaranteeCount,
    certificationGates: certificationSummary.certificationGateCount,
    passedGates: certificationSummary.passedGateCount,
    failedGates: certificationSummary.failedGateCount,
    blockingIssueCount: certificationSummary.blockingIssueCount,
    readiness: certificationSummary.readiness,
    publicApisThroughCertification:
      getKnowledgeRepositoryCertificationPublicApiCount(),
    sourceIdentity: KnowledgeRepositoryCertificationId,
  }),
  baseline: KnowledgeRepositoryFreezeCanonicalCountBaseline,
});

const totalLocks =
  KnowledgeRepositoryFreezeCompatibilityLocks.length +
  KnowledgeRepositoryFreezeDependencyLocks.length +
  KnowledgeRepositoryFreezeCoreLocks.length +
  KnowledgeRepositoryFreezeExtensionLocks.length +
  KnowledgeRepositoryFreezeBoundaryLocks.length +
  KnowledgeRepositoryFreezeRegressionLocks.length;

const lockedCount = totalLocks;
const unlockedCount = 0;
const passedGateCount = KnowledgeRepositoryFreezeGates.length;
const failedGateCount = 0;

const result: KnowledgeRepositoryFreezeResult = Object.freeze({
  status: "Frozen",
  certificationStatus: "Certified",
  baseline: "DKL-6-LOCKED",
  stability: "StableAndFrozen",
  totalLocks,
  lockedCount,
  unlockedCount,
  blockingIssueCount: 0,
  readiness: "ReadyForDKL6PublicIndex",
});

/** Canonical immutable Knowledge Repository Freeze aggregate. */
export const KnowledgeRepositoryFreeze = Object.freeze({
  identity,
  scope: KnowledgeRepositoryFreezeScopeEntries,
  certification: KnowledgeRepositoryCertification,
  frozenComponents: KnowledgeRepositoryFrozenComponents,
  canonicalCounts,
  compatibilityLocks: KnowledgeRepositoryFreezeCompatibilityLocks,
  dependencyLocks: KnowledgeRepositoryFreezeDependencyLocks,
  coreLocks: KnowledgeRepositoryFreezeCoreLocks,
  extensionLocks: KnowledgeRepositoryFreezeExtensionLocks,
  boundaryLocks: KnowledgeRepositoryFreezeBoundaryLocks,
  publicApis: KnowledgeRepositoryFreezePublicApiInventory,
  regressionLocks: KnowledgeRepositoryFreezeRegressionLocks,
  guarantees: KnowledgeRepositoryFreezeGuarantees,
  gates: KnowledgeRepositoryFreezeGates,
  result,
  readiness: "ReadyForDKL6PublicIndex" as const,
  certificationAcceptance: Object.freeze({
    certificationStatus: KnowledgeRepositoryCertification.result.status,
    criteria: KnowledgeRepositoryCertification.result.totalCriteria,
    passedCriteria: KnowledgeRepositoryCertification.result.passedCriteria,
    failedCriteria: KnowledgeRepositoryCertification.result.failedCriteria,
    gates: KnowledgeRepositoryCertification.result.totalGates,
    passedGates: KnowledgeRepositoryCertification.result.passedGates,
    failedGates: KnowledgeRepositoryCertification.result.failedGates,
    blockingIssues: KnowledgeRepositoryCertification.result.blockingIssueCount,
    readiness: KnowledgeRepositoryCertification.result.readiness,
    certificationIdentity: KnowledgeRepositoryCertificationId,
  }),
  runtimeProhibitions: Object.freeze({
    noPersistence: true as const,
    noDatabaseCoupling: true as const,
    noStorageEngineCoupling: true as const,
    noQueryExecution: true as const,
    noRetrievalExecution: true as const,
    noIndexExecution: true as const,
    noVersionExecution: true as const,
    noSnapshotExecution: true as const,
    noHistoryExecution: true as const,
    noArchiveExecution: true as const,
    noRetentionExecution: true as const,
    noFilesystemAccess: true as const,
    noNetworkAccess: true as const,
    noExternalServiceAccess: true as const,
    noAiBehavior: true as const,
    noEngineReasoning: true as const,
    noAdvisorOrSceneBehavior: true as const,
    noUiBehavior: true as const,
    noRuntimeExecutor: true as const,
    technologyNeutral: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Total declared public API count across DKL-6:1 through DKL-6:8. */
export function getKnowledgeRepositoryFreezePublicApiCount(): number {
  return KnowledgeRepositoryFreeze.publicApis.reduce(
    (sum, phase) => sum + phase.publicApiCount,
    0,
  );
}

/** Deterministic immutable freeze summary. */
export function getKnowledgeRepositoryFreezeSummary(): KnowledgeRepositoryFreezeSummaryDescriptor {
  return Object.freeze({
    freezeId: KnowledgeRepositoryFreezeId,
    version: KnowledgeRepositoryFreezeVersion,
    name: KnowledgeRepositoryFreezeName,
    namespace: KnowledgeRepositoryFreezeNamespace,
    status: KnowledgeRepositoryFreezeStatus,
    certificationStatus: "Certified",
    baseline: "DKL-6-LOCKED",
    stability: "StableAndFrozen",
    certificationIdentity: KnowledgeRepositoryCertificationId,
    freezeScopeCount: KnowledgeRepositoryFreeze.scope.length,
    frozenComponentCount: KnowledgeRepositoryFreeze.frozenComponents.length,
    compatibilityLockCount: KnowledgeRepositoryFreeze.compatibilityLocks.length,
    dependencyLockCount: KnowledgeRepositoryFreeze.dependencyLocks.length,
    coreLockCount: KnowledgeRepositoryFreeze.coreLocks.length,
    extensionLockCount: KnowledgeRepositoryFreeze.extensionLocks.length,
    boundaryLockCount: KnowledgeRepositoryFreeze.boundaryLocks.length,
    regressionLockCount: KnowledgeRepositoryFreeze.regressionLocks.length,
    guaranteeCount: KnowledgeRepositoryFreeze.guarantees.length,
    gateCount: KnowledgeRepositoryFreeze.gates.length,
    passedGateCount,
    failedGateCount,
    publicApiCount: getKnowledgeRepositoryFreezePublicApiCount(),
    lockedCount: KnowledgeRepositoryFreeze.result.lockedCount,
    unlockedCount: KnowledgeRepositoryFreeze.result.unlockedCount,
    blockingIssueCount: KnowledgeRepositoryFreeze.result.blockingIssueCount,
    readiness: "ReadyForDKL6PublicIndex",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
