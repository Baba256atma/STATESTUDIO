const policyNames = Object.freeze([
  "Stable identity policy", "Canonical naming policy",
  "Registry uniqueness policy", "Foundation reference preservation policy",
  "Deterministic ordering policy", "Platform compatibility policy",
  "Extension classification policy", "Metadata immutability policy",
  "Dependency preservation policy", "Canonical Inventory Rule compliance policy",
] as const);

export const VisualizationPlatformRegistryPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-8:2/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime enforcement.`,
    deterministicOrder: index + 1,
    runtimeEnforcement: false,
    metadataOnly: true,
    immutable: true,
  })),
);
