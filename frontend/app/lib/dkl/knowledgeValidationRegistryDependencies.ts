/**
 * DKL-5:2 — Knowledge Validation Registry Dependencies.
 *
 * Immutable dependency declarations. Consumes DKL-5:1 public foundation only.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";

/** Canonical immutable registry dependency declarations. */
export const KnowledgeValidationRegistryDependencies = Object.freeze({
  dependencyId: "DKL-5:2/RegistryDependencies",
  sourcePhase: "DKL-5:2" as const,
  approvedFoundationDependency: Object.freeze({
    module: "knowledgeValidationFoundation.ts",
    phase: KnowledgeValidationFoundationIdentity.sourcePhase,
    version: KnowledgeValidationFoundationVersion,
    foundationId: KnowledgeValidationFoundationIdentity.foundationId,
    status: KnowledgeValidationFoundationIdentity.status,
    readiness: KnowledgeValidationFoundationIdentity.readiness,
    required: true,
    publicEntryPointOnly: true,
  }),
  upstreamByReference: Object.freeze({
    dkl4PublicIndexId: KnowledgeValidationFoundation.upstream.dkl4PublicIndexId,
    dkl4PublicIndexVersion: KnowledgeValidationFoundation.upstream.dkl4PublicIndexVersion,
    reachedThroughFoundation: true,
    foundationReadyForRegistry:
      KnowledgeValidationFoundation.readiness.ReadyForRegistry === true,
  }),
  noDirectDkl4Dependency: true,
  noInternalFoundationImports: true,
  noFutureDkl5Dependency: true,
  forbidden: Object.freeze([
    "knowledgeValidationFoundationTypes.ts",
    "knowledgeValidationContracts.ts",
    "knowledgeValidationOwnership.ts",
    "knowledgeValidationBoundaries.ts",
    "knowledgeValidationLifecycle.ts",
    "knowledgeValidationDependencies.ts",
    "knowledgeModelingPublicIndex.ts",
    "DKL-4 direct imports",
    "DKL-5:3+",
    "Engine",
    "Advisor",
    "Scene",
    "UI",
    "Persistence",
    "AI",
    "external packages",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
