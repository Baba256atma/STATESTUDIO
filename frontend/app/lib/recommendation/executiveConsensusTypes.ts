/**
 * D7:5:9 — Executive strategic consensus intelligence contracts.
 */

import type { ExecutiveStrategicAdvisoryState } from "./executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "./executiveExplainabilityTypes.ts";
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
import type { ExecutiveStrategicConsensusGuardResult } from "./consensusGuards.ts";

export type ExecutiveConsensusStateLabel =
  | "aligned"
  | "emerging"
  | "fragmented"
  | "volatile"
  | "critical";

export interface ExecutiveConsensusSignal {
  consensusId: string;
  affectedRegionIds: readonly string[];
  consensusState: ExecutiveConsensusStateLabel;
  consensusStrength: number;
  dominantConsensusDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface ExecutiveAlignmentRecord {
  recordId: string;
  alignmentType:
    | "strategic_alignment"
    | "operational_coherence"
    | "consensus_stabilization"
    | "fragmentation_escalation"
    | "resilience_alignment"
    | "executive_synchronization";
  alignmentStrength: number;
  explanation: string;
  contributingConsensusIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface ConsensusFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "unstable_alignment"
    | "strategic_fragmentation"
    | "competing_recovery_priorities"
    | "governance_coherence_instability"
    | "operational_consensus_gap"
    | "divergence_volatility";
  fragmentationStrength: number;
  explanation: string;
  contributingConsensusIds: readonly string[];
}

export interface StrategicCoherenceRecord {
  recordId: string;
  coherenceDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  coherenceStrength: number;
  explanation: string;
  contributingConsensusIds: readonly string[];
}

export interface ExecutiveStrategicConsensusState {
  activeConsensusSignals: readonly ExecutiveConsensusSignal[];
  executiveAlignmentRecords: readonly ExecutiveAlignmentRecord[];
  consensusFragmentationRecords: readonly ConsensusFragmentationRecord[];
  strategicCoherenceRecords: readonly StrategicCoherenceRecord[];
  consensusStabilityZones: readonly string[];
  fragmentationZones: readonly string[];
  strategicAlignmentScore: number;
  executiveCoherenceScore: number;
  fragmentationEscalationScore: number;
  executiveConsensusLabel: "aligned" | "emerging" | "fragmented" | "volatile" | "critical";
  consensusAmbiguityDisclaimer: string;
  nonManipulationDisclaimer: string;
}

export interface ExecutiveStrategicConsensusSemantics {
  headline: string;
  summary: string;
  consensusSummaries: readonly string[];
  alignmentSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveStrategicConsensusSnapshot {
  consensusStateId: string;
  topologyId: string;
  advisoryStateId?: string;
  tick: number;
  state: ExecutiveStrategicConsensusState;
  semantics: ExecutiveStrategicConsensusSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic consensus UI contract (no rendering in D7:5:9). */
export interface StrategicConsensusPanelContract {
  consensusStateId: string;
  topologyId: string;
  strategicAlignmentScore: number;
  executiveConsensusLabel: ExecutiveStrategicConsensusState["executiveConsensusLabel"];
  consensusAmbiguityDisclaimer: string;
  nonManipulationDisclaimer: string;
  consensusSignals: readonly StrategicConsensusPanelRow[];
  alignmentSummaries: readonly string[];
  headline: string;
  viewHint:
    | "consensus_overlay"
    | "executive_alignment_dashboard"
    | "fragmentation_heatmap"
    | "strategic_coherence_timeline"
    | "recovery_alignment_panel";
}

export interface StrategicConsensusPanelRow {
  consensusId: string;
  consensusState: ExecutiveConsensusStateLabel;
  consensusStrength: number;
}

export interface SimulationStrategicConsensusContext {
  tick?: number;
  consensusLeverageFactor?: number;
  fragmentationStressFactor?: number;
}

export interface EvaluateStrategicConsensusInput {
  topology: OperationalUniverseTopology;
  advisoryState: ExecutiveStrategicAdvisoryState;
  explainabilityState: ExecutiveExplainabilityState;
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
  consensusContext?: SimulationStrategicConsensusContext;
  tick?: number;
  consensusStateId?: string;
  priorConsensusFingerprints?: readonly string[];
}

export type EvaluateStrategicConsensusResult =
  | {
      ok: true;
      snapshot: ExecutiveStrategicConsensusSnapshot;
      panelContract: StrategicConsensusPanelContract;
    }
  | { ok: false; guard: ExecutiveStrategicConsensusGuardResult };
