/**
 * D7:5:1 — Autonomous strategic recommendation intelligence foundation.
 */

export type {
  StrategicRecommendationStateLabel,
  StrategicRecommendationSignal,
  InterventionImpactRecord,
  ExecutiveRecommendationInfluenceRecord,
  StrategicRecommendationState,
  ExecutiveRecommendationSemantics,
  StrategicRecommendationSnapshot,
  RecommendationPanelContract,
  RecommendationPanelRow,
  SimulationStrategicRecommendationContext,
  GenerateStrategicRecommendationsInput,
  GenerateStrategicRecommendationsResult,
} from "./strategicRecommendationTypes.ts";

export type { RecommendationGuardCode, RecommendationGuardResult } from "./recommendationGuards.ts";
export {
  DEFAULT_MAX_RECOMMENDATIONS,
  RECOMMENDATION_UNCERTAINTY_DISCLAIMER,
  NON_EXECUTION_DISCLAIMER,
  buildRecommendationContentFingerprint,
  guardGenerateStrategicRecommendations,
  guardRecommendationExecutiveSemantics,
} from "./recommendationGuards.ts";

export { logRecommendationDev } from "./recommendationDevLog.ts";
export type { RecommendationDevChannel } from "./recommendationDevLog.ts";

export {
  deriveStrategicRecommendations,
  calculateRecommendationConfidenceScore,
  calculateStabilizationLeverageScore,
  calculateInterventionRiskScore,
  identifyStabilizationRecommendationZones,
  identifyCriticalInterventionZones,
  identifyResilienceSupportZones,
  classifyStrategicRecommendationLabel,
} from "./recommendationGenerationModel.ts";

export { analyzeInterventionImpact } from "./interventionImpactAnalysis.ts";
export { analyzeExecutiveRecommendationInfluence } from "./executiveRecommendationIntelligence.ts";
export { buildExecutiveRecommendationSemantics } from "./executiveRecommendationSemantics.ts";

export {
  generateStrategicRecommendations,
  buildRecommendationPanelContract,
  freezeStrategicRecommendationSnapshot,
} from "./autonomousStrategicRecommendationEngine.ts";

/* D7:5:2 — Strategic recommendation confidence intelligence */
export type {
  RecommendationConfidenceStateLabel,
  RecommendationConfidenceSignal,
  RecommendationUncertaintyRecord,
  EvidenceStrengthRecord,
  RecommendationConfidenceState,
  ExecutiveRecommendationConfidenceSemantics,
  RecommendationConfidenceSnapshot,
  RecommendationConfidencePanelContract,
  RecommendationConfidencePanelRow,
  SimulationRecommendationConfidenceContext,
  EvaluateRecommendationConfidenceInput,
  EvaluateRecommendationConfidenceResult,
} from "./recommendationConfidenceTypes.ts";

export type { ConfidenceGuardCode, ConfidenceGuardResult } from "./confidenceGuards.ts";
export {
  DEFAULT_MAX_CONFIDENCE_SIGNALS,
  CONFIDENCE_UNCERTAINTY_DISCLAIMER,
  buildConfidenceContentFingerprint,
  guardEvaluateRecommendationConfidence,
  guardConfidenceExecutiveSemantics,
} from "./confidenceGuards.ts";

export { logConfidenceDev } from "./confidenceDevLog.ts";
export type { ConfidenceDevChannel } from "./confidenceDevLog.ts";

export {
  deriveRecommendationConfidenceSignals,
  calculateOverallConfidenceScore,
  calculateEvidenceStabilityScore,
  calculatePredictiveConsistencyScore,
  calculateUncertaintyAmplificationScore,
  identifyUncertaintyZones,
  identifyStableRecommendationZones,
  classifyRecommendationConfidenceLabel,
} from "./confidenceScoringModel.ts";

export { analyzeRecommendationUncertainty } from "./recommendationUncertaintyAnalysis.ts";
export { analyzeEvidenceStrength } from "./evidenceStrengthIntelligence.ts";
export { buildExecutiveRecommendationConfidenceSemantics } from "./executiveRecommendationConfidenceSemantics.ts";

