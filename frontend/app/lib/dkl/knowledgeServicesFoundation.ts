/**
 * DKL-7:1 — Knowledge Services Foundation.
 *
 * Immutable architectural foundation of the Data Knowledge Layer Knowledge
 * Services. Consumes DKL-6 Public Index only. Metadata only — no runtime
 * behavior, repository access, search, graph traversal, or service logic.
 *
 * Ownership: owned exclusively by DKL-7:1.
 *
 * Public exports (exactly 7):
 *   KnowledgeServicesFoundation
 *   KnowledgeServicesFoundationId
 *   KnowledgeServicesFoundationName
 *   KnowledgeServicesFoundationVersion
 *   KnowledgeServicesFoundationNamespace
 *   KnowledgeServicesFoundationStatus
 *   getKnowledgeServicesFoundationSummary()
 */

import {
  KnowledgeRepositoryPublicIndexId,
  KnowledgeRepositoryPublicIndexVersion,
} from "./knowledgeRepositoryPublicIndex.ts";
import { KnowledgeServicesBoundaries } from "./knowledgeServicesBoundaries.ts";
import { KnowledgeServicesCapabilities } from "./knowledgeServicesCapabilities.ts";
import { KnowledgeServicesContracts } from "./knowledgeServicesContracts.ts";
import type {
  KnowledgeServicesFoundationIdentity,
  KnowledgeServicesFoundationSummary,
} from "./knowledgeServicesFoundationTypes.ts";
import { KnowledgeServicesLifecycle } from "./knowledgeServicesLifecycle.ts";
import { KnowledgeServicesOwnership } from "./knowledgeServicesOwnership.ts";

export const KnowledgeServicesFoundationId =
  "DKL-7:1/KnowledgeServicesFoundation" as const;

export const KnowledgeServicesFoundationName =
  "Knowledge Services Foundation" as const;

export const KnowledgeServicesFoundationVersion = "1.0.0" as const;

export const KnowledgeServicesFoundationNamespace =
  "nexora.dkl.knowledge-services.foundation" as const;

export const KnowledgeServicesFoundationStatus = "FoundationComplete" as const;

const identity: KnowledgeServicesFoundationIdentity = Object.freeze({
  foundationId: KnowledgeServicesFoundationId,
  foundationName: KnowledgeServicesFoundationName,
  foundationVersion: KnowledgeServicesFoundationVersion,
  foundationNamespace: KnowledgeServicesFoundationNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Foundation",
  sourcePhase: "DKL-7:1",
  owner: "DKL-7 Knowledge Services",
  architectureType: "KnowledgeServices",
  status: KnowledgeServicesFoundationStatus,
  readiness: "ReadyForRegistry",
  metadataOnly: true,
  runtimeBehavior: false,
  serviceImplementation: false,
  immutable: true,
});

const dependencies = Object.freeze({
  allowed: Object.freeze([
    Object.freeze({
      module: "knowledgeRepositoryPublicIndex.ts",
      publicIndexId: KnowledgeRepositoryPublicIndexId,
      publicIndexVersion: KnowledgeRepositoryPublicIndexVersion,
      phase: "DKL-6:9" as const,
    }),
  ]),
  forbidden: Object.freeze([
    "Engine",
    "BUS",
    "OPS",
    "CORE",
    "Advisor",
    "Scene",
    "UI",
    "Database",
    "Repository implementation",
    "NEA",
  ] as const),
  allowedCount: 1,
  consumesDkl6PublicIndexOnly: true as const,
  metadataOnly: true as const,
});

const metadata = Object.freeze({
  metadataOnly: true as const,
  knowledgeServicesArchitectureOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  runtimeBehavior: false as const,
  serviceImplementation: false as const,
  repositoryAccess: false as const,
  searchEngine: false as const,
  graphTraversal: false as const,
  indexing: false as const,
  caching: false as const,
  queryExecution: false as const,
  persistence: false as const,
  networking: false as const,
  aiReasoning: false as const,
  executiveEngineBehavior: false as const,
  advisorBehavior: false as const,
  sceneBehavior: false as const,
  businessObjectImplementation: false as const,
  createsKnowledge: false as const,
  modifiesKnowledge: false as const,
  sideEffectsPerformed: false as const,
});

