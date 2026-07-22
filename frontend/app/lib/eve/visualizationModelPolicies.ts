const names = Object.freeze([
  "Strong Typing Policy", "Immutable Model Policy", "Canonical Identity Policy",
  "Registry Reference Policy", "Deterministic Metadata Policy",
  "Canonical Inventory Policy", "No Duplication Policy",
  "No Reconstruction Policy", "Non-Rendering Policy", "Runtime-Free Policy",
] as const);

export const VisualizationModelPolicies = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-1:3/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive visualization model policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

