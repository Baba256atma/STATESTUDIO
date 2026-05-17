/**
 * D7:5:7 — Executive decision explainability contracts.
 */

import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
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
import type { ExecutiveDecisionExplainabilityGuardResult } from "./explainabilityGuards.ts";

export type ExecutiveExplainabilityStateLabel =
  | "clear"
  | "supported"
  | "uncertain"
  | "volatile"
  | "restricted";

export interface ExecutiveExplainabilitySignal {
  explanationId: string;
  relatedRecommendationId: string;
  affectedRegionIds: readonly string[];
  explainabilityState: ExecutiveExplainabilityStateLabel;
  explanationStrength: number;
  dominantExplanationDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface RecommendationTraceRecord {
  recordId: string;
  traceType:
    | "signal_to_decision"
    | "predictive_pathway"
    | "governance_alignment"
    | "evidence_mapping"
    | "ambiguity_aware"
    | "operational_causality";
  traceStrength: number;
  explanation: string;
  contributingExplanationIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface SignalToDecisionRecord {
  recordId: string;
  analysisType:
    | "weakly_supported"
    | "unclear_pathway"
    | "conflicting_evidence"
    | "unstable_reasoning"
    | "low_transparency"
    | "governance_explainability_gap";
  analysisStrength: number;
  explanation: string;
  contributingExplanationIds: readonly string[];
}

export interface ExecutiveReasoningTransparencyRecord {
  recordId: string;
  transparencyDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  transparencyStrength: number;
  explanation: string;
  contributingExplanationIds: readonly string[];
}

export interface ExecutiveExplainabilityState {
  activeExplainabilitySignals: readonly ExecutiveExplainabilitySignal[];
  recommendationTraceRecords: readonly RecommendationTraceRecord[];
  signalToDecisionRecords: readonly SignalToDecisionRecord[];
  executiveReasoningTransparencyRecords: readonly ExecutiveReasoningTransparencyRecord[];
  traceabilityZones: readonly string[];
  ambiguityExplanationZones: readonly string[];
  explanationClarityScore: number;
  traceabilityScore: number;
  reasoningTransparencyScore: number;
  executiveExplainabilityLabel: "clear" | "supported" | "ambiguous" | "volatile" | "restricted";
  explainabilityAmbiguityDisclaimer: string;
  nonOpaqueReasoningDisclaimer: string;
}

export interface ExecutiveDecisionExplainabilitySemantics {
  headline: string;
  summary: string;
  explanationSummaries: readonly string[];
  traceSummaries: readonly string[];
  signalSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveDecisionExplainabilitySnapshot {
  explainabilityStateId: string;
  topologyId: string;
  governanceStateId?: string;
  tick: number;
  state: ExecutiveExplainabilityState;
  semantics: ExecutiveDecisionExplainabilitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future explainability UI contract (no rendering in D7:5:7). */
export interface DecisionExplainabilityPanelContract {
  explainabilityStateId: string;
  topologyId: string;
  explanationClarityScore: number;
  executiveExplainabilityLabel: ExecutiveExplainabilityState["executiveExplainabilityLabel"];
  explainabilityAmbiguityDisclaimer: string;
  nonOpaqueReasoningDisclaimer: string;
  explanations: readonly DecisionExplainabilityPanelRow[];
  traceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "explainability_overlay"
    | "recommendation_trace_dashboard"
    | "signal_to_decision_map"
    | "executive_reasoning_timeline"
    | "evidence_trace_panel";
}

export interface DecisionExplainabilityPanelRow {
  explanationId: string;
  relatedRecommendationId: string;
  explainabilityState: ExecutiveExplainabilityStateLabel;
  explanationStrength: number;
}

export interface SimulationDecisionExplainabilityContext {
  tick?: number;
  explainabilityLeverageFactor?: number;
  traceStressFactor?: number;
}

export interface EvaluateDecisionExplainabilityInput {
  topology: OperationalUniverseTopology;
  governanceState: ExecutiveStrategicGovernanceState;
  memoryState: StrategicRecommendationMemoryState;
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
  explainabilityContext?: SimulationDecisionExplainabilityContext;
  tick?: number;
  explainabilityStateId?: string;
  priorExplainabilityFingerprints?: readonly string[];
}

export type EvaluateDecisionExplainabilityResult =
  | {
      ok: true;
      snapshot: ExecutiveDecisionExplainabilitySnapshot;
      panelContract: DecisionExplainabilityPanelContract;
    }
  | { ok: false; guard: ExecutiveDecisionExplainabilityGuardResult };
