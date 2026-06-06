import {
  logObjectCatalogClosed,
  logObjectCatalogOpened,
  logObjectCatalogSearch,
} from "./objectCatalogInstrumentation";
import {
  getAllCatalogObjectDefinitions,
  getCatalogObjectDefinition,
  getCatalogObjectsByCategory,
} from "./objectCatalogRegistry";
import type {
  CatalogObjectCategoryId,
  CatalogObjectDefinition,
  CatalogSearchResult,
} from "./objectCatalogTypes";
import {
  normalizeObjectCatalogEntrySource,
  normalizeObjectCatalogState,
  type ObjectCatalogEntrySource,
} from "../scene/scenePanelContract";

export const OBJECT_CATALOG_OPEN_EVENT = "nexora:object-catalog-open";
export const OBJECT_CATALOG_CLOSE_EVENT = "nexora:object-catalog-close";

export function searchCatalogObjects(query: string): CatalogSearchResult {
  const normalized = query.trim().toLowerCase();
  const all = getAllCatalogObjectDefinitions();
  if (!normalized) {
    return { query: "", matches: all };
  }
  const matches = all.filter((item) => {
    const haystack = [
      item.label,
      item.category,
      item.description ?? "",
      item.defaultRole ?? "",
      item.id,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
  logObjectCatalogSearch({ query: normalized, matchCount: matches.length });
  return { query: normalized, matches };
}

export function resolveCatalogObjectPreview(
  definition: CatalogObjectDefinition
): { definition: CatalogObjectDefinition; categoryLabel: string } {
  return {
    definition,
    categoryLabel: definition.category.charAt(0).toUpperCase() + definition.category.slice(1),
  };
}

export function requestOpenObjectCatalog(source: ObjectCatalogEntrySource | string): void {
  const normalizedSource = normalizeObjectCatalogEntrySource(source);
  normalizeObjectCatalogState("open", { warn: false });
  if (typeof window === "undefined") {
    normalizeObjectCatalogState("unavailable");
    return;
  }
  logObjectCatalogOpened(normalizedSource);
  window.dispatchEvent(new CustomEvent(OBJECT_CATALOG_OPEN_EVENT, { detail: { source: normalizedSource } }));
}

export function requestCloseObjectCatalog(source: ObjectCatalogEntrySource | string): void {
  const normalizedSource = normalizeObjectCatalogEntrySource(source, { warn: false });
  if (typeof window === "undefined") return;
  logObjectCatalogClosed(normalizedSource);
  window.dispatchEvent(new CustomEvent(OBJECT_CATALOG_CLOSE_EVENT, { detail: { source: normalizedSource } }));
}

export {
  getAllCatalogObjectDefinitions,
  getCatalogObjectDefinition,
  getCatalogObjectsByCategory,
};

export type { CatalogObjectCategoryId, CatalogObjectDefinition } from "./objectCatalogTypes";
