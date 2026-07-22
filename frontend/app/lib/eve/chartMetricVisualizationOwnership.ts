export const ChartMetricVisualizationOwnership = Object.freeze({
  owner: "Chart & Metric Visualization Foundation",
  owns: Object.freeze([
    "Metric visualization contracts", "Chart visualization contracts",
    "Metric-card metadata", "Target, baseline, variance, and trend presentation contracts",
    "Threshold and status presentation metadata", "Series, axis, legend, and annotation contracts",
    "Chart output contracts", "Chart and metric visualization lifecycle",
    "Visualization capabilities", "Architectural boundaries", "Extension contracts",
  ]),
  excludes: Object.freeze([
    "KPI definitions", "OKR definitions", "Metric formulas", "Business targets",
    "Business thresholds", "Metric calculation", "Aggregation", "Statistical analysis",
    "Forecasting", "Root-cause analysis", "Business reasoning", "Data validation",
    "Data acquisition", "Chart rendering", "Dashboard runtime", "UI components",
    "Director orchestration", "Networking", "Persistence",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
