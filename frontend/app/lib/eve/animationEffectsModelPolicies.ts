const policyNames = Object.freeze([
  "Strong typing policy", "Stable identities policy",
  "Registry reference preservation policy", "Relationship integrity policy",
  "Metadata immutability policy", "Deterministic ordering policy",
  "Extension preservation policy", "Compatibility preservation policy",
  "Dependency preservation policy", "Canonical Inventory Rule compliance policy",
] as const);

export const AnimationEffectsModelPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-7:3/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime checks.`,
    deterministicOrder: index + 1,
    runtimeChecks: false,
    metadataOnly: true,
    immutable: true,
  })),
);
