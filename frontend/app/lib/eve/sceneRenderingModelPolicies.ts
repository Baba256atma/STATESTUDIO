const names = Object.freeze([
  "Strong Typing Policy", "Immutable Model Policy", "Registry Derivation Policy",
  "Canonical Identity Policy", "Stable Ordering Policy",
  "Relationship Descriptor Policy", "Canonical Reference Policy",
  "Canonical Inventory Rule Policy", "Non-Rendering Policy", "Runtime-Free Policy",
] as const);

export const SceneRenderingModelPolicies = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-2:3/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive Scene Rendering Model policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);

