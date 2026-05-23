"use client";

import React from "react";

import type { DomainTemplate } from "../../lib/systemModeling/systemModelTypes";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { sceneHudChipStyle } from "../../lib/theme/sceneThemeTokens";

export type TemplateCardProps = {
  template: DomainTemplate;
  selected: boolean;
  tokens: SceneThemeTokens;
  onSelect: (template: DomainTemplate) => void;
};

export function TemplateCard(props: TemplateCardProps): React.ReactElement {
  const { template, selected, tokens, onSelect } = props;

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-nx-template-id={template.id}
      onClick={() => onSelect(template)}
      style={{
        ...sceneHudChipStyle(tokens, selected),
        width: "100%",
        minHeight: 72,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        padding: "10px 12px",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 800, color: tokens.textPrimary }}>{template.name}</span>
      <span style={{ fontSize: 10, color: tokens.textSecondary, lineHeight: 1.35 }}>{template.description}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: tokens.label, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {template.objects.length} objects · {template.relationships.length} links
      </span>
    </button>
  );
}

export default TemplateCard;