export {
  evaluateRecommendationConfidence,
  buildRecommendationConfidencePanelContract,
  freezeRecommendationConfidenceSnapshot,
} from "./strategicRecommendationConfidenceEngine.ts";

/* D7:5:3 — Executive tradeoff analysis intelligence */
export type {
  StrategicTradeoffStateLabel,
  StrategicTradeoffSignal,
  StrategicCostBenefitRecord,
  CompetingObjectiveRecord,
  ExecutiveTradeoffConsequenceRecord,
  ExecutiveTradeoffState,
  ExecutiveTradeoffSemantics,
  ExecutiveTradeoffSnapshot,
  TradeoffPanelContract,
  TradeoffPanelRow,
  SimulationExecutiveTradeoffContext,
  EvaluateExecutiveTradeoffsInput,
  EvaluateExecutiveTradeoffsResult,
} from "./tradeoffAnalysisTypes.ts";

export type { TradeoffGuardCode, TradeoffGuardResult } from "./tradeoffGuards.ts";
export {
  DEFAULT_MAX_TRADEOFF_SIGNALS,
  TRADEOFF_UNCERTAINTY_DISCLAIMER,
  NON_SELECTION_DISCLAIMER,
  buildTradeoffContentFingerprint,
  guardEvaluateExecutiveTradeoffs,
  guardTradeoffExecutiveSemantics,
} from "./tradeoffGuards.ts";

export { logTradeoffDev } from "./tradeoffDevLog.ts";
export type { TradeoffDevChannel } from "./tradeoffDevLog.ts";

export {
  deriveStrategicTradeoffSignals,
  analyzeStrategicCostBenefit,
  calculateStrategicBalanceScore,
  calculateOperationalCostScore,
  calculateBenefitAsymmetryScore,
  identifyBenefitZones,
  identifyOperationalCostZones,
  classifyExecutiveTradeoffLabel,
} from "./strategicCostBenefitModel.ts";

export { analyzeCompetingObjectives } from "./competingObjectiveAnalysis.ts";
export { analyzeExecutiveTradeoffConsequences } from "./executiveDecisionTradeoffIntelligence.ts";
export { buildExecutiveTradeoffSemantics } from "./executiveTradeoffSemantics.ts";

export {
  evaluateExecutiveTradeoffs,
  buildTradeoffPanelContract,
  freezeExecutiveTradeoffSnapshot,
} from "./executiveTradeoffAnalysisEngine.ts";

/* D7:5:4 — Executive multi-strategy comparison intelligence */
export type {
  StrategyComparisonStateLabel,
  StrategyComparisonSignal,
  StrategyPathwayRecord,
  StrategyDivergenceComparisonRecord,
  ExecutivePathwayEvaluationRecord,
  ExecutiveMultiStrategyState,
  ExecutiveMultiStrategyComparisonSemantics,
  ExecutiveMultiStrategyComparisonSnapshot,
  MultiStrategyComparisonPanelContract,
  MultiStrategyComparisonPanelRow,
  SimulationMultiStrategyComparisonContext,
  EvaluateMultiStrategyComparisonInput,
  EvaluateMultiStrategyComparisonResult,
} from "./multiStrategyComparisonTypes.ts";

export type {
  StrategyComparisonGuardCode,
  StrategyComparisonGuardResult,
} from "./comparisonGuards.ts";
export {
  DEFAULT_MAX_STRATEGY_COMPARISONS,
  COMPARISON_UNCERTAINTY_DISCLAIMER,
  NON_RANKING_DISCLAIMER,
  buildComparisonContentFingerprint,
  guardEvaluateMultiStrategyComparison,
  guardComparisonExecutiveSemantics,
} from "./comparisonGuards.ts";

export { logStrategyComparisonDev } from "./comparisonDevLog.ts";
export type { StrategyComparisonDevChannel } from "./comparisonDevLog.ts";

export {
  deriveStrategyComparisonSignals,
  analyzeStrategyPathways,
  calculateComparisonStabilityScore,
  calculatePathwayDivergenceScore,
  calculateResilienceRiskAsymmetryScore,
  identifyDivergenceStrategyZones,
  identifyBalancedStrategyZones,
  classifyExecutiveComparisonLabel,
} from "./strategyOutcomeComparisonModel.ts";

