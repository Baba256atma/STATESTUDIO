/**
 * DKL-5:6 — Knowledge Validation Platform Dependencies.
 *
 * Immutable dependency declarations for approved public entry points only.
 * Declarative graph metadata. No traversal.
 *
 * Ownership: owned exclusively by DKL-5:6.
 */

import {
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistryIdentity,
  KnowledgeValidationRegistryVersion,
} from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationModelIdentity,
  KnowledgeValidationModelVersion,
} from "./knowledgeValidationModel.ts";
import {
  KnowledgeValidationValidationIdentity,
  KnowledgeValidationValidationVersion,
} from "./knowledgeValidationValidation.ts";
import {
  KnowledgeValidationManifestIdentity,
  KnowledgeValidationManifestVersion,
} from "./knowledgeValidationManifest.ts";
import type { PlatformDependencyEntry } from "./knowledgeValidationPlatformTypes.ts";

const dep = (
  dependencyId: string,
  dependencyName: string,
  module: string,
  version: string,
  phase: string,
  readiness: string,
  dependencyOrder: number,
): PlatformDependencyEntry =>
  Object.freeze({
    dependencyId,
    dependencyName,
    module,
    version,
    phase,
    readiness,
    dependencyOrder,
    required: true as const,
    futurePhase: false as const,
    publicEntryPointOnly: true as const,
    circular: false as const,
  });

const ENTRIES: readonly PlatformDependencyEntry[] = Object.freeze([
  dep(
    "dep-dkl-5-1-foundation",
    "DKL-5:1 Foundation",
    "knowledgeValidationFoundation.ts",
    KnowledgeValidationFoundationVersion,
    KnowledgeValidationFoundationIdentity.sourcePhase,
    KnowledgeValidationFoundationIdentity.readiness,
    1,
  ),
  dep(
    "dep-dkl-5-2-registry",
    "DKL-5:2 Registry",
    "knowledgeValidationRegistry.ts",
    KnowledgeValidationRegistryVersion,
    KnowledgeValidationRegistryIdentity.sourcePhase,
    KnowledgeValidationRegistryIdentity.readiness,
    2,
  ),
  dep(
    "dep-dkl-5-3-model",
    "DKL-5:3 Model",
    "knowledgeValidationModel.ts",
    KnowledgeValidationModelVersion,
    KnowledgeValidationModelIdentity.sourcePhase,
    KnowledgeValidationModelIdentity.readiness,
    3,
  ),
  dep(
    "dep-dkl-5-4-validation",
    "DKL-5:4 Validation",
    "knowledgeValidationValidation.ts",
    KnowledgeValidationValidationVersion,
    KnowledgeValidationValidationIdentity.sourcePhase,
    KnowledgeValidationValidationIdentity.readiness,
    4,
  ),
  dep(
    "dep-dkl-5-5-manifest",
    "DKL-5:5 Manifest",
    "knowledgeValidationManifest.ts",
    KnowledgeValidationManifestVersion,
    KnowledgeValidationManifestIdentity.phase,
    KnowledgeValidationManifestIdentity.readiness,
    5,
  ),
]);

/** Canonical immutable Platform dependency declarations. */
export const KnowledgeValidationPlatformDependencies = Object.freeze({
  dependencyId: "DKL-5:6/PlatformDependencies",
  sourcePhase: "DKL-5:6" as const,
  owner: "DKL-5 Knowledge Validation Platform",
  entries: ENTRIES,
  entryCount: ENTRIES.length as 5,
  modules: Object.freeze(ENTRIES.map((entry) => entry.module)),
  phases: Object.freeze(ENTRIES.map((entry) => entry.phase)),
  orderedAs: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
  ] as const),
  publicEntryPointOnly: true,
  noInternalPriorPhaseImports: true,
  noDirectDkl4Dependency: true,
  noFuturePhases: true,
  noCircularDependency: true,
  noExternalPackageDependency: true,
  noPersistenceDependency: true,
  noDatabaseDependency: true,
  noAdvisorDependency: true,
  noSceneDependency: true,
  noUiDependency: true,
  executiveEngineRestrictedDownstreamConsumer: true,
  graphTraversalForbidden: true,
  declarativeOnly: true,
  forbidden: Object.freeze([
    "knowledgeValidationFoundationTypes.ts",
    "knowledgeValidationContracts.ts",
    "knowledgeValidationRegistryTypes.ts",
    "knowledgeValidationRegistryCatalog.ts",
    "knowledgeValidationModelTypes.ts",
    "knowledgeValidationModelHelpers.ts",
    "knowledgeValidationValidationTypes.ts",
    "knowledgeValidationValidationRules.ts",
    "knowledgeValidationManifestTypes.ts",
    "knowledgeValidationManifestInventory.ts",
    "knowledgeModelingPublicIndex.ts",
    "DKL-4 direct imports",
    "DKL-5:7+",
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
