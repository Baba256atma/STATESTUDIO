/**
 * D7:4:1 — Predictive future trajectory intelligence foundation (public surface).
 */

export type {
  FutureTrajectorySignalState,
  FutureTrajectorySignal,
  TrajectoryDivergenceRecord,
  RecoveryDegradationTrendRecord,
  PredictiveTrajectoryState,
  ExecutiveTrajectorySemantics,
  PredictiveTrajectorySnapshot,
  TrajectoryPanelContract,
  TrajectoryPanelSignalRow,
  SimulationPredictiveTrajectoryContext,
  EvaluateFutureTrajectoriesInput,
  EvaluateFutureTrajectoriesResult,
} from "./futureTrajectoryTypes.ts";

export type { TrajectoryGuardCode, TrajectoryGuardResult } from "./trajectoryGuards.ts";
export {
  DEFAULT_MAX_TRAJECTORY_SIGNALS,
  UNCERTAINTY_DISCLAIMER,
  PROHIBITED_CERTAINTY_TEXT,
  buildTrajectoryContentFingerprint,
  containsFalseCertaintyText,
  guardEvaluateFutureTrajectories,
  guardTrajectoryExecutiveSemantics,
} from "./trajectoryGuards.ts";

export { logTrajectoryDev } from "./trajectoryDevLog.ts";
export type { TrajectoryDevChannel } from "./trajectoryDevLog.ts";

export {
  deriveFutureTrajectorySignals,
  calculateFutureStabilityScore,
  calculateTrajectoryVolatilityScore,
  calculateTrajectoryDivergenceScore,
  identifyPredictiveDegradationTrajectories,
  identifyPredictiveRecoveryTrajectories,
  identifyPredictiveVolatilityHotspots,
  classifyPredictiveTrajectoryLabel,
} from "./directionalEvolutionModel.ts";

export { analyzeTrajectoryDivergence } from "./trajectoryDivergenceAnalysis.ts";
export { analyzeRecoveryDegradationTrends } from "./recoveryDegradationTrendIntelligence.ts";
export { buildExecutiveTrajectorySemantics } from "./executiveTrajectorySemantics.ts";

export {
  evaluateFutureTrajectories,
  buildTrajectoryPanelContract,
  freezePredictiveTrajectorySnapshot,
} from "./predictiveFutureTrajectoryEngine.ts";

/* D7:4:2 — Multi-future divergence intelligence */
export type {
  FutureDivergenceSignalState,
  FutureBranchRecord,
  FutureDivergenceSignal,
  DivergenceConvergenceRecord,
  StrategicFutureSeparationRecord,
  MultiFutureDivergenceState,
  ExecutiveDivergenceSemantics,
  MultiFutureDivergenceSnapshot,
  DivergencePanelContract,
  DivergencePanelBranchRow,
  SimulationMultiFutureDivergenceContext,
  EvaluateFutureDivergenceInput,
  EvaluateFutureDivergenceResult,
} from "./multiFutureDivergenceTypes.ts";

export type { DivergenceGuardCode, DivergenceGuardResult } from "./divergenceGuards.ts";
export {
  DEFAULT_MAX_DIVERGENCE_SIGNALS,
  DEFAULT_MAX_FUTURE_BRANCHES,
  DIVERGENCE_UNCERTAINTY_DISCLAIMER,
  buildDivergenceContentFingerprint,
  guardEvaluateFutureDivergence,
  guardDivergenceExecutiveSemantics,
} from "./divergenceGuards.ts";

export { logDivergenceDev } from "./divergenceDevLog.ts";
export type { DivergenceDevChannel } from "./divergenceDevLog.ts";

export {
  deriveFutureBranches,
  deriveFutureDivergenceSignals,
  calculateFutureVolatilityScore,
  calculateFutureFragmentationScore,
  calculateFutureConvergenceScore,
  identifyConvergingFutureZones,
  identifyFragmentedFutureZones,
  identifyStabilizationFutureBranches,
  identifyDegradationFutureBranches,
  classifyMultiFutureDivergenceLabel,
  CANONICAL_FUTURE_BRANCH_IDS,
} from "./futureBranchEvolutionModel.ts";

export { analyzeDivergenceConvergence } from "./divergenceConvergenceAnalysis.ts";
export { analyzeStrategicFutureSeparation } from "./strategicFutureSeparationIntelligence.ts";
export { buildExecutiveDivergenceSemantics } from "./executiveDivergenceSemantics.ts";

export {
  evaluateFutureDivergence,
  buildDivergencePanelContract,
  freezeMultiFutureDivergenceSnapshot,
} from "./multiFutureDivergenceEngine.ts";

/* D7:4:4 — Predictive cascading consequence intelligence */
export type {
  PredictiveCascadeSignalState,
  StrategicInflectionState,
  PredictiveCascadeSignal,
  SecondaryTertiaryConsequenceRecord,
  FutureAmplificationRecord,
  PredictiveCascadeState,
  ExecutiveCascadeSemantics,
  PredictiveCascadeSnapshot,
  CascadePanelContract,
  CascadePanelSignalRow,
  SimulationPredictiveCascadeContext,
  EvaluatePredictiveCascadesInput,
  EvaluatePredictiveCascadesResult,
} from "./cascadingConsequenceTypes.ts";

