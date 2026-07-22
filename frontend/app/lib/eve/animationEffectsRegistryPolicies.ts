const policyNames = Object.freeze([
  "Stable identity", "Canonical naming", "Registry uniqueness",
  "Foundation reference preservation", "Ownership preservation",
  "Deterministic ordering", "Extension classification",
  "Metadata immutability", "Compatibility preservation",
  "Canonical Inventory Rule compliance",
] as const);

export const AnimationEffectsRegistryPolicies = Object.freeze(policyNames.map(
  (name, index) => Object.freeze({
    id: `EVE-7:2/Policy/${index + 1}` as const,
    name,
    description: `${name} policy is descriptive and performs no runtime logic.`,
    deterministicOrder: index + 1,
    runtimeChecks: false,
    metadataOnly: true,
    immutable: true,
  })),
);
