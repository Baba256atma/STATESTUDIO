/** D9:8:1 — Autonomous enterprise institutional consciousness + civilization-scale operational awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

export type AwarenessCategory =
  | "economic_awareness"
  | "governance_awareness"
  | "infrastructure_awareness"
  | "societal_awareness"
  | "operational_ecosystem_awareness"
  | "institutional_resilience_awareness"
  | "systemic_dependency_awareness"
  | "unknown";

export type AwarenessStrength = "weak" | "moderate" | "strong" | "systemic" | "civilization_scale";

export type InstitutionalState =
  | "isolated"
  | "connected"
  | "ecosystem_aware"
  | "systemically_integrated"
  | "institutionally_conscious";

export type MacroOperationalObservation = {
  institutionalAwarenessId: string;
  institutionalState: InstitutionalState;
  awarenessStrength: AwarenessStrength;
  awarenessCategory: AwarenessCategory;
  summary: string;
  ecosystemSignals: readonly string[];
  ecosystemRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EcosystemOperationalSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly AwarenessCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type CivilizationScaleAwarenessField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  awarenessPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly AwarenessCategory[];
  generatedAt: number;
};

export type EnterpriseEcosystemRelationship = {
  relationshipId: string;
  relationshipLabel: string;
  relationshipSummary: string;
  dependencyPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly AwarenessCategory[];
  generatedAt: number;
};

export type InstitutionalAwarenessSummary = {
  dominantInstitutionalState: InstitutionalState;
  dominantAwarenessStrength: AwarenessStrength;
  awarenessHeadline: string;
  ecosystemPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type InstitutionalConsciousnessSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: InstitutionalAwarenessSummary;
  recentObservations: readonly MacroOperationalObservation[];
  ecosystemSignals: readonly EcosystemOperationalSignal[];
  awarenessFields: readonly CivilizationScaleAwarenessField[];
  ecosystemRelationships: readonly EnterpriseEcosystemRelationship[];
};

export type InstitutionalConsciousnessInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type InstitutionalConsciousnessResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalConsciousnessSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type InstitutionalConsciousnessStoreState = {
  observations: readonly MacroOperationalObservation[];
  snapshots: readonly InstitutionalConsciousnessSnapshot[];
  ecosystemSignals: readonly EcosystemOperationalSignal[];
  awarenessFields: readonly CivilizationScaleAwarenessField[];
  ecosystemRelationships: readonly EnterpriseEcosystemRelationship[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastInstitutionalState: InstitutionalState | null;
};
