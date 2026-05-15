/**
 * Decision Intelligence — public barrel for D4+ consumers.
 * Import as: `import * as DecisionIntelligence from ".../decisionIntelligenceBundle"` to avoid
 * colliding with legacy `lib/decision` type names at the package root.
 */

export type {
  DecisionActionKind,
  DecisionConfidenceBand,
  DecisionMetadataEntry,
  DecisionPriority,
  DecisionProvenanceRef,
  DecisionRecommendationLifecycleStatus,
  DecisionRiskSeverityLabel,
  DecisionSignalKind,
  DecisionSourceRef,
  DecisionTimeHorizon,
} from "./decisionTypes.ts";

export { decisionConfidenceLabelFrom01, normalizeDecisionConfidence01 } from "./decisionConfidence.ts";

export type { DecisionReasoningEdge, DecisionReasoningGraph, DecisionReasoningNode, DecisionReasoningNodeKind } from "./decisionReasoning.ts";

export type {
  DecisionAction,
  DecisionConfidence,
  DecisionContext,
  DecisionEvidence,
  DecisionInsight,
  DecisionOutcomeProjection,
  DecisionRecommendation,
  DecisionRiskAssessment,
  DecisionSignal,
  DecisionTradeoff,
} from "./decisionIntelligenceContracts.ts";

export {
  logDecisionConfidenceDev,
  logDecisionIntelligenceDev,
  logDecisionReasoningDev,
} from "./decisionInstrumentation.ts";

export type {
  CalculateDecisionScoreInput,
  DecisionScoreLabel,
  DecisionScoreResult,
  DecisionScoreWeightsUsed,
} from "./decisionScoring.ts";
export {
  DECISION_SCORE_WEIGHTS,
  calculateDecisionScore,
  calculateEvidenceStrength,
  calculateOpportunityScore,
  calculateReversibilityScore,
  calculateRiskPressure,
  calculateUrgencyScore,
  getDecisionScoreLabel,
  normalizeDecisionScore,
  trackDecisionScoreComputed,
} from "./decisionScoring.ts";

export type {
  DecisionEvidenceEvaluationInput,
  DecisionEvidenceEvaluationResult,
  DecisionEvidenceSummaryLabel,
} from "./decisionEvidenceEvaluator.ts";
export {
  calculateEvidenceConflictScore,
  calculateEvidenceConsistency,
  calculateEvidenceCoverage,
  calculateEvidenceFreshness,
  calculateEvidenceQuality,
  calculateEvidenceReliability,
  detectConflictingEvidence,
  detectSparseEvidence,
  detectWeakEvidence,
  evaluateDecisionEvidence,
  evidenceSummaryLabelFromQuality,
  trackDecisionEvidenceEvaluation,
} from "./decisionEvidenceEvaluator.ts";
