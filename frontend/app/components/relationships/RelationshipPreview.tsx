"use client";

import React from "react";

import type { RelationshipPreviewModel } from "../../lib/relationships/relationshipTypes";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";

export type RelationshipPreviewProps = {
  preview: RelationshipPreviewModel | null;
  tokens: SceneThemeTokens;
};

export function RelationshipPreview(props: RelationshipPreviewProps): React.ReactElement {
  const { preview, tokens } = props;

  return (
    <aside
      style={{
        borderRadius: 12,
        border: `1px solid ${tokens.panelBorder}`,
        background: tokens.controlBackground,
        padding: 12,
        minHeight: 140,
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
        Preview
      </div>
      {preview ? (
        <>
          <div style={{ display: "grid", gap: 6 }}>
            <PreviewRow label="Source" value={preview.sourceLabel} tokens={tokens} />
            <PreviewRow label="Target" value={preview.targetLabel} tokens={tokens} />
            <PreviewRow label="Type" value={preview.typeLabel} tokens={tokens} />
            <PreviewRow label="Direction" value={preview.directionLabel} tokens={tokens} />
          </div>
          <div
            style={{
              marginTop: 4,
              padding: "8px 10px",
              borderRadius: 10,
              border: `1px solid ${tokens.controlBorder}`,
              background: tokens.panelBackground,
              color: tokens.textPrimary,
              fontSize: 12,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {preview.sourceLabel}{" "}
            {preview.direction === "bi" ? "↔" : "→"} {preview.targetLabel}
          </div>
        </>
      ) : (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: tokens.textSecondary }}>
          Select a target object and relationship type to preview the connection.
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
    <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: props.tokens.textSecondary }}>{props.label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: props.tokens.textPrimary }}>{props.value}</span>
    </div>
  );
}

export default RelationshipPreview;
