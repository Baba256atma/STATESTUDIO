/**
 * D:1 — Decision Explanation Builder contract.
 *
 * Template-driven, read-only contracts for explaining executive recommendations.
 * Produces canonical DecisionExplanation outputs without mutating source systems.
 */

import type { DecisionExplanation } from "./DecisionRecommendationContract.ts";
import type { ExecutiveRecommendation } from "./recommendationEngineContract.ts";
import type { TradeoffProfile } from "./tradeoffAnalysisEngineContract.ts";

export const DECISION_EXPLANATION_DIAGNOSTIC = "[DECISION_EXPLANATION]" as const;

export const DECISION_EXPLANATION_READY_DIAGNOSTIC = "[DECISION_EXPLANATION_READY]" as const;

export const D1_EXPLANATION_COMPLETE_TAG = "[D1_EXPLANATION_COMPLETE]" as const;

export const DECISION_EXPLANATION_BUILDER_VERSION = "1.0.0" as const;

export const DECISION_EXPLANATION_TEMPLATES = Object.freeze({
  whyRankedFirst:
    "{{optionLabel}} ranks first with composite score {{compositeScore}}, decision score {{decisionScore}}, and confidence {{confidence}}.",
  whyAlternativeLower:
    "{{optionLabel}} ranks {{rank}} with composite score {{compositeScore}}, trailing the recommended option by {{delta}} points.",
  majorTradeoff:
    "{{dimensionLabel}} favors {{favoredOptionId}}: {{summary}}",
  majorRisk:
    "{{optionLabel}} carries residual {{dimensionLabel}} exposure at {{value}}.",
  expectedBenefit:
    "{{optionLabel}} offers {{dimensionLabel}} potential at {{value}}.",
  rationaleSummary:
    "Recommended option {{optionLabel}} leads the ranking based on score, tradeoff alignment, and executive priority fit.",
} as const);

export type DecisionExplanationBuilderInput = Readonly<{
  explanationId: string;
  generatedAt: string;
  recommendation: ExecutiveRecommendation;
  tradeoffProfile: TradeoffProfile;
}>;

export type DecisionExplanationResult = Readonly<{
  version: typeof DECISION_EXPLANATION_BUILDER_VERSION;
  generatedAt: string;
  recommendationId: string;
  explanation: DecisionExplanation;
  whyRankedFirst: string;
  whyAlternativesLower: readonly string[];
  majorTradeoffs: readonly string[];
  majorRisks: readonly string[];
  expectedBenefits: readonly string[];
  templateDriven: true;
  readOnly: true;
  mutation: false;
  sourceMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  dsMutation: false;
  simulationMutation: false;
  diagnostics: readonly [
    typeof DECISION_EXPLANATION_DIAGNOSTIC,
    typeof DECISION_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export const DECISION_EXPLANATION_BUILDER_DIAGNOSTICS = Object.freeze([
  DECISION_EXPLANATION_DIAGNOSTIC,
  DECISION_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_DECISION_EXPLANATION_RESULT: DecisionExplanationResult = Object.freeze({
  version: DECISION_EXPLANATION_BUILDER_VERSION,
  generatedAt: "",
  recommendationId: "",
  explanation: Object.freeze({
    explanationId: "",
    optionId: "",
    rationale: "",
    evidenceIds: Object.freeze([]),
    readOnly: true,
    mutation: false,
  }),
  whyRankedFirst: "",
  whyAlternativesLower: Object.freeze([]),
  majorTradeoffs: Object.freeze([]),
  majorRisks: Object.freeze([]),
  expectedBenefits: Object.freeze([]),
  templateDriven: true,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: DECISION_EXPLANATION_BUILDER_DIAGNOSTICS,
});
