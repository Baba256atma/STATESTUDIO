/**
 * APP-3:5 — Executive Intent semantic canonical examples.
 * Reference normalization scenarios — deterministic only.
 */

export type IntentSemanticCanonicalExample = Readonly<{
  exampleId: string;
  label: string;
  extractionExampleId: string | null;
  customText: string | null;
  languageCode: string;
  expectedBusinessDimension: string;
  expectedActionType: string;
  expectedMultipleGoals: boolean;
  readOnly: true;
}>;

export const INTENT_SEMANTIC_CANONICAL_EXAMPLES: readonly IntentSemanticCanonicalExample[] =
  Object.freeze([
    Object.freeze({
      exampleId: "increase-profit",
      label: "Increase profit",
      extractionExampleId: "financial-goal",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "financial",
      expectedActionType: "increase",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "reduce-costs",
      label: "Reduce costs",
      extractionExampleId: "cost-reduction",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "financial",
      expectedActionType: "reduce",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "improve-customer-satisfaction",
      label: "Improve customer satisfaction",
      extractionExampleId: null,
      customText: "Improve customer satisfaction by 10% this year.",
      languageCode: "en",
      expectedBusinessDimension: "customer",
      expectedActionType: "optimize",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "reduce-operational-risk",
      label: "Reduce operational risk",
      extractionExampleId: "risk-reduction",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "risk",
      expectedActionType: "protect",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "hire-engineers",
      label: "Hire engineers",
      extractionExampleId: "hiring",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "people",
      expectedActionType: "create",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "expand-new-market",
      label: "Expand into new market",
      extractionExampleId: "growth-goal",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "strategy",
      expectedActionType: "expand",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "improve-cash-flow",
      label: "Improve cash flow",
      extractionExampleId: null,
      customText: "Improve cash flow by 12% next year.",
      languageCode: "en",
      expectedBusinessDimension: "financial",
      expectedActionType: "optimize",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "modernize-technology",
      label: "Modernize technology",
      extractionExampleId: "technology-modernization",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "technology",
      expectedActionType: "transform",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "multiple-goals",
      label: "Multiple goals",
      extractionExampleId: "multiple-intents",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "financial",
      expectedActionType: "increase",
      expectedMultipleGoals: true,
      readOnly: true as const,
    }),
    Object.freeze({
      exampleId: "incomplete-objective",
      label: "Incomplete objective",
      extractionExampleId: "incomplete-request",
      customText: null,
      languageCode: "en",
      expectedBusinessDimension: "custom",
      expectedActionType: "custom",
      expectedMultipleGoals: false,
      readOnly: true as const,
    }),
  ]);

export function getIntentSemanticCanonicalExample(
  exampleId: string
): IntentSemanticCanonicalExample | null {
  return INTENT_SEMANTIC_CANONICAL_EXAMPLES.find((entry) => entry.exampleId === exampleId) ?? null;
}

export const ExecutiveIntentSemanticExamples = Object.freeze({
  canonical: INTENT_SEMANTIC_CANONICAL_EXAMPLES,
  getIntentSemanticCanonicalExample,
});
