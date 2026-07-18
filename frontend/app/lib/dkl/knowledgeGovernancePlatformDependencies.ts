/**
 * DKL-8:6 — Knowledge Governance Platform Dependencies.
 *
 * Declared dependency graph for Platform composition. Metadata only.
 *
 * Ownership: owned exclusively by DKL-8:6.
 */

import type { KnowledgeGovernancePlatformDependency } from "./knowledgeGovernancePlatformTypes.ts";

const dependency = (
  order: number,
  name: string,
  targetPhase: string,
  relationship: string,
  accessPath: string,
  direct: boolean,
): KnowledgeGovernancePlatformDependency =>
  Object.freeze({
    dependencyId: `DKL-8:6/Dependency/${String(order).padStart(2, "0")}`,
    name,
    targetPhase,
    relationship,
    accessPath,
    direct,
    reconstructed: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Exactly twelve Platform dependency declarations. */
export const KnowledgeGovernancePlatformDependencies: readonly KnowledgeGovernancePlatformDependency[] =
  Object.freeze([
    dependency(
      1,
      "Direct Manifest Surface",
      "DKL-8:5/KnowledgeGovernanceManifest",
      "ConsumesOnly",
      "knowledgeGovernanceManifest.ts",
      true,
    ),
    dependency(
      2,
      "Validation Through Manifest",
      "DKL-8:4/KnowledgeGovernanceValidation",
      "ReachedThroughManifest",
      "Manifest.upstreamValidation",
      false,
    ),
    dependency(
      3,
      "Model Through Validation",
      "DKL-8:3/KnowledgeGovernanceModel",
      "ReachedThroughValidation",
      "Manifest.upstreamValidation.model",
      false,
    ),
    dependency(
      4,
      "Registry Through Model",
      "DKL-8:2/KnowledgeGovernanceRegistry",
      "ReachedThroughModel",
      "Manifest.upstreamValidation.model.registry",
      false,
    ),
    dependency(
      5,
      "Foundation Through Registry",
      "DKL-8:1/KnowledgeGovernanceFoundation",
      "ReachedThroughRegistry",
      "Manifest.upstreamValidation.model.registry.foundation",
      false,
    ),
    dependency(
      6,
      "DKL-7 Through Foundation",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "ReachedThroughFoundation",
      "Manifest.upstreamValidation.model.registry.foundation.identity.dkl7PublicIndexId",
      false,
    ),
    dependency(
      7,
      "No Direct Validation Import",
      "DKL-8:4",
      "ProhibitedDirectImport",
      "Platform.dependency.validationDirectImport=false",
      false,
    ),
    dependency(
      8,
      "No Direct Model Import",
      "DKL-8:3",
      "ProhibitedDirectImport",
      "Platform.dependency.modelDirectImport=false",
      false,
    ),
    dependency(
      9,
      "No Direct Registry Import",
      "DKL-8:2",
      "ProhibitedDirectImport",
      "Platform.dependency.registryDirectImport=false",
      false,
    ),
    dependency(
      10,
      "No Direct Foundation Import",
      "DKL-8:1",
      "ProhibitedDirectImport",
      "Platform.dependency.foundationDirectImport=false",
      false,
    ),
    dependency(
      11,
      "No Direct DKL-7 Import",
      "DKL-7",
      "ProhibitedDirectImport",
      "Platform.dependency.dkl7DirectImport=false",
      false,
    ),
    dependency(
      12,
      "Future Certification Phase",
      "DKL-8:7/KnowledgeGovernanceCertification",
      "DeclaredSuccessor",
      "Platform.nextPhase",
      false,
    ),
  ]);
