/**
 * D7:7:3 — Enterprise operational causality intelligence contracts.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { EnterpriseOperationalCausalityGuardResult } from "./enterpriseOperationalCausalityGuards.ts";

export type EnterpriseOperationalCausalityStateLabel =
  | "localized"
  | "propagating"
  | "systemic"
  | "unstable"
  | "critical";

export interface EnterpriseOperationalCausalitySignal {
  causalityId: string;
  affectedRegionIds: readonly string[];
  causalityState: EnterpriseOperationalCausalityStateLabel;
  causalityStrength: number;
  dominantCausalDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface RootCauseRecord {
  recordId: string;
  rootCauseType:
    | "operational_root_cause"
    | "governance_origin_instability"
    | "dependency_driven_propagation"
    | "resilience_breakdown_pathway"
    | "strategic_pressure_accumulation"
    | "organizational_causality_structure";
  causeStrength: number;
  explanation: string;
  contributingCausalityIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface CausalPropagationRecord {
  recordId: string;
  propagationType:
    | "cascading_operational_consequence"
    | "systemic_causal_amplification"
    | "hidden_propagation_pathway"
    | "dependency_escalation"
    | "governance_consequence_instability"
    | "resilience_collapse_chain";
  propagationStrength: number;
  explanation: string;
  contributingCausalityIds: readonly string[];
}

export interface EnterpriseConsequenceRecord {
  recordId: string;
  consequenceDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  consequenceStrength: number;
  explanation: string;
  contributingCausalityIds: readonly string[];
}

export interface EnterpriseOperationalCausalityIntelligenceState {
  activeCausalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  rootCauseRecords: readonly RootCauseRecord[];
  causalPropagationRecords: readonly CausalPropagationRecord[];
  enterpriseConsequenceRecords: readonly EnterpriseConsequenceRecord[];
  rootCauseZones: readonly string[];
  propagationRiskZones: readonly string[];
  causalityClarityScore: number;
  rootCauseClarityScore: number;
  causalPropagationScore: number;
  executiveCausalityLabel: EnterpriseOperationalCausalityStateLabel;
  causalityAmbiguityDisclaimer: string;
  nonAutonomousCausalityDisclaimer: string;
}

export interface EnterpriseOperationalCausalitySemantics {
  headline: string;
  summary: string;
  causalitySummaries: readonly string[];
  rootCauseSummaries: readonly string[];
  propagationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface EnterpriseOperationalCausalitySnapshot {
  causalityStateId: string;
  topologyId: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  tick: number;
  state: EnterpriseOperationalCausalityIntelligenceState;
  semantics: EnterpriseOperationalCausalitySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future causality UI contract (no rendering in D7:7:3). */
export interface EnterpriseOperationalCausalityPanelContract {
  causalityStateId: string;
  topologyId: string;
  causalityClarityScore: number;
  executiveCausalityLabel: EnterpriseOperationalCausalityIntelligenceState["executiveCausalityLabel"];
  causalityAmbiguityDisclaimer: string;
  nonAutonomousCausalityDisclaimer: string;
  causalitySignals: readonly EnterpriseOperationalCausalityPanelRow[];
  rootCauseSummaries: readonly string[];
  headline: string;
  viewHint:
    | "causality_overlay"
    | "root_cause_dashboard"
    | "propagation_heatmap"
    | "operational_consequence_timeline"
    | "enterprise_causality_panel";
}

export interface EnterpriseOperationalCausalityPanelRow {
  causalityId: string;
  causalityState: EnterpriseOperationalCausalityStateLabel;
  causalityStrength: number;
}

export interface SimulationOperationalCausalityContext {
  tick?: number;
  causalityLeverageFactor?: number;
  propagationStressFactor?: number;
}

export interface EvaluateOperationalCausalityInput {
  topology: OperationalUniverseTopology;
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
  causalityContext?: SimulationOperationalCausalityContext;
  tick?: number;
  causalityStateId?: string;
  synchronizationStateId?: string;
  realityStateId?: string;
  priorCausalityFingerprints?: readonly string[];
}

export type EvaluateOperationalCausalityResult =
  | {
      ok: true;
      snapshot: EnterpriseOperationalCausalitySnapshot;
      panelContract: EnterpriseOperationalCausalityPanelContract;
    }
  | { ok: false; guard: EnterpriseOperationalCausalityGuardResult };
