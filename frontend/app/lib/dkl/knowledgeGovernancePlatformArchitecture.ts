/**
 * DKL-8:6 — Knowledge Governance Platform Architecture.
 *
 * Phase chain and upstream surfaces reached exclusively through
 * KnowledgeGovernanceManifestPlatform by canonical reference.
 *
 * Ownership: owned exclusively by DKL-8:6.
 */

import { KnowledgeGovernanceManifestPlatform } from "./knowledgeGovernanceManifest.ts";
import type { KnowledgeGovernancePlatformPhaseReference } from "./knowledgeGovernancePlatformTypes.ts";

/** Sole upstream surface. */
const manifest = KnowledgeGovernanceManifestPlatform;
const validation = manifest.upstreamValidation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phase = (
  phaseId: string,
  phaseName: string,
  stage: string,
  version: string,
  status: string,
  predecessor: string | null,
  successor: string | null,
  path: string,
  role: string,
  completed: boolean,
  order: number,
): KnowledgeGovernancePlatformPhaseReference =>
  Object.freeze({
    phaseId,
    phaseName,
    stage,
    version,
    status,
    directPredecessor: predecessor,
    directSuccessor: successor,
    canonicalReferencePath: path,
    architectureRole: role,
    runtimeBehavior: "None" as const,
    completed,
    deterministicOrder: order,
  });

/**
 * Nine DKL-8 phases: six completed through Platform, three future.
 * Upstream identities derived from Manifest-chain references.
 */
export const KnowledgeGovernancePlatformPhases: readonly KnowledgeGovernancePlatformPhaseReference[] =
  Object.freeze([
    phase(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      "Foundation",
      foundation.identity.foundationVersion,
      foundation.status,
      foundation.identity.dkl7PublicIndexId,
      registry.identity.registryId,
      "Platform.manifest.upstreamValidation.model.registry.foundation",
      "Foundation",
      true,
      1,
    ),
    phase(
      registry.identity.registryId,
      registry.identity.registryName,
      "Registry",
      registry.identity.registryVersion,
      registry.status,
      foundation.identity.foundationId,
      model.identity.modelId,
      "Platform.manifest.upstreamValidation.model.registry",
      "Registry",
      true,
      2,
    ),
    phase(
      model.identity.modelId,
      model.identity.modelName,
      "Model",
      model.identity.modelVersion,
      model.status,
      registry.identity.registryId,
      validation.identity.validationId,
      "Platform.manifest.upstreamValidation.model",
      "Model",
      true,
      3,
    ),
    phase(
      validation.identity.validationId,
      validation.identity.validationName,
      "Validation",
      validation.identity.validationVersion,
      validation.status,
      model.identity.modelId,
      manifest.identity.manifestId,
      "Platform.manifest.upstreamValidation",
      "Validation",
      true,
      4,
    ),
    phase(
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      "Manifest",
      manifest.identity.manifestVersion,
      manifest.status,
      validation.identity.validationId,
      "DKL-8:6/KnowledgeGovernancePlatform",
      "Platform.manifest",
      "Manifest",
      true,
      5,
    ),
    phase(
      "DKL-8:6/KnowledgeGovernancePlatform",
      "Knowledge Governance Platform",
      "Platform",
      "1.0.0",
      "PlatformDefined",
      manifest.identity.manifestId,
      "DKL-8:7/KnowledgeGovernanceCertification",
      "Platform",
      "Platform",
      true,
      6,
    ),
    phase(
      "DKL-8:7/KnowledgeGovernanceCertification",
      "Knowledge Governance Certification",
      "Certification",
      "Future",
      "Declared",
      "DKL-8:6/KnowledgeGovernancePlatform",
      "DKL-8:8/KnowledgeGovernanceFreeze",
      "Future/Certification",
      "Certification",
      false,
      7,
    ),
    phase(
      "DKL-8:8/KnowledgeGovernanceFreeze",
      "Knowledge Governance Freeze",
      "Freeze",
      "Future",
      "Declared",
      "DKL-8:7/KnowledgeGovernanceCertification",
      "DKL-8:9/KnowledgeGovernancePublicIndex",
      "Future/Freeze",
      "Freeze",
      false,
      8,
    ),
    phase(
      "DKL-8:9/KnowledgeGovernancePublicIndex",
      "Knowledge Governance Public Index",
      "PublicIndex",
      "Future",
      "Declared",
      "DKL-8:8/KnowledgeGovernanceFreeze",
      null,
      "Future/PublicIndex",
      "PublicIndex",
      false,
      9,
    ),
  ]);

const completedPhaseCount = KnowledgeGovernancePlatformPhases.filter(
  (item) => item.completed,
).length;
const futurePhaseCount = KnowledgeGovernancePlatformPhases.filter(
  (item) => !item.completed,
).length;

/** Chain IDs derived from Manifest-preserved upstream references. */
export const KnowledgeGovernancePlatformChainIds = Object.freeze({
  foundationId: foundation.identity.foundationId,
  registryId: registry.identity.registryId,
  modelId: model.identity.modelId,
  validationId: validation.identity.validationId,
  manifestId: manifest.identity.manifestId,
  platformId: "DKL-8:6/KnowledgeGovernancePlatform" as const,
  preservedByReference: true as const,
});

/**
 * Upstream surfaces preserved by Manifest-chain reference.
 * Foundation/Registry/Model/Validation/Manifest are not reconstructed.
 */
export const KnowledgeGovernancePlatformUpstreamSurfaces = Object.freeze({
  manifest,
  validation,
  model,
  registry,
  foundation,
  ownership: manifest.ownership,
  boundaries: manifest.boundaries,
  manifestInventory: manifest.inventory,
  manifestCounts: manifest.counts,
  preservedByReference: true as const,
});

/**
 * Observed counts derived only through Manifest inventory / collections.
 * No hardcoded upstream inventory values.
 */
export const KnowledgeGovernancePlatformObservedCounts = Object.freeze({
  completedPhaseCount,
  futurePhaseCount,
  totalDkl8PhaseCount: KnowledgeGovernancePlatformPhases.length,
  manifestTotalEntryCount: manifest.inventory.totalEntryCount,
  registryEntryCount: manifest.inventory.registryEntryCount,
  subjectCount: manifest.inventory.subjectCount,
  contractCount: manifest.inventory.contractCount,
  roleCount: manifest.inventory.roleCount,
  capabilityCount: manifest.inventory.capabilityCount,
  classificationCount: manifest.inventory.classificationCount,
  sensitivityCount: manifest.inventory.sensitivityCount,
  modelKindCount: manifest.inventory.modelKindCount,
  relationshipKindCount: manifest.inventory.relationshipKindCount,
  validationRuleCount: manifest.inventory.validationRuleCount,
  validationCategoryCount: manifest.inventory.validationCategoryCount,
  validationGateCount: manifest.inventory.validationGateCount,
  ownershipDeclarationCount: manifest.inventory.ownershipDeclarationCount,
  boundaryCount: manifest.inventory.boundaryCount,
  manifestSectionCount: manifest.sectionCount,
  manifestDependencyCount: manifest.dependencies.length,
  manifestGuaranteeCount: manifest.guarantees.length,
  manifestCompatibilityCount: manifest.compatibility.length,
  manifestPublicApiCount: manifest.publicApi.length,
  validationOutcome: manifest.validation.validationOutcome,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
