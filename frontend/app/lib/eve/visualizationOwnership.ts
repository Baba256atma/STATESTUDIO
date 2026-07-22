export const VisualizationOwnership = Object.freeze({
  ownershipId: "EVE-1:1/VisualizationOwnership",
  owns: Object.freeze([
    "Visual representation metadata",
    "Rendering contract metadata",
    "Viewport metadata",
    "Camera contract metadata",
    "Layer contract metadata",
    "Rendering target metadata",
    "Rendering surface metadata",
    "Visual state metadata",
    "Rendering capability metadata",
    "Rendering policy metadata",
    "Visualization extension metadata",
  ] as const),
  doesNotOwn: Object.freeze([
    "Business decisions", "Executive reasoning", "Director orchestration",
    "Advisor logic", "DKL processing", "Business rules", "Business Objects",
    "Runtime execution", "Rendering implementation", "User interface",
    "Persistence", "Networking",
  ] as const),
  runtimeOwnership: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

