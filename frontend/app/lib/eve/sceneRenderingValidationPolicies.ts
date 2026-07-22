const policyNames = Object.freeze([
  "Validation Immutability", "Deterministic Evaluation", "Metadata Preservation",
  "Registry Reference Preservation", "Model Reference Preservation", "Stable Identities",
  "Canonical Ordering", "Compatibility Preservation", "Dependency Preservation",
  "Canonical Inventory Rule Enforcement",
] as const);

export const SceneRenderingValidationPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-2:4/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive Scene Rendering Validation policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
