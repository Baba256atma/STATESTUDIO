const policyNames = Object.freeze([
  "Stable identity policy", "Registry preservation policy", "Ownership preservation policy",
  "Boundary preservation policy", "Structural consistency policy",
  "Relationship consistency policy", "Metric consistency policy", "Chart consistency policy",
  "Compatibility preservation policy", "Inventory derivation policy", "Immutability policy",
  "Dependency isolation policy", "Validation metadata policy",
  "Canonical Inventory Rule policy",
] as const);

export const ChartMetricVisualizationValidationPolicies = Object.freeze(policyNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:4/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no validation.`,
    deterministicOrder: index + 1,
    runtimeValidation: false,
    metadataOnly: true,
    immutable: true,
  })),
);
