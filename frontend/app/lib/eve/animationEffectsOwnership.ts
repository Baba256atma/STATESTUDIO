export const AnimationEffectsOwnership = Object.freeze({
  owner: "Animation & Effects Foundation",
  owns: Object.freeze([
    "Animation contracts", "Animation identities", "Effect identities",
    "Transition metadata", "Timing metadata", "Animation boundaries",
    "Animation lifecycle", "Animation capabilities",
  ]),
  excludes: Object.freeze([
    "Rendering", "Scene composition", "Graph layout", "Timeline playback",
    "Director orchestration", "Executive reasoning", "Business Objects",
    "Runtime animation", "Physics simulation",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
