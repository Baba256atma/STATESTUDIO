import { DirectorManifest } from "./directorManifest.ts";
import type { DirectorPlatformCompatibilityEntry } from "./directorPlatformTypes.ts";

const inherited: readonly DirectorPlatformCompatibilityEntry[] = Object.freeze(
  DirectorManifest.compatibility.map((entry, index) => Object.freeze({
    id: `DIRECTOR-1:6/Compatibility/${entry.name}`,
    name: entry.name,
    sourceReference: entry.id,
    compatible: entry.compatible,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

export const DirectorPlatformCompatibility = Object.freeze([
  ...inherited,
  Object.freeze({
    id: "DIRECTOR-1:6/Compatibility/ForwardCompatibility",
    name: "ForwardCompatibility",
    sourceReference: DirectorManifest.metadata.manifestIdentity.id,
    compatible: true,
    deterministicOrder: inherited.length + 1,
    metadataOnly: true,
    immutable: true,
  }),
] as const);

