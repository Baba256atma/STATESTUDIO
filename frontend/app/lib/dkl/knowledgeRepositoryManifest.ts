/**
 * DKL-6:5 — Knowledge Repository Manifest.
 *
 * Canonical immutable architectural manifest for the Knowledge Repository.
 * Aggregates DKL-6:1 through DKL-6:4 via public surfaces only.
 * Metadata-only. Manifest-only. No persistence or runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:5.
 *
 * Public exports (exactly 8):
 *   KnowledgeRepositoryManifest
 *   KnowledgeRepositoryManifestId
 *   KnowledgeRepositoryManifestVersion
 *   KnowledgeRepositoryManifestName
 *   KnowledgeRepositoryManifestNamespace
 *   KnowledgeRepositoryManifestStatus
 *   getKnowledgeRepositoryManifestSummary()
 *   getKnowledgeRepositoryManifestPublicApiCount()
 */

import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationStatus,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryCompatibilityManifest,
  KnowledgeRepositoryManifestCompatibilityEntries,
} from "./knowledgeRepositoryCompatibilityManifest.ts";
import {
  KnowledgeRepositoryFoundationInventory,
  KnowledgeRepositoryManifestCanonicalCounts,
  KnowledgeRepositoryManifestComponents,
  KnowledgeRepositoryManifestInventories,
  KnowledgeRepositoryManifestLocalInventory,
  KnowledgeRepositoryManifestPublicApis,
  KnowledgeRepositoryModelInventory,
  KnowledgeRepositoryRegistryInventory,
  KnowledgeRepositoryValidationInventory,
} from "./knowledgeRepositoryComponentManifest.ts";
import {
  KnowledgeRepositoryDependencyManifest,
  KnowledgeRepositoryManifestDependencies,
} from "./knowledgeRepositoryDependencyManifest.ts";
import {
  KnowledgeRepositoryGuaranteeManifest,
  KnowledgeRepositoryManifestCompletenessGates,
  KnowledgeRepositoryManifestGuarantees,
} from "./knowledgeRepositoryGuaranteeManifest.ts";
import type {
  KnowledgeRepositoryManifestIdentityDescriptor,
  KnowledgeRepositoryManifestResult,
  KnowledgeRepositoryManifestSection,
  KnowledgeRepositoryManifestSummaryDescriptor,
} from "./knowledgeRepositoryManifestTypes.ts";
import {
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
  KnowledgeRepositoryModelStatus,
  KnowledgeRepositoryModelVersion,
} from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryManifestBoundaries,
  KnowledgeRepositoryManifestNonOwnedResponsibilities,
  KnowledgeRepositoryManifestOwnedResponsibilities,
  KnowledgeRepositoryOwnershipManifest,
} from "./knowledgeRepositoryOwnershipManifest.ts";
import {
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryStatus,
  KnowledgeRepositoryRegistryVersion,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
  KnowledgeRepositoryValidationStatus,
  KnowledgeRepositoryValidationVersion,
} from "./knowledgeRepositoryValidation.ts";

export const KnowledgeRepositoryManifestId =
  "DKL-6:5/KnowledgeRepositoryManifest" as const;

export const KnowledgeRepositoryManifestVersion = "1.0.0" as const;

export const KnowledgeRepositoryManifestName =
  "Knowledge Repository Manifest" as const;

export const KnowledgeRepositoryManifestNamespace =
  "nexora.dkl.repository.manifest" as const;

export const KnowledgeRepositoryManifestStatus = "Manifested" as const;

const identity: KnowledgeRepositoryManifestIdentityDescriptor = Object.freeze({
  manifestId: KnowledgeRepositoryManifestId,
  manifestName: KnowledgeRepositoryManifestName,
  manifestVersion: KnowledgeRepositoryManifestVersion,
  manifestNamespace: KnowledgeRepositoryManifestNamespace,
  phase: "DKL-6:5",
  owner: "DKL-6",
  status: KnowledgeRepositoryManifestStatus,
  readiness: "ReadyForDKL6Platform",
  metadataOnly: true,
  immutable: true,
});

