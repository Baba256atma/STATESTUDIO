/** D9:9:5 — Unified enterprise strategic will intelligence + cross-system directional commitment types. */

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
import type { UnifiedStrategicIntentSnapshot } from "./strategicIntentTypes";

export type CommitmentCategory =
  | "resilience_commitment"
  | "governance_commitment"
  | "operational_commitment"
  | "continuity_commitment"
  | "adaptation_commitment"
  | "stewardship_commitment"
  | "growth_commitment"
  | "unknown";

export type CommitmentStrength =
  | "weak"
  | "moderate"
  | "committed"
  | "strongly_committed"
  | "enterprise_grade";

export type WillState =
  | "fragmented"
  | "hesitant"
  | "partially_committed"
  | "directionally_committed"
  | "strategically_committed";

export type EnterpriseCommitmentObservation = {
  willId: string;
  willState: WillState;
  commitmentStrength: CommitmentStrength;
  commitmentCategory: CommitmentCategory;
  summary: string;
  commitmentSignals: readonly string[];
  fragmentationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type DirectionalCommitmentSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly CommitmentCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type CrossSystemCommitmentField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  commitmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly CommitmentCategory[];
  generatedAt: number;
};

export type StrategicWillFragmentationIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  fragmentationSeverity: "low" | "moderate" | "high";
  linkedCategories: readonly CommitmentCategory[];
  generatedAt: number;
};

export type StrategicWillSummary = {
  dominantWillState: WillState;
  dominantCommitmentStrength: CommitmentStrength;
  willHeadline: string;
  commitmentPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseStrategicWillSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  strategicWillSummary: StrategicWillSummary;
  recentObservations: readonly EnterpriseCommitmentObservation[];
  directionalCommitmentSignals: readonly DirectionalCommitmentSignal[];
  crossSystemCommitmentFields: readonly CrossSystemCommitmentField[];
  fragmentationIndicators: readonly StrategicWillFragmentationIndicator[];
};

export type UnifiedStrategicWillInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type UnifiedStrategicWillResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseStrategicWillSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type StrategicWillStoreState = {
  observations: readonly EnterpriseCommitmentObservation[];
  snapshots: readonly EnterpriseStrategicWillSnapshot[];
  directionalCommitmentSignals: readonly DirectionalCommitmentSignal[];
  crossSystemCommitmentFields: readonly CrossSystemCommitmentField[];
  fragmentationIndicators: readonly StrategicWillFragmentationIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastWillState: WillState | null;
};
