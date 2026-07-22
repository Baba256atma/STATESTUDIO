export const VisualizationPlatformFoundationOwnership = Object.freeze({
  owner: "EVE-8:1/VisualizationPlatformFoundation",
  owns: Object.freeze([
    "Platform contracts", "Platform composition", "Platform identities",
    "Platform capabilities", "Platform boundaries", "Platform metadata",
    "Platform compatibility",
  ]),
  excludes: Object.freeze([
    "Rendering execution", "Timeline playback", "Graph layout",
    "Dashboard rendering", "Animation runtime", "UI implementation",
    "Director orchestration", "Advisor logic", "Executive reasoning",
    "Business Objects",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
