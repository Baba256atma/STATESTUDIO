/**
 * D7:5:2 — Strategic recommendation confidence contracts.
 */

import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
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
import type { ConfidenceGuardResult } from "./confidenceGuards.ts";

export type RecommendationConfidenceStateLabel =
  | "high"
  | "moderate"
  | "uncertain"
  | "volatile"
  | "low";

export interface RecommendationConfidenceSignal {
  recommendationId: string;
  affectedRegionIds: readonly string[];
  confidenceState: RecommendationConfidenceStateLabel;
  evidenceStrength: number;
  dominantConfidenceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface RecommendationUncertaintyRecord {
  recordId: string;
  regionId: string;
  uncertaintyType:
    | "predictive_instability"
    | "conflicting_drivers"
    | "volatile_operations"
    | "insufficient_evidence"
    | "divergence_amplification"
    | "intervention_assumption";
  uncertaintyStrength: number;
  explanation: string;
  contributingRecommendationIds: readonly string[];
}

export interface EvidenceStrengthRecord {
  recordId: string;
  evidenceDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "predictive_stability"
    | "systemic_equilibrium";
  evidenceStrength: number;
  explanation: string;
  contributingRecommendationIds: readonly string[];
}

export interface RecommendationConfidenceState {
  activeConfidenceSignals: readonly RecommendationConfidenceSignal[];
  recommendationUncertaintyRecords: readonly RecommendationUncertaintyRecord[];
  evidenceStrengthRecords: readonly EvidenceStrengthRecord[];
  uncertaintyZones: readonly string[];
  stableRecommendationZones: readonly string[];
  overallConfidenceScore: number;
  evidenceStabilityScore: number;
  predictiveConsistencyScore: number;
  uncertaintyAmplificationScore: number;
  recommendationConfidenceLabel: "high" | "moderate" | "uncertain" | "volatile" | "low";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveRecommendationConfidenceSemantics {
  headline: string;
  summary: string;
  confidenceSummaries: readonly string[];
  uncertaintySummaries: readonly string[];
  evidenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface RecommendationConfidenceSnapshot {
  confidenceStateId: string;
  topologyId: string;
  recommendationStateId?: string;
  tick: number;
  state: RecommendationConfidenceState;
  semantics: ExecutiveRecommendationConfidenceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future recommendation confidence UI contract (no rendering in D7:5:2). */
export interface RecommendationConfidencePanelContract {
  confidenceStateId: string;
  topologyId: string;
  overallConfidenceScore: number;
  recommendationConfidenceLabel: RecommendationConfidenceState["recommendationConfidenceLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly RecommendationConfidencePanelRow[];
  uncertaintySummaries: readonly string[];
  headline: string;
  viewHint:
    | "recommendation_confidence_overlay"
    | "executive_certainty_dashboard"
    | "uncertainty_heatmap"
    | "predictive_confidence_timeline"
    | "evidence_strength_panel";
}

export interface RecommendationConfidencePanelRow {
  recommendationId: string;
  label: string;
  confidenceState: RecommendationConfidenceStateLabel;
  evidenceStrength: number;
}

export interface SimulationRecommendationConfidenceContext {
  tick?: number;
  confidenceLeverageFactor?: number;
  ambiguityStressFactor?: number;
}

export interface EvaluateRecommendationConfidenceInput {
  topology: OperationalUniverseTopology;
  recommendationState: StrategicRecommendationState;
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
  confidenceContext?: SimulationRecommendationConfidenceContext;
  tick?: number;
  confidenceStateId?: string;
  priorConfidenceFingerprints?: readonly string[];
}

export type EvaluateRecommendationConfidenceResult =
  | { ok: true; snapshot: RecommendationConfidenceSnapshot; panelContract: RecommendationConfidencePanelContract }
  | { ok: false; guard: ConfidenceGuardResult };
