const boundaryNames = Object.freeze([
  "Workspace architecture vs workspace runtime",
  "Dashboard definition vs dashboard rendering",
  "Widget metadata vs widget execution", "Layout metadata vs layout engine",
  "Panel metadata vs panel rendering", "Navigation metadata vs navigation runtime",
  "Workspace metadata vs persistence", "Workspace metadata vs networking",
  "Dashboard metadata vs React UI", "Dashboard metadata vs browser DOM",
  "Workspace metadata vs Director orchestration",
  "Dashboard metadata vs business reasoning", "Dashboard metadata vs chart rendering",
  "Dashboard metadata vs animation",
] as const);

export const DashboardExecutiveWorkspaceVisualizationBoundaries = Object.freeze(
  boundaryNames.map((name, index) => Object.freeze({
    id: `EVE-6:1/Boundary/${index + 1}` as const,
    name,
    description: `${name}; the latter responsibility is explicitly excluded.`,
    ownership: "Excluded" as const,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
