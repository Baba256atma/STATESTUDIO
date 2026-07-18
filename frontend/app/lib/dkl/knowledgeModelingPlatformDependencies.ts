/**
 * DKL-4:6 — Knowledge Modeling Platform Dependencies.
 *
 * Immutable dependency declarations for approved public entry points only.
 * Declarative graph metadata. No traversal.
 *
 * Ownership: owned exclusively by DKL-4:6.
 */

import {
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistryVersion,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModelIdentity,
  KnowledgeModelingModelVersion,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationVersion,
} from "./knowledgeModelingValidation.ts";
import {
  KnowledgeModelingManifestIdentity,
  KnowledgeModelingManifestVersion,
} from "./knowledgeModelingManifest.ts";
import type { PlatformDependencyEntry } from "./knowledgeModelingPlatformTypes.ts";

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
  });

const ENTRIES: readonly PlatformDependencyEntry[] = Object.freeze([
  dep(
    "dep-dkl-4-1-foundation",
    "DKL-4:1 Foundation",
    "knowledgeModelingFoundation.ts",
    KnowledgeModelingFoundationVersion,
    KnowledgeModelingFoundationIdentity.sourcePhase,
    KnowledgeModelingFoundationIdentity.readiness,
    1,
  ),
  dep(
    "dep-dkl-4-2-registry",
    "DKL-4:2 Registry",
    "knowledgeModelingRegistry.ts",
    KnowledgeModelingRegistryVersion,
    KnowledgeModelingRegistryIdentity.sourcePhase,
    KnowledgeModelingRegistryIdentity.readiness,
    2,
  ),
  dep(
    "dep-dkl-4-3-model",
    "DKL-4:3 Model",
    "knowledgeModelingModel.ts",
    KnowledgeModelingModelVersion,
    KnowledgeModelingModelIdentity.sourcePhase,
    KnowledgeModelingModelIdentity.readiness,
    3,
  ),
  dep(
    "dep-dkl-4-4-validation",
    "DKL-4:4 Validation",
    "knowledgeModelingValidation.ts",
    KnowledgeModelingValidationVersion,
    KnowledgeModelingValidationIdentity.sourcePhase,
    KnowledgeModelingValidationIdentity.readiness,
    4,
  ),
  dep(
    "dep-dkl-4-5-manifest",
    "DKL-4:5 Manifest",
    "knowledgeModelingManifest.ts",
    KnowledgeModelingManifestVersion,
    KnowledgeModelingManifestIdentity.sourcePhase,
    KnowledgeModelingManifestIdentity.readiness,
    5,
  ),
]);

/** Canonical immutable Platform dependency declarations. */
export const KnowledgeModelingPlatformDependencies = Object.freeze({
  dependencyId: "DKL-4:6/PlatformDependencies",
  sourcePhase: "DKL-4:6" as const,
  owner: "DKL-4 Knowledge Modeling Platform",
  entries: ENTRIES,
  entryCount: ENTRIES.length as 5,
  modules: Object.freeze(ENTRIES.map((e) => e.module)),
  phases: Object.freeze(ENTRIES.map((e) => e.phase)),
  orderedAs: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
  ] as const),
  publicEntryPointOnly: true,
  noDirectDkl3Dependency: true,
  noEngineDependency: true,
  noAdvisorDependency: true,
  noSceneDependency: true,
  noPersistenceDependency: true,
  noExternalPackageDependency: true,
  noCircularDependency: true,
  noFuturePhases: true,
  graphTraversalForbidden: true,
  declarativeOnly: true,
  forbidden: Object.freeze([
    "knowledgeModelingFoundationTypes.ts",
    "knowledgeModelingRegistryTypes.ts",
    "knowledgeModelingModelTypes.ts",
    "knowledgeModelingValidationTypes.ts",
    "knowledgeModelingManifestTypes.ts",
    "knowledgeModelingManifestInventory.ts",
    "dataUnderstandingPublicIndex.ts",
    "DKL-3 direct imports",
    "DKL-4:7+",
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
