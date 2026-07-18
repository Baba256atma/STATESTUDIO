/**
 * DKL-9:3 — Data Knowledge Suite Release Models.
 *
 * Suite release, snapshot, and result structural models.
 * Derived from Registry identity/inventory — no runtime release execution.
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

/** Release/snapshot/result model kind descriptors. */
export const DataKnowledgeSuiteReleaseModelKinds: readonly DataKnowledgeSuiteModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "SuiteRelease",
      "Structural model of a declarative suite release composition baseline.",
      Object.freeze([
        "releaseId",
        "registryId",
        "registryVersion",
        "capabilityCount",
        "publicApiInventoryTotal",
      ]),
      14,
    ),
    descriptor(
      "SuiteSnapshot",
      "Structural snapshot of suite registry inventory at model time.",
      Object.freeze([
        "snapshotId",
        "inventory",
        "capabilityOrder",
        "totalEntryCount",
      ]),
      15,
    ),
    descriptor(
      "SuiteResult",
      "Structural model result declaring suite model completion metadata.",
      Object.freeze([
        "resultId",
        "modelStatus",
        "modelReadiness",
        "modelKindCount",
        "relationshipKindCount",
      ]),
      16,
    ),
  ]);

export interface DataKnowledgeSuiteReleaseModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "SuiteRelease";
  readonly registryIdentity: typeof registry.identity;
  readonly registryInventory: typeof registry.inventory;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteSnapshotModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "SuiteSnapshot";
  readonly inventory: typeof registry.inventory;
  readonly capabilityOrder: typeof registry.capabilityOrder;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteResultModel
  extends DataKnowledgeSuiteModelInstanceBase {
  readonly modelKind: "SuiteResult";
  readonly registryId: string;
  readonly capabilityCount: number;
  readonly publicApiInventoryTotal: number;
  readonly preservesCanonicalReference: true;
}

/** Suite release model. */
export const DataKnowledgeSuiteReleaseModels: readonly DataKnowledgeSuiteReleaseModel[] =
  Object.freeze([
    Object.freeze({
      modelId: "DKL-9:3/Model/SuiteRelease/Canonical",
      modelKind: "SuiteRelease" as const,
      name: "Data Knowledge Suite Canonical Release Model",
      registryIdentity: registry.identity,
      registryInventory: registry.inventory,
      preservesCanonicalReference: true as const,
      reconstructsUpstream: false as const,
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

/** Suite snapshot model. */
export const DataKnowledgeSuiteSnapshotModels: readonly DataKnowledgeSuiteSnapshotModel[] =
  Object.freeze([
    Object.freeze({
      modelId: "DKL-9:3/Model/SuiteSnapshot/Canonical",
      modelKind: "SuiteSnapshot" as const,
      name: "Data Knowledge Suite Canonical Snapshot Model",
      inventory: registry.inventory,
      capabilityOrder: registry.capabilityOrder,
      preservesCanonicalReference: true as const,
      reconstructsUpstream: false as const,
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

/** Suite result model. */
export const DataKnowledgeSuiteResultModels: readonly DataKnowledgeSuiteResultModel[] =
  Object.freeze([
    Object.freeze({
      modelId: "DKL-9:3/Model/SuiteResult/Canonical",
      modelKind: "SuiteResult" as const,
      name: "Data Knowledge Suite Canonical Result Model",
      registryId: registry.identity.registryId,
      capabilityCount: registry.inventory.capabilityCount,
      publicApiInventoryTotal: registry.inventory.publicApiInventoryTotal,
      preservesCanonicalReference: true as const,
      reconstructsUpstream: false as const,
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
      runtimeBehavior: "None" as const,
    }),
  ]);
