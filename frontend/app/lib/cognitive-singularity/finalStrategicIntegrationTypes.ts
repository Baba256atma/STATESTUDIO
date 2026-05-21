/** D9:9:9 — Final strategic integration + total cognitive runtime convergence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { CivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { EnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationTypes";
import type { EnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularityTypes";
import type { EnterpriseStrategicIdentitySnapshot } from "./strategicIdentityTypes";
import type { EnterpriseStrategicWillSnapshot } from "./strategicWillTypes";
import type { UnifiedStrategicIntentSnapshot } from "./strategicIntentTypes";
import type { UnifiedStrategicCoherenceSnapshot } from "./strategicCoherenceTypes";
import type { EnterpriseStrategicEquilibriumSnapshot } from "./strategicEquilibriumTypes";
import type { EnterpriseStrategicResonanceSnapshot } from "./strategicResonanceTypes";

export type IntegrationCategory =
  | "runtime_convergence"
  | "strategic_alignment"
  | "operational_unification"
  | "memory_identity_integration"
  | "foresight_action_integration"
  | "consensus_governance_integration"
  | "institutional_awareness_integration"
  | "unknown";

export type IntegrationStrength = "weak" | "moderate" | "integrated" | "unified" | "enterprise_grade";

export type IntegrationState =
  | "fragmented"
  | "partially_integrated"
  | "converging"
  | "unified"
  | "fully_integrated";

export type StrategicIntegrationObservation = {
  integrationId: string;
  integrationState: IntegrationState;
  integrationStrength: IntegrationStrength;
  integrationCategory: IntegrationCategory;
  summary: string;
  integrationSignals: readonly string[];
  fragmentationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type TotalRuntimeConvergenceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly IntegrationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EnterpriseCognitiveIntegrationField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  integrationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly IntegrationCategory[];
  generatedAt: number;
};

export type RuntimeFragmentationIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  fragmentationSeverity: "low" | "moderate" | "high";
  linkedCategories: readonly IntegrationCategory[];
  generatedAt: number;
};

export type FinalIntegrationSummary = {
  dominantIntegrationState: IntegrationState;
  dominantIntegrationStrength: IntegrationStrength;
  integrationHeadline: string;
  convergencePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type FinalStrategicIntegrationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  finalIntegrationSummary: FinalIntegrationSummary;
  recentObservations: readonly StrategicIntegrationObservation[];
  totalRuntimeConvergenceSignals: readonly TotalRuntimeConvergenceSignal[];
  enterpriseCognitiveIntegrationFields: readonly EnterpriseCognitiveIntegrationField[];
  fragmentationIndicators: readonly RuntimeFragmentationIndicator[];
};

export type FinalStrategicIntegrationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  enterpriseStrategicResonanceSnapshot?: EnterpriseStrategicResonanceSnapshot | null;
  enterpriseStrategicEquilibriumSnapshot?: EnterpriseStrategicEquilibriumSnapshot | null;
  unifiedStrategicCoherenceSnapshot?: UnifiedStrategicCoherenceSnapshot | null;
  enterpriseStrategicWillSnapshot?: EnterpriseStrategicWillSnapshot | null;
  enterpriseStrategicIdentitySnapshot?: EnterpriseStrategicIdentitySnapshot | null;
  unifiedStrategicIntentSnapshot?: UnifiedStrategicIntentSnapshot | null;
  awarenessSynchronizationSnapshot?: EnterpriseAwarenessSynchronizationSnapshot | null;
  cognitiveSingularitySnapshot?: EnterpriseCognitiveSingularitySnapshot | null;
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

export type FinalStrategicIntegrationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: FinalStrategicIntegrationSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type FinalStrategicIntegrationStoreState = {
  observations: readonly StrategicIntegrationObservation[];
  snapshots: readonly FinalStrategicIntegrationSnapshot[];
  totalRuntimeConvergenceSignals: readonly TotalRuntimeConvergenceSignal[];
  enterpriseCognitiveIntegrationFields: readonly EnterpriseCognitiveIntegrationField[];
  fragmentationIndicators: readonly RuntimeFragmentationIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastIntegrationState: IntegrationState | null;
};
