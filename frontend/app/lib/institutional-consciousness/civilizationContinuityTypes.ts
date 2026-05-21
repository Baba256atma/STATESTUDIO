/** D9:8:5 — Strategic civilization continuity + macro-operational sustainability awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { CivilizationFragilitySnapshot } from "./civilizationFragilityTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";
import type { InstitutionalInfluenceSnapshot } from "./institutionalInfluenceTypes";

export type ContinuityCategory =
  | "infrastructure_continuity"
  | "workforce_continuity"
  | "governance_continuity"
  | "logistics_continuity"
  | "resilience_continuity"
  | "ecosystem_sustainability"
  | "institutional_survivability"
  | "unknown";

export type ContinuityStrength = "weak" | "moderate" | "stable" | "resilient" | "civilization_scale";

export type SustainabilityState =
  | "fragile"
  | "pressured"
  | "adaptive"
  | "sustainable"
  | "continuity_preserved";

export type EcosystemSurvivabilityObservation = {
  continuityId: string;
  sustainabilityState: SustainabilityState;
  continuityStrength: ContinuityStrength;
  continuityCategory: ContinuityCategory;
  summary: string;
  continuitySignals: readonly string[];
  sustainabilityRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type MacroSustainabilitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ContinuityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type LongHorizonResilienceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  resiliencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly ContinuityCategory[];
  generatedAt: number;
};

export type OperationalContinuityTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  continuityPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly ContinuityCategory[];
  generatedAt: number;
};

export type CivilizationContinuitySummary = {
  dominantSustainabilityState: SustainabilityState;
  dominantContinuityStrength: ContinuityStrength;
  continuityHeadline: string;
  survivabilityPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CivilizationContinuitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  continuitySummary: CivilizationContinuitySummary;
  recentObservations: readonly EcosystemSurvivabilityObservation[];
  sustainabilitySignals: readonly MacroSustainabilitySignal[];
  resilienceFields: readonly LongHorizonResilienceField[];
  continuityTopologies: readonly OperationalContinuityTopology[];
};

export type CivilizationContinuityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  institutionalInfluenceSnapshot?: InstitutionalInfluenceSnapshot | null;
  civilizationFragilitySnapshot?: CivilizationFragilitySnapshot | null;
  ecosystemSynchronizationSnapshot?: EcosystemSynchronizationSnapshot | null;
  institutionalConsciousnessSnapshot?: InstitutionalConsciousnessSnapshot | null;
  unifiedConsensusSnapshot?: DistributedExecutiveCognitionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  operationalTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type CivilizationContinuityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationContinuitySnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CivilizationContinuityStoreState = {
  observations: readonly EcosystemSurvivabilityObservation[];
  snapshots: readonly CivilizationContinuitySnapshot[];
  sustainabilitySignals: readonly MacroSustainabilitySignal[];
  resilienceFields: readonly LongHorizonResilienceField[];
  continuityTopologies: readonly OperationalContinuityTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastSustainabilityState: SustainabilityState | null;
};
