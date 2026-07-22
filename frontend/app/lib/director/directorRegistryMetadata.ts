import { DirectorFoundation } from "./directorFoundation.ts";

export const DirectorRegistryMetadata = Object.freeze({
  id: "DIRECTOR-1:2/DirectorRegistry",
  version: "1.0.0",
  name: "Director Registry",
  namespace: "nexora.director.registry",
  layer: "Director",
  status: "Registry",
  readiness: "ReadyForModel",
  dependency: Object.freeze({
    foundationOnly: true,
    foundationId: DirectorFoundation.identity.id,
    foundationVersion: DirectorFoundation.identity.version,
    directPreviousPhaseModule: "directorFoundation.ts",
    importsEve: false,
    importsFutureDirectorPhases: false,
  }),
  producesFor: Object.freeze([
    "Director Model", "Validation", "Manifest", "Platform",
  ] as const),
  runtimeState: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