export { analyzeStrategyDivergenceComparison } from "./divergenceComparisonAnalysis.ts";
export { analyzeExecutivePathwayEvaluation } from "./executivePathwayEvaluationIntelligence.ts";
export { buildExecutiveMultiStrategyComparisonSemantics } from "./executiveMultiStrategyComparisonSemantics.ts";

export {
  evaluateMultiStrategyComparison,
  buildMultiStrategyComparisonPanelContract,
  freezeExecutiveMultiStrategyComparisonSnapshot,
} from "./executiveMultiStrategyComparisonEngine.ts";

/* D7:5:5 — Strategic recommendation memory + learning intelligence */
export type {
  StrategicRecommendationMemoryStateLabel,
  StrategicRecommendationMemorySignal,
  HistoricalOutcomeRecord,
  PatternLearningRecord,
  ExecutiveStrategicMemoryRecord,
  StrategicRecommendationMemoryState,
  ExecutiveRecommendationLearningSemantics,
  StrategicRecommendationMemorySnapshot,
  RecommendationMemoryPanelContract,
  RecommendationMemoryPanelRow,
  SimulationRecommendationLearningContext,
  EvaluateRecommendationLearningInput,
  EvaluateRecommendationLearningResult,
} from "./recommendationMemoryTypes.ts";

export type {
  RecommendationLearningGuardCode,
  RecommendationLearningGuardResult,
} from "./learningGuards.ts";
export {
  DEFAULT_MAX_MEMORY_SIGNALS,
  LEARNING_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_LEARNING_DISCLAIMER,
  buildMemoryContentFingerprint,
  guardEvaluateRecommendationLearning,
  guardLearningExecutiveSemantics,
} from "./learningGuards.ts";

export { logRecommendationMemoryDev } from "./learningDevLog.ts";
export type { RecommendationMemoryDevChannel } from "./learningDevLog.ts";

export {
  deriveRecommendationMemorySignals,
  analyzeHistoricalOutcomes,
  calculateLearningStabilityScore,
  calculatePatternRecurrenceScore,
  calculateValidationConfidenceScore,
  identifyValidatedRecommendationZones,
  identifyRepeatedFailureZones,
  classifyExecutiveLearningLabel,
} from "./historicalOutcomeModel.ts";

export { analyzePatternLearning } from "./patternLearningAnalysis.ts";
export { analyzeExecutiveStrategicMemory } from "./executiveStrategicMemoryIntelligence.ts";
export { buildExecutiveRecommendationLearningSemantics } from "./executiveRecommendationLearningSemantics.ts";

export {
  evaluateRecommendationLearning,
  buildRecommendationMemoryPanelContract,
  freezeStrategicRecommendationMemorySnapshot,
} from "./strategicRecommendationMemoryLearningEngine.ts";

/* D7:5:6 — Executive strategic governance intelligence */
export type {
  StrategicGovernanceStateLabel,
  StrategicGovernanceSignal,
  GovernanceAlignmentRecord,
  RecommendationSafetyRecord,
  ExecutiveOversightRecord,
  ExecutiveStrategicGovernanceState,
  ExecutiveStrategicGovernanceSemantics,
  ExecutiveStrategicGovernanceSnapshot,
  StrategicGovernancePanelContract,
  StrategicGovernancePanelRow,
  SimulationStrategicGovernanceContext,
  EvaluateStrategicGovernanceInput,
  EvaluateStrategicGovernanceResult,
} from "./strategicGovernanceTypes.ts";

export type {
  StrategicGovernanceGuardCode,
  StrategicGovernanceGuardResult,
} from "./strategicGovernanceGuards.ts";
export {
  DEFAULT_MAX_GOVERNANCE_SIGNALS,
  GOVERNANCE_AMBIGUITY_DISCLAIMER,
  NON_ENFORCEMENT_DISCLAIMER,
  buildGovernanceContentFingerprint,
  guardEvaluateStrategicGovernance,
  guardGovernanceExecutiveSemantics,
} from "./strategicGovernanceGuards.ts";

