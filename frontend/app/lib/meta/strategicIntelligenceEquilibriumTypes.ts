/**
 * D7:8:7 — Strategic intelligence equilibrium contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicIntelligenceEquilibriumGuardResult } from "./strategicIntelligenceEquilibriumGuards.ts";

export type StrategicIntelligenceEquilibriumStateLabel =
  | "balanced"
  | "stabilizing"
  | "strained"
  | "destabilizing"
  | "critical";

export interface StrategicIntelligenceEquilibriumSignal {
  equilibriumId: string;
  affectedRegionIds: readonly string[];
  equilibriumState: StrategicIntelligenceEquilibriumStateLabel;
  equilibriumStrength: number;
  dominantEquilibriumDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonEquilibriumRecord {
  recordId: string;
  equilibriumType:
    | "strategic_balance_preservation"
    | "governance_equilibrium_stability"
    | "resilience_balance_capacity"
    | "predictive_equilibrium_coherence"
    | "evolutionary_balance_structures"
    | "long_horizon_systemic_equilibrium";
  equilibriumStrength: number;
  explanation: string;
  contributingEquilibriumIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicBalanceRecord {
  recordId: string;
  balanceType:
    | "equilibrium_degradation"
    | "balance_fatigue"
    | "governance_equilibrium_instability"
    | "systemic_imbalance_risk"
    | "strategic_destabilization_risk"
    | "long_horizon_equilibrium_fragmentation";
  balanceStrength: number;
  explanation: string;
  contributingEquilibriumIds: readonly string[];
}

export interface EnterpriseMetaStrategicEquilibriumRecord {
  recordId: string;
  equilibriumDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  equilibriumStrength: number;
  explanation: string;
  contributingEquilibriumIds: readonly string[];
}

export interface StrategicIntelligenceEquilibriumIntelligenceState {
  activeEquilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  longHorizonEquilibriumRecords: readonly LongHorizonEquilibriumRecord[];
  strategicBalanceRecords: readonly StrategicBalanceRecord[];
  enterpriseMetaStrategicEquilibriumRecords: readonly EnterpriseMetaStrategicEquilibriumRecord[];
  balancedEquilibriumZones: readonly string[];
  destabilizingEquilibriumZones: readonly string[];
  strategicEquilibriumCoherenceScore: number;
  systemicBalanceScore: number;
  equilibriumPressureScore: number;
  executiveEquilibriumLabel: StrategicIntelligenceEquilibriumStateLabel;
  equilibriumAmbiguityDisclaimer: string;
  nonAutonomousEquilibriumDisclaimer: string;
}

export interface StrategicIntelligenceEquilibriumSemantics {
  headline: string;
  summary: string;
  equilibriumSummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  balanceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicIntelligenceEquilibriumSnapshot {
  equilibriumStateId: string;
  topologyId: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicIntelligenceEquilibriumIntelligenceState;
  semantics: StrategicIntelligenceEquilibriumSemantics;
  fingerprint: string;
  builtAt: string;
}

export interface StrategicIntelligenceEquilibriumPanelContract {
  equilibriumStateId: string;
  topologyId: string;
  strategicEquilibriumCoherenceScore: number;
  executiveEquilibriumLabel: StrategicIntelligenceEquilibriumIntelligenceState["executiveEquilibriumLabel"];
  equilibriumAmbiguityDisclaimer: string;
  nonAutonomousEquilibriumDisclaimer: string;
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumPanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_equilibrium_overlay"
    | "balance_dashboard"
    | "long_horizon_equilibrium_heatmap"
    | "systemic_balance_timeline"
    | "enterprise_equilibrium_panel";
}

export interface StrategicIntelligenceEquilibriumPanelRow {
  equilibriumId: string;
  equilibriumState: StrategicIntelligenceEquilibriumStateLabel;
  equilibriumStrength: number;
}

export interface SimulationStrategicIntelligenceEquilibriumContext {
  tick?: number;
  equilibriumLeverageFactor?: number;
  balanceStressFactor?: number;
}

export interface EvaluateStrategicIntelligenceEquilibriumInput {
  topology: OperationalUniverseTopology;
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  equilibriumContext?: SimulationStrategicIntelligenceEquilibriumContext;
  tick?: number;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorEquilibriumFingerprints?: readonly string[];
}

export type EvaluateStrategicIntelligenceEquilibriumResult =
  | {
      ok: true;
      snapshot: StrategicIntelligenceEquilibriumSnapshot;
      panelContract: StrategicIntelligenceEquilibriumPanelContract;
    }
  | { ok: false; guard: StrategicIntelligenceEquilibriumGuardResult };
