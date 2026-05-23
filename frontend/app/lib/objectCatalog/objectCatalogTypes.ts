/** E2:24 — Executive object catalog contracts. */

export type CatalogObjectCategoryId =
  | "operations"
  | "finance"
  | "project"
  | "strategy"
  | "custom";

export interface CatalogObjectDefinition {
  id: string;
  label: string;
  category: CatalogObjectCategoryId;
  icon?: string;
  description?: string;
  defaultRole?: string;
  defaultSeverity?: number;
  defaultMetadata?: Record<string, unknown>;
}

export type CatalogCategoryDefinition = {
  id: CatalogObjectCategoryId;
  label: string;
  description: string;
};

export const OBJECT_CATALOG_CATEGORIES: readonly CatalogCategoryDefinition[] = [
  { id: "operations", label: "Operations", description: "Operational entities and flow nodes" },
  { id: "finance", label: "Finance", description: "Financial system objects" },
  { id: "project", label: "Project", description: "Delivery and program structures" },
  { id: "strategy", label: "Strategy", description: "Strategic objectives and risks" },
  { id: "custom", label: "Custom", description: "User-defined enterprise objects" },
] as const;

export type CatalogObjectPreview = {
  definition: CatalogObjectDefinition;
  categoryLabel: string;
};

export type CatalogSearchResult = {
  query: string;
  matches: CatalogObjectDefinition[];
};
