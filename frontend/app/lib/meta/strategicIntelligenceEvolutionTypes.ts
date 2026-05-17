/**
 * D7:8:6 — Strategic intelligence evolution contracts.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { StrategicIntelligenceEvolutionGuardResult } from "./strategicIntelligenceEvolutionGuards.ts";

export type StrategicIntelligenceEvolutionStateLabel =
  | "stable"
  | "transforming"
  | "adaptive"
  | "accelerating"
  | "critical";

export interface StrategicIntelligenceEvolutionSignal {
  evolutionId: string;
  affectedRegionIds: readonly string[];
  evolutionState: StrategicIntelligenceEvolutionStateLabel;
  evolutionStrength: number;
  dominantEvolutionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface LongHorizonEvolutionRecord {
  recordId: string;
  evolutionType:
    | "strategic_capability_transformation"
    | "governance_evolution"
    | "resilience_adaptation_maturity"
    | "predictive_refinement"
    | "continuity_preservation_evolution"
    | "strategic_cognition_transformation";
  evolutionStrength: number;
  explanation: string;
  contributingEvolutionIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicTransformationRecord {
  recordId: string;
  transformationType:
    | "unstable_strategic_transformation"
    | "degrading_intelligence_structures"
    | "resilience_driven_adaptation"
    | "governance_evolution_instability"
    | "continuity_fragmentation_risk"
    | "long_horizon_strategic_contradiction";
  transformationStrength: number;
  explanation: string;
  contributingEvolutionIds: readonly string[];
}

export interface EnterpriseMetaStrategicEvolutionRecord {
  recordId: string;
  evolutionDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  evolutionStrength: number;
  explanation: string;
  contributingEvolutionIds: readonly string[];
}

export interface StrategicIntelligenceEvolutionIntelligenceState {
  activeEvolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  longHorizonEvolutionRecords: readonly LongHorizonEvolutionRecord[];
  strategicTransformationRecords: readonly StrategicTransformationRecord[];
  enterpriseMetaStrategicEvolutionRecords: readonly EnterpriseMetaStrategicEvolutionRecord[];
  adaptiveEvolutionZones: readonly string[];
  unstableTransformationZones: readonly string[];
  strategicEvolutionCoherenceScore: number;
  adaptiveTransformationScore: number;
  transformationPressureScore: number;
  executiveEvolutionLabel: StrategicIntelligenceEvolutionStateLabel;
  evolutionAmbiguityDisclaimer: string;
  nonAutonomousEvolutionDisclaimer: string;
}

export interface StrategicIntelligenceEvolutionSemantics {
  headline: string;
  summary: string;
  evolutionSummaries: readonly string[];
  longHorizonSummaries: readonly string[];
  transformationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface StrategicIntelligenceEvolutionSnapshot {
  evolutionStateId: string;
  topologyId: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: StrategicIntelligenceEvolutionIntelligenceState;
  semantics: StrategicIntelligenceEvolutionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic-evolution UI contract (no rendering in D7:8:6). */
export interface StrategicIntelligenceEvolutionPanelContract {
  evolutionStateId: string;
  topologyId: string;
  strategicEvolutionCoherenceScore: number;
  executiveEvolutionLabel: StrategicIntelligenceEvolutionIntelligenceState["executiveEvolutionLabel"];
  evolutionAmbiguityDisclaimer: string;
  nonAutonomousEvolutionDisclaimer: string;
  evolutionSignals: readonly StrategicIntelligenceEvolutionPanelRow[];
  longHorizonSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_evolution_overlay"
    | "transformation_dashboard"
    | "long_horizon_evolution_heatmap"
    | "strategic_maturity_timeline"
    | "enterprise_evolution_panel";
}

export interface StrategicIntelligenceEvolutionPanelRow {
  evolutionId: string;
  evolutionState: StrategicIntelligenceEvolutionStateLabel;
  evolutionStrength: number;
}

export interface SimulationStrategicIntelligenceEvolutionContext {
  tick?: number;
  evolutionLeverageFactor?: number;
  transformationStressFactor?: number;
}

export interface EvaluateStrategicIntelligenceEvolutionInput {
  topology: OperationalUniverseTopology;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  predictiveIntelligenceState: PredictiveIntelligenceState;
  simulationEvents?: readonly SimulationEvent[];
  evolutionContext?: SimulationStrategicIntelligenceEvolutionContext;
  tick?: number;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorEvolutionFingerprints?: readonly string[];
}

export type EvaluateStrategicIntelligenceEvolutionResult =
  | {
      ok: true;
      snapshot: StrategicIntelligenceEvolutionSnapshot;
      panelContract: StrategicIntelligenceEvolutionPanelContract;
    }
  | { ok: false; guard: StrategicIntelligenceEvolutionGuardResult };
