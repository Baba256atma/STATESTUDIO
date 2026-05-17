/**
 * D7:5:8 — Executive strategic advisory intelligence contracts.
 */

import type { ExecutiveExplainabilityState } from "./executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { ExecutiveTradeoffState } from "./tradeoffAnalysisTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { SimulationEvent } from "../simulation/simulationEventTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { ExecutiveStrategicAdvisoryGuardResult } from "./advisoryGuards.ts";

export type ExecutiveStrategicAdvisoryStateLabel =
  | "informational"
  | "strategic"
  | "preventive"
  | "stabilizing"
  | "critical";

export interface ExecutiveStrategicAdvisorySignal {
  advisoryId: string;
  relatedRecommendationId?: string;
  affectedRegionIds: readonly string[];
  advisoryState: ExecutiveStrategicAdvisoryStateLabel;
  advisoryStrength: number;
  dominantAdvisoryDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface ExecutiveGuidanceSynthesisRecord {
  recordId: string;
  synthesisType:
    | "strategic_guidance"
    | "executive_context"
    | "resilience_framing"
    | "stabilization_priority"
    | "operational_narrative"
    | "future_preparedness";
  synthesisStrength: number;
  explanation: string;
  contributingAdvisoryIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface StrategicContextRecord {
  recordId: string;
  contextType:
    | "executive_priority"
    | "stabilization_pathway"
    | "resilience_opportunity"
    | "governance_sensitive"
    | "advisory_conflict"
    | "future_readiness";
  contextStrength: number;
  explanation: string;
  contributingAdvisoryIds: readonly string[];
}

export interface ExecutiveAdvisoryDomainRecord {
  recordId: string;
  advisoryDomain:
    | "operations"
    | "logistics"
    | "finance"
    | "recovery"
    | "strategic_momentum"
    | "systemic_equilibrium";
  advisoryStrength: number;
  explanation: string;
  contributingAdvisoryIds: readonly string[];
}

export interface ExecutiveStrategicAdvisoryState {
  activeAdvisories: readonly ExecutiveStrategicAdvisorySignal[];
  executiveGuidanceSynthesisRecords: readonly ExecutiveGuidanceSynthesisRecord[];
  strategicContextRecords: readonly StrategicContextRecord[];
  executiveAdvisoryDomainRecords: readonly ExecutiveAdvisoryDomainRecord[];
  executivePriorityZones: readonly string[];
  strategicAdvisoryZones: readonly string[];
  advisoryClarityScore: number;
  strategicCoherenceScore: number;
  actionabilityScore: number;
  executiveAdvisoryLabel: "informational" | "strategic" | "preventive" | "stabilizing" | "critical";
  advisoryAmbiguityDisclaimer: string;
  nonAutonomousAuthorityDisclaimer: string;
}

export interface ExecutiveStrategicAdvisorySemantics {
  headline: string;
  summary: string;
  advisorySummaries: readonly string[];
  guidanceSummaries: readonly string[];
  contextSummaries: readonly string[];
  bullets: readonly string[];
}

export interface ExecutiveStrategicAdvisorySnapshot {
  advisoryStateId: string;
  topologyId: string;
  explainabilityStateId?: string;
  tick: number;
  state: ExecutiveStrategicAdvisoryState;
  semantics: ExecutiveStrategicAdvisorySemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future strategic advisory UI contract (no rendering in D7:5:8). */
export interface StrategicAdvisoryPanelContract {
  advisoryStateId: string;
  topologyId: string;
  advisoryClarityScore: number;
  executiveAdvisoryLabel: ExecutiveStrategicAdvisoryState["executiveAdvisoryLabel"];
  advisoryAmbiguityDisclaimer: string;
  nonAutonomousAuthorityDisclaimer: string;
  advisories: readonly StrategicAdvisoryPanelRow[];
  guidanceSummaries: readonly string[];
  headline: string;
  viewHint:
    | "advisory_overlay"
    | "executive_guidance_dashboard"
    | "strategic_priority_heatmap"
    | "advisory_timeline"
    | "future_readiness_panel";
}

export interface StrategicAdvisoryPanelRow {
  advisoryId: string;
  advisoryState: ExecutiveStrategicAdvisoryStateLabel;
  advisoryStrength: number;
}

export interface SimulationExecutiveAdvisoryContext {
  tick?: number;
  advisoryLeverageFactor?: number;
  priorityStressFactor?: number;
}

export interface EvaluateExecutiveAdvisoryInput {
  topology: OperationalUniverseTopology;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  memoryState: StrategicRecommendationMemoryState;
  comparisonState: ExecutiveMultiStrategyState;
  tradeoffState: ExecutiveTradeoffState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  foresightState: PredictiveExecutiveForesightState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  simulationEvents?: readonly SimulationEvent[];
  advisoryContext?: SimulationExecutiveAdvisoryContext;
  tick?: number;
  advisoryStateId?: string;
  priorAdvisoryFingerprints?: readonly string[];
}

export type EvaluateExecutiveAdvisoryResult =
  | {
      ok: true;
      snapshot: ExecutiveStrategicAdvisorySnapshot;
      panelContract: StrategicAdvisoryPanelContract;
    }
  | { ok: false; guard: ExecutiveStrategicAdvisoryGuardResult };