const section = (
  id: string,
  name: KnowledgeRepositoryManifestSection["name"],
  sourceIdentity: string,
  sourceVersion: string,
  sourceStatus: string,
  order: number,
): KnowledgeRepositoryManifestSection =>
  Object.freeze({
    id,
    name,
    sourceIdentity,
    sourceVersion,
    sourceStatus,
    order,
    owner: "DKL-6" as const,
    included: true as const,
    runtimeBehavior: "None" as const,
  });

const sections: readonly KnowledgeRepositoryManifestSection[] = Object.freeze([
  section(
    "DKL-6:5/Section/foundation",
    "foundation",
    KnowledgeRepositoryFoundationId,
    KnowledgeRepositoryFoundationVersion,
    KnowledgeRepositoryFoundationStatus,
    1,
  ),
  section(
    "DKL-6:5/Section/registry",
    "registry",
    KnowledgeRepositoryRegistryId,
    KnowledgeRepositoryRegistryVersion,
    KnowledgeRepositoryRegistryStatus,
    2,
  ),
  section(
    "DKL-6:5/Section/model",
    "model",
    KnowledgeRepositoryModelId,
    KnowledgeRepositoryModelVersion,
    KnowledgeRepositoryModelStatus,
    3,
  ),
  section(
    "DKL-6:5/Section/validation",
    "validation",
    KnowledgeRepositoryValidationId,
    KnowledgeRepositoryValidationVersion,
    KnowledgeRepositoryValidationStatus,
    4,
  ),
  section(
    "DKL-6:5/Section/manifest",
    "manifest",
    KnowledgeRepositoryManifestId,
    KnowledgeRepositoryManifestVersion,
    KnowledgeRepositoryManifestStatus,
    5,
  ),
]);

const validationEvidence = Object.freeze({
  validationId: KnowledgeRepositoryValidationId,
  validationStatus: KnowledgeRepositoryValidationStatus,
  rules: KnowledgeRepositoryValidation.result.totalRules,
  passedRules: KnowledgeRepositoryValidation.result.passedRules,
  failedRules: KnowledgeRepositoryValidation.result.failedRules,
  gates: KnowledgeRepositoryValidation.result.gateCount,
  passedGates: KnowledgeRepositoryValidation.result.passedGates,
  failedGates: KnowledgeRepositoryValidation.result.failedGates,
  overallGateStatus: KnowledgeRepositoryValidation.result.gateStatus,
  validationReadiness: KnowledgeRepositoryValidation.result.readiness,
  manifestValidationAcceptance: "Accepted" as const,
  blockingIssueCount: 0 as const,
  referencedResult: KnowledgeRepositoryValidation.result,
});

const result: KnowledgeRepositoryManifestResult = Object.freeze({
  status: "Manifested",
  completeness: "Complete",
  validationStatus: "Pass",
  blockingIssueCount: 0,
  readiness: "ReadyForDKL6Platform",
});

