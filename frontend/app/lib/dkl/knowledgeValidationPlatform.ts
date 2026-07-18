/**
 * DKL-5:6 — Knowledge Validation Platform.
 *
 * Canonical immutable Platform composition for DKL-5 Knowledge Validation.
 * Publishes exactly eight runtime exports. Composes DKL-5:1–5:5 by reference
 * only — no new contracts, no runtime organizational validation, no scoring,
 * no trust calculation, no cleansing, no remediation, no persistence, no Engine.
 *
 * Ownership: owned exclusively by DKL-5:6.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { KnowledgeValidationModel } from "./knowledgeValidationModel.ts";
import { KnowledgeValidationValidation } from "./knowledgeValidationValidation.ts";
import {
  KnowledgeValidationManifest,
  getKnowledgeValidationManifestStatistics,
} from "./knowledgeValidationManifest.ts";
import { KnowledgeValidationPlatformComponents } from "./knowledgeValidationPlatformComponents.ts";
import { KnowledgeValidationPlatformDependencies } from "./knowledgeValidationPlatformDependencies.ts";
import {
  KnowledgeValidationPlatformCompatibility,
  KnowledgeValidationPlatformExtensions,
} from "./knowledgeValidationPlatformCompatibility.ts";
import { KnowledgeValidationPlatformReadiness } from "./knowledgeValidationPlatformReadiness.ts";
import type {
  KnowledgeValidationPlatformIdentityDescriptor,
  PlatformInventoryDescriptor,
  PlatformStatusDescriptor,
  PlatformSummaryDescriptor,
} from "./knowledgeValidationPlatformTypes.ts";

export const KnowledgeValidationPlatformVersion = "1.0.0";

export const KnowledgeValidationPlatformNamespace =
  "nexora.dkl.knowledge-validation.platform";

export const KnowledgeValidationPlatformIdentity: KnowledgeValidationPlatformIdentityDescriptor =
  Object.freeze({
    platformId: "DKL-5:6/KnowledgeValidationPlatform",
    platformName: "Knowledge Validation Platform",
    platformVersion: KnowledgeValidationPlatformVersion,
    platformNamespace: KnowledgeValidationPlatformNamespace,
    phase: "DKL-5:6",
    status: "PlatformComplete",
    readiness: "ReadyForCertification",
    owner: "DKL-5 Knowledge Validation Platform",
    architectureType: "KnowledgeValidation",
    sourcePhases: Object.freeze([
      "DKL-5:1",
      "DKL-5:2",
      "DKL-5:3",
      "DKL-5:4",
      "DKL-5:5",
    ] as const),
    sectionCount: 6,
    componentCount: 5,
    validationStatus: "Pass",
    stabilityStatus: "Stable",
    compatibilityStatus: "Compatible",
    extensionStatus: "AdditiveAllowed",
    publicVisibility: "Public",
    metadataOnly: true,
    runtimeBehavior: false,
    certificationTarget: "DKL-5:7 — Knowledge Validation Certification",
    freezeTarget: "DKL-5:8 — Knowledge Validation Freeze",
    publicIndexTarget: "DKL-5:9 — Knowledge Validation Public Index",
  });

const stats = getKnowledgeValidationManifestStatistics();
const counts = KnowledgeValidationManifest.counts;

const PLATFORM_INVENTORY: PlatformInventoryDescriptor = Object.freeze({
  upstreamComponentCount: 5 as const,
  platformSectionCount: 6 as const,
  upstreamPublicApiCount: 40 as const,
  platformPublicApiCount: 8 as const,
  totalPublicApiCount: 48 as const,
  foundationContractCount: counts.foundationContractCount,
  validationTargetCount: counts.validationTargetCount,
  validationDimensionCount: counts.validationDimensionCount,
  qualitySignalCount: counts.qualitySignalCount,
  outcomeCount: counts.outcomeCount,
  severityCount: counts.severityCount,
  registryCollectionCount: counts.registryCollectionCount,
  registryEntryCount: counts.registryEntryCount,
  canonicalModelCount: counts.canonicalModelCount,
  modelRelationshipCount: counts.modelRelationshipCount,
  validationCategoryCount: counts.validationCategoryCount,
  validationRuleCount: counts.validationRuleCount,
  validationResultCount: counts.validationRuleCount,
  validationEvidenceCount: counts.validationEvidenceCount,
  validationPassCount: counts.validationPassCount,
  validationFailCount: counts.validationFailCount,
  manifestReadinessGateCount:
    KnowledgeValidationManifest.manifestReadiness.gateCount,
  compatibilityDeclarationCount: stats.compatibilityDeclarationCount,
  extensionDeclarationCount: stats.extensionDeclarationCount,
  lifecycleStateCount: counts.lifecycleStateCount,
  ownershipDeclarationCount: counts.ownershipDeclarationCount,
  dependencyDeclarationCount: counts.dependencyDeclarationCount,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const PLATFORM_BOUNDARIES = Object.freeze({
  separateFrom: Object.freeze([
    "Data ingestion",
    "Source connectors",
    "Parsing",
    "Data cleansing",
    "Source-system correction",
    "Knowledge Modeling creation",
    "Runtime Business Object creation",
    "Runtime organizational validation",
    "Numeric quality scoring",
    "Trust computation",
    "AI confidence generation",
    "Entity resolution",
    "Semantic inference",
    "Conflict resolution",
    "Ambiguity resolution",
    "Automatic remediation",
    "Persistence",
    "Repository implementation",
    "Search and query execution",
    "Graph traversal",
    "Executive reasoning",
    "Decisions",
    "Advisor behavior",
    "Scene rendering",
    "UI",
    "Notifications",
    "Workflow execution",
  ]),
  metadataOnly: true,
  immutable: true,
});

const PLATFORM_METADATA = Object.freeze({
  identity: KnowledgeValidationPlatformIdentity,
  version: KnowledgeValidationPlatformVersion,
  namespace: KnowledgeValidationPlatformNamespace,
  components: KnowledgeValidationPlatformComponents,
  inventory: PLATFORM_INVENTORY,
  dependencies: KnowledgeValidationPlatformDependencies,
  compatibility: KnowledgeValidationPlatformCompatibility,
  extensions: KnowledgeValidationPlatformExtensions,
  readiness: KnowledgeValidationPlatformReadiness,
  boundaries: PLATFORM_BOUNDARIES,
  ownership: Object.freeze({
    ownershipId: "DKL-5:6/PlatformOwnership",
    owner: "DKL-5 Knowledge Validation Platform",
    sourcePhase: "DKL-5:6" as const,
    owns: Object.freeze([
      "Platform identity",
      "Platform composition",
      "Ordered section metadata",
      "Component-reference registry",
      "Platform inventory",
      "Platform-level dependency metadata",
      "Platform-level compatibility metadata",
      "Platform-level extension metadata",
      "Platform guarantees",
      "Certification-readiness metadata",
      "Platform summaries",
    ]),
    doesNotOwn: Object.freeze([
      "Foundation contracts",
      "Registry entries",
      "Canonical models",
      "Validation rules",
      "Validation evidence",
      "Manifest inventories",
      "Runtime knowledge validation",
      "Numeric scoring",
      "Trust calculation",
      "Cleansing",
      "Conflict or ambiguity resolution",
      "Remediation",
      "Persistence",
      "Repositories",
      "Queries",
      "Search",
      "Executive reasoning",
      "Advisor",
      "Scene",
      "UI",
      "Notifications",
      "Workflow orchestration",
    ]),
    noOwnershipTransfer: true,
    earlierPhasesRetainOwnership: true,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze({
    oneCanonicalPlatformComposition: true,
    exactlySixOrderedSections: true,
    exactlyFiveUpstreamComponents: true,
    canonicalReferenceIdentity: true,
    immutableAndFrozenMetadata: true,
    deterministicOrdering: true,
    accurateInventories: true,
    noDuplicateOwnership: true,
    noDuplicatedContracts: true,
    noDuplicatedRegistryEntries: true,
    noDuplicatedModels: true,
    noDuplicatedValidationRules: true,
    noDuplicatedManifestInventories: true,
    publicEntryPointOnlyDependencies: true,
    noSourceScanning: true,
    noEnvironmentDependentBehavior: true,
    noRuntimeOrganizationalValidation: true,
    noNumericScoring: true,
    noTrustCalculation: true,
    noCleansing: true,
    noRemediation: true,
    noPersistence: true,
    noGraphTraversal: true,
    noAiOrSemanticInference: true,
    noExecutiveEngineBehavior: true,
    controlledAdditiveExtensions: true,
    readinessOnlyWhenAllGatesPass:
      KnowledgeValidationPlatformReadiness.allGatesPass === true,
  }),
  metadataOnly: true,
  platformOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * Canonical six-section platform structure.
 * Order: metadata → foundation → registry → model → validation → manifest.
 * Architecture sections reference canonical upstream exports by identity only.
 */
