/**
 * DKL-7:6 — Knowledge Services Platform Dependencies.
 *
 * Exactly twelve immutable architectural dependency declarations.
 * Future dependencies are declarations only — no future-phase imports.
 *
 * Ownership: owned exclusively by DKL-7:6.
 */

import { KnowledgeServicesPlatformChainIds } from "./knowledgeServicesPlatformArchitecture.ts";
import type { KnowledgeServicesPlatformDependency } from "./knowledgeServicesPlatformTypes.ts";

const dep = (
  key: string,
  source: string,
  target: string,
  dependencyType: KnowledgeServicesPlatformDependency["dependencyType"],
  required: boolean,
  canonicalPath: string,
  ownershipRule: string,
  boundaryRule: string,
  order: number,
): KnowledgeServicesPlatformDependency =>
  Object.freeze({
    dependencyId: `DKL-7:6/Dependency/${key}`,
    source,
    target,
    direction: "Consumes" as const,
    dependencyType,
    status: "Declared" as const,
    required,
    canonicalPath,
    ownershipRule,
    boundaryRule,
    runtimeAuthorization: "None" as const,
    introducesFutureImport: false as const,
    deterministicOrder: order,
  });

const ids = KnowledgeServicesPlatformChainIds;

/** Exactly twelve Platform dependency declarations. */
export const KnowledgeServicesPlatformDependencies: readonly KnowledgeServicesPlatformDependency[] =
  Object.freeze([
    dep(
      "PlatformToManifest",
      "DKL-7:6/KnowledgeServicesPlatform",
      ids.manifestId,
      "CanonicalChain",
      true,
      "Platform → Manifest",
      "Manifest ownership retained by DKL-7:5",
      "No Platform reconstruction of Manifest",
      1,
    ),
    dep(
      "ManifestToValidation",
      ids.manifestId,
      ids.validationId,
      "CanonicalChain",
      true,
      "Manifest → Validation",
      "Validation ownership retained by DKL-7:4",
      "No direct Validation import by Platform",
      2,
    ),
    dep(
      "ValidationToModel",
      ids.validationId,
      ids.modelId,
      "CanonicalChain",
      true,
      "Validation → Model",
      "Model ownership retained by DKL-7:3",
      "No direct Model import by Platform",
      3,
    ),
    dep(
      "ModelToRegistry",
      ids.modelId,
      ids.registryId,
      "CanonicalChain",
      true,
      "Model → Registry",
      "Registry ownership retained by DKL-7:2",
      "No direct Registry import by Platform",
      4,
    ),
    dep(
      "RegistryToFoundation",
      ids.registryId,
      ids.foundationId,
      "CanonicalChain",
      true,
      "Registry → Foundation",
      "Foundation ownership retained by DKL-7:1",
      "No direct Foundation import by Platform",
      5,
    ),
    dep(
      "FoundationToDkl6PublicIndex",
      ids.foundationId,
      ids.dkl6PublicIndexId,
      "CanonicalChain",
      true,
      "Foundation → DKL-6 Public Index",
      "DKL-6 ownership retained outside DKL-7",
      "No direct DKL-6 import by Platform",
      6,
    ),
    dep(
      "CertificationToPlatform",
      "DKL-7:7/KnowledgeServicesCertification",
      "DKL-7:6/KnowledgeServicesPlatform",
      "FuturePhase",
      false,
      "Certification → Platform",
      "Certification may consume Platform directly",
      "No Certification runtime in Platform",
      7,
    ),
    dep(
      "FreezeToCertification",
      "DKL-7:8/KnowledgeServicesFreeze",
      "DKL-7:7/KnowledgeServicesCertification",
      "FuturePhase",
      false,
      "Freeze → Certification",
      "Freeze consumes Certification only",
      "No Freeze direct Platform import",
      8,
    ),
    dep(
      "PublicIndexToFreeze",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "DKL-7:8/KnowledgeServicesFreeze",
      "FuturePhase",
      false,
      "Public Index → Freeze",
      "Public Index consumes Freeze only",
      "No Public Index direct Platform import",
      9,
    ),
    dep(
      "ExecutiveEngineToPublicIndex",
      "ExecutiveEngineConsumer",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "FutureConsumer",
      false,
      "Executive Engine consumer → Public Index",
      "Executive Engine not owned by DKL-7",
      "No Engine reasoning in Platform",
      10,
    ),
    dep(
      "AdvisorToPublicIndex",
      "AdvisorConsumer",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "FutureConsumer",
      false,
      "Advisor consumer → Public Index",
      "Advisor not owned by DKL-7",
      "No Advisor behavior in Platform",
      11,
    ),
    dep(
      "ApprovedInternalConsumerToPublicIndex",
      "ApprovedInternalConsumer",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "FutureConsumer",
      false,
      "Approved internal consumer → Public Index",
      "Consumers not owned by DKL-7",
      "No consumer runtime in Platform",
      12,
    ),
  ]);
