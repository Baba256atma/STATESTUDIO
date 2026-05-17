/**
 * D7:5:3 — Executive tradeoff analysis contracts.
 */

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
import type { TradeoffGuardResult } from "./tradeoffGuards.ts";

export type StrategicTradeoffStateLabel =
  | "balanced"
  | "favorable"
  | "strained"
  | "volatile"
  | "critical";

export interface StrategicTradeoffSignal {
  tradeoffId: string;
  affectedRegionIds: readonly string[];
  tradeoffState: StrategicTradeoffStateLabel;
  tradeoffStrength: number;
  dominantTradeoffDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface StrategicCostBenefitRecord {
  recordId: string;
  regionId: string;
  benefitType:
    | "stabilization"
    | "fragility_reduction"
    | "recovery_acceleration"
    | "equilibrium_restoration"
    | "resilience_gain";
  costType:
    | "operational_rigidity"
    | "leadership_load"
    | "flexibility_sacrifice"
    | "short_term_fragility"
    | "coordination_overhead";
  benefitStrength: number;
  costStrength: number;
  explanation: string;
  contributingTradeoffIds: readonly string[];
}

export interface CompetingObjectiveRecord {
  recordId: string;
  objectiveTension:
    | "resilience_vs_flexibility"
    | "stability_vs_growth"
    | "recovery_vs_efficiency"
    | "coordination_vs_agility"
    | "short_term_vs_long_term";
  tensionStrength: number;
  explanation: string;
  contributingTradeoffIds: readonly string[];
}

export interface ExecutiveTradeoffConsequenceRecord {
  recordId: string;
  consequenceDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  consequenceStrength: number;
  explanation: string;
  contributingTradeoffIds: readonly string[];
}

export interface ExecutiveTradeoffState {
  activeTradeoffs: readonly StrategicTradeoffSignal[];
  strategicCostBenefitRecords: readonly StrategicCostBenefitRecord[];
  competingObjectiveRecords: readonly CompetingObjectiveRecord[];
  executiveTradeoffConsequenceRecords: readonly ExecutiveTradeoffConsequenceRecord[];
  benefitZones: readonly string[];
  operationalCostZones: readonly string[];
  strategicBalanceScore: number;
  operationalCostScore: number;
  benefitAsymmetryScore: number;
  executiveTradeoffLabel: "balanced" | "favorable" | "strained" | "volatile" | "critical";
  uncertaintyDisclaimer: string;
  nonSelectionDisclaimer: string;
}

export interface ExecutiveTradeoffSemantics {
  headline: string;
  summary: string;
  tradeoffSummaries: readonly string[];
  costBenefitSummaries: readonly string[];
  competingObjectiveSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveTradeoffSnapshot {
  tradeoffStateId: string;
  topologyId: string;
  recommendationStateId?: string;
  tick: number;
  state: ExecutiveTradeoffState;
  semantics: ExecutiveTradeoffSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future tradeoff UI contract (no rendering in D7:5:3). */
export interface TradeoffPanelContract {
  tradeoffStateId: string;
  topologyId: string;
  strategicBalanceScore: number;
  executiveTradeoffLabel: ExecutiveTradeoffState["executiveTradeoffLabel"];
  uncertaintyDisclaimer: string;
  nonSelectionDisclaimer: string;
  tradeoffs: readonly TradeoffPanelRow[];
  costBenefitSummaries: readonly string[];
  headline: string;
  viewHint:
    | "tradeoff_overlay"
    | "executive_comparison_dashboard"
    | "cost_benefit_heatmap"
    | "strategic_balance_timeline"
    | "competing_objective_panel";
}

export interface TradeoffPanelRow {
  tradeoffId: string;
  label: string;
  tradeoffState: StrategicTradeoffStateLabel;
  tradeoffStrength: number;
}

export interface SimulationExecutiveTradeoffContext {
  tick?: number;
  tradeoffLeverageFactor?: number;
  sacrificeStressFactor?: number;
}

export interface EvaluateExecutiveTradeoffsInput {
  topology: OperationalUniverseTopology;
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
  tradeoffContext?: SimulationExecutiveTradeoffContext;
  tick?: number;
  tradeoffStateId?: string;
  priorTradeoffFingerprints?: readonly string[];
}

export type EvaluateExecutiveTradeoffsResult =
  | { ok: true; snapshot: ExecutiveTradeoffSnapshot; panelContract: TradeoffPanelContract }
  | { ok: false; guard: TradeoffGuardResult };
