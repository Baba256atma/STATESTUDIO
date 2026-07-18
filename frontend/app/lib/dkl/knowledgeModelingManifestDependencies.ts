/**
 * DKL-4:5 — Knowledge Modeling Manifest Dependencies.
 *
 * Immutable dependency inventory for approved public entry points only.
 * Never includes future phases, internal prior-phase files, or DKL-3 direct.
 *
 * Ownership: owned exclusively by DKL-4:5.
 */

import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistry,
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistryVersion,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModel,
  KnowledgeModelingModelIdentity,
  KnowledgeModelingModelVersion,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidation,
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationVersion,
} from "./knowledgeModelingValidation.ts";
import type { ManifestDependencyEntry } from "./knowledgeModelingManifestTypes.ts";

const dep = (
  dependencyId: string,
  dependencyName: string,
  module: string,
  version: string,
  phase: string,
  readiness: string,
): ManifestDependencyEntry =>
  Object.freeze({
    dependencyId,
    dependencyName,
    module,
    version,
    phase,
    readiness,
    required: true as const,
    futurePhase: false as const,
    publicEntryPointOnly: true as const,
  });

const ENTRIES: readonly ManifestDependencyEntry[] = Object.freeze([
  dep(
    "dep-dkl-4-1-foundation",
    "DKL-4:1 Foundation",
    "knowledgeModelingFoundation.ts",
    KnowledgeModelingFoundationVersion,
    KnowledgeModelingFoundationIdentity.sourcePhase,
    KnowledgeModelingFoundationIdentity.readiness,
  ),
  dep(
    "dep-dkl-4-2-registry",
    "DKL-4:2 Registry",
    "knowledgeModelingRegistry.ts",
    KnowledgeModelingRegistryVersion,
    KnowledgeModelingRegistryIdentity.sourcePhase,
    KnowledgeModelingRegistryIdentity.readiness,
  ),
  dep(
    "dep-dkl-4-3-model",
    "DKL-4:3 Model",
    "knowledgeModelingModel.ts",
    KnowledgeModelingModelVersion,
    KnowledgeModelingModelIdentity.sourcePhase,
    KnowledgeModelingModelIdentity.readiness,
  ),
  dep(
    "dep-dkl-4-4-validation",
    "DKL-4:4 Validation",
    "knowledgeModelingValidation.ts",
    KnowledgeModelingValidationVersion,
    KnowledgeModelingValidationIdentity.sourcePhase,
    KnowledgeModelingValidationIdentity.readiness,
  ),
]);

/** Canonical immutable Manifest dependency declarations. */
export const KnowledgeModelingManifestDependencies = Object.freeze({
  dependencyId: "DKL-4:5/ManifestDependencies",
  sourcePhase: "DKL-4:5" as const,
  owner: "DKL-4 Knowledge Modeling Manifest",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  modules: Object.freeze(ENTRIES.map((e) => e.module)),
  phases: Object.freeze(ENTRIES.map((e) => e.phase)),
  publicEntryPointOnly: true,
  noInternalPriorPhaseImports: true,
  noDirectDkl3Dependency: true,
  noFuturePhases: true,
  upstreamByReference: Object.freeze({
    dkl3PublicIndexId: KnowledgeModelingFoundation.upstream.dkl3PublicIndexId,
    dkl3PublicIndexVersion: KnowledgeModelingFoundation.upstream.dkl3PublicIndexVersion,
    reachedThroughFoundation: true,
    registryReadyForModel: KnowledgeModelingRegistry.readiness.ReadyForModel === true,
    modelReadyForValidation: KnowledgeModelingModel.readiness.ReadyForValidation === true,
    validationReadyForManifest:
      KnowledgeModelingValidation.readiness.ReadyForManifest === true,
  }),
  forbidden: Object.freeze([
    "knowledgeModelingFoundationTypes.ts",
    "knowledgeModelingContracts.ts",
    "knowledgeModelingOwnership.ts",
    "knowledgeModelingBoundaries.ts",
    "knowledgeModelingLifecycle.ts",
    "knowledgeModelingDependencies.ts",
    "knowledgeModelingRegistryTypes.ts",
    "knowledgeModelingRegistryCatalog.ts",
    "knowledgeModelingBusinessObjectRegistry.ts",
    "knowledgeModelingRelationshipRegistry.ts",
    "knowledgeModelingRegistryOwnership.ts",
    "knowledgeModelingRegistryDependencies.ts",
    "knowledgeModelingModelTypes.ts",
    "knowledgeModelingBusinessObjectModel.ts",
    "knowledgeModelingKnowledgeObjectModel.ts",
    "knowledgeModelingRelationshipModel.ts",
    "knowledgeModelingStructureModels.ts",
    "knowledgeModelingIdentityReferenceModels.ts",
    "knowledgeModelingValidationTypes.ts",
    "knowledgeModelingValidationRules.ts",
    "knowledgeModelingValidationOwnership.ts",
    "knowledgeModelingValidationBoundaries.ts",
    "dataUnderstandingPublicIndex.ts",
    "DKL-3 direct imports",
    "DKL-4:6+",
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
