import { DirectorManifest } from "./directorManifest.ts";
import type { DirectorPlatformChainEntry } from "./directorPlatformTypes.ts";

const upstreamChain: readonly DirectorPlatformChainEntry[] = Object.freeze(
  [...DirectorManifest.inventories].reverse().map((inventory, index) =>
    Object.freeze({
      id: `DIRECTOR-1:6/Chain/${inventory.name}`,
      phase: inventory.name,
      canonicalReference: inventory.canonicalReference,
      deterministicOrder: index + 3,
      metadataOnly: true,
      immutable: true,
    })),
);

export const DirectorPlatformArchitectureChain: readonly DirectorPlatformChainEntry[] =
  Object.freeze([
    Object.freeze({
      id: "DIRECTOR-1:6/Chain/Platform",
      phase: "Platform",
      canonicalReference: "DIRECTOR-1:6/DirectorPlatform",
      deterministicOrder: 1,
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "DIRECTOR-1:6/Chain/Manifest",
      phase: "Manifest",
      canonicalReference: DirectorManifest.metadata.manifestIdentity.id,
      deterministicOrder: 2,
      metadataOnly: true,
      immutable: true,
    }),
    ...upstreamChain,
  ]);

const manifestCollections = Object.freeze(
  Object.values(DirectorManifest).filter(
    (value): value is Extract<typeof value, readonly unknown[]> =>
      Array.isArray(value),
  ),
);

export const DirectorPlatformComposition = Object.freeze({
  compositionId: "DIRECTOR-1:6/PlatformComposition",
  manifest: DirectorManifest,
  architectureVersion: DirectorManifest.metadata.manifestVersion,
  architectureChain: DirectorPlatformArchitectureChain,
  inventories: DirectorManifest.inventories,
  manifestInventory: Object.freeze({
    collectionCount: manifestCollections.length,
    entryCount: manifestCollections.reduce(
      (total, collection) => total + collection.length, 0,
    ),
    canonicalReference: DirectorManifest.metadata.manifestIdentity.id,
    derived: true,
  }),
  aggregateInventory: Object.freeze({
    totalInventoryEntries:
      DirectorManifest.inventoryTotals.totalInventoryEntries
      + manifestCollections.reduce(
        (total, collection) => total + collection.length, 0,
      ),
    totalMetadataCollections:
      DirectorManifest.inventoryTotals.totalMetadataCollections
      + manifestCollections.length,
    totalExportedCollections:
      DirectorManifest.inventoryTotals.totalExportedCollections
      + manifestCollections.length,
    derivedFromManifest: true,
  }),
  dependency: Object.freeze({
    manifestOnly: true,
    directPreviousPhaseModule: "directorManifest.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    importsFutureDirectorPhases: false,
    importsEve: false,
  }),
  reconstructsArchitecture: false,
  duplicatesMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