export type { CascadeGuardCode, CascadeGuardResult } from "./cascadeGuards.ts";
export {
  DEFAULT_MAX_CASCADE_SIGNALS,
  DEFAULT_MAX_PROPAGATION_HOP_DEPTH,
  CASCADE_UNCERTAINTY_DISCLAIMER,
  buildCascadeContentFingerprint,
  guardEvaluatePredictiveCascades,
  guardCascadeExecutiveSemantics,
} from "./cascadeGuards.ts";

export { logCascadeDev } from "./cascadeDevLog.ts";
export type { CascadeDevChannel } from "./cascadeDevLog.ts";

export {
  resolveInflectionSurface,
  identifyCascadeOriginRegions,
  derivePredictiveCascadeSignals,
  calculateCascadePropagationScore,
  calculateCascadeAmplificationScore,
  calculateCascadeStabilizationScore,
  identifyAmplificationZones,
  identifyStabilizationZones,
  classifyPredictiveCascadeLabel,
} from "./predictivePropagationModel.ts";

export { analyzeSecondaryTertiaryConsequences } from "./secondaryTertiaryConsequenceAnalysis.ts";
export { analyzeFutureAmplification } from "./futureAmplificationIntelligence.ts";
export { buildExecutiveCascadeSemantics } from "./executiveCascadeSemantics.ts";

export {
  evaluatePredictiveCascades,
  buildCascadePanelContract,
  freezePredictiveCascadeSnapshot,
} from "./predictiveCascadingConsequenceEngine.ts";

/* D7:4:5 — Predictive recovery opportunity intelligence */
export type {
  RecoveryOpportunitySignalState,
  RecoveryOpportunitySignal,
  RecoveryLeveragePointRecord,
  PredictiveStabilizationRecord,
  PredictiveRecoveryOpportunityState,
  ExecutiveRecoveryOpportunitySemantics,
  PredictiveRecoveryOpportunitySnapshot,
  RecoveryOpportunityPanelContract,
  RecoveryOpportunityPanelSignalRow,
  SimulationRecoveryOpportunityContext,
  EvaluateRecoveryOpportunitiesInput,
  EvaluateRecoveryOpportunitiesResult,
} from "./recoveryOpportunityTypes.ts";

export type {
  RecoveryOpportunityGuardCode,
  RecoveryOpportunityGuardResult,
} from "./recoveryOpportunityGuards.ts";
export {
  DEFAULT_MAX_RECOVERY_OPPORTUNITY_SIGNALS,
  RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER,
  buildRecoveryOpportunityContentFingerprint,
  guardEvaluateRecoveryOpportunities,
  guardRecoveryOpportunityExecutiveSemantics,
} from "./recoveryOpportunityGuards.ts";

export { logRecoveryOpportunityDev } from "./recoveryOpportunityDevLog.ts";
export type { RecoveryOpportunityDevChannel } from "./recoveryOpportunityDevLog.ts";

export {
  deriveRecoveryOpportunitySignals,
  calculateRecoveryAccelerationScore,
  calculateStabilizationPotentialScore,
  identifyStabilizationOpportunityZones,
  identifyFragileRecoveryZones,
  identifyResilienceAccelerationZones,
  classifyRecoveryOpportunityLabel,
} from "./opportunityEmergenceModel.ts";

export { analyzeRecoveryLeveragePoints } from "./recoveryLeveragePointAnalysis.ts";
export { analyzePredictiveStabilization } from "./predictiveStabilizationIntelligence.ts";
export { buildExecutiveRecoveryOpportunitySemantics } from "./executiveRecoveryOpportunitySemantics.ts";

export {
  evaluateRecoveryOpportunities,
  buildRecoveryOpportunityPanelContract,
  freezePredictiveRecoveryOpportunitySnapshot,
} from "./predictiveRecoveryOpportunityEngine.ts";

/* D7:4:6 — Predictive systemic collapse prevention intelligence */
export type {
  CollapsePreventionSignalState,
  CollapsePreventionSignal,
  StabilizationInterruptionRecord,
  ResiliencePreservationRecord,
  PredictiveCollapsePreventionState,
  ExecutiveCollapsePreventionSemantics,
  PredictiveCollapsePreventionSnapshot,
  PreventionPanelContract,
  PreventionPanelSignalRow,
  SimulationCollapsePreventionContext,
  EvaluateCollapsePreventionInput,
  EvaluateCollapsePreventionResult,
} from "./collapsePreventionTypes.ts";

export type { PreventionGuardCode, PreventionGuardResult } from "./preventionGuards.ts";
export {
  DEFAULT_MAX_PREVENTION_SIGNALS,
  PREVENTION_UNCERTAINTY_DISCLAIMER,
  buildPreventionContentFingerprint,
  guardEvaluateCollapsePrevention,
  guardPreventionExecutiveSemantics,
} from "./preventionGuards.ts";

export { logPreventionDev } from "./preventionDevLog.ts";
export type { PreventionDevChannel } from "./preventionDevLog.ts";

