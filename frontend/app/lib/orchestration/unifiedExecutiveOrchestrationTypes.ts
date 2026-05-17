/**
 * D7:5:10 — Unified executive strategic orchestration contracts.
 */

import type { ExecutiveStrategicConsensusState } from "../recommendation/executiveConsensusTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "../recommendation/recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "../recommendation/multiStrategyComparisonTypes.ts";
import type { ExecutiveTradeoffState } from "../recommendation/tradeoffAnalysisTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
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
import type { UnifiedExecutiveOrchestrationGuardResult } from "./orchestrationGuards.ts";

export type UnifiedOrchestrationStateLabel =
  | "stable"
  | "synchronized"
  | "strained"
  | "volatile"
  | "critical";

export interface UnifiedExecutiveOrchestrationSignal {
  orchestrationId: string;
  affectedRegionIds: readonly string[];
  orchestrationState: UnifiedOrchestrationStateLabel;
  orchestrationStrength: number;
  dominantOrchestrationDrivers?: readonly string[];
  executiveLabel?: string;
}

export interface CrossIntelligenceSynchronizationRecord {
  recordId: string;
  synchronizationType:
    | "recommendation_sync"
    | "governance_alignment"
    | "predictive_advisory_coordination"
    | "resilience_harmonization"
    | "orchestration_conflict"
    | "executive_cognition_stability";
  synchronizationStrength: number;
  explanation: string;
  contributingOrchestrationIds: readonly string[];
  affectedRegionIds: readonly string[];
}

export interface OrchestrationStabilityRecord {
  recordId: string;
  instabilityType:
    | "cross_system_instability"
    | "orchestration_fragmentation"
    | "recommendation_governance_conflict"
    | "predictive_advisory_divergence"
    | "executive_cognition_overload"
    | "coherence_degradation";
  instabilityStrength: number;
  explanation: string;
  contributingOrchestrationIds: readonly string[];
}

export interface UnifiedExecutiveCognitionRecord {
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
  contributingOrchestrationIds: readonly string[];
}

export interface UnifiedExecutiveOrchestrationState {
  activeOrchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  crossIntelligenceSynchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
  orchestrationStabilityRecords: readonly OrchestrationStabilityRecord[];
  unifiedExecutiveCognitionRecords: readonly UnifiedExecutiveCognitionRecord[];
  synchronizedIntelligenceZones: readonly string[];
  orchestrationFragilityZones: readonly string[];
  orchestrationCoherenceScore: number;
  crossSystemSynchronizationScore: number;
  orchestrationInstabilityScore: number;
  executiveOrchestrationLabel: UnifiedOrchestrationStateLabel;
  orchestrationAmbiguityDisclaimer: string;
  nonAutonomousAuthorityDisclaimer: string;
}

export interface UnifiedExecutiveOrchestrationSemantics {
  headline: string;
  summary: string;
  orchestrationSummaries: readonly string[];
  synchronizationSummaries: readonly string[];
  instabilitySummaries: readonly string[];
  bullets: readonly string[];
}

export interface UnifiedExecutiveOrchestrationSnapshot {
  orchestrationStateId: string;
  topologyId: string;
  consensusStateId?: string;
  tick: number;
  state: UnifiedExecutiveOrchestrationState;
  semantics: UnifiedExecutiveOrchestrationSemantics;
  fingerprint: string;
  builtAt: string;
}

/** Future unified orchestration UI contract (no rendering in D7:5:10). */
export interface UnifiedOrchestrationPanelContract {
  orchestrationStateId: string;
  topologyId: string;
  orchestrationCoherenceScore: number;
  executiveOrchestrationLabel: UnifiedExecutiveOrchestrationState["executiveOrchestrationLabel"];
  orchestrationAmbiguityDisclaimer: string;
  nonAutonomousAuthorityDisclaimer: string;
  orchestrationSignals: readonly UnifiedOrchestrationPanelRow[];
  synchronizationSummaries: readonly string[];
  headline: string;
  viewHint:
    | "orchestration_overlay"
    | "executive_cognition_dashboard"
    | "cross_intelligence_sync_map"
    | "orchestration_stability_timeline"
    | "unified_strategic_panel";
}

export interface UnifiedOrchestrationPanelRow {
  orchestrationId: string;
  orchestrationState: UnifiedOrchestrationStateLabel;
  orchestrationStrength: number;
}

export interface SimulationUnifiedOrchestrationContext {
  tick?: number;
  orchestrationLeverageFactor?: number;
  instabilityStressFactor?: number;
}

export interface EvaluateUnifiedExecutiveOrchestrationInput {
  topology: OperationalUniverseTopology;
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
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
  orchestrationContext?: SimulationUnifiedOrchestrationContext;
  tick?: number;
  orchestrationStateId?: string;
  priorOrchestrationFingerprints?: readonly string[];
}

export type EvaluateUnifiedExecutiveOrchestrationResult =
  | {
      ok: true;
      snapshot: UnifiedExecutiveOrchestrationSnapshot;
      panelContract: UnifiedOrchestrationPanelContract;
    }
  | { ok: false; guard: UnifiedExecutiveOrchestrationGuardResult };
