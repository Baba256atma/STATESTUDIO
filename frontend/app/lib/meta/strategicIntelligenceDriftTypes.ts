/**
 * D7:8:4 — Strategic intelligence drift contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicIntelligenceDriftGuardResult } from "./strategicIntelligenceDriftGuards.ts";

export type StrategicIntelligenceDriftStateLabel =
  | "stable"
  | "emerging"
  | "drifting"
  | "destabilizing"
  | "critical";

export interface StrategicIntelligenceDriftSignal {
  driftId: string;
  affectedRegionIds: readonly string[];
  driftState: StrategicIntelligenceDriftStateLabel;
  driftStrength: number;
  dominantDriftDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonIntelligenceDriftRecord {
  recordId: string;
  driftType:
    | "strategic_coherence_degradation"
    | "resilience_erosion"
    | "governance_drift"
    | "predictive_confidence_instability"
    | "continuity_weakening"
    | "long_horizon_strategic_fragmentation";
  driftStrength: number;
  explanation: string;
  contributingDriftIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicCoherenceDegradationRecord {
  recordId: string;
  degradationType:
    | "degrading_strategic_intelligence"
    | "hidden_long_horizon_instability"
    | "predictive_overconfidence_drift"
    | "governance_coherence_erosion"
    | "resilience_degradation_pathways"
    | "recursive_strategic_contradictions";
  degradationStrength: number;
  explanation: string;
  contributingDriftIds: readonly string[];
}

export interface EnterpriseStrategicDriftRecord {
  recordId: string;
  driftDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  driftStrength: number;
  explanation: string;
  contributingDriftIds: readonly string[];
}

export interface StrategicIntelligenceDriftIntelligenceState {
  activeDriftSignals: readonly StrategicIntelligenceDriftSignal[];
  longHorizonIntelligenceDriftRecords: readonly LongHorizonIntelligenceDriftRecord[];
  strategicCoherenceDegradationRecords: readonly StrategicCoherenceDegradationRecord[];
  enterpriseStrategicDriftRecords: readonly EnterpriseStrategicDriftRecord[];
  emergingDriftZones: readonly string[];
  degradedStrategicZones: readonly string[];
  strategicIntelligenceCoherenceScore: number;
  longHorizonDriftScore: number;
  strategicDriftInstabilityScore: number;
  executiveDriftLabel: StrategicIntelligenceDriftStateLabel;
  driftAmbiguityDisclaimer: string;
  nonAutonomousDriftDisclaimer: string;
}

export interface StrategicIntelligenceDriftSemantics {
  headline: string;
  summary: string;
  driftSummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  degradationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicIntelligenceDriftSnapshot {
  driftStateId: string;
  topologyId: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicIntelligenceDriftIntelligenceState;
  semantics: StrategicIntelligenceDriftSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic-drift UI contract (no rendering in D7:8:4). */
export interface StrategicIntelligenceDriftPanelContract {
  driftStateId: string;
  topologyId: string;
  strategicIntelligenceCoherenceScore: number;
  executiveDriftLabel: StrategicIntelligenceDriftIntelligenceState["executiveDriftLabel"];
  driftAmbiguityDisclaimer: string;
  nonAutonomousDriftDisclaimer: string;
  driftSignals: readonly StrategicIntelligenceDriftPanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_drift_overlay"
    | "intelligence_coherence_dashboard"
    | "long_horizon_drift_heatmap"
    | "strategic_degradation_timeline"
    | "meta_strategic_drift_panel";
}

export interface StrategicIntelligenceDriftPanelRow {
  driftId: string;
  driftState: StrategicIntelligenceDriftStateLabel;
  driftStrength: number;
}

export interface SimulationStrategicIntelligenceDriftContext {
  tick?: number;
  driftLeverageFactor?: number;
  coherenceStressFactor?: number;
}

export interface EvaluateStrategicIntelligenceDriftInput {
  topology: OperationalUniverseTopology;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  driftContext?: SimulationStrategicIntelligenceDriftContext;
  tick?: number;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorDriftFingerprints?: readonly string[];
}

export type EvaluateStrategicIntelligenceDriftResult =
  | {
      ok: true;
      snapshot: StrategicIntelligenceDriftSnapshot;
      panelContract: StrategicIntelligenceDriftPanelContract;
    }
  | { ok: false; guard: StrategicIntelligenceDriftGuardResult };
