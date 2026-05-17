/**
 * D7:8:9 — Unified meta-strategic intelligence contracts.
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
import type { StrategicIntelligenceContinuityIntelligenceState } from "./strategicIntelligenceContinuityTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { UnifiedMetaStrategicGuardResult } from "./unifiedMetaStrategicGuards.ts";

export type UnifiedMetaStrategicStateLabel =
  | "coherent"
  | "adaptive"
  | "transforming"
  | "fragmented"
  | "critical";

export interface UnifiedMetaStrategicSignal {
  unifiedMetaId: string;
  affectedRegionIds: readonly string[];
  unifiedMetaState: UnifiedMetaStrategicStateLabel;
  unifiedMetaStrength: number;
  dominantUnifiedDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface CrossIntelligenceSynchronizationRecord {
  recordId: string;
  synchronizationType:
    | "resilience_equilibrium_synchronization"
    | "continuity_evolution_coherence"
    | "meta_causality_drift_interaction"
    | "governance_recovery_alignment"
    | "predictive_meta_continuity"
    | "long_horizon_strategic_coherence";
  synchronizationStrength: number;
  explanation: string;
  contributingUnifiedMetaIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface UnifiedMetaCoherenceRecord {
  recordId: string;
  coherenceType:
    | "fragmented_enterprise_cognition"
    | "disconnected_strategic_pathways"
    | "long_horizon_coherence_degradation"
    | "resilience_equilibrium_imbalance"
    | "predictive_meta_instability"
    | "strategic_ecosystem_fragmentation";
  coherenceStrength: number;
  explanation: string;
  contributingUnifiedMetaIds: readonly string[];
}

export interface EnterpriseUnifiedMetaStrategicRecord {
  recordId: string;
  cognitionDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  cognitionStrength: number;
  explanation: string;
  contributingUnifiedMetaIds: readonly string[];
}

export interface UnifiedMetaStrategicIntelligenceState {
  activeUnifiedMetaSignals: readonly UnifiedMetaStrategicSignal[];
  crossIntelligenceSynchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
  unifiedMetaCoherenceRecords: readonly UnifiedMetaCoherenceRecord[];
  enterpriseUnifiedMetaStrategicRecords: readonly EnterpriseUnifiedMetaStrategicRecord[];
  synchronizedMetaZones: readonly string[];
  fragmentedMetaZones: readonly string[];
  unifiedStrategicCoherenceScore: number;
  metaSynchronizationScore: number;
  ecosystemFragmentationScore: number;
  executiveUnifiedMetaLabel: UnifiedMetaStrategicStateLabel;
  unifiedMetaAmbiguityDisclaimer: string;
  nonAutonomousUnifiedMetaDisclaimer: string;
}

export interface UnifiedMetaStrategicSemantics {
  headline: string;
  summary: string;
  unifiedMetaSummaries: readonly string[];
  synchronizationSummaries: readonly string[];
  coherenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface UnifiedMetaStrategicSnapshot {
  unifiedMetaStateId: string;
  topologyId: string;
  continuityStateId?: string;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  tick: number;
  state: UnifiedMetaStrategicIntelligenceState;
  semantics: UnifiedMetaStrategicSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future unified meta UI contract (no rendering in D7:8:9). */
export interface UnifiedMetaStrategicPanelContract {
  unifiedMetaStateId: string;
  topologyId: string;
  unifiedStrategicCoherenceScore: number;
  executiveUnifiedMetaLabel: UnifiedMetaStrategicIntelligenceState["executiveUnifiedMetaLabel"];
  unifiedMetaAmbiguityDisclaimer: string;
  nonAutonomousUnifiedMetaDisclaimer: string;
  unifiedMetaSignals: readonly UnifiedMetaStrategicPanelRow[];
  synchronizationSummaries: readonly string[];
  headline: string;
  viewHint:
    | "unified_meta_overlay"
    | "enterprise_cognition_dashboard"
    | "strategic_coherence_heatmap"
    | "long_horizon_intelligence_timeline"
    | "unified_meta_panel";
}

export interface UnifiedMetaStrategicPanelRow {
  unifiedMetaId: string;
  unifiedMetaState: UnifiedMetaStrategicStateLabel;
  unifiedMetaStrength: number;
}

export interface SimulationUnifiedMetaStrategicContext {
  tick?: number;
  unifiedMetaLeverageFactor?: number;
  ecosystemStressFactor?: number;
}

export interface EvaluateUnifiedMetaStrategicIntelligenceInput {
  topology: OperationalUniverseTopology;
  strategicContinuityState: StrategicIntelligenceContinuityIntelligenceState;
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
  unifiedMetaContext?: SimulationUnifiedMetaStrategicContext;
  tick?: number;
  unifiedMetaStateId?: string;
  continuityStateId?: string;
  equilibriumStateId?: string;
  evolutionStateId?: string;
  resilienceStateId?: string;
  driftStateId?: string;
  metaCausalityStateId?: string;
  patternStateId?: string;
  metaStateId?: string;
  realityStateId?: string;
  priorUnifiedMetaFingerprints?: readonly string[];
}

export type EvaluateUnifiedMetaStrategicIntelligenceResult =
  | {
      ok: true;
      snapshot: UnifiedMetaStrategicSnapshot;
      panelContract: UnifiedMetaStrategicPanelContract;
    }
  | { ok: false; guard: UnifiedMetaStrategicGuardResult };
