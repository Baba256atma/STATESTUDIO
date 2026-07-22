const capabilityNames = Object.freeze([
  "Workspace identity declaration", "Workspace definition declaration",
  "Workspace layout declaration", "Workspace zone declaration",
  "Workspace section declaration", "Dashboard declaration",
  "Dashboard layout declaration", "Dashboard template declaration", "Widget declaration",
  "Panel declaration", "Executive card declaration", "KPI panel declaration",
  "Chart panel declaration", "Timeline panel declaration", "Graph panel declaration",
  "Navigation declaration", "Filter declaration", "Context declaration",
  "Output declaration", "Export declaration", "Presentation declaration",
  "Extension declaration",
] as const);

export const DashboardExecutiveWorkspaceVisualizationCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-6:1/Capability/${index + 1}` as const,
    name,
    description: `Architectural support for ${name.toLowerCase()}.`,
    deterministicOrder: index + 1,
    executionProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
