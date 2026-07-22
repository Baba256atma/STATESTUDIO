import type { DirectorRegistryEntry } from "./directorRegistryTypes.ts";

const entries = (
  category: string,
  names: readonly string[],
): readonly DirectorRegistryEntry[] => Object.freeze(names.map((name, index) =>
  Object.freeze({
    id: `DIRECTOR-1:2/${category}/${name}`,
    name,
    description: `Canonical Director ${category} classification for ${name}.`,
    category,
    version: "1.0.0" as const,
    namespace: `nexora.director.registry.${category.toLowerCase()}` as const,
    stability: "Stable" as const,
    deterministicOrder: index + 1,
  }),
));

export const DirectorVisualizationIntentTypeRegistry = entries(
  "VisualizationIntentType",
  ["Explain", "Compare", "Explore", "Monitor", "Simulate", "Highlight", "Recommend", "Investigate", "Present", "Review"],
);

export const DirectorExecutiveFocusTypeRegistry = entries(
  "ExecutiveFocusType",
  ["Cost", "Revenue", "Growth", "Production", "Operations", "Inventory", "Sales", "Customers", "Workforce", "Risk", "Strategy"],
);

export const DirectorVisualizationRegistry = Object.freeze({
  intentTypes: DirectorVisualizationIntentTypeRegistry,
  executiveFocusTypes: DirectorExecutiveFocusTypeRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

