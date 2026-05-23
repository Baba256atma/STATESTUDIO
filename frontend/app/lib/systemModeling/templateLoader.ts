import { getAllDomainTemplates, getDomainTemplate, getDomainTemplatesByCategory } from "./templateRegistry";
import type { DomainTemplate, DomainTemplateCategoryId, DomainTemplatePreview } from "./systemModelTypes";
import { DOMAIN_TEMPLATE_CATEGORIES } from "./systemModelTypes";

export function loadDomainTemplate(templateId: string): DomainTemplate | undefined {
  return getDomainTemplate(templateId);
}

export function loadAllDomainTemplates(): DomainTemplate[] {
  return getAllDomainTemplates();
}

export function loadDomainTemplatesByCategory(category: DomainTemplateCategoryId): DomainTemplate[] {
  return getDomainTemplatesByCategory(category);
}

export function resolveDomainTemplatePreview(template: DomainTemplate): DomainTemplatePreview {
  const categoryLabel =
    DOMAIN_TEMPLATE_CATEGORIES.find((entry) => entry.id === template.category)?.label ??
    template.category;

  return {
    template,
    objectCount: template.objects.length,
    relationshipCount: template.relationships.length,
    categoryLabel,
  };
}

export function resolveCategoryLabel(category: DomainTemplateCategoryId): string {
  return DOMAIN_TEMPLATE_CATEGORIES.find((entry) => entry.id === category)?.label ?? category;
}

export {
  getAllDomainTemplates,
  getDomainTemplate,
  getDomainTemplatesByCategory,
  DOMAIN_TEMPLATE_CATEGORIES,
};

export type { DomainTemplate, DomainTemplateCategoryId, DomainTemplatePreview } from "./systemModelTypes";
