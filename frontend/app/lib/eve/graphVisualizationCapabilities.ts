const names = Object.freeze([
  "Graph Identity Declaration", "Graph Structure Declaration",
  "Node Visualization Declaration", "Edge Visualization Declaration",
  "Cluster Declaration", "Group Declaration", "Path Declaration",
  "Graph View Declaration", "Graph Viewport Declaration", "Layout Intent Declaration",
  "Relationship Marker Declaration", "Node Presentation Declaration",
  "Edge Presentation Declaration", "Graph Output Declaration",
  "Scene Rendering Target Referencing", "Ownership Publication",
  "Boundary Publication", "Extension Point Publication",
] as const);

export const GraphVisualizationCapabilities = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-3:1/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Metadata-only Graph Visualization capability for ${name}.`,
    deterministicOrder: index + 1,
    implementationProvided: false,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
