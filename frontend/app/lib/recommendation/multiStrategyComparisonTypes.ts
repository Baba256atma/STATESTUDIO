/**
 * D7:5:4 — Executive multi-strategy comparison contracts.
 */

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
import type { StrategyComparisonGuardResult } from "./comparisonGuards.ts";

export type StrategyComparisonStateLabel =
  | "balanced"
  | "risk_heavy"
  | "recovery_focused"
  | "adaptive"
  | "volatile";

export interface StrategyComparisonSignal {
  strategyId: string;
  strategyLabel: string;
  affectedRegionIds: readonly string[];
  comparisonState: StrategyComparisonStateLabel;
  comparisonStrength: number;
  dominantComparisonDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface StrategyPathwayRecord {
  recordId: string;
  strategyId: string;
  pathwayType:
    | "stabilization_focused"
    | "flexibility_focused"
    | "resilience_optimization"
    | "fragility_reduction"
    | "recovery_acceleration"
    | "equilibrium_restoration";
  pathwayStrength: number;
  explanation: string;
  contributingStrategyIds: readonly string[];
}

export interface StrategyDivergenceComparisonRecord {
  recordId: string;
  comparisonType:
    | "resilience_risk_asymmetry"
    | "flexibility_stability"
    | "short_long_term"
    | "recovery_speed"
    | "strategic_volatility";
  divergenceStrength: number;
  explanation: string;
  strategyIds: readonly string[];
}

export interface ExecutivePathwayEvaluationRecord {
  recordId: string;
  evaluationDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  evaluationStrength: number;
  explanation: string;
  contributingStrategyIds: readonly string[];
}

export interface ExecutiveMultiStrategyState {
  activeStrategyComparisons: readonly StrategyComparisonSignal[];
  strategyPathwayRecords: readonly StrategyPathwayRecord[];
  strategyDivergenceComparisonRecords: readonly StrategyDivergenceComparisonRecord[];
  executivePathwayEvaluationRecords: readonly ExecutivePathwayEvaluationRecord[];
  divergenceStrategyZones: readonly string[];
  balancedStrategyZones: readonly string[];
  comparisonStabilityScore: number;
  pathwayDivergenceScore: number;
  resilienceRiskAsymmetryScore: number;
  executiveComparisonLabel: "balanced" | "divergent" | "volatile" | "convergent" | "fragmented";
  uncertaintyDisclaimer: string;
  nonRankingDisclaimer: string;
}

export interface ExecutiveMultiStrategyComparisonSemantics {
  headline: string;
  summary: string;
  strategySummaries: readonly string[];
  pathwaySummaries: readonly string[];
  divergenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveMultiStrategyComparisonSnapshot {
  comparisonStateId: string;
  topologyId: string;
  tradeoffStateId?: string;
  tick: number;
  state: ExecutiveMultiStrategyState;
  semantics: ExecutiveMultiStrategyComparisonSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future multi-strategy comparison UI contract (no rendering in D7:5:4). */
export interface MultiStrategyComparisonPanelContract {
  comparisonStateId: string;
  topologyId: string;
  comparisonStabilityScore: number;
  executiveComparisonLabel: ExecutiveMultiStrategyState["executiveComparisonLabel"];
  uncertaintyDisclaimer: string;
  nonRankingDisclaimer: string;
  strategies: readonly MultiStrategyComparisonPanelRow[];
  pathwaySummaries: readonly string[];
  headline: string;
  viewHint:
    | "multi_strategy_overlay"
    | "executive_comparison_dashboard"
    | "strategy_divergence_heatmap"
    | "resilience_risk_comparison_timeline"
    | "competing_pathway_panel";
}

export interface MultiStrategyComparisonPanelRow {
  strategyId: string;
  label: string;
  comparisonState: StrategyComparisonStateLabel;
  comparisonStrength: number;
}

export interface SimulationMultiStrategyComparisonContext {
  tick?: number;
  comparisonLeverageFactor?: number;
  divergenceStressFactor?: number;
}

export interface EvaluateMultiStrategyComparisonInput {
  topology: OperationalUniverseTopology;
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
  comparisonContext?: SimulationMultiStrategyComparisonContext;
  tick?: number;
  comparisonStateId?: string;
  priorComparisonFingerprints?: readonly string[];
}

export type EvaluateMultiStrategyComparisonResult =
  | { ok: true; snapshot: ExecutiveMultiStrategyComparisonSnapshot; panelContract: MultiStrategyComparisonPanelContract }
  | { ok: false; guard: StrategyComparisonGuardResult };
