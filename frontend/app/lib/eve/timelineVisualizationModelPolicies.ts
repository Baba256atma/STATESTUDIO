const policyNames = Object.freeze([
  "Stable identity policy", "Registry preservation policy", "Structural consistency policy",
  "Immutable model policy", "Canonical ordering policy", "Ownership preservation policy",
  "Boundary preservation policy", "Relationship consistency policy",
  "Compatibility preservation policy", "Timeline-versus-playback separation policy",
  "Timeline-versus-animation separation policy", "Canonical Inventory Rule policy",
] as const);

export const TimelineVisualizationModelPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-4:3/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Timeline Visualization Model policy: ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
