import { TimelineVisualizationCertificationPlatform } from "./timelineVisualizationCertification.ts";
import type { TimelineVisualizationFreezeDeclaration } from "./timelineVisualizationFreezeTypes.ts";

const certification = TimelineVisualizationCertificationPlatform;
const extensionNames = Object.freeze([
  "Timeline extension", "Time axis extension", "Temporal event extension",
  "Playback intent extension", "Scenario timeline extension",
  "Historical timeline extension", "Forecast timeline extension", "Public extension point",
] as const);

export const TimelineVisualizationFreezeExtensions:
readonly TimelineVisualizationFreezeDeclaration[] = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-4:8/Extension/${name.replaceAll(" ", "")}`,
    name,
    canonicalReference: certification.platform.manifest.validation.model.registry.extensions[
      index % certification.platform.manifest.validation.model.registry.extensions.length
    ]!,
    preservedByReference: true,
    deterministicOrder: index + 1,
    runtimeExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
