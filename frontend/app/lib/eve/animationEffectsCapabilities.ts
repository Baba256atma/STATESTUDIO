const capabilityNames = Object.freeze([
  "Animation description", "Transition description", "Effect description",
  "Highlight description", "Motion description", "Timing description",
  "Visual emphasis description", "Animation identity management",
  "Extension definition", "Architectural compatibility", "Metadata publication",
  "Canonical inventory publication", "Readiness publication",
  "Foundation preservation",
] as const);

export const AnimationEffectsCapabilities = Object.freeze(capabilityNames.map(
  (name, index) => Object.freeze({
    id: `EVE-7:1/Capability/${index + 1}` as const,
    name,
    description: `Architectural support for ${name.toLowerCase()}.`,
    deterministicOrder: index + 1,
    executionProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
