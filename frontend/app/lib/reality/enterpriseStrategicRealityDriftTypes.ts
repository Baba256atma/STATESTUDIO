/**
 * D7:7:4 — Enterprise strategic reality drift intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseStrategicRealityDriftGuardResult } from "./enterpriseStrategicRealityDriftGuards.ts";

export type EnterpriseStrategicRealityDriftStateLabel =
  | "stable"
  | "emerging"
  | "drifting"
  | "destabilizing"
  | "critical";

export interface EnterpriseStrategicRealityDriftSignal {
  driftId: string;
  affectedRegionIds: readonly string[];
  driftState: EnterpriseStrategicRealityDriftStateLabel;
  driftStrength: number;
  dominantDriftDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface DriftEvolutionRecord {
  recordId: string;
  evolutionType:
    | "gradual_operational_degradation"
    | "resilience_erosion"
    | "governance_drift"
    | "coordination_decay"
    | "dependency_accumulation"
    | "strategic_alignment_weakening";
  evolutionStrength: number;
  explanation: string;
  contributingDriftIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicCoherenceDegradationRecord {
  recordId: string;
  degradationType:
    | "hidden_strategic_instability"
    | "slow_governance_degradation"
    | "operational_alignment_drift"
    | "resilience_capacity_erosion"
    | "predictive_coherence_weakening"
    | "long_horizon_fragmentation";
  degradationStrength: number;
  explanation: string;
  contributingDriftIds: readonly string[];
}

export interface EnterpriseDriftDomainRecord {
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

export interface EnterpriseStrategicRealityDriftIntelligenceState {
  activeDriftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  driftEvolutionRecords: readonly DriftEvolutionRecord[];
  strategicCoherenceDegradationRecords: readonly StrategicCoherenceDegradationRecord[];
  enterpriseDriftDomainRecords: readonly EnterpriseDriftDomainRecord[];
  emergingDriftZones: readonly string[];
  destabilizedRealityZones: readonly string[];
  strategicCoherenceScore: number;
  driftEvolutionScore: number;
  coherenceDegradationScore: number;
  executiveDriftLabel: EnterpriseStrategicRealityDriftStateLabel;
  driftAmbiguityDisclaimer: string;
  nonAutonomousDriftDisclaimer: string;
}

export interface EnterpriseStrategicRealityDriftSemantics {
  headline: string;
  summary: string;
  driftSummaries: readonly string[];
  evolutionSummaries: readonly string[];
  degradationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseStrategicRealityDriftSnapshot {
  driftStateId: string;
  topologyId: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseStrategicRealityDriftIntelligenceState;
  semantics: EnterpriseStrategicRealityDriftSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future drift UI contract (no rendering in D7:7:4). */
export interface EnterpriseStrategicRealityDriftPanelContract {
  driftStateId: string;
  topologyId: string;
  strategicCoherenceScore: number;
  executiveDriftLabel: EnterpriseStrategicRealityDriftIntelligenceState["executiveDriftLabel"];
  driftAmbiguityDisclaimer: string;
  nonAutonomousDriftDisclaimer: string;
  driftSignals: readonly EnterpriseStrategicRealityDriftPanelRow[];
  evolutionSummaries: readonly string[];
  headline: string;
  viewHint:
    | "strategic_drift_overlay"
    | "enterprise_coherence_dashboard"
    | "long_horizon_drift_heatmap"
    | "degradation_timeline"
    | "strategic_stability_panel";
}

export interface EnterpriseStrategicRealityDriftPanelRow {
  driftId: string;
  driftState: EnterpriseStrategicRealityDriftStateLabel;
  driftStrength: number;
}

export interface SimulationStrategicRealityDriftContext {
  tick?: number;
  driftLeverageFactor?: number;
  degradationStressFactor?: number;
}

export interface EvaluateStrategicRealityDriftInput {
  topology: OperationalUniverseTopology;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  simulationEvents?: readonly SimulationEvent[];
  driftContext?: SimulationStrategicRealityDriftContext;
  tick?: number;
  driftStateId?: string;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorDriftFingerprints?: readonly string[];
}

export type EvaluateStrategicRealityDriftResult =
  | {
      ok: true;
      snapshot: EnterpriseStrategicRealityDriftSnapshot;
      panelContract: EnterpriseStrategicRealityDriftPanelContract;
    }
  | { ok: false; guard: EnterpriseStrategicRealityDriftGuardResult };
