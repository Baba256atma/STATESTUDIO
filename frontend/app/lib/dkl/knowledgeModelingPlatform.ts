/**
 * DKL-4:6 — Knowledge Modeling Platform.
 *
 * Canonical immutable Platform composition for DKL-4 Knowledge Modeling.
 * Publishes exactly eight runtime exports. Composes DKL-4:1–4:5 by reference
 * only — no new architecture, no runtime objects, no graphs, no persistence,
 * no AI, no Engine.
 *
 * Ownership: owned exclusively by DKL-4:6.
 */

import { KnowledgeModelingFoundation } from "./knowledgeModelingFoundation.ts";
import { KnowledgeModelingRegistry } from "./knowledgeModelingRegistry.ts";
import { KnowledgeModelingModel } from "./knowledgeModelingModel.ts";
import { KnowledgeModelingValidation } from "./knowledgeModelingValidation.ts";
import { KnowledgeModelingManifest } from "./knowledgeModelingManifest.ts";
import { KnowledgeModelingPlatformComponents } from "./knowledgeModelingPlatformComponents.ts";
import { KnowledgeModelingPlatformDependencies } from "./knowledgeModelingPlatformDependencies.ts";
import {
  KnowledgeModelingPlatformCompatibility,
  KnowledgeModelingPlatformExtensions,
} from "./knowledgeModelingPlatformCompatibility.ts";
import { KnowledgeModelingPlatformReadiness } from "./knowledgeModelingPlatformReadiness.ts";
import type {
  KnowledgeModelingPlatformIdentityDescriptor,
  PlatformStatusDescriptor,
  PlatformSummaryDescriptor,
} from "./knowledgeModelingPlatformTypes.ts";

export const KnowledgeModelingPlatformVersion = "1.0.0";

export const KnowledgeModelingPlatformNamespace =
  "nexora.dkl.knowledge-modeling.platform";

export const KnowledgeModelingPlatformIdentity: KnowledgeModelingPlatformIdentityDescriptor =
  Object.freeze({
    id: "DKL-4:6/KnowledgeModelingPlatform",
    name: "Knowledge Modeling Platform",
    version: KnowledgeModelingPlatformVersion,
    namespace: KnowledgeModelingPlatformNamespace,
    phase: "DKL-4:6",
    status: "PlatformComplete",
    readiness: "ReadyForCertification",
    owner: "DKL-4 Knowledge Modeling Platform",
    architectureType: "KnowledgeModelingPlatform",
    sourcePhases: Object.freeze([
      "DKL-4:1",
      "DKL-4:2",
      "DKL-4:3",
      "DKL-4:4",
      "DKL-4:5",
    ] as const),
    publicVisibility: "Public",
    stability: "Stable",
    compatibilityStatus: "Compatible",
    extensionStatus: "AdditiveAllowed",
    metadataOnly: true,
    runtimeBehavior: "Forbidden",
    certificationTarget: "DKL-4:7",
    freezeTarget: "DKL-4:8",
    publicIndexTarget: "DKL-4:9",
    platformId: "DKL-4",
    sourcePhase: "DKL-4:6",
  });

