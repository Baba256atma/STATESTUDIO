const policyNames = Object.freeze([
  "Strong typing policy", "Model immutability policy",
  "Registry derivation policy", "Deterministic ordering policy",
  "Canonical ordering policy", "Metadata-only policy",
  "Identity preservation policy", "Relationship integrity policy",
  "Dependency preservation policy", "Canonical Inventory Rule compliance policy",
] as const);

export const VisualizationSuiteModelPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-9:3/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime enforcement.`,
    deterministicOrder: index + 1,
    runtimeEnforcement: false,
    metadataOnly: true,
    immutable: true,
  })),
);
