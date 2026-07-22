const extensionNames = Object.freeze([
  "Timeline extension", "Time axis extension", "Time point extension",
  "Time range extension", "Temporal event extension", "Marker extension",
  "Segment extension", "Layer extension", "Playback extension",
  "Scenario timeline extension", "Historical timeline extension",
  "Forecast timeline extension", "Timeline output extension", "Temporal policy extension",
] as const);

export const TimelineVisualizationRegistryExtensions = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-4:2/Extension/${name.replaceAll(" ", "")}`,
    name,
    description: `Future-compatible descriptive classification for ${name}.`,
    stability: "Stable",
    deterministicOrder: index + 1,
    implementationProvided: false,
    runtimeLoading: false,
    metadataOnly: true,
    immutable: true,
  })),
);
