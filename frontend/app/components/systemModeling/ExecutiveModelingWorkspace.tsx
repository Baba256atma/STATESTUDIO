"use client";

import React from "react";

import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  buildDomainTemplatePreview,
  listDomainTemplatesByCategory,
  saveSceneAsDomainTemplate,
  type DomainTemplate,
} from "../../lib/templates/domainTemplateRuntime";
import {
  resolveSceneThemeTokens,
  sceneHudControlButtonStyle,
  sceneHudShellStyle,
} from "../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";

export type ExecutiveModelingWorkspaceProps = {
  open: boolean;
  sceneJson: unknown;
  themeMode?: NexoraHudThemeMode;
  onCancel: () => void;
  onLoadTemplate: (templateId: string, mode: "load" | "import") => void;
  onTemplateSaved?: (templateName: string) => void;
};

const TEMPLATE_CATEGORIES: readonly { id: DomainTemplate["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "supply_chain", label: "Supply Chain" },
  { id: "pmo", label: "PMO" },
  { id: "finance", label: "Finance" },
  { id: "operations", label: "Operations" },
  { id: "risk", label: "Risk" },
  { id: "custom", label: "Custom" },
];

function categoryLabel(category: DomainTemplate["category"]): string {
  return TEMPLATE_CATEGORIES.find((entry) => entry.id === category)?.label ?? category;
}

export function ExecutiveModelingWorkspace(
  props: ExecutiveModelingWorkspaceProps
): React.ReactElement | null {
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const [activeCategory, setActiveCategory] = React.useState<DomainTemplate["category"] | "all">("all");
  const [selected, setSelected] = React.useState<DomainTemplate | null>(null);
  const [templateEpoch, setTemplateEpoch] = React.useState(0);
  const [customName, setCustomName] = React.useState("");
  const [customDescription, setCustomDescription] = React.useState("");

  React.useEffect(() => {
    if (!props.open) {
      setActiveCategory("all");
      setSelected(null);
      setCustomName("");
      setCustomDescription("");
    }
  }, [props.open]);

  const templates = React.useMemo(
    () => listDomainTemplatesByCategory(activeCategory),
    [activeCategory, templateEpoch]
  );
  const preview = selected ? buildDomainTemplatePreview(selected.id) : null;

  const handleLoad = React.useCallback(() => {
    if (!selected) return;
    props.onLoadTemplate(selected.id, "load");
  }, [props, selected]);

  const handleImport = React.useCallback(() => {
    if (!selected) return;
    props.onLoadTemplate(selected.id, "import");
  }, [props, selected]);

  const handleSaveCustomTemplate = React.useCallback(() => {
    const name = customName.trim();
    if (!name) return;
    const result = saveSceneAsDomainTemplate({
      sceneJson: props.sceneJson,
      name,
      description: customDescription,
    });
    if (!result.success || !result.template) return;
    setTemplateEpoch((epoch) => epoch + 1);
    setActiveCategory("custom");
    setSelected(result.template);
    setCustomName("");
    setCustomDescription("");
    props.onTemplateSaved?.(result.template.name);
  }, [customDescription, customName, props]);

  if (!props.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Executive Domain Template Library"
      data-nx="executive-domain-template-library"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 440,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "color-mix(in srgb, var(--nx-bg-app) 35%, rgba(0,0,0,0.45))",
        backdropFilter: "blur(8px)",
      }}
      onPointerDown={props.onCancel}
    >
      <div
        style={{
          ...sceneHudShellStyle(tokens),
          width: "min(900px, 96vw)",
          maxHeight: "min(86vh, 780px)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 12,
          padding: 14,
          overflow: "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
              Template Library
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: hudTheme.textPrimary, marginTop: 2 }}>
              Load Executive System
            </div>
          </div>
          <button
            type="button"
            aria-label="Close template library"
            onClick={props.onCancel}
            style={{ ...sceneHudControlButtonStyle(tokens), width: 30, height: 30, padding: 0 }}
          >
            x
          </button>
        </header>

        <div
          style={{
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(260px, 0.9fr)",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <section style={{ minHeight: 0, display: "grid", gridTemplateRows: "auto 1fr", gap: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TEMPLATE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    ...sceneHudControlButtonStyle(tokens),
                    minHeight: 28,
                    padding: "5px 9px",
                    borderColor: activeCategory === category.id ? tokens.accent : tokens.controlBorder,
                    background: activeCategory === category.id ? tokens.chipBackground : tokens.controlBackground,
                    fontSize: 10,
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div style={{ minHeight: 0, overflowY: "auto", display: "grid", gap: 8, alignContent: "start" }}>
              {templates.map((template) => {
                const isSelected = selected?.id === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelected(template)}
                    style={{
                      textAlign: "left",
                      borderRadius: 10,
                      border: `1px solid ${isSelected ? tokens.accent : tokens.controlBorder}`,
                      background: isSelected ? tokens.chipBackground : tokens.controlBackground,
                      color: tokens.textPrimary,
                      padding: 11,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong style={{ fontSize: 12 }}>{template.name}</strong>
                      <span style={{ fontSize: 9, color: tokens.textSecondary }}>v{template.version}</span>
                    </div>
                    <div style={{ marginTop: 4, fontSize: 10, color: tokens.textSecondary, lineHeight: 1.4 }}>
                      {template.description}
                    </div>
                    <div style={{ marginTop: 7, fontSize: 9, color: tokens.textSecondary }}>
                      {categoryLabel(template.category)} - {template.objects.length} objects - {template.relationships.length} links - {template.propagationPaths.length} impacts
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <div style={{ display: "grid", gap: 10, minHeight: 0, overflowY: "auto" }}>
            <section
              style={{
                border: `1px solid ${tokens.controlBorder}`,
                borderRadius: 12,
                background: tokens.panelBackground,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
                Template Preview
              </div>
              {preview ? (
                <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: tokens.textPrimary }}>{preview.template.name}</div>
                  <div style={{ fontSize: 11, color: tokens.textSecondary, lineHeight: 1.45 }}>
                    {preview.template.description}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, fontSize: 10, color: tokens.textSecondary }}>
                    <span>Domain <strong style={{ color: tokens.textPrimary }}>{categoryLabel(preview.template.category)}</strong></span>
                    <span>Version <strong style={{ color: tokens.textPrimary }}>{preview.template.version}</strong></span>
                    <span>Objects <strong style={{ color: tokens.textPrimary }}>{preview.objectCount}</strong></span>
                    <span>Relationships <strong style={{ color: tokens.textPrimary }}>{preview.relationshipCount}</strong></span>
                    <span>Impact Paths <strong style={{ color: tokens.textPrimary }}>{preview.propagationPathCount}</strong></span>
                  </div>
                  <div
                    aria-label="Preview diagram"
                    style={{
                      minHeight: 84,
                      borderRadius: 10,
                      border: `1px solid ${tokens.controlBorder}`,
                      background: tokens.controlBackground,
                      padding: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {preview.template.objects.slice(0, 7).map((entry, index) => (
                      <React.Fragment key={entry.id}>
                        <span
                          style={{
                            borderRadius: 999,
                            border: `1px solid ${tokens.controlBorder}`,
                            background: tokens.chipBackground,
                            color: tokens.textPrimary,
                            padding: "5px 8px",
                            fontSize: 9,
                            fontWeight: 800,
                          }}
                        >
                          {String(entry.label ?? entry.name ?? entry.id)}
                        </span>
                        {index < Math.min(preview.template.objects.length, 7) - 1 ? (
                          <span aria-hidden style={{ color: tokens.textSecondary, fontSize: 11 }}>
                            -&gt;
                          </span>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 8, fontSize: 11, color: tokens.textSecondary }}>
                  Select a domain template to preview its system model.
                </div>
              )}
            </section>

            <section
              style={{
                border: `1px solid ${tokens.controlBorder}`,
                borderRadius: 12,
                background: tokens.panelBackground,
                padding: 12,
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: hudTheme.label }}>
                Save As Template
              </div>
              <input
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder="Custom operating model"
                style={{
                  borderRadius: 9,
                  border: `1px solid ${tokens.controlBorder}`,
                  background: tokens.controlBackground,
                  color: tokens.textPrimary,
                  padding: "8px 9px",
                  fontSize: 11,
                }}
              />
              <textarea
                value={customDescription}
                onChange={(event) => setCustomDescription(event.target.value)}
                placeholder="Reusable executive template description"
                rows={3}
                style={{
                  borderRadius: 9,
                  border: `1px solid ${tokens.controlBorder}`,
                  background: tokens.controlBackground,
                  color: tokens.textPrimary,
                  padding: "8px 9px",
                  fontSize: 11,
                  resize: "vertical",
                }}
              />
              <button
                type="button"
                disabled={!customName.trim()}
                onClick={handleSaveCustomTemplate}
                style={{
                  ...sceneHudControlButtonStyle(tokens),
                  opacity: customName.trim() ? 1 : 0.5,
                  cursor: customName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Save Current Workspace
              </button>
            </section>
          </div>
        </div>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={sceneHudControlButtonStyle(tokens)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={handleImport}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: selected ? 1 : 0.5,
              cursor: selected ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
            }}
          >
            Import Into Workspace
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={handleLoad}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: selected ? 1 : 0.5,
              cursor: selected ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
              background: tokens.chipBackground,
            }}
          >
            Load Template
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ExecutiveModelingWorkspace;
