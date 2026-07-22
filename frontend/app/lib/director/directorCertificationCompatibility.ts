import { DirectorPlatform } from "./directorPlatform.ts";
import type { DirectorCertificationCompatibilityEntry } from "./directorCertificationTypes.ts";

const architectureEntries = Object.freeze(
  [...DirectorPlatform.composition.architectureChain].reverse(),
);

export const DirectorCertificationCompatibility: readonly DirectorCertificationCompatibilityEntry[] =
  Object.freeze([
    ...architectureEntries.map((entry, index) => Object.freeze({
      id: `DIRECTOR-1:7/Compatibility/${entry.phase}`,
      name: `${entry.phase}Compatibility`,
      platformReference: entry.canonicalReference,
      compatible: true as const,
      deterministicOrder: index + 1,
      derivedFromPlatform: true as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
    Object.freeze({
      id: "DIRECTOR-1:7/Compatibility/Forward",
      name: "ForwardCompatibility",
      platformReference: DirectorPlatform.metadata.identity.platformId,
      compatible: true,
      deterministicOrder: architectureEntries.length + 1,
      derivedFromPlatform: true,
      metadataOnly: true,
      immutable: true,
    }),
  ]);

