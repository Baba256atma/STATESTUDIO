const policyNames = Object.freeze([
  "Stable identity", "Canonical naming", "Registry uniqueness",
  "Foundation reference preservation", "Public Index preservation",
  "Deterministic ordering", "Compatibility preservation",
  "Metadata immutability", "Dependency preservation",
  "Canonical Inventory Rule compliance",
] as const);

export const VisualizationSuiteRegistryPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-9:2/Policy/${index + 1}` as const,
    name,
    description: `${name} policy is descriptive and performs no runtime enforcement.`,
    deterministicOrder: index + 1,
    runtimeEnforcement: false,
    metadataOnly: true,
    immutable: true,
  })),
);
