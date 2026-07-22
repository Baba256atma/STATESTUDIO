export const VisualizationSuiteFoundationOwnership = Object.freeze({
  owner: "EVE-9:1/VisualizationSuiteFoundation",
  owns: Object.freeze([
    "Suite contracts", "Suite composition", "Suite identities",
    "Suite capabilities", "Suite boundaries", "Suite metadata",
    "Suite compatibility",
  ]),
  excludes: Object.freeze([
    "Rendering execution", "Scene rendering", "Graph layout",
    "Timeline playback", "Dashboard rendering", "Animation runtime",
    "Visualization Platform implementation", "Director orchestration",
    "Advisor logic", "Executive reasoning", "Business Objects",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
