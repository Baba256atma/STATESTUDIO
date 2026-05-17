/**
 * D7:4:4 — Predictive cascading consequence contracts.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulationEventTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { CascadeGuardResult } from "./cascadeGuards.ts";

export type PredictiveCascadeSignalState =
  | "localized"
  | "propagating"
  | "amplifying"
  | "stabilizing"
  | "critical";

/** Optional D7:4:3 inflection surface when strategic inflection layer is wired. */
export interface StrategicInflectionState {
  activeInflectionSignals: readonly {
    signalId: string;
    affectedRegionIds: readonly string[];
    inflectionSeverity: number;
  }[];
  inflectionPressureScore: number;
  criticalInflectionZones: readonly string[];
  strategicInflectionLabel: "stable" | "strained" | "transitioning" | "critical";
}

export interface PredictiveCascadeSignal {
  signalId: string;
  originatingRegionIds: readonly string[];
  affectedRegionIds: readonly string[];
  cascadeState: PredictiveCascadeSignalState;
  propagationIntensity: number;
  hopDepth: number;
  dominantCascadeDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface SecondaryTertiaryConsequenceRecord {
  recordId: string;
  originRegionId: string;
  consequenceRegionId: string;
  consequenceTier: "secondary" | "tertiary";
  consequenceStrength: number;
  explanation: string;
  contributingSignalIds: readonly string[];
}

export interface FutureAmplificationRecord {
  recordId: string;
  regionId: string;
  amplificationType: "instability" | "recovery_ripple" | "pressure_chain" | "equilibrium_drift";
  amplificationStrength: number;
  explanation: string;
}

export interface PredictiveCascadeState {
  activeCascadeSignals: readonly PredictiveCascadeSignal[];
  secondaryTertiaryConsequenceRecords: readonly SecondaryTertiaryConsequenceRecord[];
  futureAmplificationRecords: readonly FutureAmplificationRecord[];
  amplificationZones: readonly string[];
  stabilizationZones: readonly string[];
  cascadePropagationScore: number;
  cascadeAmplificationScore: number;
  cascadeStabilizationScore: number;
  predictiveCascadeLabel: "localized" | "propagating" | "amplifying" | "stabilizing" | "critical";
  uncertaintyDisclaimer: string;
}

export interface ExecutiveCascadeSemantics {
  headline: string;
  summary: string;
  signalSummaries: readonly string[];
  consequenceSummaries: readonly string[];
  amplificationSummaries: readonly string[];
  bullets: readonly string[];
}

export interface PredictiveCascadeSnapshot {
  cascadeStateId: string;
  topologyId: string;
  trajectoryStateId?: string;
  divergenceStateId?: string;
  tick: number;
  state: PredictiveCascadeState;
  semantics: ExecutiveCascadeSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future cascade UI contract (no rendering in D7:4:4). */
export interface CascadePanelContract {
  cascadeStateId: string;
  topologyId: string;
  cascadePropagationScore: number;
  predictiveCascadeLabel: PredictiveCascadeState["predictiveCascadeLabel"];
  uncertaintyDisclaimer: string;
  signals: readonly CascadePanelSignalRow[];
  consequenceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "cascade_overlay"
    | "propagation_heatmap"
    | "chain_reaction_dashboard"
    | "executive_cascade_timeline"
    | "stabilization_ripple_panel";
}

export interface CascadePanelSignalRow {
  signalId: string;
  label: string;
  cascadeState: PredictiveCascadeSignalState;
  propagationIntensity: number;
}

export interface SimulationPredictiveCascadeContext {
  tick?: number;
  cascadeAmplificationFactor?: number;
  propagationStressFactor?: number;
}

export interface EvaluatePredictiveCascadesInput {
  topology: OperationalUniverseTopology;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  inflectionState?: StrategicInflectionState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  coordinationState?: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  simulationEvents?: readonly SimulationEvent[];
  cascadeContext?: SimulationPredictiveCascadeContext;
  tick?: number;
  cascadeStateId?: string;
  priorCascadeFingerprints?: readonly string[];
}

export type EvaluatePredictiveCascadesResult =
  | { ok: true; snapshot: PredictiveCascadeSnapshot; panelContract: CascadePanelContract }
  | { ok: false; guard: CascadeGuardResult };
