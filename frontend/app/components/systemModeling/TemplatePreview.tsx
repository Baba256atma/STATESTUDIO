"use client";

import React from "react";

import type { DomainTemplatePreview } from "../../lib/systemModeling/systemModelTypes";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";

export type TemplatePreviewProps = {
  preview: DomainTemplatePreview | null;
  tokens: SceneThemeTokens;
};

export function TemplatePreview(props: TemplatePreviewProps): React.ReactElement {
  const { preview, tokens } = props;

  return (
    <aside
      style={{
        borderRadius: 12,
        border: `1px solid ${tokens.panelBorder}`,
        background: tokens.controlBackground,
        padding: 12,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
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
        Template Preview
      </div>
      {preview ? (
        <>
          <div style={{ fontSize: 14, fontWeight: 800, color: tokens.textPrimary }}>{preview.template.name}</div>
          <div style={{ display: "grid", gap: 6 }}>
            <PreviewRow label="Domain" value={preview.categoryLabel} tokens={tokens} />
            <PreviewRow label="Objects" value={String(preview.objectCount)} tokens={tokens} />
            <PreviewRow label="Relationships" value={String(preview.relationshipCount)} tokens={tokens} />
            <PreviewRow label="Purpose" value={preview.template.purpose} tokens={tokens} />
          </div>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: tokens.textSecondary }}>
            {preview.template.description}
          </p>
        </>
      ) : (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: tokens.textSecondary }}>
          Select a domain template to preview the initial system blueprint.
        </p>
      )}
    </aside>
  );
}

function PreviewRow(props: {
  label: string;
  value: string;
  tokens: SceneThemeTokens;
}): React.ReactElement {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 8, alignItems: "start" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: props.tokens.textSecondary }}>{props.label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: props.tokens.textPrimary }}>{props.value}</span>
    </div>
  );
}

export default TemplatePreview;
