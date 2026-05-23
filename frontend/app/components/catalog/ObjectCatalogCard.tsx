"use client";

import React from "react";

import type { CatalogObjectDefinition } from "../../lib/objectCatalog/objectCatalogTypes";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { sceneHudChipStyle } from "../../lib/theme/sceneThemeTokens";

export type ObjectCatalogCardProps = {
  definition: CatalogObjectDefinition;
  selected: boolean;
  tokens: SceneThemeTokens;
  onSelect: (definition: CatalogObjectDefinition) => void;
};

export function ObjectCatalogCard(props: ObjectCatalogCardProps): React.ReactElement {
  const { definition, selected, tokens, onSelect } = props;

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-nx-catalog-id={definition.id}
      onClick={() => onSelect(definition)}
      style={{
        ...sceneHudChipStyle(tokens, selected),
        width: "100%",
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: tokens.controlBackground,
          border: `1px solid ${tokens.controlBorder}`,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {definition.icon ?? "◆"}
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: tokens.textPrimary,
            lineHeight: 1.2,
          }}
        >
          {definition.label}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 2,
            fontSize: 10,
            color: tokens.textSecondary,
            textTransform: "capitalize",
          }}
        >
          {definition.category}
        </span>
      </span>
    </button>
  );
}

export default ObjectCatalogCard;
