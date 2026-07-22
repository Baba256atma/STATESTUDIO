import { DirectorPlatformCompatibility } from "./directorPlatformCompatibility.ts";
import { DirectorPlatformComposition } from "./directorPlatformComposition.ts";
import { DirectorPlatformPublicExportNames } from "./directorPlatformExports.ts";
import { DirectorPlatformMetadata } from "./directorPlatformMetadata.ts";
import { DirectorPlatformRegistry } from "./directorPlatformRegistry.ts";

export {
  DirectorPlatformCompatibility,
  DirectorPlatformComposition,
  DirectorPlatformMetadata,
  DirectorPlatformRegistry,
};

export const DirectorPlatform = Object.freeze({
  metadata: DirectorPlatformMetadata,
  composition: DirectorPlatformComposition,
  registry: DirectorPlatformRegistry,
  compatibility: DirectorPlatformCompatibility,
  publicExports: DirectorPlatformPublicExportNames,
  producesFor: Object.freeze([
    "Director Certification", "Director Freeze", "Director Public Index",
  ] as const),
  services: false,
  factories: false,
  execution: false,
  orchestrationEngine: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const DirectorPlatformSummary = Object.freeze({
  ...DirectorPlatformMetadata.identity,
  architectureVersion: DirectorPlatformMetadata.architectureVersion,
  registryEntryCount: DirectorPlatformRegistry.entries.length,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDirectorPlatformSummary = () => DirectorPlatformSummary;
export const getDirectorPlatformInventory = () =>
  DirectorPlatformComposition.aggregateInventory;
export const getDirectorPlatformReadiness = () =>
  DirectorPlatformMetadata.readiness;

