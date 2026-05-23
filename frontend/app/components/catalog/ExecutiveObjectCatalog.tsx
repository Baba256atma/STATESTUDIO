"use client";

import React from "react";

import {
  OBJECT_CATALOG_CATEGORIES,
  type CatalogObjectCategoryId,
  type CatalogObjectDefinition,
} from "../../lib/objectCatalog/objectCatalogTypes";
import {
  resolveCatalogObjectPreview,
  searchCatalogObjects,
} from "../../lib/objectCatalog/objectCatalogRuntime";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  resolveSceneThemeTokens,
  sceneHudControlButtonStyle,
  sceneHudShellStyle,
} from "../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import { ObjectCatalogCard } from "./ObjectCatalogCard";
import { ObjectCatalogCategory } from "./ObjectCatalogCategory";

export type ExecutiveObjectCatalogProps = {
  open: boolean;
  themeMode?: NexoraHudThemeMode;
  onCancel: () => void;
  onConfirm: (definition: CatalogObjectDefinition) => void;
};

export function ExecutiveObjectCatalog(props: ExecutiveObjectCatalogProps): React.ReactElement | null {
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<CatalogObjectCategoryId | "all">("all");
  const [selected, setSelected] = React.useState<CatalogObjectDefinition | null>(null);

  React.useEffect(() => {
    if (!props.open) {
      setQuery("");
      setActiveCategory("all");
      setSelected(null);
    }
  }, [props.open]);

  const searchResult = React.useMemo(() => searchCatalogObjects(query), [query]);

  const visibleObjects = React.useMemo(() => {
    if (activeCategory === "all") return searchResult.matches;
    return searchResult.matches.filter((item) => item.category === activeCategory);
  }, [activeCategory, searchResult.matches]);

  const categoryCounts = React.useMemo(() => {
    const counts = new Map<CatalogObjectCategoryId, number>();
    for (const category of OBJECT_CATALOG_CATEGORIES) {
      counts.set(
        category.id,
        searchResult.matches.filter((item) => item.category === category.id).length
      );
    }
    return counts;
  }, [searchResult.matches]);

  const preview = selected ? resolveCatalogObjectPreview(selected) : null;

  const handleCancel = React.useCallback(() => {
    props.onCancel();
  }, [props.onCancel]);

  const handleConfirm = React.useCallback(() => {
    if (!selected) return;
    props.onConfirm(selected);
  }, [props.onConfirm, selected]);

  if (!props.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Executive Object Catalog"
      data-nx="executive-object-catalog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "color-mix(in srgb, var(--nx-bg-app) 35%, rgba(0,0,0,0.45))",
        backdropFilter: "blur(8px)",
      }}
      onPointerDown={handleCancel}
    >
      <div
        style={{
          ...sceneHudShellStyle(tokens),
          width: "min(760px, 96vw)",
          maxHeight: "min(82vh, 720px)",
          display: "grid",
          gridTemplateRows: "auto auto 1fr auto auto",
          gap: 10,
          padding: 14,
          overflow: "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
              Executive Catalog
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: hudTheme.textPrimary, marginTop: 2 }}>
              Add Object
            </div>
          </div>
          <button
            type="button"
            aria-label="Close catalog"
            onClick={handleCancel}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              width: 30,
              height: 30,
              padding: 0,
            }}
          >
            ×
          </button>
        </header>

        <input
          type="search"
          aria-label="Search catalog objects"
          placeholder="Search supplier, warehouse, risk, project, budget…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{
            width: "100%",
            borderRadius: 10,
            border: `1px solid ${tokens.controlBorder}`,
            background: tokens.inputSurface,
            color: tokens.textPrimary,
            fontSize: 12,
            fontWeight: 600,
            padding: "8px 10px",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button
            type="button"
            aria-pressed={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              padding: "5px 10px",
              fontWeight: 700,
              opacity: activeCategory === "all" ? 1 : 0.78,
            }}
          >
            All ({searchResult.matches.length})
          </button>
          {OBJECT_CATALOG_CATEGORIES.map((category) => (
            <ObjectCatalogCategory
              key={category.id}
              category={category}
              active={activeCategory === category.id}
              count={categoryCounts.get(category.id) ?? 0}
              tokens={tokens}
              onSelect={setActiveCategory}
            />
          ))}
        </div>

        <div
          style={{
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(220px, 0.8fr)",
            gap: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              minHeight: 0,
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 8,
              alignContent: "start",
              paddingRight: 2,
            }}
          >
            {visibleObjects.map((definition) => (
              <ObjectCatalogCard
                key={definition.id}
                definition={definition}
                selected={selected?.id === definition.id}
                tokens={tokens}
                onSelect={setSelected}
              />
            ))}
            {visibleObjects.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", fontSize: 12, color: tokens.textSecondary, padding: 8 }}>
                No objects match your search.
              </div>
            ) : null}
          </div>

          <aside
            style={{
              borderRadius: 12,
              border: `1px solid ${tokens.panelBorder}`,
              background: tokens.controlBackground,
              padding: 10,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
              Preview
            </div>
            {preview ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: tokens.panelBackground,
                      border: `1px solid ${tokens.controlBorder}`,
                      fontSize: 16,
                    }}
                  >
                    {preview.definition.icon ?? "◆"}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: tokens.textPrimary }}>
                      {preview.definition.label}
                    </div>
                    <div style={{ fontSize: 11, color: tokens.textSecondary }}>{preview.categoryLabel}</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: tokens.textSecondary }}>
                  {preview.definition.description ?? "Executive catalog object."}
                </p>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: tokens.textSecondary }}>
                Select an object to preview before inserting it into the scene.
              </p>
            )}
          </aside>
        </div>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={handleCancel} style={sceneHudControlButtonStyle(tokens)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={handleConfirm}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: selected ? 1 : 0.5,
              cursor: selected ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
              color: tokens.textPrimary,
              background: tokens.chipBackground,
            }}
          >
            Insert Object
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ExecutiveObjectCatalog;
