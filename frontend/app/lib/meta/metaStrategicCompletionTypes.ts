/**
 * D7:8:10 — Meta-strategic intelligence completion contracts.
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
import type { UnifiedMetaStrategicIntelligenceState } from "./unifiedMetaStrategicTypes.ts";
import type { PredictiveIntelligenceState } from "./metaStrategicTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { MetaStrategicCompletionGuardResult } from "./metaStrategicCompletionGuards.ts";

export type MetaStrategicCompletionStateLabel =
  | "stable"
  | "coherent"
  | "synchronized"
  | "fragmented"
  | "critical";

export interface MetaStrategicCompletionSignal {
  completionId: string;
  affectedRegionIds: readonly string[];
  completionState: MetaStrategicCompletionStateLabel;
  completionStrength: number;
  dominantCompletionDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface EnterpriseCognitionSynchronizationRecord {
  recordId: string;
  synchronizationType:
    | "enterprise_cognition_synchronization"
    | "resilience_continuity_coherence"
    | "causality_evolution_integration"
    | "equilibrium_stabilization"
    | "governance_meta_continuity"
    | "long_horizon_strategic_coherence";
  synchronizationStrength: number;
  explanation: string;
  contributingCompletionIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicWorldCoherenceRecord {
  recordId: string;
  coherenceType:
    | "enterprise_cognition_fragmentation"
    | "unstable_strategic_coherence"
    | "disconnected_meta_pathways"
    | "continuity_equilibrium_imbalance"
    | "predictive_meta_instability"
    | "long_horizon_cognition_degradation";
  coherenceStrength: number;
  explanation: string;
  contributingCompletionIds: readonly string[];
}

export interface EnterpriseMetaStrategicCompletionRecord {
  recordId: string;
  completionDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  completionStrength: number;
  explanation: string;
  contributingCompletionIds: readonly string[];
}

export interface MetaStrategicCompletionIntelligenceState {
  activeCompletionSignals: readonly MetaStrategicCompletionSignal[];
  enterpriseCognitionSynchronizationRecords: readonly EnterpriseCognitionSynchronizationRecord[];
  strategicWorldCoherenceRecords: readonly StrategicWorldCoherenceRecord[];
  enterpriseMetaStrategicCompletionRecords: readonly EnterpriseMetaStrategicCompletionRecord[];
  synchronizedMetaWorldZones: readonly string[];
  fragmentedMetaWorldZones: readonly string[];
  enterpriseMetaCoherenceScore: number;
  cognitionSynchronizationScore: number;
  worldFragmentationScore: number;
  executiveCompletionLabel: MetaStrategicCompletionStateLabel;
  completionAmbiguityDisclaimer: string;
  nonAutonomousCompletionDisclaimer: string;
}

export interface MetaStrategicCompletionSemantics {
  headline: string;
  summary: string;
  completionSummaries: readonly string[];
  synchronizationSummaries: readonly string[];
  worldCoherenceSummaries: readonly string[];
  bullets: readonly string[];
}

export interface MetaStrategicCompletionSnapshot {
  completionStateId: string;
  topologyId: string;
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
  tick: number;
  state: MetaStrategicCompletionIntelligenceState;
  semantics: MetaStrategicCompletionSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future meta-completion UI contract (no rendering in D7:8:10). */
export interface MetaStrategicCompletionPanelContract {
  completionStateId: string;
  topologyId: string;
  enterpriseMetaCoherenceScore: number;
  executiveCompletionLabel: MetaStrategicCompletionIntelligenceState["executiveCompletionLabel"];
  completionAmbiguityDisclaimer: string;
  nonAutonomousCompletionDisclaimer: string;
  completionSignals: readonly MetaStrategicCompletionPanelRow[];
  synchronizationSummaries: readonly string[];
  headline: string;
  viewHint:
    | "unified_cognition_overlay"
    | "enterprise_meta_dashboard"
    | "strategic_coherence_heatmap"
    | "long_horizon_cognition_timeline"
    | "enterprise_cognition_panel";
}

export interface MetaStrategicCompletionPanelRow {
  completionId: string;
  completionState: MetaStrategicCompletionStateLabel;
  completionStrength: number;
}

export interface SimulationMetaStrategicCompletionContext {
  tick?: number;
  completionLeverageFactor?: number;
  worldStressFactor?: number;
}

export interface EvaluateMetaStrategicCompletionInput {
  topology: OperationalUniverseTopology;
  unifiedMetaStrategicState: UnifiedMetaStrategicIntelligenceState;
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
  completionContext?: SimulationMetaStrategicCompletionContext;
  tick?: number;
  completionStateId?: string;
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
  priorCompletionFingerprints?: readonly string[];
}

export type EvaluateMetaStrategicCompletionResult =
  | {
      ok: true;
      snapshot: MetaStrategicCompletionSnapshot;
      panelContract: MetaStrategicCompletionPanelContract;
    }
  | { ok: false; guard: MetaStrategicCompletionGuardResult };
