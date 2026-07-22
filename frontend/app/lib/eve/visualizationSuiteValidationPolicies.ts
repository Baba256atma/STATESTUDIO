const policyNames = Object.freeze([
  "Validation immutability", "Deterministic ordering",
  "Metadata preservation", "Registry reference preservation",
  "Model reference preservation", "Stable identities",
  "Compatibility preservation", "Dependency preservation",
  "Namespace preservation", "Canonical Inventory Rule enforcement",
] as const);

export const VisualizationSuiteValidationPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-9:4/Policy/${index + 1}` as const,
    name,
    description: `${name} policy is descriptive and performs no runtime validation.`,
    deterministicOrder: index + 1,
    runtimeValidation: false,
    metadataOnly: true,
    immutable: true,
  })),
);
