import type { DirectorFreezeLock } from "./directorFreezeTypes.ts";

export const DirectorFreezeLocks: readonly DirectorFreezeLock[] = Object.freeze([
  Object.freeze({
    lockId: "DIRECTOR-1-LOCKED",
    lockName: "Director Architecture Lock",
    lockVersion: "1.0.0",
    lockStatus: "Locked",
    lockTimestampMetadata: "DeterministicArchitecturalMetadataOnly",
    lockScope: "CompleteCertifiedDirectorArchitecture",
    lockReason:
      "Preserve the certified Director architecture for canonical public publication.",
    runtimeLocking: false,
    metadataOnly: true,
    immutable: true,
  }),
]);