const foundationValidation = Object.freeze({
  identityExists:
    identity.foundationId === KnowledgeServicesFoundationId &&
    identity.foundationId.length > 0,
  namespaceImmutable:
    identity.foundationNamespace === KnowledgeServicesFoundationNamespace,
  versionImmutable:
    identity.foundationVersion === KnowledgeServicesFoundationVersion,
  statusComplete: identity.status === "FoundationComplete",
  ownershipComplete:
    KnowledgeServicesOwnership.ownsCount === 6 &&
    KnowledgeServicesOwnership.doesNotOwnCount === 24,
  boundariesDeclared:
    KnowledgeServicesBoundaries.consumes.length === 1 &&
    KnowledgeServicesBoundaries.provides.length === 1 &&
    KnowledgeServicesBoundaries.prohibitedSurfaceCount === 29,
  lifecycleComplete: KnowledgeServicesLifecycle.stageCount === 8,
  capabilitiesDeclared: KnowledgeServicesCapabilities.capabilityCount === 12,
  contractsDeclared: KnowledgeServicesContracts.contractCount === 11,
  upstreamPublicIndexBound:
    KnowledgeRepositoryPublicIndexId ===
    "DKL-6:9/KnowledgeRepositoryPublicIndex",
  metadataOnly: true,
  noRuntimeValidation: true,
});

/** Canonical immutable Knowledge Services Foundation. */
export const KnowledgeServicesFoundation = Object.freeze({
  identity,
  foundationId: KnowledgeServicesFoundationId,
  foundationName: KnowledgeServicesFoundationName,
  foundationVersion: KnowledgeServicesFoundationVersion,
  foundationNamespace: KnowledgeServicesFoundationNamespace,
  foundationStatus: KnowledgeServicesFoundationStatus,
  name: KnowledgeServicesFoundationName,
  version: KnowledgeServicesFoundationVersion,
  namespace: KnowledgeServicesFoundationNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-7" as const,
  stage: "Foundation" as const,
  status: KnowledgeServicesFoundationStatus,
  readiness: "ReadyForRegistry" as const,
  soleArchitecturalDependency: true as const,
  referencedThroughPublicFoundation: true as const,
  ownership: KnowledgeServicesOwnership,
  capabilities: KnowledgeServicesCapabilities,
  boundaries: KnowledgeServicesBoundaries,
  lifecycle: KnowledgeServicesLifecycle,
  contracts: KnowledgeServicesContracts,
  metadata,
  dependencies,
  upstream: Object.freeze({
    publicIndexId: KnowledgeRepositoryPublicIndexId,
    publicIndexVersion: KnowledgeRepositoryPublicIndexVersion,
    module: "knowledgeRepositoryPublicIndex.ts",
    consumesPublicIndexOnly: true as const,
  }),
  validation: foundationValidation,
  nextPhase: "DKL-7:2 — Knowledge Services Registry",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceImplementation: false as const,
  createsKnowledge: false as const,
  modifiesKnowledge: false as const,
  performsExecutiveReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic summary of the Knowledge Services Foundation. */
export function getKnowledgeServicesFoundationSummary(): KnowledgeServicesFoundationSummary {
  return Object.freeze({
    foundationId: KnowledgeServicesFoundationId,
    version: KnowledgeServicesFoundationVersion,
    namespace: KnowledgeServicesFoundationNamespace,
    layer: "Data Knowledge Layer",
    phase: "DKL-7",
    stage: "Foundation",
    status: KnowledgeServicesFoundationStatus,
    readiness: "ReadyForRegistry",
    capabilityCount: KnowledgeServicesCapabilities.capabilityCount,
    contractCount: KnowledgeServicesContracts.contractCount,
    lifecycleStageCount: KnowledgeServicesLifecycle.stageCount,
    ownsCount: KnowledgeServicesOwnership.ownsCount,
    doesNotOwnCount: KnowledgeServicesOwnership.doesNotOwnCount,
    prohibitedBoundaryCount: KnowledgeServicesBoundaries.prohibitedSurfaceCount,
    upstreamPublicIndexId: KnowledgeRepositoryPublicIndexId,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
