/**
 * D:2:5 — Confidence Explanation Builder contract.
 *
 * Template-driven, read-only contracts for explaining recommendation confidence
 * levels, supporting evidence, weakening uncertainty, and data improvements
 * without mutating source systems.
 */

import type { DecisionConfidenceExplanation } from "./DecisionConfidenceContract.ts";
import type { DecisionExplanation } from "./DecisionRecommendationContract.ts";
import type { EvidenceStrengthScore } from "./evidenceStrengthEngineContract.ts";
import type {
  EvidenceStrengthProfile,
  RecommendationConfidenceScore,
} from "./recommendationConfidenceScoringEngineContract.ts";
import type { UncertaintyProfile } from "./uncertaintyDetectionEngineContract.ts";

export const CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTIC =
  "[CONFIDENCE_EXPLANATION_BUILDER]" as const;

export const CONFIDENCE_EXPLANATION_READY_DIAGNOSTIC =
  "[CONFIDENCE_EXPLANATION_READY]" as const;

export const D2_CONFIDENCE_EXPLANATION_COMPLETE_TAG =
  "[D2_CONFIDENCE_EXPLANATION_COMPLETE]" as const;

export const CONFIDENCE_EXPLANATION_BUILDER_VERSION = "1.0.0" as const;

export const CONFIDENCE_EXPLANATION_TEMPLATES = Object.freeze({
  whyHighConfidence:
    "Confidence is {{confidenceLabel}} at {{confidenceScore}} because {{driverSummary}}.",
  whyLimitedConfidence:
    "Confidence is {{confidenceLabel}} at {{confidenceScore}} because {{limitationSummary}}.",
  whyInsufficientEvidence:
    "Confidence is insufficient at {{confidenceScore}} because evidence coverage is below executive threshold ({{evidenceCount}} linked items).",
  supportingEvidence:
    "{{label}} supports confidence with a {{contribution}} point contribution.",
  supportingEvidenceDimension:
    "{{label}} evidence is strong at {{value}} and reinforces confidence.",
  weakeningUncertainty:
    "{{uncertaintyLabel}} weakens confidence: {{detail}} (severity {{severity}}).",
  dataImprovement:
    "Confidence would improve with additional {{dataCategory}} coverage.",
  rationaleSummary:
    "Recommendation {{recommendationId}} confidence reflects evidence strength, uncertainty exposure, and tradeoff clarity.",
  noMaterialLimitation: "No material confidence limitation was detected beyond routine executive review.",
} as const);

export type ConfidenceExplanationBuilderInput = Readonly<{
  explanationId: string;
  generatedAt: string;
  recommendationId: string;
  optionLabel: string;
  confidenceScore: RecommendationConfidenceScore;
  evidenceStrength: EvidenceStrengthProfile;
  evidenceStrengthScore?: EvidenceStrengthScore | null;
  uncertainty: UncertaintyProfile;
  decisionExplanation?: DecisionExplanation | null;
}>;

export type ConfidenceExplanationResult = Readonly<{
  version: typeof CONFIDENCE_EXPLANATION_BUILDER_VERSION;
  generatedAt: string;
  recommendationId: string;
  explanation: DecisionConfidenceExplanation;
  whyConfidenceHigh: string;
  whyConfidenceLimited: string;
  supportingEvidence: readonly string[];
  weakeningUncertainty: readonly string[];
  dataImprovements: readonly string[];
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
    typeof CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTIC,
    typeof CONFIDENCE_EXPLANATION_READY_DIAGNOSTIC,
  ];
}>;

export const CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTICS = Object.freeze([
  CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTIC,
  CONFIDENCE_EXPLANATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_CONFIDENCE_EXPLANATION_RESULT: ConfidenceExplanationResult = Object.freeze({
  version: CONFIDENCE_EXPLANATION_BUILDER_VERSION,
  generatedAt: "",
  recommendationId: "",
  explanation: Object.freeze({
    explanationId: "",
    confidenceLevel: "insufficient_evidence",
    summary: "",
    evidenceSummary: "",
    uncertaintySummary: "",
    evidenceIds: Object.freeze([]),
    uncertaintyFactorIds: Object.freeze([]),
    readOnly: true,
    mutation: false,
  }),
  whyConfidenceHigh: "",
  whyConfidenceLimited: "",
  supportingEvidence: Object.freeze([]),
  weakeningUncertainty: Object.freeze([]),
  dataImprovements: Object.freeze([]),
  templateDriven: true,
  readOnly: true,
  mutation: false,
  sourceMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  dsMutation: false,
  simulationMutation: false,
  diagnostics: CONFIDENCE_EXPLANATION_BUILDER_DIAGNOSTICS,
});
