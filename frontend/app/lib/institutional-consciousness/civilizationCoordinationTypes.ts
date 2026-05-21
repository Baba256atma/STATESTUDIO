/** D9:8:7 — Strategic civilization coordination + macro-institutional harmony awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { CivilizationAdaptationSnapshot } from "./civilizationAdaptationTypes";
import type { CivilizationContinuitySnapshot } from "./civilizationContinuityTypes";
import type { CivilizationFragilitySnapshot } from "./civilizationFragilityTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";
import type { InstitutionalInfluenceSnapshot } from "./institutionalInfluenceTypes";

export type CoordinationCategory =
  | "governance_coordination"
  | "logistics_coordination"
  | "infrastructure_coordination"
  | "workforce_coordination"
  | "resilience_coordination"
  | "ecosystem_alignment"
  | "systemic_harmony"
  | "unknown";

export type CoordinationStrength = "weak" | "moderate" | "stable" | "systemic" | "civilization_scale";

export type HarmonyState =
  | "fragmented"
  | "unstable"
  | "coordinated"
  | "harmonized"
  | "civilization_coherent";

export type CoordinationStabilityObservation = {
  coordinationId: string;
  harmonyState: HarmonyState;
  coordinationStrength: CoordinationStrength;
  coordinationCategory: CoordinationCategory;
  summary: string;
  coordinationSignals: readonly string[];
  coordinationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type InstitutionalHarmonySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly CoordinationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type MacroOperationalCoherenceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  coherencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly CoordinationCategory[];
  generatedAt: number;
};

export type EcosystemAlignmentTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly CoordinationCategory[];
  generatedAt: number;
};

export type CivilizationCoordinationSummary = {
  dominantHarmonyState: HarmonyState;
  dominantCoordinationStrength: CoordinationStrength;
  coordinationHeadline: string;
  harmonyPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CivilizationCoordinationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  coordinationSummary: CivilizationCoordinationSummary;
  recentObservations: readonly CoordinationStabilityObservation[];
  harmonySignals: readonly InstitutionalHarmonySignal[];
  coherenceFields: readonly MacroOperationalCoherenceField[];
  alignmentTopologies: readonly EcosystemAlignmentTopology[];
};

export type CivilizationCoordinationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  civilizationAdaptationSnapshot?: CivilizationAdaptationSnapshot | null;
  civilizationContinuitySnapshot?: CivilizationContinuitySnapshot | null;
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

export type CivilizationCoordinationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationCoordinationSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CivilizationCoordinationStoreState = {
  observations: readonly CoordinationStabilityObservation[];
  snapshots: readonly CivilizationCoordinationSnapshot[];
  harmonySignals: readonly InstitutionalHarmonySignal[];
  coherenceFields: readonly MacroOperationalCoherenceField[];
  alignmentTopologies: readonly EcosystemAlignmentTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastHarmonyState: HarmonyState | null;
};