export { logStrategicGovernanceDev } from "./strategicGovernanceDevLog.ts";
export type { StrategicGovernanceDevChannel } from "./strategicGovernanceDevLog.ts";

export {
  deriveStrategicGovernanceSignals,
  analyzeGovernanceAlignment,
  calculateGovernanceStabilityScore,
  calculateRecommendationSafetyScore,
  calculateOversightRequirementScore,
  identifyRestrictedRecommendationZones,
  identifyExecutiveOversightZones,
  classifyExecutiveGovernanceLabel,
} from "./governanceAlignmentModel.ts";

export { analyzeRecommendationSafety } from "./recommendationSafetyAnalysis.ts";
export { analyzeExecutiveOversight } from "./executiveOversightIntelligence.ts";
export { buildExecutiveStrategicGovernanceSemantics } from "./executiveStrategicGovernanceSemantics.ts";

export {
  evaluateStrategicGovernance,
  buildStrategicGovernancePanelContract,
  freezeExecutiveStrategicGovernanceSnapshot,
} from "./executiveStrategicGovernanceEngine.ts";

/* D7:5:7 — Executive decision explainability intelligence */
export type {
  ExecutiveExplainabilityStateLabel,
  ExecutiveExplainabilitySignal,
  RecommendationTraceRecord,
  SignalToDecisionRecord,
  ExecutiveReasoningTransparencyRecord,
  ExecutiveExplainabilityState,
  ExecutiveDecisionExplainabilitySemantics,
  ExecutiveDecisionExplainabilitySnapshot,
  DecisionExplainabilityPanelContract,
  DecisionExplainabilityPanelRow,
  SimulationDecisionExplainabilityContext,
  EvaluateDecisionExplainabilityInput,
  EvaluateDecisionExplainabilityResult,
} from "./executiveExplainabilityTypes.ts";

export type {
  ExecutiveDecisionExplainabilityGuardCode,
  ExecutiveDecisionExplainabilityGuardResult,
} from "./explainabilityGuards.ts";
export {
  DEFAULT_MAX_EXPLAINABILITY_SIGNALS,
  EXPLAINABILITY_AMBIGUITY_DISCLAIMER,
  NON_OPAQUE_REASONING_DISCLAIMER,
  buildExplainabilityContentFingerprint,
  guardEvaluateDecisionExplainability,
  guardExplainabilityExecutiveSemantics,
} from "./explainabilityGuards.ts";

export { logExecutiveDecisionExplainabilityDev } from "./explainabilityDevLog.ts";
export type { ExecutiveDecisionExplainabilityDevChannel } from "./explainabilityDevLog.ts";

export {
  deriveExecutiveExplainabilitySignals,
  analyzeRecommendationTraces,
  calculateExplanationClarityScore,
  calculateTraceabilityScore,
  calculateReasoningTransparencyScore,
  identifyTraceabilityZones,
  identifyAmbiguityExplanationZones,
  classifyExecutiveExplainabilityLabel,
} from "./recommendationTraceModel.ts";

export { analyzeSignalToDecision } from "./signalToDecisionAnalysis.ts";
export { analyzeExecutiveReasoningTransparency } from "./executiveReasoningTransparencyIntelligence.ts";
export { buildExecutiveDecisionExplainabilitySemantics } from "./executiveDecisionExplainabilitySemantics.ts";

export {
  evaluateDecisionExplainability,
  buildDecisionExplainabilityPanelContract,
  freezeExecutiveDecisionExplainabilitySnapshot,
} from "./executiveDecisionExplainabilityEngine.ts";

/* D7:5:8 — Executive strategic advisory intelligence */
export type {
  ExecutiveStrategicAdvisoryStateLabel,
  ExecutiveStrategicAdvisorySignal,
  ExecutiveGuidanceSynthesisRecord,
  StrategicContextRecord,
  ExecutiveAdvisoryDomainRecord,
  ExecutiveStrategicAdvisoryState,
  ExecutiveStrategicAdvisorySemantics,
  ExecutiveStrategicAdvisorySnapshot,
  StrategicAdvisoryPanelContract,
  StrategicAdvisoryPanelRow,
  SimulationExecutiveAdvisoryContext,
  EvaluateExecutiveAdvisoryInput,
  EvaluateExecutiveAdvisoryResult,
} from "./executiveStrategicAdvisoryTypes.ts";

