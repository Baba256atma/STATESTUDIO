import { DirectorFreezeCompatibility } from "./directorFreezeCompatibility.ts";
import { DirectorFreezePublicExportNames } from "./directorFreezeExports.ts";
import { DirectorFreezeLocks } from "./directorFreezeLocks.ts";
import { DirectorFreezeMetadata } from "./directorFreezeMetadata.ts";
import { DirectorFreezeRegistry } from "./directorFreezeRegistry.ts";

export {
  DirectorFreezeCompatibility,
  DirectorFreezeLocks,
  DirectorFreezeMetadata,
  DirectorFreezeRegistry,
};

export const DirectorFreeze = Object.freeze({
  metadata: DirectorFreezeMetadata,
  registry: DirectorFreezeRegistry,
  locks: DirectorFreezeLocks,
  compatibility: DirectorFreezeCompatibility,
  publicExports: DirectorFreezePublicExportNames,
  producesFor: Object.freeze(["Director Public Index"] as const),
  services: false,
  factories: false,
  execution: false,
  orchestration: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const DirectorFreezeSummary = Object.freeze({
  id: DirectorFreezeMetadata.freezeId,
  version: DirectorFreezeMetadata.freezeVersion,
  namespace: DirectorFreezeMetadata.freezeNamespace,
  status: DirectorFreezeMetadata.freezeStatus,
  readiness: DirectorFreezeMetadata.readiness,
  lockId: DirectorFreezeLocks[0]!.lockId,
  registryEntryCount: DirectorFreezeRegistry.entries.length,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDirectorFreezeSummary = () => DirectorFreezeSummary;
export const getDirectorFreezeLockStatus = () =>
  DirectorFreezeLocks[0]!.lockStatus;
export const getDirectorFreezeReadiness = () =>
  DirectorFreezeMetadata.readiness;

