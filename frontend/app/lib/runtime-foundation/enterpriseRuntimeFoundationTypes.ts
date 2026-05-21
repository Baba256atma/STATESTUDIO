/** D9:10:1 — Final enterprise intelligence runtime foundation + MVP strategic readiness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { CivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { FinalStrategicIntelligenceSnapshot } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeTypes";

export type RuntimeFoundationCategory =
  | "runtime_stability"
  | "orchestration_reliability"
  | "cognition_governance"
  | "bounded_execution"
  | "operational_safety"
  | "explainability_reliability"
  | "executive_readiness"
  | "unknown";

export type EnterpriseRuntimeFoundationStatus =
  | "unstable"
  | "stabilizing"
  | "operational"
  | "hardened"
  | "mvp_ready";

export type RuntimeReliabilityLevel =
  | "weak"
  | "moderate"
  | "reliable"
  | "stable"
  | "enterprise_grade";

export type RuntimeReliabilityObservation = {
  observationId: string;
  category: RuntimeFoundationCategory;
  reliabilityLevel: RuntimeReliabilityLevel;
  headline: string;
  active: boolean;
  generatedAt: number;
};

export type RuntimeOperationalHealth = {
  level: RuntimeReliabilityLevel;
  integrityState: string;
  foundationHeadline: string;
  readinessPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseRuntimeGovernanceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly RuntimeFoundationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type RuntimeFoundationSummary = {
  singularityRuntimeState: string;
  institutionalRuntimeState: string;
  orchestrationState: string;
  governanceState: string;
  explainabilityState: string;
  executiveInteractionState: string;
  primaryOperationalRisk: string;
};

export type MVPStrategicReadinessSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  runtimeFoundationId: string;
  runtimeStatus: EnterpriseRuntimeFoundationStatus;
  reliabilityLevel: RuntimeReliabilityLevel;
  summary: string;
  readinessSignals: readonly string[];
  operationalRisks: readonly string[];
  confidence: number;
  activeFoundationCategories: readonly RuntimeFoundationCategory[];
  reliabilityObservations: readonly RuntimeReliabilityObservation[];
  runtimeOperationalHealth: RuntimeOperationalHealth;
  runtimeFoundationSummary: RuntimeFoundationSummary;
  governanceSignals: readonly EnterpriseRuntimeGovernanceSignal[];
};

export type EnterpriseRuntimeFoundationHistoryEntry = {
  entryId: string;
  reliabilityLevel: RuntimeReliabilityLevel;
  runtimeStatus: EnterpriseRuntimeFoundationStatus;
  headline: string;
  generatedAt: number;
};

export type EnterpriseRuntimeFoundationState = {
  readinessSnapshots: readonly MVPStrategicReadinessSnapshot[];
  reliabilityObservations: readonly RuntimeReliabilityObservation[];
  foundationHistory: readonly EnterpriseRuntimeFoundationHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: EnterpriseRuntimeFoundationStatus | null;
};

export type EnterpriseRuntimeFoundationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  finalStrategicIntelligenceSnapshot?: FinalStrategicIntelligenceSnapshot | null;
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
  runtimeStable?: boolean;
  now?: number;
};

export type EnterpriseRuntimeFoundationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: MVPStrategicReadinessSnapshot | null;
  activeFoundationCategoryCount: number;
  storeSignature: string;
};
