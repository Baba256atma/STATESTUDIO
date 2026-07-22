import type { TimelineVisualizationCapabilityDeclaration } from "./timelineVisualizationFoundationTypes.ts";

const capabilityNames = Object.freeze([
  "Timeline identity", "Time point definition", "Time range definition",
  "Time axis definition", "Temporal event description", "Temporal marker description",
  "Timeline segmentation", "Timeline layering", "Historical reference",
  "Forecast reference", "Scenario timeline definition", "Playback intent definition",
  "Timeline output description", "Decision moment description",
  "Temporal metadata publication", "Timeline policy publication",
  "Extension publication", "Temporal architecture publication",
] as const);

export const TimelineVisualizationFoundationCapabilities:
readonly TimelineVisualizationCapabilityDeclaration[] = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-4:1/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive metadata capability for ${name}.`,
    deterministicOrder: index + 1,
    executionProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
