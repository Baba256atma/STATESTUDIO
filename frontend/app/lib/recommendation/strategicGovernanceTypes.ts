/**
 * D7:5:6 — Executive strategic governance intelligence contracts.
 */

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
import type { StrategicGovernanceGuardResult } from "./strategicGovernanceGuards.ts";

export type StrategicGovernanceStateLabel =
  | "stable"
  | "monitoring"
  | "restricted"
  | "volatile"
  | "critical";

export interface StrategicGovernanceSignal {
  governanceId: string;
  affectedRegionIds: readonly string[];
  governanceState: StrategicGovernanceStateLabel;
  governanceStrength: number;
  dominantGovernanceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface GovernanceAlignmentRecord {
  recordId: string;
  alignmentType:
    | "recommendation_safety"
    | "oversight_stability"
    | "resilience_coherence"
    | "confidence_governance"
    | "volatility_governance"
    | "safeguard_alignment";
  alignmentStrength: number;
  explanation: string;
  contributingGovernanceIds: readonly string[];
}

export interface RecommendationSafetyRecord {
  recordId: string;
  safetyType:
    | "unstable_pathway"
    | "governance_risk_amplification"
    | "confidence_conflict"
    | "fragile_intervention"
    | "volatility_escalation"
    | "oversight_sensitive_action";
  safetyStrength: number;
  explanation: string;
  contributingGovernanceIds: readonly string[];
}

export interface ExecutiveOversightRecord {
  recordId: string;
  oversightDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  oversightStrength: number;
  explanation: string;
  contributingGovernanceIds: readonly string[];
}

export interface ExecutiveStrategicGovernanceState {
  activeGovernanceSignals: readonly StrategicGovernanceSignal[];
  governanceAlignmentRecords: readonly GovernanceAlignmentRecord[];
  recommendationSafetyRecords: readonly RecommendationSafetyRecord[];
  executiveOversightRecords: readonly ExecutiveOversightRecord[];
  restrictedRecommendationZones: readonly string[];
  executiveOversightZones: readonly string[];
  governanceStabilityScore: number;
  recommendationSafetyScore: number;
  oversightRequirementScore: number;
  executiveGovernanceLabel: "aligned" | "cautious" | "volatile" | "restricted" | "critical";
  governanceAmbiguityDisclaimer: string;
  nonEnforcementDisclaimer: string;
}

export interface ExecutiveStrategicGovernanceSemantics {
  headline: string;
  summary: string;
  governanceSummaries: readonly string[];
  alignmentSummaries: readonly string[];
  safetySummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveStrategicGovernanceSnapshot {
  governanceStateId: string;
  topologyId: string;
  memoryStateId?: string;
  tick: number;
  state: ExecutiveStrategicGovernanceState;
  semantics: ExecutiveStrategicGovernanceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic governance UI contract (no rendering in D7:5:6). */
export interface StrategicGovernancePanelContract {
  governanceStateId: string;
  topologyId: string;
  governanceStabilityScore: number;
  executiveGovernanceLabel: ExecutiveStrategicGovernanceState["executiveGovernanceLabel"];
  governanceAmbiguityDisclaimer: string;
  nonEnforcementDisclaimer: string;
  governanceSignals: readonly StrategicGovernancePanelRow[];
  safetySummaries: readonly string[];
  headline: string;
  viewHint:
    | "governance_overlay"
    | "executive_oversight_dashboard"
    | "recommendation_safety_heatmap"
    | "governance_stability_timeline"
    | "strategic_control_panel";
}

export interface StrategicGovernancePanelRow {
  governanceId: string;
  governanceState: StrategicGovernanceStateLabel;
  governanceStrength: number;
}

export interface SimulationStrategicGovernanceContext {
  tick?: number;
  governanceLeverageFactor?: number;
  oversightStressFactor?: number;
}

export interface EvaluateStrategicGovernanceInput {
  topology: OperationalUniverseTopology;
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
  governanceContext?: SimulationStrategicGovernanceContext;
  tick?: number;
  governanceStateId?: string;
  priorGovernanceFingerprints?: readonly string[];
}

export type EvaluateStrategicGovernanceResult =
  | {
      ok: true;
      snapshot: ExecutiveStrategicGovernanceSnapshot;
      panelContract: StrategicGovernancePanelContract;
    }
  | { ok: false; guard: StrategicGovernanceGuardResult };
