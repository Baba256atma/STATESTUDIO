const boundaryNames = Object.freeze([
  "Rendering Execution Boundary", "Scene Rendering Boundary",
  "Graph Layout Boundary", "Timeline Playback Boundary",
  "Dashboard Rendering Boundary", "Animation Runtime Boundary",
  "Visualization Platform Implementation Boundary",
  "Director Orchestration Boundary", "Advisor Logic Boundary",
  "Executive Reasoning Boundary", "Business State Boundary",
  "Infrastructure Boundary",
] as const);

export const VisualizationSuiteFoundationBoundaries = Object.freeze(
  boundaryNames.map((name, index) => Object.freeze({
    id: `EVE-9:1/Boundary/${index + 1}` as const,
    name,
    description: `${name} remains outside the Visualization Suite Foundation.`,
    deterministicOrder: index + 1,
    enforcementRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
