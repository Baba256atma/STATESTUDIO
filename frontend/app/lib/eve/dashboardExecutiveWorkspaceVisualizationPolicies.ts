const policyNames = Object.freeze([
  "Stable identity policy", "Vocabulary immutability policy",
  "Foundation reference preservation policy", "Canonical registry policy",
  "Deterministic ordering policy", "Category isolation policy",
  "Ownership preservation policy", "Lifecycle preservation policy",
  "Boundary preservation policy", "Extension compatibility policy",
  "Inventory derivation policy", "Dependency isolation policy", "Metadata-only policy",
  "Canonical Inventory Rule policy",
] as const);

export const DashboardExecutiveWorkspaceVisualizationRegistryPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-6:2/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime logic.`,
    deterministicOrder: index + 1,
    runtimeChecks: false,
    metadataOnly: true,
    immutable: true,
  })),
);