export type {
  ExecutiveStrategicAdvisoryGuardCode,
  ExecutiveStrategicAdvisoryGuardResult,
} from "./advisoryGuards.ts";
export {
  DEFAULT_MAX_ADVISORY_SIGNALS,
  ADVISORY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_AUTHORITY_DISCLAIMER,
  buildAdvisoryContentFingerprint,
  guardEvaluateExecutiveAdvisory,
  guardAdvisoryExecutiveSemantics,
} from "./advisoryGuards.ts";

export { logExecutiveStrategicAdvisoryDev } from "./advisoryDevLog.ts";
export type { ExecutiveStrategicAdvisoryDevChannel } from "./advisoryDevLog.ts";

export {
  deriveExecutiveStrategicAdvisories,
  analyzeExecutiveGuidanceSynthesis,
  calculateAdvisoryClarityScore,
  calculateStrategicCoherenceScore,
  calculateActionabilityScore,
  identifyExecutivePriorityZones,
  identifyStrategicAdvisoryZones,
  classifyExecutiveAdvisoryLabel,
} from "./executiveGuidanceSynthesisModel.ts";

export { analyzeStrategicContextGeneration } from "./strategicContextGenerationAnalysis.ts";
export { analyzeExecutiveAdvisoryIntelligence } from "./executiveAdvisoryIntelligence.ts";
export { buildExecutiveStrategicAdvisorySemantics } from "./executiveStrategicAdvisorySemantics.ts";

export {
  evaluateExecutiveAdvisory,
  buildStrategicAdvisoryPanelContract,
  freezeExecutiveStrategicAdvisorySnapshot,
} from "./executiveStrategicAdvisoryEngine.ts";

/* D7:5:9 — Executive strategic consensus intelligence */
export type {
  ExecutiveConsensusStateLabel,
  ExecutiveConsensusSignal,
  ExecutiveAlignmentRecord,
  ConsensusFragmentationRecord,
  StrategicCoherenceRecord,
  ExecutiveStrategicConsensusState,
  ExecutiveStrategicConsensusSemantics,
  ExecutiveStrategicConsensusSnapshot,
  StrategicConsensusPanelContract,
  StrategicConsensusPanelRow,
  SimulationStrategicConsensusContext,
  EvaluateStrategicConsensusInput,
  EvaluateStrategicConsensusResult,
} from "./executiveConsensusTypes.ts";

export type {
  ExecutiveStrategicConsensusGuardCode,
  ExecutiveStrategicConsensusGuardResult,
} from "./consensusGuards.ts";
export {
  DEFAULT_MAX_CONSENSUS_SIGNALS,
  CONSENSUS_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_DISCLAIMER,
  buildConsensusContentFingerprint,
  guardEvaluateStrategicConsensus,
  guardConsensusExecutiveSemantics,
} from "./consensusGuards.ts";

export { logExecutiveStrategicConsensusDev } from "./consensusDevLog.ts";
export type { ExecutiveStrategicConsensusDevChannel } from "./consensusDevLog.ts";

export {
  deriveExecutiveConsensusSignals,
  analyzeExecutiveAlignment,
  calculateStrategicAlignmentScore,
  calculateExecutiveCoherenceScore,
  calculateFragmentationEscalationScore,
  identifyConsensusStabilityZones,
  identifyFragmentationZones,
  classifyExecutiveConsensusLabel,
} from "./executiveAlignmentModel.ts";

export { analyzeConsensusFragmentation } from "./consensusFragmentationAnalysis.ts";
export { analyzeStrategicCoherence } from "./strategicCoherenceIntelligence.ts";
export { buildExecutiveStrategicConsensusSemantics } from "./executiveStrategicConsensusSemantics.ts";

export {
  evaluateStrategicConsensus,
  buildStrategicConsensusPanelContract,
  freezeExecutiveStrategicConsensusSnapshot,
} from "./executiveStrategicConsensusEngine.ts";
