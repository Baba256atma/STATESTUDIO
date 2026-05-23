"use client";

import React from "react";

import type { SystemBlueprintMetadata } from "../../lib/systemModeling/systemModelTypes";
import { resolveCategoryLabel } from "../../lib/systemModeling/templateLoader";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";

export type SystemBlueprintPanelProps = {
  blueprint: SystemBlueprintMetadata | null;
  category?: string | null;
  tokens: SceneThemeTokens;
  mode?: "preview" | "active";
};

export function SystemBlueprintPanel(props: SystemBlueprintPanelProps): React.ReactElement {
  const { blueprint, tokens, mode = "preview" } = props;
  const categoryLabel =
    props.category ??
    (blueprint?.templateId ? resolveCategoryLabelFromTemplate(blueprint.templateId) : "—");

  return (
    <section
      data-nx="system-blueprint-panel"
      style={{
        borderRadius: 12,
        border: `1px solid ${tokens.panelBorder}`,
        background: tokens.panelBackground,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: tokens.label,
        }}
      >
        {mode === "active" ? "Active Blueprint" : "System Blueprint"}
      </div>
      {blueprint ? (
        <div style={{ display: "grid", gap: 6 }}>
          <Row label="Template" value={blueprint.templateName} tokens={tokens} />
          <Row label="Domain" value={categoryLabel} tokens={tokens} />
          <Row label="Objects" value={String(blueprint.objectCount)} tokens={tokens} />
          <Row label="Relationships" value={String(blueprint.relationshipCount)} tokens={tokens} />
          <Row
            label="Created"
            value={new Date(blueprint.generatedAt).toLocaleString()}
            tokens={tokens}
          />
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 11, color: tokens.textSecondary, lineHeight: 1.45 }}>
          Blueprint metadata will appear here after system generation.
        </p>
      )}
    </section>
  );
}

function Row(props: { label: string; value: string; tokens: SceneThemeTokens }): React.ReactElement {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: props.tokens.textSecondary }}>{props.label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: props.tokens.textPrimary }}>{props.value}</span>
    </div>
  );
}

function resolveCategoryLabelFromTemplate(templateId: string): string {
  if (templateId.includes("supply")) return resolveCategoryLabel("supply_chain");
  if (templateId.includes("pmo")) return resolveCategoryLabel("pmo");
  if (templateId.includes("finance")) return resolveCategoryLabel("finance");
  if (templateId.includes("operations")) return resolveCategoryLabel("operations");
  return "Executive";
}

export default SystemBlueprintPanel;
