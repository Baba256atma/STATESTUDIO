const boundaryNames = Object.freeze([
  "Rendering Execution Boundary", "Scene Execution Boundary",
  "Graph Execution Boundary", "Timeline Execution Boundary",
  "Dashboard Execution Boundary", "Animation Execution Boundary",
  "UI Implementation Boundary", "Director Orchestration Boundary",
  "Advisor Logic Boundary", "Executive Reasoning Boundary",
  "Business State Boundary", "Infrastructure Boundary",
] as const);

export const VisualizationPlatformFoundationBoundaries = Object.freeze(
  boundaryNames.map((name, index) => Object.freeze({
    id: `EVE-8:1/Boundary/${index + 1}` as const,
    name,
    description: `${name} remains outside the Visualization Platform Foundation.`,
    deterministicOrder: index + 1,
    enforcementRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
