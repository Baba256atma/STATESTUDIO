/**
 * D7:8:2 — Strategic pattern evolution intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicPatternEvolutionGuardResult } from "./strategicPatternEvolutionGuards.ts";

export type StrategicPatternStateLabel =
  | "emerging"
  | "stabilizing"
  | "adaptive"
  | "degrading"
  | "critical";

export interface StrategicPatternEvolutionSignal {
  patternId: string;
  affectedRegionIds: readonly string[];
  patternState: StrategicPatternStateLabel;
  patternStrength: number;
  dominantPatternDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonPatternRecord {
  recordId: string;
  patternType:
    | "recurring_operational_strategies"
    | "governance_behavior_patterns"
    | "resilience_adaptation_cycles"
    | "continuity_preservation_structures"
    | "optimization_risk_tradeoffs"
    | "strategic_evolution_trajectories";
  patternStrength: number;
  explanation: string;
  contributingPatternIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicPatternInstabilityRecord {
  recordId: string;
  instabilityType:
    | "degrading_strategic_behaviors"
    | "unstable_recurring_governance_patterns"
    | "long_horizon_fragility_accumulation"
    | "resilience_erosion_cycles"
    | "continuity_degradation_patterns"
    | "recursive_strategic_contradictions";
  instabilityStrength: number;
  explanation: string;
  contributingPatternIds: readonly string[];
}

export interface EnterprisePatternRecord {
  recordId: string;
  patternDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  patternStrength: number;
  explanation: string;
  contributingPatternIds: readonly string[];
}

export interface StrategicPatternEvolutionIntelligenceState {
  activePatternSignals: readonly StrategicPatternEvolutionSignal[];
  longHorizonPatternRecords: readonly LongHorizonPatternRecord[];
  patternInstabilityRecords: readonly StrategicPatternInstabilityRecord[];
  enterprisePatternRecords: readonly EnterprisePatternRecord[];
  adaptivePatternZones: readonly string[];
  unstablePatternZones: readonly string[];
  patternCoherenceScore: number;
  longHorizonPatternScore: number;
  patternInstabilityScore: number;
  executivePatternLabel: StrategicPatternStateLabel;
  patternAmbiguityDisclaimer: string;
  nonAutonomousPatternDisclaimer: string;
}

export interface StrategicPatternEvolutionSemantics {
  headline: string;
  summary: string;
  patternSummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  instabilitySummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicPatternEvolutionSnapshot {
  patternStateId: string;
  topologyId: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicPatternEvolutionIntelligenceState;
  semantics: StrategicPatternEvolutionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic-pattern UI contract (no rendering in D7:8:2). */
export interface StrategicPatternEvolutionPanelContract {
  patternStateId: string;
  topologyId: string;
  patternCoherenceScore: number;
  executivePatternLabel: StrategicPatternEvolutionIntelligenceState["executivePatternLabel"];
  patternAmbiguityDisclaimer: string;
  nonAutonomousPatternDisclaimer: string;
  patternSignals: readonly StrategicPatternEvolutionPanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_pattern_overlay"
    | "long_horizon_pattern_dashboard"
    | "recurring_behavior_heatmap"
    | "strategic_evolution_timeline"
    | "enterprise_pattern_panel";
}

export interface StrategicPatternEvolutionPanelRow {
  patternId: string;
  patternState: StrategicPatternStateLabel;
  patternStrength: number;
}

export interface SimulationStrategicPatternContext {
  tick?: number;
  patternLeverageFactor?: number;
  recurrenceStressFactor?: number;
}

export interface EvaluateStrategicPatternEvolutionInput {
  topology: OperationalUniverseTopology;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  patternContext?: SimulationStrategicPatternContext;
  tick?: number;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorPatternFingerprints?: readonly string[];
}

export type EvaluateStrategicPatternEvolutionResult =
  | {
      ok: true;
      snapshot: StrategicPatternEvolutionSnapshot;
      panelContract: StrategicPatternEvolutionPanelContract;
    }
  | { ok: false; guard: StrategicPatternEvolutionGuardResult };
