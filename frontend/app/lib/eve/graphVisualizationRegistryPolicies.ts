import type { GraphVisualizationRegistryPolicy } from "./graphVisualizationRegistryTypes.ts";

const names = Object.freeze([
  "Stable Identity Policy", "Canonical Naming Policy", "Registry Uniqueness Policy",
  "Foundation Reference Preservation Policy", "Category Ownership Policy",
  "Deterministic Ordering Policy", "Vocabulary Immutability Policy",
  "Extension Classification Policy", "Structure Versus Analytics Separation Policy",
  "Layout Intent Versus Execution Separation Policy",
  "Relationship Marker Versus Inference Separation Policy",
  "Canonical Inventory Rule Policy",
] as const);

export const GraphVisualizationRegistryPolicies: readonly GraphVisualizationRegistryPolicy[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-3:2/Policy/${name.replaceAll(" ", "")}`,
    name,
    description: `Descriptive Graph Visualization Registry policy for ${name}.`,
    enforcement: "DescriptiveOnly",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));
