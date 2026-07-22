import { DirectorManifest } from "./directorManifest.ts";
import type { DirectorPlatformRegistryEntry } from "./directorPlatformTypes.ts";

const upstreamEntries: readonly DirectorPlatformRegistryEntry[] = Object.freeze(
  DirectorManifest.inventories.map((inventory, index) => Object.freeze({
    id: `DIRECTOR-1:6/Registry/${inventory.name}`,
    architectureLayer: inventory.name,
    canonicalReference: inventory.canonicalReference,
    source: "DirectorManifest",
    deterministicOrder: index + 1,
    duplicatesMetadata: false,
    immutable: true,
  })),
);

export const DirectorPlatformRegistry = Object.freeze({
  registryId: "DIRECTOR-1:6/PlatformRegistry",
  entries: Object.freeze([
    ...upstreamEntries,
    Object.freeze({
      id: "DIRECTOR-1:6/Registry/Manifest",
      architectureLayer: "Manifest",
      canonicalReference: DirectorManifest.metadata.manifestIdentity.id,
      source: "DirectorManifest",
      deterministicOrder: upstreamEntries.length + 1,
      duplicatesMetadata: false,
      immutable: true,
    }),
  ]),
  sourceManifest: DirectorManifest,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

