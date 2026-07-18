/**
 * DKL-7:5 — Knowledge Services Manifest Dependencies.
 *
 * Exactly ten immutable architectural dependency declarations.
 * Future dependencies are declarations only — no future-phase imports.
 *
 * Ownership: owned exclusively by DKL-7:5.
 */

import { KnowledgeServicesManifestChainIds } from "./knowledgeServicesManifestInventory.ts";
import type { KnowledgeServicesManifestDependency } from "./knowledgeServicesManifestTypes.ts";

const dep = (
  key: string,
  source: string,
  target: string,
  direction: KnowledgeServicesManifestDependency["direction"],
  dependencyType: KnowledgeServicesManifestDependency["dependencyType"],
  required: boolean,
  canonicalPath: string,
  order: number,
): KnowledgeServicesManifestDependency =>
  Object.freeze({
    dependencyId: `DKL-7:5/Dependency/${key}`,
    source,
    target,
    direction,
    dependencyType,
    required,
    status: "Declared" as const,
    canonicalPath,
    runtimeBehavior: "None" as const,
    introducesFutureImport: false as const,
    deterministicOrder: order,
  });

const ids = KnowledgeServicesManifestChainIds;

/** Exactly ten canonical dependency declarations. */
export const KnowledgeServicesManifestDependencies: readonly KnowledgeServicesManifestDependency[] =
  Object.freeze([
    dep(
      "ManifestToValidation",
      "DKL-7:5/KnowledgeServicesManifest",
      ids.validationId,
      "Consumes",
      "CanonicalChain",
      true,
      "Manifest → Validation",
      1,
    ),
    dep(
      "ValidationToModel",
      ids.validationId,
      ids.modelId,
      "Consumes",
      "CanonicalChain",
      true,
      "Validation → Model",
      2,
    ),
    dep(
      "ModelToRegistry",
      ids.modelId,
      ids.registryId,
      "Consumes",
      "CanonicalChain",
      true,
      "Model → Registry",
      3,
    ),
    dep(
      "RegistryToFoundation",
      ids.registryId,
      ids.foundationId,
      "Consumes",
      "CanonicalChain",
      true,
      "Registry → Foundation",
      4,
    ),
    dep(
      "FoundationToDkl6PublicIndex",
      ids.foundationId,
      ids.dkl6PublicIndexId,
      "Consumes",
      "CanonicalChain",
      true,
      "Foundation → DKL-6 Public Index",
      5,
    ),
    dep(
      "FuturePlatformToManifest",
      "DKL-7:6/KnowledgeServicesPlatform",
      "DKL-7:5/KnowledgeServicesManifest",
      "Consumes",
      "FuturePhase",
      false,
      "Future Platform → Manifest",
      6,
    ),
    dep(
      "FutureCertificationToPlatform",
      "DKL-7:7/KnowledgeServicesCertification",
      "DKL-7:6/KnowledgeServicesPlatform",
      "Consumes",
      "FuturePhase",
      false,
      "Future Certification → Platform",
      7,
    ),
    dep(
      "FutureFreezeToCertification",
      "DKL-7:8/KnowledgeServicesFreeze",
      "DKL-7:7/KnowledgeServicesCertification",
      "Consumes",
      "FuturePhase",
      false,
      "Future Freeze → Certification",
      8,
    ),
    dep(
      "FuturePublicIndexToFreeze",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "DKL-7:8/KnowledgeServicesFreeze",
      "Consumes",
      "FuturePhase",
      false,
      "Future Public Index → Freeze",
      9,
    ),
    dep(
      "FutureExecutiveConsumersToPublicIndex",
      "FutureExecutiveConsumers",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "Consumes",
      "FutureConsumer",
      false,
      "Future Executive consumers → DKL-7 Public Index",
      10,
    ),
  ]);
