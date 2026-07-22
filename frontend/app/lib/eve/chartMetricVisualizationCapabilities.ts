const capabilityNames = Object.freeze([
  "Metric identity declaration", "Metric reference declaration",
  "Metric definition declaration", "Metric value presentation declaration",
  "Metric target presentation declaration", "Metric baseline presentation declaration",
  "Metric variance presentation declaration", "Metric trend presentation declaration",
  "Metric threshold presentation declaration", "Metric status presentation declaration",
  "Metric-card declaration", "Metric comparison declaration", "Chart identity declaration",
  "Chart definition declaration", "Chart-series declaration", "Chart-axis declaration",
  "Chart-legend declaration", "Chart-annotation declaration", "Chart-output declaration",
  "Extension-point declaration",
] as const);

export const ChartMetricVisualizationCapabilities = Object.freeze(capabilityNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:1/Capability/${index + 1}` as const,
    name,
    description: `Architectural support for ${name.toLowerCase()}.`,
    deterministicOrder: index + 1,
    executionProvided: false,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
