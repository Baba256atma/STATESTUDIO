/** D9:9:6 — Unified enterprise strategic coherence field + total-system intelligence alignment types. */

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

export type CoherenceCategory =
  | "operational_coherence"
  | "temporal_coherence"
  | "foresight_coherence"
  | "decision_coherence"
  | "meta_cognition_coherence"
  | "consensus_coherence"
  | "institutional_consciousness_coherence"
  | "intent_identity_will_coherence"
  | "unknown";

export type CoherenceStrength = "weak" | "moderate" | "aligned" | "unified" | "enterprise_grade";

export type CoherenceState =
  | "fragmented"
  | "drifting"
  | "partially_aligned"
  | "coherent"
  | "fully_aligned";

export type StrategicCoherenceObservation = {
  coherenceId: string;
  coherenceState: CoherenceState;
  coherenceStrength: CoherenceStrength;
  coherenceCategory: CoherenceCategory;
  summary: string;
  coherenceSignals: readonly string[];
  misalignmentRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type TotalSystemAlignmentSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly CoherenceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EnterpriseCoherenceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly CoherenceCategory[];
  generatedAt: number;
};

export type CrossRuntimeMisalignmentIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  misalignmentSeverity: "low" | "moderate" | "high";
  linkedCategories: readonly CoherenceCategory[];
  generatedAt: number;
};

export type TotalSystemAlignmentSummary = {
  dominantCoherenceState: CoherenceState;
  dominantCoherenceStrength: CoherenceStrength;
  coherenceHeadline: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type UnifiedStrategicCoherenceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  totalSystemAlignmentSummary: TotalSystemAlignmentSummary;
  recentObservations: readonly StrategicCoherenceObservation[];
  totalSystemAlignmentSignals: readonly TotalSystemAlignmentSignal[];
  enterpriseCoherenceFields: readonly EnterpriseCoherenceField[];
  misalignmentIndicators: readonly CrossRuntimeMisalignmentIndicator[];
};

export type UnifiedStrategicCoherenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type UnifiedStrategicCoherenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: UnifiedStrategicCoherenceSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type StrategicCoherenceStoreState = {
  observations: readonly StrategicCoherenceObservation[];
  snapshots: readonly UnifiedStrategicCoherenceSnapshot[];
  totalSystemAlignmentSignals: readonly TotalSystemAlignmentSignal[];
  enterpriseCoherenceFields: readonly EnterpriseCoherenceField[];
  misalignmentIndicators: readonly CrossRuntimeMisalignmentIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastCoherenceState: CoherenceState | null;
};
