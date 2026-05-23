import type { DomainTemplate, TemplateValidationResult } from "./systemModelTypes";

export function validateDomainTemplate(template: DomainTemplate | null | undefined): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!template) {
    return { valid: false, errors: ["missing_template"], warnings };
  }

  if (!template.id?.trim()) errors.push("missing_template_id");
  if (!template.name?.trim()) errors.push("missing_template_name");
  if (!template.category) errors.push("missing_template_category");
  if (!Array.isArray(template.objects) || template.objects.length === 0) {
    errors.push("missing_template_objects");
  }
  if (!Array.isArray(template.relationships)) warnings.push("no_template_relationships");

  const objectKeys = new Set<string>();
  template.objects?.forEach((object, index) => {
    const key = String(object?.key ?? "").trim();
    if (!key) {
      errors.push(`invalid_object_key:${index}`);
      return;
    }
    if (objectKeys.has(key)) errors.push(`duplicate_object_key:${key}`);
    objectKeys.add(key);
    if (!String(object?.label ?? "").trim()) warnings.push(`missing_object_label:${key}`);
  });

  template.relationships?.forEach((relationship, index) => {
    const sourceKey = String(relationship?.sourceKey ?? "").trim();
    const targetKey = String(relationship?.targetKey ?? "").trim();
    if (!sourceKey || !targetKey) {
      errors.push(`invalid_relationship_keys:${index}`);
      return;
    }
    if (!objectKeys.has(sourceKey)) errors.push(`missing_relationship_source:${sourceKey}`);
    if (!objectKeys.has(targetKey)) errors.push(`missing_relationship_target:${targetKey}`);
    if (sourceKey === targetKey) errors.push(`self_relationship:${sourceKey}`);
  });

  return { valid: errors.length === 0, errors, warnings };
}
