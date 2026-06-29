/**
 * APP-3:4 — Executive Intent extraction canonical examples.
 * Reference inputs for certification — deterministic extraction only.
 */

export type IntentExtractionCanonicalExample = Readonly<{
  exampleId: string;
  label: string;
  text: string;
  languageCode: string;
  expectedCategory: string | null;
  expectedActionVerb: string | null;
  expectedMultiple: boolean;
  readOnly: true;
}>;

export const INTENT_EXTRACTION_CANONICAL_EXAMPLES: readonly IntentExtractionCanonicalExample[] =
  Object.freeze([
    Object.freeze({
      exampleId: "financial-goal",
      label: "Financial goal",
      text: "Increase company profit by 20% next year.",
      languageCode: "en",
      expectedCategory: "financial",
      expectedActionVerb: "increase",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "growth-goal",
      label: "Growth goal",
      text: "Expand market share by 15% this year.",
      languageCode: "en",
      expectedCategory: "growth",
      expectedActionVerb: "expand",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "risk-reduction",
      label: "Risk reduction",
      text: "Mitigate supply chain risk exposure without increasing cost.",
      languageCode: "en",
      expectedCategory: "risk_reduction",
      expectedActionVerb: "mitigate",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "operational-improvement",
      label: "Operational improvement",
      text: "Improve operational efficiency by 10% in the department.",
      languageCode: "en",
      expectedCategory: "operational",
      expectedActionVerb: "improve",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "hiring",
      label: "Hiring",
      text: "Hire 50 engineers for the project by Q3.",
      languageCode: "en",
      expectedCategory: "people",
      expectedActionVerb: "hire",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "cost-reduction",
      label: "Cost reduction",
      text: "Reduce operating cost by 8% next year.",
      languageCode: "en",
      expectedCategory: "financial",
      expectedActionVerb: "reduce",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "compliance",
      label: "Compliance",
      text: "Ensure compliance with GDPR regulation by 2026.",
      languageCode: "en",
      expectedCategory: "compliance",
      expectedActionVerb: "ensure",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "technology-modernization",
      label: "Technology modernization",
      text: "Modernize cloud platform technology across the enterprise.",
      languageCode: "en",
      expectedCategory: "technology",
      expectedActionVerb: "modernize",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "multiple-intents",
      label: "Multiple intents",
      text: "Increase profit by 10%. Reduce cost by 5%.",
      languageCode: "en",
      expectedCategory: "financial",
      expectedActionVerb: "increase",
      expectedMultiple: true,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "incomplete-request",
      label: "Incomplete request",
      text: "Increase by 20%",
      languageCode: "en",
      expectedCategory: null,
      expectedActionVerb: null,
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "spanish-financial",
      label: "Spanish financial goal",
      text: "Aumentar beneficios de la empresa en 20% el proximo ano.",
      languageCode: "es",
      expectedCategory: "financial",
      expectedActionVerb: "aumentar",
      expectedMultiple: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "explicit-priority",
      label: "Explicit priority",
      text: "High priority: reduce cost by 5% next year.",
      languageCode: "en",
      expectedCategory: "financial",
      expectedActionVerb: "reduce",
      expectedMultiple: false,
      readOnly: true as const,
    }),
  ]);

export function getIntentExtractionCanonicalExample(
  exampleId: string
): IntentExtractionCanonicalExample | null {
  return INTENT_EXTRACTION_CANONICAL_EXAMPLES.find((entry) => entry.exampleId === exampleId) ?? null;
}

export const ExecutiveIntentExtractionExamples = Object.freeze({
  canonical: INTENT_EXTRACTION_CANONICAL_EXAMPLES,
  getIntentExtractionCanonicalExample,
});
