/**
 * DKL-5:5 — Knowledge Validation Manifest Dependencies.
 *
 * Immutable dependency inventory for approved public entry points only.
 * Declarative — never future phases, internal prior-phase files, or DKL-4 direct.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistry,
  KnowledgeValidationRegistryVersion,
} from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationModel,
  KnowledgeValidationModelVersion,
} from "./knowledgeValidationModel.ts";
import {
  KnowledgeValidationValidation,
  KnowledgeValidationValidationVersion,
} from "./knowledgeValidationValidation.ts";
import type { ManifestDependencyEntry } from "./knowledgeValidationManifestTypes.ts";

const dep = (
  dependencyId: string,
  dependencyName: string,
  consumerPhase: string,
  dependsOn: readonly string[],
  order: number,
): ManifestDependencyEntry =>
  Object.freeze({
    dependencyId,
    dependencyName,
    consumerPhase,
    dependsOn: Object.freeze([...dependsOn]),
    order,
    publicEntryPointOnly: true as const,
    futurePhase: false as const,
    circular: false as const,
  });

const ENTRIES: readonly ManifestDependencyEntry[] = Object.freeze([
  dep(
    "dep-dkl-5-1-foundation",
    "DKL-5:1 Foundation depends on DKL-4 Public Index",
    "DKL-5:1",
    Object.freeze(["knowledgeModelingPublicIndex.ts"]),
    1,
  ),
  dep(
    "dep-dkl-5-2-registry",
    "DKL-5:2 Registry depends on DKL-5:1 public entry",
    "DKL-5:2",
    Object.freeze(["knowledgeValidationFoundation.ts"]),
    2,
  ),
  dep(
    "dep-dkl-5-3-model",
    "DKL-5:3 Model depends on DKL-5:1 and DKL-5:2 public entries",
    "DKL-5:3",
    Object.freeze([
      "knowledgeValidationFoundation.ts",
      "knowledgeValidationRegistry.ts",
    ]),
    3,
  ),
  dep(
    "dep-dkl-5-4-validation",
    "DKL-5:4 Validation depends on DKL-5:1–5:3 public entries",
    "DKL-5:4",
    Object.freeze([
      "knowledgeValidationFoundation.ts",
      "knowledgeValidationRegistry.ts",
      "knowledgeValidationModel.ts",
    ]),
    4,
  ),
  dep(
    "dep-dkl-5-5-manifest",
    "DKL-5:5 Manifest depends on DKL-5:1–5:4 public entries",
    "DKL-5:5",
    Object.freeze([
      "knowledgeValidationFoundation.ts",
      "knowledgeValidationRegistry.ts",
      "knowledgeValidationModel.ts",
      "knowledgeValidationValidation.ts",
    ]),
    5,
  ),
]);

/** Canonical immutable Manifest dependency declarations for DKL-5. */
export const KnowledgeValidationManifestDependencies = Object.freeze({
  dependencyId: "DKL-5:5/ManifestDependencies",
  sourcePhase: "DKL-5:5" as const,
  owner: "DKL-5 Knowledge Validation Manifest",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  approvedManifestModules: Object.freeze([
    "knowledgeValidationFoundation.ts",
    "knowledgeValidationRegistry.ts",
    "knowledgeValidationModel.ts",
    "knowledgeValidationValidation.ts",
  ]),
  deterministicOrder: Object.freeze(ENTRIES.map((entry) => entry.order)),
  publicEntryPointOnly: true,
  noInternalPriorPhaseImports: true,
  noDirectDkl4Dependency: true,
  noFuturePhases: true,
  noCircularDependencies: true,
  executiveEngineRestrictedDownstreamConsumer: true,
  noPersistenceDependency: true,
  noExternalPackageDependency: true,
  upstreamByReference: Object.freeze({
    dkl4PublicIndexId: KnowledgeValidationFoundation.upstream.dkl4PublicIndexId,
    dkl4PublicIndexVersion:
      KnowledgeValidationFoundation.upstream.dkl4PublicIndexVersion,
    foundationVersion: KnowledgeValidationFoundationVersion,
    registryVersion: KnowledgeValidationRegistryVersion,
    modelVersion: KnowledgeValidationModelVersion,
    validationVersion: KnowledgeValidationValidationVersion,
    foundationReadyForRegistry:
      KnowledgeValidationFoundation.readiness.ReadyForRegistry === true,
    registryReadyForModel:
      KnowledgeValidationRegistry.readiness.ReadyForModel === true,
    modelReadyForValidation:
      KnowledgeValidationModel.readiness.ReadyForValidation === true,
    validationReadyForManifest:
      KnowledgeValidationValidation.readiness.ReadyForManifest === true,
  }),
  forbidden: Object.freeze([
    "knowledgeValidationFoundationTypes.ts",
    "knowledgeValidationContracts.ts",
    "knowledgeValidationOwnership.ts",
    "knowledgeValidationBoundaries.ts",
    "knowledgeValidationLifecycle.ts",
    "knowledgeValidationDependencies.ts",
    "knowledgeValidationRegistryTypes.ts",
    "knowledgeValidationRegistryCatalog.ts",
    "knowledgeValidationRegistryOwnership.ts",
    "knowledgeValidationRegistryDependencies.ts",
    "knowledgeValidationModelTypes.ts",
    "knowledgeValidationModelHelpers.ts",
    "knowledgeValidationValidationTypes.ts",
    "knowledgeValidationValidationRules.ts",
    "knowledgeValidationFoundationValidation.ts",
    "knowledgeValidationRegistryValidation.ts",
    "knowledgeValidationModelValidation.ts",
    "knowledgeValidationCrossPhaseValidation.ts",
    "knowledgeModelingPublicIndex.ts",
    "DKL-4 direct imports",
    "DKL-5:6+",
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