const PLATFORM_METADATA = Object.freeze({
  identity: KnowledgeModelingPlatformIdentity,
  version: KnowledgeModelingPlatformVersion,
  namespace: KnowledgeModelingPlatformNamespace,
  components: KnowledgeModelingPlatformComponents,
  dependencies: KnowledgeModelingPlatformDependencies,
  compatibility: KnowledgeModelingPlatformCompatibility,
  extensions: KnowledgeModelingPlatformExtensions,
  readiness: KnowledgeModelingPlatformReadiness,
  ownership: Object.freeze({
    ownershipId: "DKL-4:6/PlatformOwnership",
    owner: "DKL-4 Knowledge Modeling Platform",
    sourcePhase: "DKL-4:6" as const,
    owns: Object.freeze([
      "Platform composition metadata",
      "Platform identity",
      "Ordered platform sections",
      "Component-reference registry",
      "Platform-level dependency declarations",
      "Platform-level compatibility declarations",
      "Platform-level extension declarations",
      "Readiness for Certification",
      "Platform summaries",
    ]),
    doesNotOwn: Object.freeze([
      "Foundation contracts",
      "Registry entries",
      "Canonical models",
      "Validation rules",
      "Manifest inventories",
      "Runtime Knowledge Objects",
      "Runtime Business Objects",
      "Runtime entities",
      "Runtime relationships",
      "Graph construction",
      "Graph traversal",
      "Repository behavior",
      "Persistence",
      "Queries",
      "Search",
      "Entity resolution",
      "Semantic inference",
      "AI",
      "Executive reasoning",
      "Decisions",
      "Advisor",
      "Scene",
      "UI",
      "Orchestration",
    ]),
    noDuplicatedOwnership: true,
    earlierPhasesRetainOwnership: true,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze({
    oneCanonicalPlatformComposition: true,
    immutableOrderedSections: true,
    upstreamIncludedByReference: true,
    noDuplicatedOwnership: true,
    noDuplicatedContracts: true,
    noDuplicatedRegistries: true,
    noDuplicatedModels: true,
    noDuplicatedValidationRules: true,
    noDuplicatedManifestInventories: true,
    deterministicMetadata: true,
    frozenExportedStructures: true,
    publicEntryPointOnlyDependencies: true,
    noRuntimeBehavior: true,
    noHiddenMutableState: true,
    noSourceInspection: true,
    noEnvironmentDependentBehavior: true,
    noPersistenceAssumptions: true,
    noGraphOperations: true,
    noAiOrInference: true,
    noEngineBehavior: true,
    readinessRequiresEarlierPhasesComplete: true,
  }),
  metadataOnly: true,
  platformOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * Deterministic, metadata-only Platform summary. Pure and side-effect free.
 */
export function getKnowledgeModelingPlatformSummary(): PlatformSummaryDescriptor {
  return Object.freeze({
    platformId: KnowledgeModelingPlatformIdentity.id,
    version: KnowledgeModelingPlatformVersion,
    namespace: KnowledgeModelingPlatformNamespace,
    phase: "DKL-4:6" as const,
    status: "PlatformComplete" as const,
    readiness: "ReadyForCertification" as const,
    sectionCount: 6 as const,
    componentCount: 5 as const,
    dependencyCount: 5 as const,
    readinessGateCount: KnowledgeModelingPlatformReadiness.gateCount,
    readinessGatesPassed: KnowledgeModelingPlatformReadiness.passCount,
    readinessGatesFailed: KnowledgeModelingPlatformReadiness.failCount,
    allReadinessGatesPass: true as const,
    totalPublicApiCount: 48 as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Deterministic, metadata-only Platform status. Pure and side-effect free.
 */
export function getKnowledgeModelingPlatformStatus(): PlatformStatusDescriptor {
  return Object.freeze({
    status: "PlatformComplete" as const,
    readiness: "ReadyForCertification" as const,
    allReadinessGatesPass: true as const,
    foundationComplete: true as const,
    registryComplete: true as const,
    modelComplete: true as const,
    validationComplete: true as const,
    validationPass: true as const,
    manifestComplete: true as const,
    platformComplete: true as const,
    runtimeBehaviorForbidden: true as const,
    ownershipConflictsAbsent: true as const,
    nextPhase: "DKL-4:7 — Knowledge Modeling Certification" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical six-section platform structure.
 * Order: metadata → foundation → registry → model → validation → manifest.
 * Architecture sections reference canonical upstream exports by identity only.
 */
const PLATFORM_SECTIONS = Object.freeze({
  metadata: PLATFORM_METADATA,
  foundation: KnowledgeModelingFoundation,
  registry: KnowledgeModelingRegistry,
  model: KnowledgeModelingModel,
  validation: KnowledgeModelingValidation,
  manifest: KnowledgeModelingManifest,
});

/**
 * Canonical immutable Knowledge Modeling Platform aggregate.
 * Primary section order: metadata → foundation → registry → model → validation → manifest.
 */
export const KnowledgeModelingPlatform = Object.freeze({
  metadata: PLATFORM_SECTIONS.metadata,
  foundation: PLATFORM_SECTIONS.foundation,
  registry: PLATFORM_SECTIONS.registry,
  model: PLATFORM_SECTIONS.model,
  validation: PLATFORM_SECTIONS.validation,
  manifest: PLATFORM_SECTIONS.manifest,
  sections: PLATFORM_SECTIONS,
  sectionOrder: KnowledgeModelingPlatformReadiness.primarySectionOrder,
  identity: KnowledgeModelingPlatformIdentity,
  version: KnowledgeModelingPlatformVersion,
  namespace: KnowledgeModelingPlatformNamespace,
  components: KnowledgeModelingPlatformComponents,
  dependencies: KnowledgeModelingPlatformDependencies,
  compatibility: KnowledgeModelingPlatformCompatibility,
  extensions: KnowledgeModelingPlatformExtensions,
  readiness: KnowledgeModelingPlatformReadiness,
  nextPhase: "DKL-4:7 — Knowledge Modeling Certification",
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
  KnowledgeModelingPlatformComponents,
  KnowledgeModelingPlatformReadiness,
};
