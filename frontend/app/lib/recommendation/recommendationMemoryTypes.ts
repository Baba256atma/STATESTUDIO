/**
 * D7:5:5 — Strategic recommendation memory + learning contracts.
 */

import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { ExecutiveTradeoffState } from "./tradeoffAnalysisTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { RecommendationLearningGuardResult } from "./learningGuards.ts";

export type StrategicRecommendationMemoryStateLabel =
  | "validated"
  | "improving"
  | "volatile"
  | "outdated"
  | "critical";

export interface StrategicRecommendationMemorySignal {
  memoryId: string;
  originatingRecommendationId: string;
  affectedRegionIds: readonly string[];
  memoryState: StrategicRecommendationMemoryStateLabel;
  memoryStrength: number;
  dominantLearningDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface HistoricalOutcomeRecord {
  recordId: string;
  outcomeType:
    | "successful_recovery_pathway"
    | "repeated_fragility_pattern"
    | "validated_stabilization"
    | "failed_intervention"
    | "resilience_learning_evolution"
    | "strategic_pattern_recurrence";
  outcomeStrength: number;
  explanation: string;
  contributingMemoryIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface PatternLearningRecord {
  recordId: string;
  patternType:
    | "recurring_instability"
    | "repeated_strategic_success"
    | "resilience_learning_opportunity"
    | "recommendation_validation"
    | "operational_history_similarity"
    | "historical_fragility_amplification";
  patternStrength: number;
  explanation: string;
  contributingMemoryIds: readonly string[];
}

export interface ExecutiveStrategicMemoryRecord {
  recordId: string;
  memoryDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  memoryInfluenceStrength: number;
  explanation: string;
  contributingMemoryIds: readonly string[];
}

export interface StrategicRecommendationMemoryState {
  activeMemorySignals: readonly StrategicRecommendationMemorySignal[];
  historicalOutcomeRecords: readonly HistoricalOutcomeRecord[];
  patternLearningRecords: readonly PatternLearningRecord[];
  executiveStrategicMemoryRecords: readonly ExecutiveStrategicMemoryRecord[];
  validatedRecommendationZones: readonly string[];
  repeatedFailureZones: readonly string[];
  learningStabilityScore: number;
  patternRecurrenceScore: number;
  validationConfidenceScore: number;
  executiveLearningLabel: "stable" | "emerging" | "volatile" | "validated" | "degraded";
  learningAmbiguityDisclaimer: string;
  nonAutonomousLearningDisclaimer: string;
}

export interface ExecutiveRecommendationLearningSemantics {
  headline: string;
  summary: string;
  memorySummaries: readonly string[];
  outcomeSummaries: readonly string[];
  patternSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicRecommendationMemorySnapshot {
  memoryStateId: string;
  topologyId: string;
  comparisonStateId?: string;
  tick: number;
  state: StrategicRecommendationMemoryState;
  semantics: ExecutiveRecommendationLearningSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future recommendation-memory UI contract (no rendering in D7:5:5). */
export interface RecommendationMemoryPanelContract {
  memoryStateId: string;
  topologyId: string;
  learningStabilityScore: number;
  executiveLearningLabel: StrategicRecommendationMemoryState["executiveLearningLabel"];
  learningAmbiguityDisclaimer: string;
  nonAutonomousLearningDisclaimer: string;
  memories: readonly RecommendationMemoryPanelRow[];
  outcomeSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_memory_overlay"
    | "recommendation_history_dashboard"
    | "resilience_learning_heatmap"
    | "executive_learning_timeline"
    | "historical_pattern_panel";
}

export interface RecommendationMemoryPanelRow {
  memoryId: string;
  originatingRecommendationId: string;
  memoryState: StrategicRecommendationMemoryStateLabel;
  memoryStrength: number;
}

export interface SimulationRecommendationLearningContext {
  tick?: number;
  memoryLeverageFactor?: number;
  historicalStressFactor?: number;
}

export interface EvaluateRecommendationLearningInput {
  topology: OperationalUniverseTopology;
  comparisonState: ExecutiveMultiStrategyState;
  tradeoffState: ExecutiveTradeoffState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  foresightState: PredictiveExecutiveForesightState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  learningContext?: SimulationRecommendationLearningContext;
  tick?: number;
  memoryStateId?: string;
  priorMemoryFingerprints?: readonly string[];
}

export type EvaluateRecommendationLearningResult =
  | {
      ok: true;
      snapshot: StrategicRecommendationMemorySnapshot;
      panelContract: RecommendationMemoryPanelContract;
    }
  | { ok: false; guard: RecommendationLearningGuardResult };
