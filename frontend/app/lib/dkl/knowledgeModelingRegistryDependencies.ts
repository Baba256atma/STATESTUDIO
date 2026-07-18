/**
 * DKL-4:2 — Knowledge Modeling Registry Dependencies.
 *
 * Immutable dependency metadata. DKL-4:2 consumes DKL-4:1 only through
 * knowledgeModelingFoundation.ts and does not import DKL-3 directly.
 *
 * Ownership: owned exclusively by DKL-4:2.
 */

import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";

/** Canonical immutable registry dependency metadata. */
export const KnowledgeModelingRegistryDependencies = Object.freeze({
  dependencyId: "DKL-4:2/KnowledgeModelingRegistryDependencies",
  sourcePhase: "DKL-4:2",
  approvedFoundationDependency: Object.freeze({
    module: "knowledgeModelingFoundation.ts",
    phase: KnowledgeModelingFoundationIdentity.sourcePhase,
    version: KnowledgeModelingFoundationVersion,
    foundationId: KnowledgeModelingFoundationIdentity.foundationId,
    readiness: KnowledgeModelingFoundationIdentity.readiness,
    required: true,
    publicFoundationOnly: true,
  }),
  upstreamByReference: Object.freeze({
    dkl3PublicIndexId: KnowledgeModelingFoundation.upstream.dkl3PublicIndexId,
    dkl3PublicIndexVersion: KnowledgeModelingFoundation.upstream.dkl3PublicIndexVersion,
    reachedThroughFoundation: true,
  }),
  allowedDependencyCount: 1,
  noDirectDkl3Dependency: true,
  noFutureDkl4Dependency: true,
  forbidden: Object.freeze([
    "knowledgeModelingFoundationTypes.ts",
    "knowledgeModelingContracts.ts",
    "knowledgeModelingOwnership.ts",
    "knowledgeModelingBoundaries.ts",
    "knowledgeModelingLifecycle.ts",
    "knowledgeModelingDependencies.ts",
    "dataUnderstandingPublicIndex.ts",
    "DKL-3 direct imports",
    "DKL-4:3+",
    "DKL-5+",
    "Engine",
    "Advisor",
    "Scene",
    "UI",
    "Persistence",
    "Database",
    "AI",
    "external packages",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
