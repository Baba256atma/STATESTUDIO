/** D9:8:9 — Strategic civilization stewardship + macro-system preservation awareness types. */

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
import type { CivilizationCoordinationSnapshot } from "./civilizationCoordinationTypes";
import type { CivilizationFragilitySnapshot } from "./civilizationFragilityTypes";
import type { CivilizationWisdomSnapshot } from "./civilizationWisdomTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";
import type { InstitutionalInfluenceSnapshot } from "./institutionalInfluenceTypes";

export type StewardshipCategory =
  | "infrastructure_preservation"
  | "governance_preservation"
  | "workforce_preservation"
  | "resilience_preservation"
  | "ecosystem_preservation"
  | "continuity_preservation"
  | "sustainability_preservation"
  | "unknown";

export type StewardshipStrength = "weak" | "moderate" | "resilient" | "systemic" | "civilization_scale";

export type PreservationState =
  | "degrading"
  | "pressured"
  | "protected"
  | "reinforced"
  | "sustainably_preserved";

export type LongHorizonStewardshipObservation = {
  stewardshipId: string;
  preservationState: PreservationState;
  stewardshipStrength: StewardshipStrength;
  stewardshipCategory: StewardshipCategory;
  summary: string;
  stewardshipSignals: readonly string[];
  preservationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type MacroPreservationSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly StewardshipCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EcosystemSurvivabilityField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  survivabilityPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly StewardshipCategory[];
  generatedAt: number;
};

export type InstitutionalPreservationTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  preservationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly StewardshipCategory[];
  generatedAt: number;
};

export type CivilizationStewardshipSummary = {
  dominantPreservationState: PreservationState;
  dominantStewardshipStrength: StewardshipStrength;
  stewardshipHeadline: string;
  preservationPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CivilizationStewardshipSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  stewardshipSummary: CivilizationStewardshipSummary;
  recentObservations: readonly LongHorizonStewardshipObservation[];
  preservationSignals: readonly MacroPreservationSignal[];
  survivabilityFields: readonly EcosystemSurvivabilityField[];
  preservationTopologies: readonly InstitutionalPreservationTopology[];
};

export type CivilizationStewardshipInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  civilizationWisdomSnapshot?: CivilizationWisdomSnapshot | null;
  civilizationCoordinationSnapshot?: CivilizationCoordinationSnapshot | null;
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

export type CivilizationStewardshipResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationStewardshipSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CivilizationStewardshipStoreState = {
  observations: readonly LongHorizonStewardshipObservation[];
  snapshots: readonly CivilizationStewardshipSnapshot[];
  preservationSignals: readonly MacroPreservationSignal[];
  survivabilityFields: readonly EcosystemSurvivabilityField[];
  preservationTopologies: readonly InstitutionalPreservationTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastPreservationState: PreservationState | null;
};
