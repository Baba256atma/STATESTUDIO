"use client";

import React from "react";

import { logTemplateSelected } from "../../lib/systemModeling/systemModelInstrumentation";
import {
  buildTemplatePreview,
  readSystemBlueprint,
} from "../../lib/systemModeling/systemModelRuntime";
import type { DomainTemplate, DomainTemplateCategoryId } from "../../lib/systemModeling/systemModelTypes";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import {
  resolveSceneThemeTokens,
  sceneHudControlButtonStyle,
  sceneHudShellStyle,
} from "../../lib/theme/sceneThemeTokens";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import { SystemBlueprintPanel } from "./SystemBlueprintPanel";
import { TemplatePicker } from "./TemplatePicker";
import { TemplatePreview } from "./TemplatePreview";

export type ExecutiveModelingWorkspaceProps = {
  open: boolean;
  sceneJson: unknown;
  themeMode?: NexoraHudThemeMode;
  onCancel: () => void;
  onGenerate: (templateId: string) => void;
};

export function ExecutiveModelingWorkspace(
  props: ExecutiveModelingWorkspaceProps
): React.ReactElement | null {
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const [activeCategory, setActiveCategory] = React.useState<DomainTemplateCategoryId | "all">("all");
  const [selected, setSelected] = React.useState<DomainTemplate | null>(null);

  React.useEffect(() => {
    if (!props.open) {
      setActiveCategory("all");
      setSelected(null);
    }
  }, [props.open]);

  const preview = selected ? buildTemplatePreview(selected.id) : null;
  const activeBlueprint = readSystemBlueprint(props.sceneJson);
  const pendingBlueprint = preview
    ? {
        templateId: preview.template.id,
        templateName: preview.template.name,
        generatedAt: new Date().toISOString(),
        version: preview.template.version,
        source: "template" as const,
        objectCount: preview.objectCount,
        relationshipCount: preview.relationshipCount,
      }
    : null;

  const handleSelectTemplate = React.useCallback((template: DomainTemplate) => {
    setSelected(template);
    logTemplateSelected({ templateId: template.id, templateName: template.name });
  }, []);

  const handleGenerate = React.useCallback(() => {
    if (!selected) return;
    props.onGenerate(selected.id);
  }, [props.onGenerate, selected]);

  if (!props.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Executive Modeling Workspace"
      data-nx="executive-modeling-workspace"
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
          width: "min(860px, 96vw)",
          maxHeight: "min(84vh, 760px)",
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
              Executive Modeling
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: hudTheme.textPrimary, marginTop: 2 }}>
              Create System
            </div>
          </div>
          <button
            type="button"
            aria-label="Close modeling workspace"
            onClick={props.onCancel}
            style={{ ...sceneHudControlButtonStyle(tokens), width: 30, height: 30, padding: 0 }}
          >
            ×
          </button>
        </header>

        <div
          style={{
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(240px, 0.9fr)",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <TemplatePicker
            selectedTemplateId={selected?.id ?? null}
            activeCategory={activeCategory}
            tokens={tokens}
            onCategoryChange={setActiveCategory}
            onSelectTemplate={handleSelectTemplate}
          />

          <div style={{ display: "grid", gap: 10, minHeight: 0, overflowY: "auto" }}>
            <TemplatePreview preview={preview} tokens={tokens} />
            <SystemBlueprintPanel
              blueprint={pendingBlueprint}
              category={preview?.categoryLabel ?? null}
              tokens={tokens}
              mode="preview"
            />
            {activeBlueprint ? (
              <SystemBlueprintPanel blueprint={activeBlueprint} tokens={tokens} mode="active" />
            ) : null}
          </div>
        </div>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={sceneHudControlButtonStyle(tokens)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={handleGenerate}
            style={{
              ...sceneHudControlButtonStyle(tokens),
              opacity: selected ? 1 : 0.5,
              cursor: selected ? "pointer" : "not-allowed",
              borderColor: tokens.accent,
              background: tokens.chipBackground,
            }}
          >
            Generate System
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ExecutiveModelingWorkspace;
