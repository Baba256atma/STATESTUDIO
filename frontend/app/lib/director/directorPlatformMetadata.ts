import { DirectorManifest } from "./directorManifest.ts";
import { DirectorPlatformCompatibility } from "./directorPlatformCompatibility.ts";
import { DirectorPlatformComposition } from "./directorPlatformComposition.ts";

const inheritedReadiness = Object.freeze(
  DirectorManifest.readiness.map((entry, index) => Object.freeze({
    id: `DIRECTOR-1:6/Readiness/${entry.name}`,
    name: entry.name,
    ready: entry.ready,
    evidenceReference: entry.id,
    deterministicOrder: index + 2,
    metadataOnly: true,
    immutable: true,
  })),
);

export const DirectorPlatformMetadata = Object.freeze({
  identity: Object.freeze({
    platformId: "DIRECTOR-1:6/DirectorPlatform",
    platformName: "Director Platform",
    platformVersion: "1.0.0",
    namespace: "nexora.director.platform",
    layer: "Director",
    status: "Platform",
    readiness: "ReadyForCertification",
  }),
  architectureVersion: DirectorPlatformComposition.architectureVersion,
  architectureChain: DirectorPlatformComposition.architectureChain,
  compositionMetadata: DirectorPlatformComposition,
  dependencyMetadata: DirectorPlatformComposition.dependency,
  inventoryTotals: DirectorPlatformComposition.aggregateInventory,
  compatibility: DirectorPlatformCompatibility,
  readiness: Object.freeze([
    Object.freeze({
      id: "DIRECTOR-1:6/Readiness/ReadyForCertification",
      name: "ReadyForCertification",
      ready: true,
      evidenceReference: DirectorManifest.metadata.manifestIdentity.id,
      deterministicOrder: 1,
      metadataOnly: true,
      immutable: true,
    }),
    ...inheritedReadiness,
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

