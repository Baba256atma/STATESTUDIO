/**
 * DKL-6:1 — Knowledge Repository Foundation.
 *
 * Immutable architectural foundation of the Data Knowledge Layer Repository.
 * Consumes DKL-5 Public Index only. Metadata only — no runtime behavior,
 * persistence, database access, or storage engines.
 *
 * Ownership: owned exclusively by DKL-6:1.
 *
 * Public exports (exactly 6):
 *   KnowledgeRepositoryFoundation
 *   KnowledgeRepositoryFoundationId
 *   KnowledgeRepositoryFoundationVersion
 *   KnowledgeRepositoryFoundationNamespace
 *   KnowledgeRepositoryFoundationStatus
 *   getKnowledgeRepositoryFoundationSummary()
 */

import {
  KnowledgeValidationPublicIndexId,
  KnowledgeValidationPublicIndexVersion,
} from "./knowledgeValidationPublicIndex.ts";
import { KnowledgeRepositoryBoundaries } from "./knowledgeRepositoryBoundaries.ts";
import { KnowledgeRepositoryContracts } from "./knowledgeRepositoryContracts.ts";
import type {
  FoundationSummaryDescriptor,
  KnowledgeRepositoryFoundationIdentityDescriptor,
} from "./knowledgeRepositoryFoundationTypes.ts";
import { KnowledgeRepositoryLifecycle } from "./knowledgeRepositoryLifecycle.ts";
import { KnowledgeRepositoryOwnership } from "./knowledgeRepositoryOwnership.ts";
import { KnowledgeRepositoryPolicies } from "./knowledgeRepositoryPolicies.ts";

export const KnowledgeRepositoryFoundationId =
  "DKL-6:1/KnowledgeRepositoryFoundation" as const;

export const KnowledgeRepositoryFoundationVersion = "1.0.0" as const;

export const KnowledgeRepositoryFoundationNamespace =
  "nexora.dkl.repository.foundation" as const;

export const KnowledgeRepositoryFoundationStatus = "Foundation" as const;

const identity: KnowledgeRepositoryFoundationIdentityDescriptor = Object.freeze({
  foundationId: KnowledgeRepositoryFoundationId,
  foundationName: "Knowledge Repository Foundation",
  foundationVersion: KnowledgeRepositoryFoundationVersion,
  foundationNamespace: KnowledgeRepositoryFoundationNamespace,
  phase: "DKL-6:1",
  owner: "DKL-6 Knowledge Repository",
  architectureType: "KnowledgeRepository",
  status: KnowledgeRepositoryFoundationStatus,
  readiness: "ReadyForRegistry",
  metadataOnly: true,
  runtimeBehavior: false,
  persistenceImplementation: false,
  immutable: true,
});

const foundationValidation = Object.freeze({
  identityExists:
    identity.foundationId === KnowledgeRepositoryFoundationId &&
    identity.foundationId.length > 0,
  namespaceImmutable:
    identity.foundationNamespace === KnowledgeRepositoryFoundationNamespace,
  versionImmutable:
    identity.foundationVersion === KnowledgeRepositoryFoundationVersion,
  ownershipComplete:
    KnowledgeRepositoryOwnership.ownsCount === 11 &&
    KnowledgeRepositoryOwnership.doesNotOwnCount === 19,
  boundariesDeclared:
    KnowledgeRepositoryBoundaries.consumes.length === 1 &&
    KnowledgeRepositoryBoundaries.provides.length === 1 &&
    KnowledgeRepositoryBoundaries.neverAccesses.length === 6,
  lifecycleComplete: KnowledgeRepositoryLifecycle.stateCount === 7,
  policiesComplete: KnowledgeRepositoryPolicies.policyCount === 6,
  contractsDeclared: KnowledgeRepositoryContracts.contractCount === 8,
  capabilitiesDeclared: KnowledgeRepositoryContracts.capabilityCount === 9,
  upstreamPublicIndexBound:
    KnowledgeValidationPublicIndexId === "DKL-5:9/KnowledgeValidationPublicIndex",
  metadataOnly: true,
  noRuntimeValidation: true,
});

/** Canonical immutable Knowledge Repository Foundation. */
export const KnowledgeRepositoryFoundation = Object.freeze({
  identity,
  foundationId: KnowledgeRepositoryFoundationId,
  version: KnowledgeRepositoryFoundationVersion,
  namespace: KnowledgeRepositoryFoundationNamespace,
  status: KnowledgeRepositoryFoundationStatus,
  readiness: "ReadyForRegistry" as const,
  contracts: KnowledgeRepositoryContracts,
  ownership: KnowledgeRepositoryOwnership,
  boundaries: KnowledgeRepositoryBoundaries,
  lifecycle: KnowledgeRepositoryLifecycle,
  policies: KnowledgeRepositoryPolicies,
  upstream: Object.freeze({
    publicIndexId: KnowledgeValidationPublicIndexId,
    publicIndexVersion: KnowledgeValidationPublicIndexVersion,
    consumesPublicIndexOnly: true as const,
  }),
  validation: foundationValidation,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  persistenceImplementation: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic summary of the Knowledge Repository Foundation. */
export function getKnowledgeRepositoryFoundationSummary(): FoundationSummaryDescriptor {
  return Object.freeze({
    foundationId: KnowledgeRepositoryFoundationId,
    version: KnowledgeRepositoryFoundationVersion,
    namespace: KnowledgeRepositoryFoundationNamespace,
    status: KnowledgeRepositoryFoundationStatus,
    readiness: "ReadyForRegistry",
    capabilityCount: KnowledgeRepositoryContracts.capabilityCount,
    contractCount: KnowledgeRepositoryContracts.contractCount,
    lifecycleStateCount: KnowledgeRepositoryLifecycle.stateCount,
    policyCount: KnowledgeRepositoryPolicies.policyCount,
    ownsCount: KnowledgeRepositoryOwnership.ownsCount,
    doesNotOwnCount: KnowledgeRepositoryOwnership.doesNotOwnCount,
    upstreamPublicIndexId: KnowledgeValidationPublicIndexId,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
