/**
 * D7:8:5 — Strategic intelligence resilience contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicIntelligenceResilienceGuardResult } from "./strategicIntelligenceResilienceGuards.ts";

export type StrategicIntelligenceResilienceStateLabel =
  | "stable"
  | "adaptive"
  | "recovering"
  | "strained"
  | "critical";

export interface StrategicIntelligenceResilienceSignal {
  resilienceId: string;
  affectedRegionIds: readonly string[];
  resilienceState: StrategicIntelligenceResilienceStateLabel;
  resilienceStrength: number;
  dominantResilienceDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonResilienceRecord {
  recordId: string;
  resilienceType:
    | "strategic_recovery_adaptation"
    | "governance_stabilization_capacity"
    | "resilience_under_pressure_behavior"
    | "continuity_preservation_structures"
    | "strategic_coherence_recovery"
    | "long_horizon_resilience_evolution";
  resilienceStrength: number;
  explanation: string;
  contributingResilienceIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicRecoveryRecord {
  recordId: string;
  recoveryType:
    | "resilience_degradation"
    | "recovery_fatigue"
    | "governance_resilience_instability"
    | "continuity_preservation_failure"
    | "strategic_exhaustion_risk"
    | "long_horizon_resilience_fragmentation";
  recoveryStrength: number;
  explanation: string;
  contributingResilienceIds: readonly string[];
}

export interface EnterpriseMetaStrategicResilienceRecord {
  recordId: string;
  resilienceDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  resilienceStrength: number;
  explanation: string;
  contributingResilienceIds: readonly string[];
}

export interface StrategicIntelligenceResilienceIntelligenceState {
  activeResilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  longHorizonResilienceRecords: readonly LongHorizonResilienceRecord[];
  strategicRecoveryRecords: readonly StrategicRecoveryRecord[];
  enterpriseMetaStrategicResilienceRecords: readonly EnterpriseMetaStrategicResilienceRecord[];
  adaptiveRecoveryZones: readonly string[];
  resilienceFailureZones: readonly string[];
  strategicResilienceCapacityScore: number;
  adaptiveRecoveryScore: number;
  recoveryPressureScore: number;
  executiveResilienceLabel: StrategicIntelligenceResilienceStateLabel;
  resilienceAmbiguityDisclaimer: string;
  nonAutonomousResilienceDisclaimer: string;
}

export interface StrategicIntelligenceResilienceSemantics {
  headline: string;
  summary: string;
  resilienceSummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  recoverySummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicIntelligenceResilienceSnapshot {
  resilienceStateId: string;
  topologyId: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicIntelligenceResilienceIntelligenceState;
  semantics: StrategicIntelligenceResilienceSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic-resilience UI contract (no rendering in D7:8:5). */
export interface StrategicIntelligenceResiliencePanelContract {
  resilienceStateId: string;
  topologyId: string;
  strategicResilienceCapacityScore: number;
  executiveResilienceLabel: StrategicIntelligenceResilienceIntelligenceState["executiveResilienceLabel"];
  resilienceAmbiguityDisclaimer: string;
  nonAutonomousResilienceDisclaimer: string;
  resilienceSignals: readonly StrategicIntelligenceResiliencePanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_resilience_overlay"
    | "long_horizon_resilience_dashboard"
    | "recovery_capacity_heatmap"
    | "resilience_evolution_timeline"
    | "enterprise_resilience_panel";
}

export interface StrategicIntelligenceResiliencePanelRow {
  resilienceId: string;
  resilienceState: StrategicIntelligenceResilienceStateLabel;
  resilienceStrength: number;
}

export interface SimulationStrategicIntelligenceResilienceContext {
  tick?: number;
  resilienceLeverageFactor?: number;
  recoveryStressFactor?: number;
}

export interface EvaluateStrategicIntelligenceResilienceInput {
  topology: OperationalUniverseTopology;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  resilienceContext?: SimulationStrategicIntelligenceResilienceContext;
  tick?: number;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorResilienceFingerprints?: readonly string[];
}

export type EvaluateStrategicIntelligenceResilienceResult =
  | {
      ok: true;
      snapshot: StrategicIntelligenceResilienceSnapshot;
      panelContract: StrategicIntelligenceResiliencePanelContract;
    }
  | { ok: false; guard: StrategicIntelligenceResilienceGuardResult };
