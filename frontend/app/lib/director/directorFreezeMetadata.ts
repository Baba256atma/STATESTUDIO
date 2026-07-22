import { DirectorCertification } from "./directorCertification.ts";
import { DirectorFreezeCompatibility } from "./directorFreezeCompatibility.ts";
import { DirectorFreezeLocks } from "./directorFreezeLocks.ts";
import { DirectorFreezeRegistry } from "./directorFreezeRegistry.ts";

export const DirectorFreezeMetadata = Object.freeze({
  freezeId: "DIRECTOR-1:8/DirectorFreeze",
  freezeName: "Director Freeze",
  freezeVersion: "1.0.0",
  freezeNamespace: "nexora.director.freeze",
  layer: "Director",
  freezeStatus: "Frozen",
  readiness: "ReadyForPublicIndex",
  lockMetadata: DirectorFreezeLocks,
  compatibilitySummary: DirectorFreezeCompatibility,
  architectureSummary: DirectorFreezeRegistry.entries,
  certifiedInventory: DirectorFreezeRegistry.certifiedInventory,
  certificationSummary: DirectorCertification.metadata,
  dependency: Object.freeze({
    certificationOnly: true,
    certificationReference: DirectorCertification.metadata.certificationId,
    directPreviousPhaseModule: "directorCertification.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directManifestImport: false,
    directPlatformImport: false,
    importsFutureDirectorPhases: false,
    importsEve: false,
  }),
  reconstructsArchitecture: false,
  duplicatesMetadata: false,
  runtimeLock: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

