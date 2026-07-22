import { TimelineVisualizationManifestPlatform } from "./timelineVisualizationManifest.ts";

export const TimelineVisualizationPlatformComposition = Object.freeze([
  ...TimelineVisualizationManifestPlatform.composition,
  Object.freeze({
    id: "EVE-4:6/Composition/Platform",
    phase: "Platform",
    canonicalReference: "EVE-4:6/TimelineVisualizationPlatform",
    canonicalSource: "EVE-4:6/TimelineVisualizationPlatform",
    preservedByReference: true,
    deterministicOrder: TimelineVisualizationManifestPlatform.composition.length + 1,
    metadataOnly: true,
    immutable: true,
  }),
]);
