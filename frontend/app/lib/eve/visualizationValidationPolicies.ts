const names = Object.freeze([
  "Declarative Validation Policy", "Immutable Validation Metadata Policy",
  "Stable Rule Identity Policy", "Model Reference Policy",
  "Deterministic Outcome Policy", "Canonical Inventory Policy",
  "No Duplication Policy", "No Reconstruction Policy",
  "Non-Rendering Policy", "No Runtime Diagnostics Policy",
] as const);

export const VisualizationValidationPolicies = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-1:4/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive visualization validation policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);

