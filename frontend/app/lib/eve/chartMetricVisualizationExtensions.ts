const extensionNames = Object.freeze([
  "Metric types", "Chart families", "Series types", "Axis types", "Legend styles",
  "Annotation styles", "Threshold styles", "Status styles", "Output profiles",
  "Format profiles", "Comparison profiles", "Dashboard profiles", "Executive profiles",
  "Accessibility profiles", "Export profiles", "Future visualization profiles",
] as const);

export const ChartMetricVisualizationExtensionClassifications = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-5:2/Extension/${index + 1}` as const,
    name,
    description: `Declarative compatibility classification for ${name.toLowerCase()}.`,
    deterministicOrder: index + 1,
    runtimeLoading: false,
    runtimeRegistration: false,
    metadataOnly: true,
    immutable: true,
  })),
);
