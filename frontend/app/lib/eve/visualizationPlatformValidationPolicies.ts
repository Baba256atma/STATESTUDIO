const policyNames = Object.freeze([
  "Validation immutability policy", "Deterministic ordering policy",
  "Metadata preservation policy", "Registry reference preservation policy",
  "Model reference preservation policy", "Stable identities policy",
  "Compatibility preservation policy", "Dependency preservation policy",
  "Namespace preservation policy", "Canonical Inventory Rule enforcement policy",
] as const);

export const VisualizationPlatformValidationPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-8:4/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime validation.`,
    deterministicOrder: index + 1,
    runtimeValidation: false,
    metadataOnly: true,
    immutable: true,
  })),
);
