/**
 * D7:8:8 — Strategic intelligence continuity contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { StrategicIntelligenceEquilibriumIntelligenceState } from "./strategicIntelligenceEquilibriumTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicIntelligenceContinuityGuardResult } from "./strategicIntelligenceContinuityGuards.ts";

export type StrategicIntelligenceContinuityStateLabel =
  | "stable"
  | "adaptive"
  | "recovering"
  | "fragmenting"
  | "critical";

export interface StrategicIntelligenceContinuitySignal {
  continuityId: string;
  affectedRegionIds: readonly string[];
  continuityState: StrategicIntelligenceContinuityStateLabel;
  continuityStrength: number;
  dominantContinuityDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonContinuityRecord {
  recordId: string;
  continuityType:
    | "strategic_continuity_preservation"
    | "governance_continuity_adaptation"
    | "resilience_driven_continuity_stabilization"
    | "continuity_under_pressure_behavior"
    | "strategic_persistence_structures"
    | "long_horizon_strategic_survival_pathways";
  continuityStrength: number;
  explanation: string;
  contributingContinuityIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface ContinuityFragmentationRecord {
  recordId: string;
  fragmentationType:
    | "strategic_continuity_degradation"
    | "long_horizon_fragmentation"
    | "resilience_exhaustion_continuity"
    | "governance_continuity_instability"
    | "strategic_persistence_failure"
    | "continuity_collapse_pathway";
  fragmentationStrength: number;
  explanation: string;
  contributingContinuityIds: readonly string[];
}

export interface EnterpriseMetaStrategicContinuityRecord {
  recordId: string;
  continuityDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  continuityStrength: number;
  explanation: string;
  contributingContinuityIds: readonly string[];
}

export interface StrategicIntelligenceContinuityIntelligenceState {
  activeContinuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  continuityFragmentationRecords: readonly ContinuityFragmentationRecord[];
  enterpriseMetaStrategicContinuityRecords: readonly EnterpriseMetaStrategicContinuityRecord[];
  preservedContinuityZones: readonly string[];
  continuityFailureZones: readonly string[];
  longHorizonStrategicContinuityScore: number;
  adaptiveContinuityScore: number;
  fragmentationPressureScore: number;
  executiveContinuityLabel: StrategicIntelligenceContinuityStateLabel;
  continuityAmbiguityDisclaimer: string;
  nonAutonomousContinuityDisclaimer: string;
}

export interface StrategicIntelligenceContinuitySemantics {
  headline: string;
  summary: string;
  continuitySummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  fragmentationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicIntelligenceContinuitySnapshot {
  continuityStateId: string;
  topologyId: string;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicIntelligenceContinuityIntelligenceState;
  semantics: StrategicIntelligenceContinuitySemantics;
  fingerprint: string;
  builtAt: string;
}

export interface StrategicIntelligenceContinuityPanelContract {
  continuityStateId: string;
  topologyId: string;
  longHorizonStrategicContinuityScore: number;
  executiveContinuityLabel: StrategicIntelligenceContinuityIntelligenceState["executiveContinuityLabel"];
  continuityAmbiguityDisclaimer: string;
  nonAutonomousContinuityDisclaimer: string;
  continuitySignals: readonly StrategicIntelligenceContinuityPanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_continuity_overlay"
    | "long_horizon_continuity_dashboard"
    | "continuity_heatmap"
    | "strategic_persistence_timeline"
    | "enterprise_continuity_panel";
}

export interface StrategicIntelligenceContinuityPanelRow {
  continuityId: string;
  continuityState: StrategicIntelligenceContinuityStateLabel;
  continuityStrength: number;
}

export interface SimulationStrategicIntelligenceContinuityContext {
  tick?: number;
  continuityLeverageFactor?: number;
  disruptionStressFactor?: number;
}

export interface EvaluateStrategicIntelligenceContinuityInput {
  topology: OperationalUniverseTopology;
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
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
  continuityContext?: SimulationStrategicIntelligenceContinuityContext;
  tick?: number;
  continuityStateId?: string;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorContinuityFingerprints?: readonly string[];
}

export type EvaluateStrategicIntelligenceContinuityResult =
  | {
      ok: true;
      snapshot: StrategicIntelligenceContinuitySnapshot;
      panelContract: StrategicIntelligenceContinuityPanelContract;
    }
  | { ok: false; guard: StrategicIntelligenceContinuityGuardResult };
