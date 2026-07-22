const extensionNames = Object.freeze([
  "Animation extension", "Transition extension", "Effect extension",
  "Timing extension", "Motion extension", "Easing extension", "Target extension",
  "Trigger extension", "Profile extension", "Policy extension",
  "Highlight extension", "Focus extension", "Pulse extension", "Fade extension",
] as const);

export const AnimationEffectsRegistryExtensions = Object.freeze(extensionNames.map(
  (name, index) => Object.freeze({
    id: `EVE-7:2/Extension/${index + 1}` as const,
    name,
    description: `Future-compatible classification for ${name.toLowerCase()}.`,
    deterministicOrder: index + 1,
    runtimeLoading: false,
    runtimeRegistration: false,
    metadataOnly: true,
    immutable: true,
  })),
);
