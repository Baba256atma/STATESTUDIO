import { DirectorCertification } from "./directorCertification.ts";
import type { DirectorFreezeRegistryEntry } from "./directorFreezeTypes.ts";

const certificationEntry: DirectorFreezeRegistryEntry = Object.freeze({
  id: "DIRECTOR-1:8/Registry/Certification",
  architectureLayer: "Certification",
  canonicalReference: DirectorCertification.metadata.certificationId,
  source: "DirectorCertification",
  deterministicOrder: 1,
  copiesMetadata: false,
  immutable: true,
});

const upstreamEntries: readonly DirectorFreezeRegistryEntry[] = Object.freeze(
  DirectorCertification.metadata.architectureChain.map((entry, index) =>
    Object.freeze({
      id: `DIRECTOR-1:8/Registry/${entry.phase}`,
      architectureLayer: entry.phase,
      canonicalReference: entry.canonicalReference,
      source: "DirectorCertification",
      deterministicOrder: index + 2,
      copiesMetadata: false,
      immutable: true,
    })),
);

export const DirectorFreezeRegistry = Object.freeze({
  registryId: "DIRECTOR-1:8/FreezeRegistry",
  entries: Object.freeze([certificationEntry, ...upstreamEntries]),
  certifiedInventory: DirectorCertification.metadata.certifiedInventory,
  inventoryPreservedByReference: true,
  reconstructsMetadata: false,
  duplicatesMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

