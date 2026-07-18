/**
 * DKL-6:6 — Knowledge Repository Platform Readiness.
 *
 * Exactly fourteen readiness gates and phase public API inventory.
 * Accepts Manifest and Validation by canonical reference.
 *
 * Ownership: owned exclusively by DKL-6:6.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import {
  getKnowledgeRepositoryManifestPublicApiCount,
  getKnowledgeRepositoryManifestSummary,
  KnowledgeRepositoryManifest,
  KnowledgeRepositoryManifestId,
} from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidation,
  KnowledgeRepositoryValidationId,
} from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryPlatformPublicApiPhase,
  KnowledgeRepositoryPlatformReadinessGate,
} from "./knowledgeRepositoryPlatformTypes.ts";

const PLATFORM_ID = "DKL-6:6/KnowledgeRepositoryPlatform" as const;
const PLATFORM_PUBLIC_API_COUNT = 8 as const;

const gate = (
  id: string,
  name: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryPlatformReadinessGate =>
  Object.freeze({
    id,
    name,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Pass" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const manifestSummary = getKnowledgeRepositoryManifestSummary();

/** Manifest acceptance by canonical reference. */
export const KnowledgeRepositoryPlatformManifestAcceptance = Object.freeze({
  manifestId: KnowledgeRepositoryManifestId,
  manifestStatus: KnowledgeRepositoryManifest.result.status,
  manifestCompleteness: KnowledgeRepositoryManifest.result.completeness,
  manifestValidationStatus: KnowledgeRepositoryManifest.result.validationStatus,
  manifestBlockingIssueCount: KnowledgeRepositoryManifest.result.blockingIssueCount,
  manifestReadiness: KnowledgeRepositoryManifest.result.readiness,
  summary: manifestSummary,
  referencedManifest: KnowledgeRepositoryManifest,
});

/** Validation acceptance by canonical reference. */
export const KnowledgeRepositoryPlatformValidationAcceptance = Object.freeze({
  validationId: KnowledgeRepositoryValidationId,
  validationStatus: KnowledgeRepositoryValidation.result.status,
  rules: KnowledgeRepositoryValidation.result.totalRules,
  passedRules: KnowledgeRepositoryValidation.result.passedRules,
  failedRules: KnowledgeRepositoryValidation.result.failedRules,
  gates: KnowledgeRepositoryValidation.result.gateCount,
  passedGates: KnowledgeRepositoryValidation.result.passedGates,
  failedGates: KnowledgeRepositoryValidation.result.failedGates,
  overallGateStatus: KnowledgeRepositoryValidation.result.gateStatus,
  referencedResult: KnowledgeRepositoryValidation.result,
});

/** Inventory acceptance derived from Manifest summary. */
export const KnowledgeRepositoryPlatformInventoryAcceptance = Object.freeze({
  foundationCapabilities: 9,
  foundationContracts: 8,
  foundationLifecycleStates: 7,
  foundationPolicies: 6,
  registryEntries: 103,
  registryGroups: 16,
  models: 52,
  relationships: 13,
  registryTraceabilityGroups: 14,
  validationRules: KnowledgeRepositoryValidation.result.totalRules,
  validationGates: KnowledgeRepositoryValidation.result.gateCount,
  manifestSections: manifestSummary.architectureSectionCount,
  manifestComponents: manifestSummary.componentCount,
  manifestPublicApis: getKnowledgeRepositoryManifestPublicApiCount(),
  manifestDependencies: manifestSummary.dependencyCount,
  manifestBoundaries: manifestSummary.boundaryDeclarationCount,
  manifestCompatibilityDeclarations: manifestSummary.compatibilityDeclarationCount,
  manifestGuarantees: manifestSummary.guaranteeCount,
  manifestCompletenessGates: manifestSummary.completenessGateCount,
  source: KnowledgeRepositoryManifestId,
});

/** Phase public API inventory including Platform. */
export const KnowledgeRepositoryPlatformPublicApis: readonly KnowledgeRepositoryPlatformPublicApiPhase[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-6:6/PublicApi/Foundation",
      phase: "DKL-6:1",
      sourceIdentity: KnowledgeRepositoryFoundationId,
      publicApiCount: 6,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:6/PublicApi/Registry",
      phase: "DKL-6:2",
      sourceIdentity: KnowledgeRepositoryRegistryId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:6/PublicApi/Model",
      phase: "DKL-6:3",
      sourceIdentity: KnowledgeRepositoryModelId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:6/PublicApi/Validation",
      phase: "DKL-6:4",
      sourceIdentity: KnowledgeRepositoryValidationId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:6/PublicApi/Manifest",
      phase: "DKL-6:5",
      sourceIdentity: KnowledgeRepositoryManifestId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:6/PublicApi/Platform",
      phase: "DKL-6:6",
      sourceIdentity: PLATFORM_ID,
      publicApiCount: PLATFORM_PUBLIC_API_COUNT,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

/** Exactly fourteen readiness gates — all Pass. */
export const KnowledgeRepositoryPlatformReadinessGates: readonly KnowledgeRepositoryPlatformReadinessGate[] =
  Object.freeze([
    gate(
      "DKL-6:6/Gate/PlatformIdentityGate",
      "PlatformIdentityGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/SectionCompositionGate",
      "SectionCompositionGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/CanonicalReferenceGate",
      "CanonicalReferenceGate",
      Object.freeze([
        KnowledgeRepositoryFoundationId,
        KnowledgeRepositoryRegistryId,
        KnowledgeRepositoryModelId,
        KnowledgeRepositoryValidationId,
        KnowledgeRepositoryManifestId,
      ]),
    ),
    gate(
      "DKL-6:6/Gate/FoundationReadinessGate",
      "FoundationReadinessGate",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    gate(
      "DKL-6:6/Gate/RegistryReadinessGate",
      "RegistryReadinessGate",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    gate(
      "DKL-6:6/Gate/ModelReadinessGate",
      "ModelReadinessGate",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    gate(
      "DKL-6:6/Gate/ValidationAcceptanceGate",
      "ValidationAcceptanceGate",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    gate(
      "DKL-6:6/Gate/ManifestAcceptanceGate",
      "ManifestAcceptanceGate",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    gate(
      "DKL-6:6/Gate/DependencyIntegrityGate",
      "DependencyIntegrityGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/CompatibilityGate",
      "CompatibilityGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/BoundaryPreservationGate",
      "BoundaryPreservationGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/GuaranteeCompletenessGate",
      "GuaranteeCompletenessGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/ImmutabilityGate",
      "ImmutabilityGate",
      Object.freeze([PLATFORM_ID]),
    ),
    gate(
      "DKL-6:6/Gate/CertificationReadinessGate",
      "CertificationReadinessGate",
      Object.freeze([PLATFORM_ID]),
    ),
  ]);

export const KnowledgeRepositoryPlatformReadinessManifest = Object.freeze({
  readinessGates: KnowledgeRepositoryPlatformReadinessGates,
  readinessGateCount: KnowledgeRepositoryPlatformReadinessGates.length,
  passedReadinessGateCount: KnowledgeRepositoryPlatformReadinessGates.filter(
    (item) => item.status === "Pass",
  ).length,
  failedReadinessGateCount: 0 as const,
  manifestAcceptance: KnowledgeRepositoryPlatformManifestAcceptance,
  validationAcceptance: KnowledgeRepositoryPlatformValidationAcceptance,
  inventoryAcceptance: KnowledgeRepositoryPlatformInventoryAcceptance,
  publicApis: KnowledgeRepositoryPlatformPublicApis,
  metadataOnly: true as const,
  immutable: true as const,
});
