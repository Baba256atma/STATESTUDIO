import { TimelineVisualizationPlatformPlatform } from "./timelineVisualizationPlatform.ts";
import type { TimelineVisualizationCertificationCompatibilityEntry } from "./timelineVisualizationCertificationTypes.ts";

const platform = TimelineVisualizationPlatformPlatform;
const composition = platform.composition;
const verificationSources = Object.freeze([
  ["Foundation compatibility verified", composition[0]!.canonicalReference],
  ["Registry compatibility verified", composition[1]!.canonicalReference],
  ["Model compatibility verified", composition[2]!.canonicalReference],
  ["Validation compatibility verified", composition[3]!.canonicalReference],
  ["Manifest compatibility verified", composition[4]!.canonicalReference],
  ["Platform compatibility verified", platform.metadata.id],
  ["Namespace compatibility verified", platform.metadata.namespace],
  ["Public API compatibility verified", platform.metadata.id],
] as const);

export const TimelineVisualizationCertificationCompatibility:
readonly TimelineVisualizationCertificationCompatibilityEntry[] = Object.freeze(
  verificationSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-4:7/Compatibility/${name.replaceAll(" ", "")}`,
    name,
    verified: true,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeVerification: false,
    metadataOnly: true,
    immutable: true,
  })),
);
