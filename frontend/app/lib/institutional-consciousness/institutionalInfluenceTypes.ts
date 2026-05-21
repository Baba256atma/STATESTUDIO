/** D9:8:4 — Strategic institutional influence + civilization-scale operational impact awareness types. */

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

export type InfluenceCategory =
  | "economic_influence"
  | "infrastructure_influence"
  | "workforce_influence"
  | "governance_influence"
  | "logistics_influence"
  | "resilience_influence"
  | "fragility_influence"
  | "unknown";

export type InfluenceStrength = "weak" | "moderate" | "strong" | "systemic" | "civilization_scale";

export type ImpactState =
  | "localized"
  | "distributed"
  | "ecosystem_active"
  | "systemically_influential"
  | "civilization_scale_impact";

export type MacroInfluenceObservation = {
  influenceId: string;
  impactState: ImpactState;
  influenceStrength: InfluenceStrength;
  influenceCategory: InfluenceCategory;
  summary: string;
  influenceSignals: readonly string[];
  impactRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CivilizationImpactSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly InfluenceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type OperationalInfluenceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  influencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly InfluenceCategory[];
  generatedAt: number;
};

export type EcosystemImpactTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  impactPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly InfluenceCategory[];
  generatedAt: number;
};

export type InstitutionalImpactSummary = {
  dominantImpactState: ImpactState;
  dominantInfluenceStrength: InfluenceStrength;
  impactHeadline: string;
  ecosystemInfluencePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type InstitutionalInfluenceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  impactSummary: InstitutionalImpactSummary;
  recentObservations: readonly MacroInfluenceObservation[];
  impactSignals: readonly CivilizationImpactSignal[];
  influenceFields: readonly OperationalInfluenceField[];
  impactTopologies: readonly EcosystemImpactTopology[];
};

export type InstitutionalInfluenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type InstitutionalInfluenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalInfluenceSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type InstitutionalInfluenceStoreState = {
  observations: readonly MacroInfluenceObservation[];
  snapshots: readonly InstitutionalInfluenceSnapshot[];
  impactSignals: readonly CivilizationImpactSignal[];
  influenceFields: readonly OperationalInfluenceField[];
  impactTopologies: readonly EcosystemImpactTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastImpactState: ImpactState | null;
};
