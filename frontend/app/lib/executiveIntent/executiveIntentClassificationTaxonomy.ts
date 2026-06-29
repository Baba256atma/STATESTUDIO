/**
 * APP-3:6 — Executive Intent canonical taxonomy.
 * Business, strategic, operational, and reserved executive intent classes.
 */

export const EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION = "APP-3/6-TAXONOMY-1" as const;

export type IntentTaxonomyClassKey =
  | "strategic"
  | "financial"
  | "operational"
  | "growth"
  | "transformation"
  | "technology"
  | "risk"
  | "compliance"
  | "customer"
  | "people"
  | "innovation"
  | "resource"
  | "supply_chain"
  | "marketing"
  | "sales"
  | "governance"
  | "sustainability"
  | "custom";

export type IntentTaxonomyGroup =
  | "business"
  | "strategic"
  | "operational"
  | "transformation"
  | "risk"
  | "resource"
  | "compliance"
  | "innovation"
  | "reserved";

export type IntentTaxonomyClassDefinition = Readonly<{
  classId: IntentTaxonomyClassKey;
  label: string;
  group: IntentTaxonomyGroup;
  description: string;
  readOnly: true;
}>;

export const INTENT_TAXONOMY_CLASS_KEYS = Object.freeze([
  "strategic",
  "financial",
  "operational",
  "growth",
  "transformation",
  "technology",
  "risk",
  "compliance",
  "customer",
  "people",
  "innovation",
  "resource",
  "supply_chain",
  "marketing",
  "sales",
  "governance",
  "sustainability",
  "custom",
] as const satisfies readonly IntentTaxonomyClassKey[]);

/** Deterministic ordering for multi-label classification output. */
export const INTENT_TAXONOMY_CLASS_ORDER = Object.freeze([
  "compliance",
  "risk",
  "governance",
  "financial",
  "operational",
  "growth",
  "transformation",
  "technology",
  "innovation",
  "customer",
  "people",
  "resource",
  "sales",
  "marketing",
  "supply_chain",
  "strategic",
  "sustainability",
  "custom",
] as const satisfies readonly IntentTaxonomyClassKey[]);

export const INTENT_TAXONOMY_CLASS_DEFINITIONS: readonly IntentTaxonomyClassDefinition[] =
  Object.freeze([
    Object.freeze({
      classId: "strategic",
      label: "Strategic",
      group: "strategic",
      description: "Long-horizon strategic direction and enterprise positioning.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "financial",
      label: "Financial",
      group: "business",
      description: "Profit, revenue, cost, and cash objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "operational",
      label: "Operational",
      group: "operational",
      description: "Process efficiency and operational performance.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "growth",
      label: "Growth",
      group: "strategic",
      description: "Market expansion and revenue growth initiatives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "transformation",
      label: "Transformation",
      group: "transformation",
      description: "Digital and organizational transformation programs.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "technology",
      label: "Technology",
      group: "transformation",
      description: "Technology modernization and platform initiatives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "risk",
      label: "Risk",
      group: "risk",
      description: "Risk reduction and operational resilience.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "compliance",
      label: "Compliance",
      group: "compliance",
      description: "Regulatory and policy compliance initiatives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "customer",
      label: "Customer",
      group: "business",
      description: "Customer experience and satisfaction objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "people",
      label: "People",
      group: "resource",
      description: "Workforce and talent objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "innovation",
      label: "Innovation",
      group: "innovation",
      description: "Product and service innovation programs.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "resource",
      label: "Resource",
      group: "resource",
      description: "Hiring, capacity, and resource allocation.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "supply_chain",
      label: "Supply Chain",
      group: "operational",
      description: "Supply chain and logistics objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "marketing",
      label: "Marketing",
      group: "business",
      description: "Brand, demand generation, and marketing objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "sales",
      label: "Sales",
      group: "business",
      description: "Sales performance and pipeline objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "governance",
      label: "Governance",
      group: "compliance",
      description: "Corporate governance and oversight initiatives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "sustainability",
      label: "Sustainability",
      group: "reserved",
      description: "ESG and sustainability objectives.",
      readOnly: true as const,
    }),
    Object.freeze({
      classId: "custom",
      label: "Custom",
      group: "reserved",
      description: "Unmapped or custom executive intent class.",
      readOnly: true as const,
    }),
  ]);

export function getIntentTaxonomyClassDefinition(
  classId: IntentTaxonomyClassKey
): IntentTaxonomyClassDefinition {
  const definition = INTENT_TAXONOMY_CLASS_DEFINITIONS.find((entry) => entry.classId === classId);
  if (!definition) {
    return Object.freeze({
      classId: "custom",
      label: "Custom",
      group: "reserved",
      description: "Unknown taxonomy class.",
      readOnly: true as const,
    });
  }
  return definition;
}

export function sortIntentClasses(classes: readonly IntentTaxonomyClassKey[]): IntentTaxonomyClassKey[] {
  const unique = [...new Set(classes)];
  return unique.sort(
    (left, right) =>
      INTENT_TAXONOMY_CLASS_ORDER.indexOf(left) - INTENT_TAXONOMY_CLASS_ORDER.indexOf(right)
  );
}

export function isIntentTaxonomyClassKey(value: string): value is IntentTaxonomyClassKey {
  return (INTENT_TAXONOMY_CLASS_KEYS as readonly string[]).includes(value);
}
