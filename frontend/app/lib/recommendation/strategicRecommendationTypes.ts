/**
 * D7:5:1 — Autonomous strategic recommendation contracts.
 */

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
import type { RecommendationGuardResult } from "./recommendationGuards.ts";

export type StrategicRecommendationStateLabel =
  | "informational"
  | "preventive"
  | "stabilizing"
  | "adaptive"
  | "critical";

export interface StrategicRecommendationSignal {
  recommendationId: string;
  affectedRegionIds: readonly string[];
  recommendationState: StrategicRecommendationStateLabel;
  recommendationStrength: number;
  dominantRecommendationDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface InterventionImpactRecord {
  recordId: string;
  regionId: string;
  impactType:
    | "stabilization_leverage"
    | "fragility_reduction"
    | "recovery_acceleration"
    | "equilibrium_restoration"
    | "cascade_mitigation";
  impactStrength: number;
  explanation: string;
  contributingRecommendationIds: readonly string[];
}

export interface ExecutiveRecommendationInfluenceRecord {
  recordId: string;
  influenceDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  influenceStrength: number;
  explanation: string;
  contributingRecommendationIds: readonly string[];
}

export interface StrategicRecommendationState {
  activeRecommendations: readonly StrategicRecommendationSignal[];
  interventionImpactRecords: readonly InterventionImpactRecord[];
  executiveRecommendationInfluenceRecords: readonly ExecutiveRecommendationInfluenceRecord[];
  stabilizationRecommendationZones: readonly string[];
  criticalInterventionZones: readonly string[];
  resilienceSupportZones: readonly string[];
  recommendationConfidenceScore: number;
  stabilizationLeverageScore: number;
  interventionRiskScore: number;
  strategicRecommendationLabel:
    | "informational"
    | "preventive"
    | "stabilizing"
    | "adaptive"
    | "critical";
  uncertaintyDisclaimer: string;
  nonExecutionDisclaimer: string;
}

export interface ExecutiveRecommendationSemantics {
  headline: string;
  summary: string;
  recommendationSummaries: readonly string[];
  interventionSummaries: readonly string[];
  influenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicRecommendationSnapshot {
  recommendationStateId: string;
  topologyId: string;
  foresightStateId?: string;
  tick: number;
  state: StrategicRecommendationState;
  semantics: ExecutiveRecommendationSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future recommendation UI contract (no rendering in D7:5:1). */
export interface RecommendationPanelContract {
  recommendationStateId: string;
  topologyId: string;
  recommendationConfidenceScore: number;
  strategicRecommendationLabel: StrategicRecommendationState["strategicRecommendationLabel"];
  uncertaintyDisclaimer: string;
  nonExecutionDisclaimer: string;
  recommendations: readonly RecommendationPanelRow[];
  interventionSummaries: readonly string[];
  headline: string;
  viewHint:
    | "recommendation_overlay"
    | "executive_recommendation_dashboard"
    | "intervention_heatmap"
    | "stabilization_opportunity_panel"
    | "recommendation_timeline";
}

export interface RecommendationPanelRow {
  recommendationId: string;
  label: string;
  recommendationState: StrategicRecommendationStateLabel;
  recommendationStrength: number;
}

export interface SimulationStrategicRecommendationContext {
  tick?: number;
  recommendationLeverageFactor?: number;
  interventionStressFactor?: number;
}

export interface GenerateStrategicRecommendationsInput {
  topology: OperationalUniverseTopology;
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
  recommendationContext?: SimulationStrategicRecommendationContext;
  tick?: number;
  recommendationStateId?: string;
  priorRecommendationFingerprints?: readonly string[];
}

export type GenerateStrategicRecommendationsResult =
  | { ok: true; snapshot: StrategicRecommendationSnapshot; panelContract: RecommendationPanelContract }
  | { ok: false; guard: RecommendationGuardResult };
