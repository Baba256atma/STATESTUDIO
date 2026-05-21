/** D9:9:7 — Enterprise strategic equilibrium intelligence + cognitive balance stabilization types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { CivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { EnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationTypes";
import type { EnterpriseStrategicIdentitySnapshot } from "./strategicIdentityTypes";
import type { EnterpriseStrategicWillSnapshot } from "./strategicWillTypes";
import type { UnifiedStrategicIntentSnapshot } from "./strategicIntentTypes";
import type { UnifiedStrategicCoherenceSnapshot } from "./strategicCoherenceTypes";

export type EquilibriumCategory =
  | "resilience_speed_balance"
  | "governance_adaptability_balance"
  | "consensus_diversity_balance"
  | "foresight_action_balance"
  | "confidence_uncertainty_balance"
  | "continuity_growth_balance"
  | "stability_innovation_balance"
  | "unknown";

export type BalanceStrength = "weak" | "moderate" | "balanced" | "stable" | "enterprise_grade";

export type EquilibriumState =
  | "imbalanced"
  | "unstable"
  | "rebalancing"
  | "balanced"
  | "strategically_stable";

export type TotalSystemBalanceObservation = {
  equilibriumId: string;
  equilibriumState: EquilibriumState;
  balanceStrength: BalanceStrength;
  equilibriumCategory: EquilibriumCategory;
  summary: string;
  balanceSignals: readonly string[];
  imbalanceRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CognitiveBalanceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly EquilibriumCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EquilibriumStabilityField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  balancePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly EquilibriumCategory[];
  generatedAt: number;
};

export type StrategicImbalanceIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  imbalanceSeverity: "low" | "moderate" | "high";
  linkedCategories: readonly EquilibriumCategory[];
  generatedAt: number;
};

export type StrategicEquilibriumSummary = {
  dominantEquilibriumState: EquilibriumState;
  dominantBalanceStrength: BalanceStrength;
  equilibriumHeadline: string;
  balancePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseStrategicEquilibriumSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  strategicEquilibriumSummary: StrategicEquilibriumSummary;
  recentObservations: readonly TotalSystemBalanceObservation[];
  cognitiveBalanceSignals: readonly CognitiveBalanceSignal[];
  equilibriumStabilityFields: readonly EquilibriumStabilityField[];
  imbalanceIndicators: readonly StrategicImbalanceIndicator[];
};

export type EnterpriseStrategicEquilibriumInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  unifiedStrategicCoherenceSnapshot?: UnifiedStrategicCoherenceSnapshot | null;
  enterpriseStrategicWillSnapshot?: EnterpriseStrategicWillSnapshot | null;
  enterpriseStrategicIdentitySnapshot?: EnterpriseStrategicIdentitySnapshot | null;
  unifiedStrategicIntentSnapshot?: UnifiedStrategicIntentSnapshot | null;
  awarenessSynchronizationSnapshot?: EnterpriseAwarenessSynchronizationSnapshot | null;
  unifiedInstitutionalConsciousnessSnapshot?: CivilizationScaleEnterpriseSnapshot | null;
  unifiedConsensusSnapshot?: DistributedExecutiveCognitionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  operationalTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  cognitionConverged?: boolean;
  now?: number;
};

export type EnterpriseStrategicEquilibriumResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseStrategicEquilibriumSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type StrategicEquilibriumStoreState = {
  observations: readonly TotalSystemBalanceObservation[];
  snapshots: readonly EnterpriseStrategicEquilibriumSnapshot[];
  cognitiveBalanceSignals: readonly CognitiveBalanceSignal[];
  equilibriumStabilityFields: readonly EquilibriumStabilityField[];
  imbalanceIndicators: readonly StrategicImbalanceIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastEquilibriumState: EquilibriumState | null;
};
