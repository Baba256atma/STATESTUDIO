/** D9:9:4 — Enterprise strategic identity intelligence + organizational self-consistency awareness types. */

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
import type { UnifiedStrategicIntentSnapshot } from "./strategicIntentTypes";

export type IdentityCategory =
  | "resilience_identity"
  | "governance_identity"
  | "operational_identity"
  | "innovation_identity"
  | "continuity_identity"
  | "stewardship_identity"
  | "strategic_growth_identity"
  | "unknown";

export type ConsistencyLevel = "weak" | "moderate" | "aligned" | "strong" | "enterprise_grade";

export type IdentityState =
  | "fragmented"
  | "drifting"
  | "partially_consistent"
  | "self_consistent"
  | "strategically_integrated";

export type IdentityAlignmentObservation = {
  identityId: string;
  identityState: IdentityState;
  consistencyLevel: ConsistencyLevel;
  identityCategory: IdentityCategory;
  summary: string;
  consistencySignals: readonly string[];
  driftRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OrganizationalSelfConsistencySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly IdentityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicIdentityField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  consistencyPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly IdentityCategory[];
  generatedAt: number;
};

export type OrganizationalDriftIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  driftSeverity: "low" | "moderate" | "high";
  linkedCategories: readonly IdentityCategory[];
  generatedAt: number;
};

export type StrategicIdentitySummary = {
  dominantIdentityState: IdentityState;
  dominantConsistencyLevel: ConsistencyLevel;
  identityHeadline: string;
  consistencyPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseStrategicIdentitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  strategicIdentitySummary: StrategicIdentitySummary;
  recentObservations: readonly IdentityAlignmentObservation[];
  selfConsistencySignals: readonly OrganizationalSelfConsistencySignal[];
  strategicIdentityFields: readonly StrategicIdentityField[];
  driftIndicators: readonly OrganizationalDriftIndicator[];
};

export type EnterpriseStrategicIdentityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type EnterpriseStrategicIdentityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseStrategicIdentitySnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type StrategicIdentityStoreState = {
  observations: readonly IdentityAlignmentObservation[];
  snapshots: readonly EnterpriseStrategicIdentitySnapshot[];
  selfConsistencySignals: readonly OrganizationalSelfConsistencySignal[];
  strategicIdentityFields: readonly StrategicIdentityField[];
  driftIndicators: readonly OrganizationalDriftIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastIdentityState: IdentityState | null;
};
