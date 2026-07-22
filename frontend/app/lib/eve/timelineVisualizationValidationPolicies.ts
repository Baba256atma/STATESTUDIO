const policyNames = Object.freeze([
  "Stable identity policy", "Canonical namespace policy", "Registry preservation policy",
  "Foundation preservation policy", "Model integrity policy", "Boundary preservation policy",
  "Compatibility preservation policy", "Immutable metadata policy",
  "Deterministic ordering policy", "Dynamic inventory policy", "Public surface policy",
  "Canonical Inventory Rule policy",
] as const);

export const TimelineVisualizationValidationPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-4:4/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative validation policy: ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
