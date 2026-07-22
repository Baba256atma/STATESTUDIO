const boundarySeeds = Object.freeze([
  ["metric-visualization-versus-calculation", "Metric visualization versus metric calculation"],
  ["metric-presentation-versus-kpi-ownership", "Metric presentation versus KPI ownership"],
  ["metric-presentation-versus-okr-ownership", "Metric presentation versus OKR ownership"],
  ["target-visualization-versus-governance", "Target visualization versus target governance"],
  ["variance-presentation-versus-calculation", "Variance presentation versus variance calculation"],
  ["trend-presentation-versus-analysis", "Trend presentation versus trend analysis"],
  ["threshold-metadata-versus-evaluation", "Threshold metadata versus threshold evaluation"],
  ["status-metadata-versus-determination", "Status metadata versus business-state determination"],
  ["chart-definition-versus-rendering", "Chart definition versus chart rendering"],
  ["interaction-intent-versus-execution", "Chart interaction intent versus interaction execution"],
  ["output-metadata-versus-generation", "Chart output metadata versus output generation"],
  ["eve-5-visualization-versus-director", "EVE-5 visualization versus Director orchestration"],
] as const);

export const ChartMetricVisualizationBoundaries = Object.freeze(boundarySeeds.map(
  ([key, name], index) => Object.freeze({
    id: `EVE-5:1/Boundary/${key}` as const,
    name,
    description: `${name}; the latter responsibility is explicitly excluded.`,
    ownership: "Excluded" as const,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
