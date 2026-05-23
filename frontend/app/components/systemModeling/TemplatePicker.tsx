"use client";

import React from "react";

import {
  DOMAIN_TEMPLATE_CATEGORIES,
  type DomainTemplate,
  type DomainTemplateCategoryId,
} from "../../lib/systemModeling/systemModelTypes";
import { loadDomainTemplatesByCategory } from "../../lib/systemModeling/templateLoader";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { sceneHudChipStyle } from "../../lib/theme/sceneThemeTokens";
import { TemplateCard } from "./TemplateCard";

export type TemplatePickerProps = {
  selectedTemplateId: string | null;
  activeCategory: DomainTemplateCategoryId | "all";
  tokens: SceneThemeTokens;
  onCategoryChange: (category: DomainTemplateCategoryId | "all") => void;
  onSelectTemplate: (template: DomainTemplate) => void;
};

export function TemplatePicker(props: TemplatePickerProps): React.ReactElement {
  const templates = React.useMemo(() => {
    if (props.activeCategory === "all") {
      return DOMAIN_TEMPLATE_CATEGORIES.flatMap((category) =>
        loadDomainTemplatesByCategory(category.id)
      );
    }
    return loadDomainTemplatesByCategory(props.activeCategory);
  }, [props.activeCategory]);

  return (
    <div style={{ display: "grid", gap: 10, minHeight: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button
          type="button"
          aria-pressed={props.activeCategory === "all"}
          onClick={() => props.onCategoryChange("all")}
          style={{
            ...sceneHudChipStyle(props.tokens, props.activeCategory === "all"),
            padding: "5px 10px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          All
        </button>
        {DOMAIN_TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={props.activeCategory === category.id}
            onClick={() => props.onCategoryChange(category.id)}
            style={{
              ...sceneHudChipStyle(props.tokens, props.activeCategory === category.id),
              padding: "5px 10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div
        style={{
          minHeight: 0,
          overflowY: "auto",
          display: "grid",
          gap: 8,
          paddingRight: 2,
        }}
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={props.selectedTemplateId === template.id}
            tokens={props.tokens}
            onSelect={props.onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
}

export default TemplatePicker;
