/** D9:9:3 — Executive unified strategic intent intelligence + enterprise purpose alignment runtime types. */

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

export type IntentCategory =
  | "resilience_intent"
  | "governance_intent"
  | "operational_intent"
  | "continuity_intent"
  | "adaptation_intent"
  | "stewardship_intent"
  | "strategic_growth_intent"
  | "unknown";

export type AlignmentStrength = "weak" | "moderate" | "aligned" | "unified" | "enterprise_grade";

export type IntentState =
  | "fragmented"
  | "partially_aligned"
  | "directionally_coherent"
  | "strategically_unified"
  | "enterprise_purpose_aligned";

export type PurposeAlignmentObservation = {
  intentId: string;
  intentState: IntentState;
  alignmentStrength: AlignmentStrength;
  intentCategory: IntentCategory;
  summary: string;
  alignmentSignals: readonly string[];
  alignmentRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterprisePurposeAlignmentSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly IntentCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicDirectionField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  directionPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly IntentCategory[];
  generatedAt: number;
};

export type OrganizationalIntentTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly IntentCategory[];
  generatedAt: number;
};

export type StrategicIntentSummary = {
  dominantIntentState: IntentState;
  dominantAlignmentStrength: AlignmentStrength;
  intentHeadline: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type UnifiedStrategicIntentSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  strategicIntentSummary: StrategicIntentSummary;
  recentObservations: readonly PurposeAlignmentObservation[];
  purposeAlignmentSignals: readonly EnterprisePurposeAlignmentSignal[];
  strategicDirectionFields: readonly StrategicDirectionField[];
  intentTopologies: readonly OrganizationalIntentTopology[];
};

export type UnifiedStrategicIntentInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type UnifiedStrategicIntentResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: UnifiedStrategicIntentSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type StrategicIntentStoreState = {
  observations: readonly PurposeAlignmentObservation[];
  snapshots: readonly UnifiedStrategicIntentSnapshot[];
  purposeAlignmentSignals: readonly EnterprisePurposeAlignmentSignal[];
  strategicDirectionFields: readonly StrategicDirectionField[];
  intentTopologies: readonly OrganizationalIntentTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastIntentState: IntentState | null;
};
