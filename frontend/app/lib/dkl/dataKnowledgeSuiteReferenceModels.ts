/**
 * DKL-9:3 — Data Knowledge Suite Reference Models.
 *
 * Public platform, API registry, integration contract, ownership, and
 * boundary reference models. Canonical Registry references preserved.
 *
 * Ownership: owned exclusively by DKL-9:3.
 */

import { DataKnowledgeSuiteRegistryPlatform } from "./dataKnowledgeSuiteRegistry.ts";
import type {
  DataKnowledgeSuiteModelInstanceBase,
  DataKnowledgeSuiteModelKindDescriptor,
} from "./dataKnowledgeSuiteModelTypes.ts";

const registry = DataKnowledgeSuiteRegistryPlatform;

const descriptor = (
  modelKind: DataKnowledgeSuiteModelKindDescriptor["modelKind"],
  description: string,
  fields: readonly string[],
  order: number,
): DataKnowledgeSuiteModelKindDescriptor =>
  Object.freeze({
    modelKindId: `DKL-9:3/ModelKind/${modelKind}`,
    modelKind,
    description,
    fields: Object.freeze([...fields]),
    sourcePhase: "DKL-9:3" as const,
    registryAligned: true as const,
    runtimeBehavior: "None" as const,
    reconstructsUpstreamModels: false as const,
    duplicatesUpstreamModels: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Reference model kind descriptors. */
export const DataKnowledgeSuiteReferenceModelKinds: readonly DataKnowledgeSuiteModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "PublicPlatformReference",
      "Structural reference to a capability Public Platform via Registry.",
      Object.freeze(["capabilityId", "publicPlatform"]),
      8,
    ),
    descriptor(
      "PublicApiRegistryReference",
      "Structural reference metadata for capability Public API registries via Registry.",
      Object.freeze([
        "capabilityId",
        "publicApiCount",
        "registryAccess",
        "publicPlatform",
      ]),
      9,
    ),
    descriptor(
      "IntegrationContractReference",
      "Structural reference to suite integration contracts via Registry.",
      Object.freeze(["capabilityId", "integrationContractReference"]),
      10,
    ),
    descriptor(
      "OwnershipReference",
      "Structural reference to suite ownership declarations via Registry.",
      Object.freeze(["ownershipAggregate", "foundationOwnership"]),
      11,
    ),
    descriptor(
      "BoundaryReference",
      "Structural reference to suite boundary declarations via Registry.",
      Object.freeze(["boundariesAggregate", "foundationBoundaries"]),
      12,
    ),
  ]);

export interface DataKnowledgeSuitePublicPlatformReferenceModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "PublicPlatformReference";
  readonly capabilityId: (typeof registry.publicPlatforms)[number]["capabilityId"];
  readonly publicPlatformRegistration: (typeof registry.publicPlatforms)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuitePublicApiRegistryReferenceModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "PublicApiRegistryReference";
  readonly capabilityId: (typeof registry.publicApiRegistryRefs)[number]["capabilityId"];
  readonly publicApiRegistryRef: (typeof registry.publicApiRegistryRefs)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteIntegrationContractReferenceModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "IntegrationContractReference";
  readonly capabilityId: (typeof registry.integrationContracts)[number]["capabilityId"];
  readonly integrationContractRegistration: (typeof registry.integrationContracts)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteOwnershipReferenceModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "OwnershipReference";
  readonly ownership: typeof registry.ownership;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteBoundaryReferenceModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "BoundaryReference";
  readonly boundaries: typeof registry.boundaries;
  readonly preservesCanonicalReference: true;
}

/** Public platform reference models. */
export const DataKnowledgeSuitePublicPlatformReferenceModels: readonly DataKnowledgeSuitePublicPlatformReferenceModel[] =
  Object.freeze(
    registry.publicPlatforms.map((platform, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/PublicPlatformReference/${platform.capabilityId}`,
        modelKind: "PublicPlatformReference" as const,
        name: platform.name,
        capabilityId: platform.capabilityId,
        publicPlatformRegistration: platform,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Public API registry reference models. */
export const DataKnowledgeSuitePublicApiRegistryReferenceModels: readonly DataKnowledgeSuitePublicApiRegistryReferenceModel[] =
  Object.freeze(
    registry.publicApiRegistryRefs.map((apiRef, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/PublicApiRegistryReference/${apiRef.capabilityId}`,
        modelKind: "PublicApiRegistryReference" as const,
        name: apiRef.name,
        capabilityId: apiRef.capabilityId,
        publicApiRegistryRef: apiRef,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Integration contract reference models. */
export const DataKnowledgeSuiteIntegrationContractReferenceModels: readonly DataKnowledgeSuiteIntegrationContractReferenceModel[] =
  Object.freeze(
    registry.integrationContracts.map((contract, index) =>
      Object.freeze({
        modelId: `DKL-9:3/Model/IntegrationContractReference/${contract.capabilityId}`,
        modelKind: "IntegrationContractReference" as const,
        name: contract.name,
        capabilityId: contract.capabilityId,
        integrationContractRegistration: contract,
        preservesCanonicalReference: true as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Ownership reference model — Registry ownership aggregate by reference. */
export const DataKnowledgeSuiteOwnershipReferenceModels: readonly DataKnowledgeSuiteOwnershipReferenceModel[] =
  Object.freeze([
    Object.freeze({
      modelId: "DKL-9:3/Model/OwnershipReference/Suite",
      modelKind: "OwnershipReference" as const,
      name: "Suite Ownership Reference",
      ownership: registry.ownership,
      preservesCanonicalReference: true as const,
      reconstructsUpstream: false as const,
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

/** Boundary reference model — Registry boundaries aggregate by reference. */
export const DataKnowledgeSuiteBoundaryReferenceModels: readonly DataKnowledgeSuiteBoundaryReferenceModel[] =
  Object.freeze([
    Object.freeze({
      modelId: "DKL-9:3/Model/BoundaryReference/Suite",
      modelKind: "BoundaryReference" as const,
      name: "Suite Boundary Reference",
      boundaries: registry.boundaries,
      preservesCanonicalReference: true as const,
      reconstructsUpstream: false as const,
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
      runtimeBehavior: "None" as const,
    }),
  ]);
