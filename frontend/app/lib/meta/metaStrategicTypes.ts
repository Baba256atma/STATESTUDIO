/**
 * D7:8:1 — Nexora meta-strategic intelligence foundation contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { ExecutiveCognitiveCompletionIntelligenceState } from "../cognitive/executiveCognitiveCompletionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { MetaStrategicGuardResult } from "./metaStrategicGuards.ts";

export type MetaStrategicStateLabel =
  | "stable"
  | "adaptive"
  | "transforming"
  | "fragmented"
  | "critical";

export interface MetaStrategicSignal {
  metaId: string;
  affectedRegionIds: readonly string[];
  metaState: MetaStrategicStateLabel;
  metaStrength: number;
  dominantMetaDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface StrategicEvolutionRecord {
  recordId: string;
  evolutionType:
    | "strategy_lifecycle_evolution"
    | "strategic_drift_accumulation"
    | "resilience_impact_tradeoff"
    | "governance_strategy_adaptation"
    | "optimization_stability_tension"
    | "long_horizon_strategic_transformation";
  evolutionStrength: number;
  explanation: string;
  contributingMetaIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface MetaCoherenceRecord {
  recordId: string;
  coherenceType:
    | "conflicting_strategic_trajectories"
    | "unstable_enterprise_strategy_patterns"
    | "resilience_optimization_imbalance"
    | "long_horizon_strategic_fragmentation"
    | "governance_strategy_instability"
    | "recursive_strategic_contradiction";
  coherenceStrength: number;
  explanation: string;
  contributingMetaIds: readonly string[];
}

export interface EnterpriseStrategyRecord {
  recordId: string;
  strategyDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  strategyStrength: number;
  explanation: string;
  contributingMetaIds: readonly string[];
}

export interface PredictiveIntelligenceState {
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
}

export interface MetaStrategicIntelligenceState {
  activeMetaSignals: readonly MetaStrategicSignal[];
  strategicEvolutionRecords: readonly StrategicEvolutionRecord[];
  metaCoherenceRecords: readonly MetaCoherenceRecord[];
  enterpriseStrategyRecords: readonly EnterpriseStrategyRecord[];
  adaptiveStrategyZones: readonly string[];
  unstableMetaZones: readonly string[];
  strategicMetaCoherenceScore: number;
  strategicEvolutionScore: number;
  metaInstabilityScore: number;
  executiveMetaLabel: MetaStrategicStateLabel;
  metaAmbiguityDisclaimer: string;
  nonAutonomousMetaDisclaimer: string;
}

export interface MetaStrategicSemantics {
  headline: string;
  summary: string;
  metaSummaries: readonly string[];
  evolutionSummaries: readonly string[];
  coherenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface MetaStrategicSnapshot {
  metaStateId: string;
  topologyId: string;
  realityStateId?: string;
  tick: number;
  state: MetaStrategicIntelligenceState;
  semantics: MetaStrategicSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future meta-strategic UI contract (no rendering in D7:8:1). */
export interface MetaStrategicPanelContract {
  metaStateId: string;
  topologyId: string;
  strategicMetaCoherenceScore: number;
  executiveMetaLabel: MetaStrategicIntelligenceState["executiveMetaLabel"];
  metaAmbiguityDisclaimer: string;
  nonAutonomousMetaDisclaimer: string;
  metaSignals: readonly MetaStrategicPanelRow[];
  evolutionSummaries: readonly string[];
  headline: string;
  viewHint:
    | "meta_strategy_overlay"
    | "strategic_evolution_dashboard"
    | "strategy_coherence_heatmap"
    | "long_horizon_strategy_timeline"
    | "enterprise_meta_panel";
}

export interface MetaStrategicPanelRow {
  metaId: string;
  metaState: MetaStrategicStateLabel;
  metaStrength: number;
}

export interface SimulationMetaStrategicContext {
  tick?: number;
  metaLeverageFactor?: number;
  evolutionStressFactor?: number;
}

export interface EvaluateMetaStrategicIntelligenceInput {
  topology: OperationalUniverseTopology;
  strategicRealityState: StrategicRealityIntelligenceState;
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  executiveOrchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  metaContext?: SimulationMetaStrategicContext;
  tick?: number;
  metaStateId?: string;
  realityStateId?: string;
  priorMetaFingerprints?: readonly string[];
}

export type EvaluateMetaStrategicIntelligenceResult =
  | {
      ok: true;
      snapshot: MetaStrategicSnapshot;
      panelContract: MetaStrategicPanelContract;
    }
  | { ok: false; guard: MetaStrategicGuardResult };
