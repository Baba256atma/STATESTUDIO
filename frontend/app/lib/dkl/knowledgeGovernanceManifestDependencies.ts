/**
 * DKL-8:5 — Knowledge Governance Manifest Dependencies.
 *
 * Declared dependency graph for Manifest composition. Metadata only.
 *
 * Ownership: owned exclusively by DKL-8:5.
 */

import type { KnowledgeGovernanceManifestDependency } from "./knowledgeGovernanceManifestTypes.ts";

const dependency = (
  order: number,
  name: string,
  targetPhase: string,
  relationship: string,
  accessPath: string,
  direct: boolean,
): KnowledgeGovernanceManifestDependency =>
  Object.freeze({
    dependencyId: `DKL-8:5/Dependency/${String(order).padStart(2, "0")}`,
    name,
    targetPhase,
    relationship,
    accessPath,
    direct,
    reconstructed: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Exactly ten Manifest dependency declarations. */
export const KnowledgeGovernanceManifestDependencies: readonly KnowledgeGovernanceManifestDependency[] =
  Object.freeze([
    dependency(
      1,
      "Direct Validation Surface",
      "DKL-8:4/KnowledgeGovernanceValidation",
      "ConsumesOnly",
      "knowledgeGovernanceValidation.ts",
      true,
    ),
    dependency(
      2,
      "Model Through Validation",
      "DKL-8:3/KnowledgeGovernanceModel",
      "ReachedThroughValidation",
      "Validation.model",
      false,
    ),
    dependency(
      3,
      "Registry Through Model",
      "DKL-8:2/KnowledgeGovernanceRegistry",
      "ReachedThroughModel",
      "Validation.model.registry",
      false,
    ),
    dependency(
      4,
      "Foundation Through Registry",
      "DKL-8:1/KnowledgeGovernanceFoundation",
      "ReachedThroughRegistry",
      "Validation.model.registry.foundation",
      false,
    ),
    dependency(
      5,
      "DKL-7 Through Foundation",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "ReachedThroughFoundation",
      "Validation.model.registry.foundation.identity.dkl7PublicIndexId",
      false,
    ),
    dependency(
      6,
      "No Direct Model Import",
      "DKL-8:3",
      "ProhibitedDirectImport",
      "Manifest.dependency.modelDirectImport=false",
      false,
    ),
    dependency(
      7,
      "No Direct Registry Import",
      "DKL-8:2",
      "ProhibitedDirectImport",
      "Manifest.dependency.registryDirectImport=false",
      false,
    ),
    dependency(
      8,
      "No Direct Foundation Import",
      "DKL-8:1",
      "ProhibitedDirectImport",
      "Manifest.dependency.foundationDirectImport=false",
      false,
    ),
    dependency(
      9,
      "No Direct DKL-7 Import",
      "DKL-7",
      "ProhibitedDirectImport",
      "Manifest.dependency.dkl7DirectImport=false",
      false,
    ),
    dependency(
      10,
      "Future Platform Phase",
      "DKL-8:6/KnowledgeGovernancePlatform",
      "DeclaredSuccessor",
      "Manifest.nextPhase",
      false,
    ),
  ]);
