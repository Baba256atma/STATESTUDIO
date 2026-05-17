/**
 * D7:7:2 — Enterprise operational reality synchronization contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseRealitySynchronizationGuardResult } from "./enterpriseRealitySynchronizationGuards.ts";

export type EnterpriseRealitySynchronizationStateLabel =
  | "aligned"
  | "stable"
  | "drifting"
  | "fragmented"
  | "critical";

export interface EnterpriseRealitySynchronizationSignal {
  synchronizationId: string;
  affectedRegionIds: readonly string[];
  synchronizationState: EnterpriseRealitySynchronizationStateLabel;
  synchronizationStrength: number;
  dominantSynchronizationDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface CrossDomainSynchronizationRecord {
  recordId: string;
  syncType:
    | "operational_domain_sync"
    | "recovery_logistics_coordination"
    | "governance_state_alignment"
    | "predictive_continuity_coherence"
    | "resilience_synchronization"
    | "enterprise_state_continuity";
  syncStrength: number;
  explanation: string;
  contributingSynchronizationIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface OperationalDriftRecord {
  recordId: string;
  driftType:
    | "cross_domain_operational_drift"
    | "synchronization_degradation"
    | "fragmented_enterprise_continuity"
    | "governance_alignment_instability"
    | "predictive_synchronization_conflict"
    | "operational_state_divergence";
  driftStrength: number;
  explanation: string;
  contributingSynchronizationIds: readonly string[];
}

export interface EnterpriseContinuityRecord {
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
  contributingSynchronizationIds: readonly string[];
}

export interface EnterpriseRealitySynchronizationIntelligenceState {
  activeSynchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  crossDomainSynchronizationRecords: readonly CrossDomainSynchronizationRecord[];
  operationalDriftRecords: readonly OperationalDriftRecord[];
  enterpriseContinuityRecords: readonly EnterpriseContinuityRecord[];
  synchronizedOperationalZones: readonly string[];
  operationalDriftZones: readonly string[];
  synchronizationCoherenceScore: number;
  crossDomainSyncScore: number;
  operationalDriftScore: number;
  executiveSynchronizationLabel: EnterpriseRealitySynchronizationStateLabel;
  synchronizationAmbiguityDisclaimer: string;
  nonAutonomousSynchronizationDisclaimer: string;
}

export interface EnterpriseRealitySynchronizationSemantics {
  headline: string;
  summary: string;
  synchronizationSummaries: readonly string[];
  alignmentSummaries: readonly string[];
  driftSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseRealitySynchronizationSnapshot {
  synchronizationStateId: string;
  topologyId: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseRealitySynchronizationIntelligenceState;
  semantics: EnterpriseRealitySynchronizationSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future synchronization UI contract (no rendering in D7:7:2). */
export interface EnterpriseRealitySynchronizationPanelContract {
  synchronizationStateId: string;
  topologyId: string;
  synchronizationCoherenceScore: number;
  executiveSynchronizationLabel: EnterpriseRealitySynchronizationIntelligenceState["executiveSynchronizationLabel"];
  synchronizationAmbiguityDisclaimer: string;
  nonAutonomousSynchronizationDisclaimer: string;
  synchronizationSignals: readonly EnterpriseRealitySynchronizationPanelRow[];
  alignmentSummaries: readonly string[];
  headline: string;
  viewHint:
    | "operational_synchronization_overlay"
    | "enterprise_alignment_dashboard"
    | "drift_heatmap"
    | "synchronization_timeline"
    | "cross_domain_continuity_panel";
}

export interface EnterpriseRealitySynchronizationPanelRow {
  synchronizationId: string;
  synchronizationState: EnterpriseRealitySynchronizationStateLabel;
  synchronizationStrength: number;
}

export interface SimulationRealitySynchronizationContext {
  tick?: number;
  synchronizationLeverageFactor?: number;
  driftStressFactor?: number;
}

export interface EvaluateEnterpriseRealitySynchronizationInput {
  topology: OperationalUniverseTopology;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  simulationEvents?: readonly SimulationEvent[];
  synchronizationContext?: SimulationRealitySynchronizationContext;
  tick?: number;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorSynchronizationFingerprints?: readonly string[];
}

export type EvaluateEnterpriseRealitySynchronizationResult =
  | {
      ok: true;
      snapshot: EnterpriseRealitySynchronizationSnapshot;
      panelContract: EnterpriseRealitySynchronizationPanelContract;
    }
  | { ok: false; guard: EnterpriseRealitySynchronizationGuardResult };
