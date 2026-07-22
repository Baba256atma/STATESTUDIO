import type { VisualizationRegistryPolicy } from "./visualizationRegistryTypes.ts";

const names = Object.freeze([
  "Canonical Identity Policy", "Foundation Reference Policy",
  "Immutable Entry Policy", "Deterministic Inventory Policy",
  "No Duplication Policy", "No Reconstruction Policy",
  "Metadata Only Policy", "Non-Rendering Policy",
] as const);

export const VisualizationRegistryPolicies: readonly VisualizationRegistryPolicy[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:2/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive registry policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

