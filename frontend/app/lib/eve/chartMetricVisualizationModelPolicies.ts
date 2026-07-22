const policyNames = Object.freeze([
  "Stable identity policy", "Registry preservation policy", "Structural consistency policy",
  "Immutable model policy", "Canonical ordering policy", "Ownership preservation policy",
  "Boundary preservation policy", "Relationship consistency policy",
  "Compatibility preservation policy", "Metric-versus-calculation policy",
  "Chart-versus-rendering policy", "Dashboard separation policy", "Metadata-only policy",
  "Canonical Inventory Rule policy",
] as const);

export const ChartMetricVisualizationModelPolicies = Object.freeze(policyNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:3/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime enforcement.`,
    deterministicOrder: index + 1,
    runtimeChecks: false,
    metadataOnly: true,
    immutable: true,
  })),
);
