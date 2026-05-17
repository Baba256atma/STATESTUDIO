/**
 * D7:8:3 — Strategic meta-causality intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicMetaCausalityGuardResult } from "./strategicMetaCausalityGuards.ts";

export type StrategicMetaCausalityStateLabel =
  | "localized"
  | "propagating"
  | "systemic"
  | "destabilizing"
  | "critical";

export interface StrategicMetaCausalitySignal {
  metaCausalityId: string;
  affectedRegionIds: readonly string[];
  metaCausalityState: StrategicMetaCausalityStateLabel;
  metaCausalityStrength: number;
  dominantMetaCausalDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonCausalRecord {
  recordId: string;
  causalType:
    | "strategic_force_propagation"
    | "governance_driven_causality"
    | "resilience_causality_structures"
    | "optimization_risk_causal_chains"
    | "continuity_degradation_pathways"
    | "adaptive_strategic_transformation_causes";
  causalStrength: number;
  explanation: string;
  contributingMetaCausalityIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicForcePropagationRecord {
  recordId: string;
  forceType:
    | "hidden_enterprise_strategic_drivers"
    | "systemic_causal_amplification"
    | "recursive_strategic_instability"
    | "resilience_degradation_forces"
    | "governance_causality_conflicts"
    | "long_horizon_strategic_contradictions";
  forceStrength: number;
  explanation: string;
  contributingMetaCausalityIds: readonly string[];
}

export interface EnterpriseMetaCausalityRecord {
  recordId: string;
  causalityDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  causalityStrength: number;
  explanation: string;
  contributingMetaCausalityIds: readonly string[];
}

export interface StrategicMetaCausalityIntelligenceState {
  activeMetaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  longHorizonCausalRecords: readonly LongHorizonCausalRecord[];
  strategicForcePropagationRecords: readonly StrategicForcePropagationRecord[];
  enterpriseMetaCausalityRecords: readonly EnterpriseMetaCausalityRecord[];
  strategicForceZones: readonly string[];
  systemicMetaRiskZones: readonly string[];
  metaCausalityCoherenceScore: number;
  longHorizonCausalScore: number;
  metaCausalityInstabilityScore: number;
  executiveMetaCausalityLabel: StrategicMetaCausalityStateLabel;
  metaCausalityAmbiguityDisclaimer: string;
  nonAutonomousMetaCausalityDisclaimer: string;
}

export interface StrategicMetaCausalitySemantics {
  headline: string;
  summary: string;
  metaCausalitySummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  forceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicMetaCausalitySnapshot {
  metaCausalityStateId: string;
  topologyId: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicMetaCausalityIntelligenceState;
  semantics: StrategicMetaCausalitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future meta-causality UI contract (no rendering in D7:8:3). */
export interface StrategicMetaCausalityPanelContract {
  metaCausalityStateId: string;
  topologyId: string;
  metaCausalityCoherenceScore: number;
  executiveMetaCausalityLabel: StrategicMetaCausalityIntelligenceState["executiveMetaCausalityLabel"];
  metaCausalityAmbiguityDisclaimer: string;
  nonAutonomousMetaCausalityDisclaimer: string;
  metaCausalitySignals: readonly StrategicMetaCausalityPanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "meta_causality_overlay"
    | "strategic_force_dashboard"
    | "long_horizon_causality_heatmap"
    | "enterprise_force_timeline"
    | "meta_strategic_causality_panel";
}

export interface StrategicMetaCausalityPanelRow {
  metaCausalityId: string;
  metaCausalityState: StrategicMetaCausalityStateLabel;
  metaCausalityStrength: number;
}

export interface SimulationStrategicMetaCausalityContext {
  tick?: number;
  causalityLeverageFactor?: number;
  forcePropagationStressFactor?: number;
}

export interface EvaluateStrategicMetaCausalityInput {
  topology: OperationalUniverseTopology;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  metaCausalityContext?: SimulationStrategicMetaCausalityContext;
  tick?: number;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorMetaCausalityFingerprints?: readonly string[];
}

export type EvaluateStrategicMetaCausalityResult =
  | {
      ok: true;
      snapshot: StrategicMetaCausalitySnapshot;
      panelContract: StrategicMetaCausalityPanelContract;
    }
  | { ok: false; guard: StrategicMetaCausalityGuardResult };
