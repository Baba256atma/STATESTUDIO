"use client";

import React from "react";

import type { CatalogCategoryDefinition } from "../../lib/objectCatalog/objectCatalogTypes";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { sceneHudChipStyle } from "../../lib/theme/sceneThemeTokens";

export type ObjectCatalogCategoryProps = {
  category: CatalogCategoryDefinition;
  active: boolean;
  count: number;
  tokens: SceneThemeTokens;
  onSelect: (categoryId: CatalogCategoryDefinition["id"]) => void;
};

export function ObjectCatalogCategory(props: ObjectCatalogCategoryProps): React.ReactElement {
  const { category, active, count, tokens, onSelect } = props;

  return (
    <button
      type="button"
      aria-pressed={active}
      data-nx-catalog-category={category.id}
      onClick={() => onSelect(category.id)}
      style={{
        ...sceneHudChipStyle(tokens, active),
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700 }}>{category.label}</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          opacity: 0.72,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}
      </span>
    </button>
  );
}

export default ObjectCatalogCategory;