export {
  deriveCollapsePreventionSignals,
  resolvePreventionInflection,
  calculateCollapseInterruptionScore,
  calculateCriticalThresholdProximityScore,
  calculateResiliencePreservationScore,
  identifyStabilizationInterventionZones,
  identifyCriticalCollapseZones,
  classifyPredictivePreventionLabel,
} from "./criticalThresholdPreventionModel.ts";

export { analyzeStabilizationInterruption } from "./stabilizationInterruptionAnalysis.ts";
export { analyzeResiliencePreservation } from "./predictiveResiliencePreservationIntelligence.ts";
export { buildExecutiveCollapsePreventionSemantics } from "./executiveCollapsePreventionSemantics.ts";

export {
  evaluateCollapsePrevention,
  buildPreventionPanelContract,
  freezePredictiveCollapsePreventionSnapshot,
} from "./predictiveSystemicCollapsePreventionEngine.ts";

/* D7:4:7 — Predictive strategic adaptation intelligence */
export type {
  StrategicAdaptationSignalState,
  StrategicAdaptationSignal,
  ResilienceFlexibilityRecord,
  PredictiveAdaptationPathwayRecord,
  PredictiveStrategicAdaptationState,
  ExecutiveStrategicAdaptationSemantics,
  PredictiveStrategicAdaptationSnapshot,
  AdaptationPanelContract,
  AdaptationPanelSignalRow,
  SimulationStrategicAdaptationContext,
  EvaluateStrategicAdaptationInput,
  EvaluateStrategicAdaptationResult,
} from "./strategicAdaptationTypes.ts";

export type { AdaptationGuardCode, AdaptationGuardResult } from "./adaptationGuards.ts";
export {
  DEFAULT_MAX_ADAPTATION_SIGNALS,
  ADAPTATION_UNCERTAINTY_DISCLAIMER,
  buildAdaptationContentFingerprint,
  guardEvaluateStrategicAdaptation,
  guardAdaptationExecutiveSemantics,
} from "./adaptationGuards.ts";

export { logAdaptationDev } from "./adaptationDevLog.ts";
export type { AdaptationDevChannel } from "./adaptationDevLog.ts";

export {
  deriveStrategicAdaptationSignals,
  calculateAdaptiveResilienceScore,
  calculateStrategicFlexibilityScore,
  calculateAdaptationFragilityScore,
  identifyStrategicFlexibilityZones,
  identifyAdaptationFragilityZones,
  identifyTransformationBottleneckZones,
  classifyPredictiveAdaptationLabel,
} from "./adaptiveTransformationModel.ts";

export { analyzeResilienceFlexibility } from "./resilienceFlexibilityAnalysis.ts";
export { analyzePredictiveAdaptationPathways } from "./predictiveAdaptationPathwayIntelligence.ts";
export { buildExecutiveStrategicAdaptationSemantics } from "./executiveStrategicAdaptationSemantics.ts";

export {
  evaluateStrategicAdaptation,
  buildAdaptationPanelContract,
  freezePredictiveStrategicAdaptationSnapshot,
} from "./predictiveStrategicAdaptationEngine.ts";

/* D7:4:8 — Predictive executive foresight intelligence */
export type {
  ExecutiveForesightSignalState,
  ExecutiveForesightSignal,
  LongHorizonForesightRecord,
  ExecutivePreparationGapRecord,
  PredictiveExecutiveForesightState,
  ExecutiveForesightSemantics,
  PredictiveExecutiveForesightSnapshot,
  ForesightPanelContract,
  ForesightPanelSignalRow,
  SimulationExecutiveForesightContext,
  EvaluateExecutiveForesightInput,
  EvaluateExecutiveForesightResult,
} from "./executiveForesightTypes.ts";

export type { ForesightGuardCode, ForesightGuardResult } from "./foresightGuards.ts";
export {
  DEFAULT_MAX_FORESIGHT_SIGNALS,
  FORESIGHT_UNCERTAINTY_DISCLAIMER,
  buildForesightContentFingerprint,
  guardEvaluateExecutiveForesight,
  guardForesightExecutiveSemantics,
} from "./foresightGuards.ts";

export { logForesightDev } from "./foresightDevLog.ts";
export type { ForesightDevChannel } from "./foresightDevLog.ts";

export {
  deriveExecutiveForesightSignals,
  calculateStrategicPreparednessScore,
  calculateLongHorizonRiskScore,
  calculateFutureReadinessScore,
  identifyForesightOpportunityZones,
  identifyLongHorizonRiskZones,
  identifyFutureReadinessZones,
  classifyPredictiveForesightLabel,
} from "./emergingPatternModel.ts";

export { analyzeLongHorizonForesight } from "./longHorizonForesightAnalysis.ts";
export { analyzeExecutivePreparationGaps } from "./predictiveExecutivePreparationIntelligence.ts";
export { buildExecutiveForesightSemantics } from "./executiveForesightSemantics.ts";

export {
  evaluateExecutiveForesight,
  buildForesightPanelContract,
  freezePredictiveExecutiveForesightSnapshot,
} from "./predictiveExecutiveForesightEngine.ts";