/** Canonical immutable Knowledge Repository Manifest aggregate. */
export const KnowledgeRepositoryManifest = Object.freeze({
  identity,
  sections,
  components: KnowledgeRepositoryManifestComponents,
  inventories: KnowledgeRepositoryManifestInventories,
  publicApis: KnowledgeRepositoryManifestPublicApis,
  dependencies: KnowledgeRepositoryManifestDependencies,
  ownership: Object.freeze({
    owned: KnowledgeRepositoryManifestOwnedResponsibilities,
    notOwned: KnowledgeRepositoryManifestNonOwnedResponsibilities,
    ownedCount: KnowledgeRepositoryOwnershipManifest.ownedCount,
    notOwnedCount: KnowledgeRepositoryOwnershipManifest.notOwnedCount,
  }),
  boundaries: KnowledgeRepositoryManifestBoundaries,
  compatibility: KnowledgeRepositoryManifestCompatibilityEntries,
  guarantees: KnowledgeRepositoryManifestGuarantees,
  validationEvidence,
  completenessGates: KnowledgeRepositoryManifestCompletenessGates,
  result,
  readiness: "ReadyForDKL6Platform" as const,
  canonicalCounts: KnowledgeRepositoryManifestCanonicalCounts,
  sourceReferences: Object.freeze({
    foundation: KnowledgeRepositoryFoundation,
    registry: KnowledgeRepositoryRegistry,
    model: KnowledgeRepositoryModel,
    validation: KnowledgeRepositoryValidation,
  }),
  supportingManifests: Object.freeze({
    dependency: KnowledgeRepositoryDependencyManifest,
    ownership: KnowledgeRepositoryOwnershipManifest,
    compatibility: KnowledgeRepositoryCompatibilityManifest,
    guarantee: KnowledgeRepositoryGuaranteeManifest,
  }),
  inventoryFlattened: Object.freeze([
    ...KnowledgeRepositoryFoundationInventory,
    ...KnowledgeRepositoryRegistryInventory,
    ...KnowledgeRepositoryModelInventory,
    ...KnowledgeRepositoryValidationInventory,
    ...KnowledgeRepositoryManifestLocalInventory,
  ]),
  runtimeProhibitions: Object.freeze({
    metadataOnly: true as const,
    noPersistence: true as const,
    noQueryExecution: true as const,
    noRetrievalExecution: true as const,
    noIndexExecution: true as const,
    noRuntimeExecutor: true as const,
    noAiBehavior: true as const,
    noEngineReasoning: true as const,
    noAdvisorBehavior: true as const,
    noSceneBehavior: true as const,
    noUiBehavior: true as const,
    technologyNeutral: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Total declared public API count across DKL-6:1 through DKL-6:5. */
export function getKnowledgeRepositoryManifestPublicApiCount(): number {
  return KnowledgeRepositoryManifest.publicApis.reduce(
    (sum, phase) => sum + phase.publicApiCount,
    0,
  );
}

/** Deterministic immutable manifest summary. */
export function getKnowledgeRepositoryManifestSummary(): KnowledgeRepositoryManifestSummaryDescriptor {
  const passedGates = KnowledgeRepositoryManifest.completenessGates.filter(
    (gate) => gate.status === "Pass",
  ).length;
  const failedGates = KnowledgeRepositoryManifest.completenessGates.length - passedGates;
  return Object.freeze({
    manifestId: KnowledgeRepositoryManifestId,
    version: KnowledgeRepositoryManifestVersion,
    name: KnowledgeRepositoryManifestName,
    namespace: KnowledgeRepositoryManifestNamespace,
    status: KnowledgeRepositoryManifestStatus,
    foundationIdentity: KnowledgeRepositoryFoundationId,
    registryIdentity: KnowledgeRepositoryRegistryId,
    modelIdentity: KnowledgeRepositoryModelId,
    validationIdentity: KnowledgeRepositoryValidationId,
    architectureSectionCount: KnowledgeRepositoryManifest.sections.length,
    componentCount: KnowledgeRepositoryManifest.components.length,
    inventoryGroupCount: KnowledgeRepositoryManifest.inventories.groupCount,
    publicApiCount: getKnowledgeRepositoryManifestPublicApiCount(),
    dependencyCount: KnowledgeRepositoryManifest.dependencies.length,
    ownedResponsibilityCount: KnowledgeRepositoryManifest.ownership.ownedCount,
    nonOwnedResponsibilityCount:
      KnowledgeRepositoryManifest.ownership.notOwnedCount,
    boundaryDeclarationCount: KnowledgeRepositoryManifest.boundaries.length,
    compatibilityDeclarationCount: KnowledgeRepositoryManifest.compatibility.length,
    guaranteeCount: KnowledgeRepositoryManifest.guarantees.length,
    completenessGateCount: KnowledgeRepositoryManifest.completenessGates.length,
    passedCompletenessGateCount: passedGates,
    failedCompletenessGateCount: failedGates,
    validationRuleCount: KnowledgeRepositoryManifest.validationEvidence.rules,
    validationPassedRuleCount:
      KnowledgeRepositoryManifest.validationEvidence.passedRules,
    validationFailedRuleCount:
      KnowledgeRepositoryManifest.validationEvidence.failedRules,
    blockingIssueCount: KnowledgeRepositoryManifest.result.blockingIssueCount,
    completeness: "Complete",
    readiness: "ReadyForDKL6Platform",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
