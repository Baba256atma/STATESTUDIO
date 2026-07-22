export const DashboardExecutiveWorkspaceVisualizationOwnership = Object.freeze({
  owner: "Dashboard & Executive Workspace Visualization Foundation",
  owns: Object.freeze([
    "Dashboard contracts", "Workspace contracts", "Widget contracts", "Layout contracts",
    "Panel contracts", "Capability metadata", "Boundary metadata", "Lifecycle metadata",
    "Foundation policies",
  ]),
  excludes: Object.freeze([
    "Dashboard runtime", "React components", "HTML", "CSS", "DOM",
    "Widget execution", "Chart rendering", "Timeline rendering", "Graph rendering",
    "Data loading", "Persistence", "Networking", "Authentication", "Business logic",
    "KPI calculations", "OKR calculations",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