const PLATFORM_SECTIONS = Object.freeze({
  metadata: PLATFORM_METADATA,
  foundation: KnowledgeValidationFoundation,
  registry: KnowledgeValidationRegistry,
  model: KnowledgeValidationModel,
  validation: KnowledgeValidationValidation,
  manifest: KnowledgeValidationManifest,
});

/** Deterministic, metadata-only Platform summary. Pure and side-effect free. */
export function getKnowledgeValidationPlatformSummary(): PlatformSummaryDescriptor {
  return Object.freeze({
    platformId: KnowledgeValidationPlatformIdentity.platformId,
    version: KnowledgeValidationPlatformVersion,
    namespace: KnowledgeValidationPlatformNamespace,
    phase: "DKL-5:6" as const,
    status: "PlatformComplete" as const,
    readiness: "ReadyForCertification" as const,
    sectionCount: 6 as const,
    componentCount: 5 as const,
    dependencyCount: 5 as const,
    readinessGateCount: KnowledgeValidationPlatformReadiness.gateCount,
    readinessGatesPassed: KnowledgeValidationPlatformReadiness.passCount,
    readinessGatesFailed: KnowledgeValidationPlatformReadiness.failCount,
    allReadinessGatesPass: KnowledgeValidationPlatformReadiness.allGatesPass,
    totalPublicApiCount: 48 as const,
    validationStatus: "Pass" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Deterministic, metadata-only Platform status. Pure and side-effect free. */
export function getKnowledgeValidationPlatformStatus(): PlatformStatusDescriptor {
  return Object.freeze({
    status: "PlatformComplete" as const,
    readiness: "ReadyForCertification" as const,
    validationStatus: "Pass" as const,
    allReadinessGatesPass: KnowledgeValidationPlatformReadiness.allGatesPass,
    foundationComplete: true as const,
    registryComplete: true as const,
    modelComplete: true as const,
    validationComplete: true as const,
    validationPass: true as const,
    manifestComplete: true as const,
    platformComplete: true as const,
    runtimeBehaviorForbidden: true as const,
    ownershipConflictsAbsent: true as const,
    nextPhase: "DKL-5:7 — Knowledge Validation Certification" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Knowledge Validation Platform aggregate.
 * Primary section order: metadata → foundation → registry → model → validation → manifest.
 */
export const KnowledgeValidationPlatform = Object.freeze({
  metadata: PLATFORM_SECTIONS.metadata,
  foundation: PLATFORM_SECTIONS.foundation,
  registry: PLATFORM_SECTIONS.registry,
  model: PLATFORM_SECTIONS.model,
  validation: PLATFORM_SECTIONS.validation,
  manifest: PLATFORM_SECTIONS.manifest,
  sections: PLATFORM_SECTIONS,
  sectionOrder: KnowledgeValidationPlatformReadiness.primarySectionOrder,
  identity: KnowledgeValidationPlatformIdentity,
  version: KnowledgeValidationPlatformVersion,
  namespace: KnowledgeValidationPlatformNamespace,
  components: KnowledgeValidationPlatformComponents,
  inventory: PLATFORM_INVENTORY,
  dependencies: KnowledgeValidationPlatformDependencies,
  compatibility: KnowledgeValidationPlatformCompatibility,
  extensions: KnowledgeValidationPlatformExtensions,
  readiness: KnowledgeValidationPlatformReadiness,
  nextPhase: "DKL-5:7 — Knowledge Validation Certification",
  completionStatus: Object.freeze([
    "PlatformComplete",
    "AllReadinessGatesPass",
    "ReadyForCertification",
  ]),
  metadataOnly: true,
  platformOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeValidationPlatformComponents,
  KnowledgeValidationPlatformReadiness,
};
