import { TimelineVisualizationManifestPlatform } from "./timelineVisualizationManifest.ts";
import type { TimelineVisualizationPlatformCompatibilityEntry } from "./timelineVisualizationPlatformTypes.ts";

const manifest = TimelineVisualizationManifestPlatform;
const composition = manifest.composition;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility", composition[0]!.canonicalReference, composition[0]!.canonicalSource],
  ["Registry compatibility", composition[1]!.canonicalReference, composition[1]!.canonicalSource],
  ["Model compatibility", composition[2]!.canonicalReference, composition[2]!.canonicalSource],
  ["Validation compatibility", composition[3]!.canonicalReference, composition[3]!.canonicalSource],
  ["Manifest compatibility", manifest.metadata.id, manifest],
  ["Namespace compatibility", manifest.metadata.namespace, manifest.metadata],
  ["Public surface compatibility", manifest.metadata.id, manifest],
  ["Certification compatibility", manifest.metadata.id, manifest],
] as const);

export const TimelineVisualizationPlatformCompatibility:
readonly TimelineVisualizationPlatformCompatibilityEntry[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference, canonicalSource], index) => Object.freeze({
    id: `EVE-4:6/Compatibility/${name.replaceAll(" ", "")}`,
    name,
    compatible: true,
    canonicalReference,
    canonicalSource,
    deterministicOrder: index + 1,
    runtimeVerification: false,
    metadataOnly: true,
    immutable: true,
  })),
);
